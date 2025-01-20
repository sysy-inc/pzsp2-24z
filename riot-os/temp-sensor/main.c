
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h> // exit()
#include <sys/time.h>
#include "periph/gpio.h"
#include "dht11_module.h"
#include "gnrc_udp.h"
#include "ztimer.h"
#include "encrypt.h"
#include "shell.h"

// Buffer for storing the new IPv6 address
#define IPV6_ADDR_LEN 40
char ipv6_address[IPV6_ADDR_LEN] = HOST_IPV6;

// Command handler to set IPv6 address
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

static const shell_command_t shell_commands[] = {
    { "set_ipv6", "Set the destination IPv6 address", set_ipv6_address },
    { NULL, NULL, NULL }
};

int main(void)
{
    puts("Welcome to RIOT!\n");
    uint32_t seed = ztimer_now(ZTIMER_MSEC);
    srand(seed);

    puts("Starting shell. Use the 'set_ipv6' command to change the IPv6 address.");
    char line_buf[SHELL_DEFAULT_BUFSIZE];
    shell_run(shell_commands, line_buf, SHELL_DEFAULT_BUFSIZE);

    gpio_t pin = GPIO_PIN(PORT_A, 4);
    uint8_t humidity_integral = 0;
    uint8_t humidity_decimal = 0;
    uint8_t temp_integral = 0;
    uint8_t temp_decimal = 0;

    int i = 0;
    while (i < 10)
    {
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
        // printf("%s\n", json_humidity);
        /* json format:
                * {
                *     "sensor_id": <int>,
                *     "value": <float>
                * }
                */
        gnrc_udp_send(ipv6_address, HOST_PORT, json_temp, json_temp_len, 1, 1000);
        gnrc_udp_send(ipv6_address, HOST_PORT, json_humidity, json_humidity_len, 1, 1000);

        printf("Humidity: %d.%d %%\n", humidity_integral, humidity_decimal);
        printf("Temperature: %d.%d \u00b0C\n", temp_integral, temp_decimal);
        i++;
        ztimer_sleep(ZTIMER_MSEC, 4000);
    }

    return 0;
}
