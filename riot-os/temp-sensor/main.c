#include "crypto/ciphers.h"
#include "crypto/modes/cbc.h"
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h> // exit()
#include <string.h>
#include <sys/time.h>
#include "periph/gpio.h"
#include "dht11_module.h"
#include "gnrc_udp.h"
#include "ztimer.h"
#include <string.h>
#include "encrypt.h"
#include "shell.h"
#include "thread.h"

#define IPV6_ADDR_LEN 40
#define THREAD_STACKSIZE (THREAD_STACKSIZE_MAIN + 256)

char ipv6_address[IPV6_ADDR_LEN] = HOST_IPV6;
char thread_stack[THREAD_STACKSIZE];
volatile int running = 1;  // Start sending by default
kernel_pid_t thread_handle = -1;
char port[6] = HOST_PORT; // Default port as a string
unsigned measurement_interval = MEASUREMENT_INTERVAL_MSEC;

#define MAX_LEN 256
#define AES_KEY_SIZE 32   // AES-256 bit key size
#define AES_BLOCK_SIZE 16 // AES block size

const uint8_t key[AES_KEY_SIZE] = {
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4};

// Default sensor IDs
int sensor_id_temp = SENSOR_ID_TEMP;
int sensor_id_humidity = SENSOR_ID_HUM;

/*
  `set_sensor_id <temp|humidity> <id>` command handler to set the sensor ID.
*/
int set_sensor_id(int argc, char **argv) {
    if (argc != 3) {
        printf("Usage: %s <temp|humidity> <id>\n", argv[0]);
        return 1;
    }

    const char *sensor_type = argv[1];
    int id = atoi(argv[2]);

    if (id <= 0) {
        printf("Error: Sensor ID must be a positive integer.\n");
        return 1;
    }

    if (strcmp(sensor_type, "temp") == 0) {
        sensor_id_temp = id;
        printf("Temperature sensor ID set to: %d\n", sensor_id_temp);
    } else if (strcmp(sensor_type, "humidity") == 0) {
        sensor_id_humidity = id;
        printf("Humidity sensor ID set to: %d\n", sensor_id_humidity);
    } else {
        printf("Error: Unknown sensor type '%s'. Use 'temp' or 'humidity'.\n", sensor_type);
        return 1;
    }

    return 0;
}

/*
  `set_ipv6_address <ipv6 addr>` command handler to set the destination IPv6 address and port.
  Can be used while the data is being read and sent.
*/
int set_ipv6_address(int argc, char **argv) {
    if (argc != 2) {
        printf("Usage: %s <ipv6-address>\n", argv[0]);
        return 1;
    }

    if (strlen(argv[1]) >= IPV6_ADDR_LEN) {
        printf("Error: IPv6 address too long.\n");
        return 1;
    }

    strncpy(ipv6_address, argv[1], IPV6_ADDR_LEN);
    printf("New IPv6 address set to: %s\n", ipv6_address);
    return 0;
}

/*
  `set_port <port num>` command handler to set the destination port.
*/
int set_port(int argc, char **argv) {
    if (argc != 2) {
        printf("Usage: %s <port>\n", argv[0]);
        return 1;
    }

    int port_value = atoi(argv[1]);
    if (port_value <= 0 || port_value > 65535) {
        printf("Error: Invalid port number. Must be between 1 and 65535.\n");
        return 1;
    }

    strncpy(port, argv[1], sizeof(port));
    printf("New port set to: %s\n", port);
    return 0;
}

/*
  `set_measure_interval <interval>` command handler to set the measurement interval.
*/
int set_measure_interval(int argc, char **argv) {
    if (argc != 2) {
        printf("Usage: %s <interval>\n", argv[0]);
        return 1;
    }

    int interval = atoi(argv[1]);
    if (interval <= 0) {
        printf("Error: Invalid interval. Must be greater than 0.\n");
        return 1;
    }

    measurement_interval = interval;
    printf("New measurement interval set to: %d\n", measurement_interval);
    return 0;
}


/*
  `stop_sending` command handler to stop the data sending thread.
*/
int stop_sending(int argc, char **argv) {
    (void)argc;
    (void)argv;
    running = 0;
    printf("Data sending stopped.\n");
    return 0;
}

/*
  Callback function to run in a thread used for reading and sending data.
  Sent data format:
  {
    "sensor_id": int,
    "value": float
  }
*/
void *data_sender_thread(void *arg) {
    (void)arg;

    gpio_t pin = GPIO_PIN(PORT_A, 4);
    uint8_t humidity_integral = 0;
    uint8_t humidity_decimal = 0;
    uint8_t temp_integral = 0;
    uint8_t temp_decimal = 0;

    while (running) {
        read_dht(&pin, &humidity_integral, &humidity_decimal, &temp_integral, &temp_decimal);

        char json_temp[MAX_LEN];
        char json_humidity[MAX_LEN];
        int encrypted_temp_len;
        int encrypted_humidity_len;

        sprintf(json_temp, "{\"sensor_id\": %d, \"value\": %d.%d}", sensor_id_temp, temp_integral, temp_decimal);
        sprintf(json_humidity, "{\"sensor_id\": %d, \"value\": %d.%d}", sensor_id_hum, humidity_integral, humidity_decimal);

        if ((encrypted_temp_len = encrypt(&cipher, json_temp)) < 0)
                printf("Temp encryption failed!\n");
        if ((encrypted_humidity_len = encrypt(&cipher, json_humidity)) < 0)
                printf("Humidity encryption failed!\n");

        gnrc_udp_send(ipv6_address, port, json_temp, encrypted_temp_len, 1, 1000);
        gnrc_udp_send(ipv6_address, port, json_humidity, encrypted_humidity_len, 1, 1000);

        printf("Humidity: %d.%d %%\n", humidity_integral, humidity_decimal);
        printf("Temperature: %d.%d \u00b0C\n", temp_integral, temp_decimal);

        ztimer_sleep(ZTIMER_MSEC, measurement_interval);
    }

    printf("Data sender thread exiting.\n");
    thread_handle = 0;
    return NULL;
}

/*
  `start_sending` command handler to start the data sending thread.
*/
int start_sending(int argc, char **argv) {
    (void)argc;
    (void)argv;
    if (running) {
        printf("Data sending is already running.\n");
        return 0;
    }

    if ( thread_handle > 0) {
        printf("Data sending thread is still running. Wait for it to exit before starting a new one.\n");
        return 0;
    }

    printf("Starting data sending...\n");
    running = 1;
    thread_handle = thread_create(thread_stack, sizeof(thread_stack), THREAD_PRIORITY_MAIN - 1, THREAD_CREATE_STACKTEST,
                                  data_sender_thread, NULL, "data_sender_thread");
    printf("Thread handle kernel_pid_t: %d\n", thread_handle);
    if (thread_handle < 0) {
        printf("Could not create data sending thread. Got Error: %d\n", thread_handle);
        running = 0;
        return 1;
    }
    return 0;
}

static const shell_command_t shell_commands[] = {
    { "set_ipv6", "Set the destination IPv6 address", set_ipv6_address },
    { "set_port", "Set the destination port", set_port },
    { "stop_sending", "Stop data sending", stop_sending },
    { "start_sending", "Start data sending", start_sending },
    { "set_measure_interval", "Set the measurement interval in miliseconds", set_measure_interval },
    { "set_sensor_id", "Set the sensor ID", set_sensor_id },
    { NULL, NULL, NULL }
};


int main(void) {
    uint32_t seed = ztimer_now(ZTIMER_MSEC);
    srand(seed);

    cipher_t cipher;
    if (cipher_init(&cipher, CIPHER_AES, key, AES_KEY_SIZE) < 0)
        printf("Cipher init failed!\n");

    // Start the data sender thread by default
    puts("Starting data sender thread by default...");
    thread_handle = thread_create(thread_stack, sizeof(thread_stack), THREAD_PRIORITY_MAIN - 1, THREAD_CREATE_STACKTEST,
                                  data_sender_thread, NULL, "data_sender_thread");
    printf("Thread handle kernel_pid_t: %d\n", thread_handle);
    if (thread_handle < 0) {
        printf("Could not create data sending thread. Got Error: %d\n", thread_handle);
        return 1;
    }

    char line_buf[SHELL_DEFAULT_BUFSIZE];
    shell_run(shell_commands, line_buf, SHELL_DEFAULT_BUFSIZE);

    return 0;
}
