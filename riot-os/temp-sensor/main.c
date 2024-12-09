#include <stdio.h>
#include <stdint.h>
#include "periph/gpio.h"
#include "dht11_module.h"
#include "gnrc_udp.h"

int main(void)
{
    puts("Welcome to RIOT!\n");

    gpio_t pin = GPIO_PIN(PORT_A, 4);
    uint8_t humidity_integral = 0;
    uint8_t humidity_decimal = 0;
    uint8_t temp_integral = 0;
    uint8_t temp_decimal = 0;

    read_dht(&pin, &humidity_integral, &humidity_decimal, &temp_integral, &temp_decimal);
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
    gnrc_udp_send("fe80::2ef0:5dff:fe9e:fbdb", "5000", json_temp, 1, 1000);
    gnrc_udp_send("fe80::2ef0:5dff:fe9e:fbdb", "5000", json_humidity, 1, 1000);

    printf("Humidity: %d.%d %%\n", humidity_integral, humidity_decimal);
    printf("Temperature: %d.%d °C\n", temp_integral, temp_decimal);

    return 1;
}
