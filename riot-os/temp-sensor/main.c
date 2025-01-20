#include <stdio.h>
#include <stdint.h>
#include <stdlib.h> // exit()
#include <sys/time.h>
#include "periph/gpio.h"
#include "dht11_module.h"
#include "gnrc_udp.h"
#include "ztimer.h"
#include "encrypt.h"

int main(void)
{
    puts("Welcome to RIOT!\n");
    uint32_t seed = ztimer_now(ZTIMER_MSEC);
    srand(seed);

    gpio_t pin = GPIO_PIN(PORT_A, 4);
    uint8_t humidity_integral = 0;
    uint8_t humidity_decimal = 0;
    uint8_t temp_integral = 0;
    uint8_t temp_decimal = 0;

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
    gnrc_udp_send(HOST_IPV6, HOST_PORT, json_temp, json_temp_len, 1, 1000);
    gnrc_udp_send(HOST_IPV6, HOST_PORT, json_humidity, json_humidity_len, 1, 1000);

    printf("Humidity: %d.%d %%\n", humidity_integral, humidity_decimal);
    printf("Temperature: %d.%d °C\n", temp_integral, temp_decimal);
    return 1;
}
