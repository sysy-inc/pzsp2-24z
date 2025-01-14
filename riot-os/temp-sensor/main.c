#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>  // exit()
#include "periph/gpio.h"
#include "dht11_module.h"
#include "gnrc_udp.h"
#include "ztimer.h"

int main(void)
{
    puts("Welcome to RIOT!\n");

#ifdef TEST_UDP_IPV6
    int i = 0;
    while (i < 5) {
#endif
#ifndef TEST
        gpio_t pin = GPIO_PIN(PORT_A, 4);
#endif
        uint8_t humidity_integral = 0;
        uint8_t humidity_decimal = 0;
        uint8_t temp_integral = 0;
        uint8_t temp_decimal = 0;

#ifndef TEST
        read_dht(&pin, &humidity_integral, &humidity_decimal, &temp_integral, &temp_decimal);
#endif
        char json_temp[256];
        char json_humidity[256];
        sprintf(json_temp, "{\"sensor_id\": 1, \"value\": %d.%d}", temp_integral, temp_decimal);
        sprintf(json_humidity, "{\"sensor_id\": 2, \"value\": %d.%d}", humidity_integral, humidity_decimal);
        /* json format:
            * {
            *     "sensor_id": <int>,
            *     "value": <float>
            * }
        */
        gnrc_udp_send(HOST_IPV6, HOST_PORT, json_temp, 1, 1000);
        gnrc_udp_send(HOST_IPV6, HOST_PORT, json_humidity, 1, 1000);

        printf("Humidity: %d.%d %%\n", humidity_integral, humidity_decimal);
        printf("Temperature: %d.%d °C\n", temp_integral, temp_decimal);

#ifdef TEST_UDP_IPV6
        ztimer_sleep(ZTIMER_MSEC, 1000);
        i++;
    }
    exit(0);
#endif
    return 1;
}
