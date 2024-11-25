#include "dht11_module.h"
#include "periph/gpio.h"
#include "ztimer.h"


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
    uint8_t checksum = 0;

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
        } else {
            checksum = checksum << 1 | tabl[i];
        }
        j++;
    }

    if (checksum != (hu_integral_ + hu_decimal_ + te_integral_ + te_decimal_)) {
        return DHT_READ_ERROR_CHECKSUM;
    }

    *hu_integral = hu_integral_;
    *hu_decimal = hu_decimal_;
    *te_integral = te_integral_;
    *te_decimal = te_decimal_;

    return DHT_READ_OK;
}
