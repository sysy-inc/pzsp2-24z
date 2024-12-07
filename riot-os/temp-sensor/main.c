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
    char json_string[256];
    /* json format:
        * {
        *     "humidity": {
        *        "value": 0.0,
        *        "unit": "percent"
        *     },
        *     "temperature": {
        *        "value": 0.0,
        *        "unit": "celsius"
        *     }
        * }
    */
    sprintf(
        json_string,
        "{\"humidity\": {\"value\": %d.%d, \"unit\": \"percent\"}, \"temperature\": {\"value\": %d.%d, \"unit\": \"celsius\"}}",
        humidity_integral,
        humidity_decimal,
        temp_integral,
        temp_decimal
    );
    gnrc_udp_send("fe80::2ef0:5dff:fe9e:fbdb", "8808", json_string, 1, 1000);

    printf("Humidity: %d.%d %%\n", humidity_integral, humidity_decimal);
    printf("Temperature: %d.%d °C\n", temp_integral, temp_decimal);

    return 1;
}
