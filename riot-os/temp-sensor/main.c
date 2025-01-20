#include <stdio.h>
#include <stdint.h>
#include <stdlib.h> // exit()
#include <string.h>
#include <sys/time.h>
#include "periph/gpio.h"
#include "dht11_module.h"
#include "gnrc_udp.h"
#include "ztimer.h"
#include "encrypt.h"
#include "shell.h"
#include "thread.h"

#define IPV6_ADDR_LEN 40
#define THREAD_STACKSIZE (THREAD_STACKSIZE_MAIN + 256)

char ipv6_address[IPV6_ADDR_LEN] = HOST_IPV6;
char thread_stack[THREAD_STACKSIZE];
volatile int running = 1;  // Start sending by default
kernel_pid_t thread_handle = -1;

/*
  Command handler to set the destination IPv6 address.
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

int stop_sending(int argc, char **argv) {
    (void)argc;
    (void)argv;
    running = 0;
    printf("Data sending stopped.\n");
    return 0;
}

void *data_sender_thread(void *arg) {
    (void)arg;

    gpio_t pin = GPIO_PIN(PORT_A, 4);
    uint8_t humidity_integral = 0;
    uint8_t humidity_decimal = 0;
    uint8_t temp_integral = 0;
    uint8_t temp_decimal = 0;

    while (running) {
        read_dht(&pin, &humidity_integral, &humidity_decimal, &temp_integral, &temp_decimal);

        char json_temp[128];
        char json_humidity[128];
        size_t json_temp_len = 0;
        size_t json_humidity_len = 0;

        sprintf(json_temp, "{\"sensor_id\": 1, \"value\": %d.%d}", temp_integral, temp_decimal);
        json_temp_len = encrypt(json_temp);
        printf("%s\n", json_temp);

        sprintf(json_humidity, "{\"sensor_id\": 2, \"value\": %d.%d}", humidity_integral, humidity_decimal);
        json_humidity_len = encrypt(json_humidity);

        gnrc_udp_send(ipv6_address, HOST_PORT, json_temp, json_temp_len, 1, 1000);
        gnrc_udp_send(ipv6_address, HOST_PORT, json_humidity, json_humidity_len, 1, 1000);

        printf("Humidity: %d.%d %%\n", humidity_integral, humidity_decimal);
        printf("Temperature: %d.%d \u00b0C\n", temp_integral, temp_decimal);

        ztimer_sleep(ZTIMER_MSEC, 4000);
    }

    printf("Data sender thread exiting.\n");
    thread_handle = 0;
    return NULL;
}

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
    { "stop_sending", "Stop data sending", stop_sending },
    { "start_sending", "Start data sending", start_sending },
    { NULL, NULL, NULL }
};


int main(void) {
    uint32_t seed = ztimer_now(ZTIMER_MSEC);
    srand(seed);

    // Start the data sender thread by default
    puts("Starting data sender thread by default...");
    thread_handle = thread_create(thread_stack, sizeof(thread_stack), THREAD_PRIORITY_MAIN - 1, THREAD_CREATE_STACKTEST,
                                  data_sender_thread, NULL, "data_sender_thread");
    printf("Thread handle kernel_pid_t: %d\n", thread_handle);
    if (thread_handle < 0) {
        printf("Could not create data sending thread. Got Error: %d\n", thread_handle);
        return 1;
    }

    puts("Use 'set_ipv6' to change the IPv6 address, 'start_sending' to start data sending, or 'stop_sending' to stop it.");
    char line_buf[SHELL_DEFAULT_BUFSIZE];
    shell_run(shell_commands, line_buf, SHELL_DEFAULT_BUFSIZE);

    return 0;
}
