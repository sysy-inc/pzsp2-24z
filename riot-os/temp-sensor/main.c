#include <stdio.h>
#include <stdint.h>
#include "periph/gpio.h"
#include "dht11_module.h"

int main(void)
{
    puts("Welcome to RIOT!\n");
    puts("Type `help` for help, type `saul` to see all SAUL devices\n");

    gpio_t pin = GPIO_PIN(PORT_A, 4);
    uint8_t humidity_integral = 0;
    uint8_t humidity_decimal = 0;
    uint8_t temp_integral = 0;
    uint8_t temp_decimal = 0;

    read_dht(&pin, &humidity_integral, &humidity_decimal, &temp_integral, &temp_decimal);

    printf("Humidity: %d.%d %%\n", humidity_integral, humidity_decimal);
    printf("Temperature: %d.%d °C\n", temp_integral, temp_decimal);

    return 1;
}
