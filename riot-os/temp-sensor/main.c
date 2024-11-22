#include <stdio.h>
#include <stdint.h>
#include "periph/gpio.h"
#include "ztimer.h"


#define DHT_READ_OK 0
#define DHT_READ_ERROR_CHECKSUM -1
#define DHT_READ_ERROR_GPIO_INIT -2


int read_dht(
    gpio_t *pin,
    uint8_t *hu_integral,
    uint8_t *hu_decimal,
    uint8_t *te_integral,
    uint8_t *te_decimal
) {
    int i = 0;
    uint8_t tabl[40];
    uint8_t hu_integral_ = 0;
    uint8_t hu_decimal_ = 0;
    uint8_t te_integral_ = 0;
    uint8_t te_decimal_ = 0;

    if (gpio_init(*pin, GPIO_OUT) < 0) {
        return DHT_READ_ERROR_GPIO_INIT;
    }
    gpio_write(*pin, true);
    ztimer_sleep(ZTIMER_MSEC, 500);

    gpio_write(*pin, false);
    ztimer_sleep(ZTIMER_MSEC, 20);

    gpio_write(*pin, true);
    if (gpio_init(*pin, GPIO_IN) < 0) {
        return DHT_READ_ERROR_GPIO_INIT;
    }

    while (gpio_read(*pin))
    {
    }
    while (!gpio_read(*pin))
    {
    }
    while (gpio_read(*pin))
    {
    }

    // here DHT pulled signal down - starting to send data
    while (i < 40)
    {
        while (!gpio_read(*pin))
        {
            // waiting for DHT to pull signal up (up when transfering data)
        }
        ztimer_sleep(ZTIMER_USEC, 40);
        // here wa are reading data
        if (gpio_read(*pin)) {
            // bit = 1
            tabl[i] = 1;
            i++;
            while (gpio_read(*pin))
            {
            }

        } else {
            // bit = 0
            tabl[i] = 0;
            i++;
        }
    }

    int j = 1;
    for (int i = 0; i < 40; i++)
    {
        if ( i < 8) {
            hu_integral_ = hu_integral_ << 1 | tabl[i];
        } else if (i < 16) {
            hu_decimal_ = hu_decimal_ << 1 | tabl[i];
        } else if (i < 24) {
            te_integral_ = te_integral_ << 1 | tabl[i];
        } else if (i < 32) {
            te_decimal_ = te_decimal_ << 1 | tabl[i];
        }
        j++;
    }

    *hu_integral = hu_integral_;
    *hu_decimal = hu_decimal_;
    *te_integral = te_integral_;
    *te_decimal = te_decimal_;

    return DHT_READ_OK;
}

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
