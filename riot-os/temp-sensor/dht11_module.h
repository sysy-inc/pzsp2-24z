#include <stdint.h>
#include "periph/gpio.h"

#define DHT_READ_OK 0
#define DHT_READ_ERROR_CHECKSUM -1
#define DHT_READ_ERROR_GPIO_INIT -2

int read_dht(
    gpio_t *pin,
    uint8_t *hu_integral,
    uint8_t *hu_decimal,
    uint8_t *te_integral,
    uint8_t *te_decimal
);
