#include "crypto/ciphers.h"
#include "crypto/modes/cbc.h"
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h> // exit()
#include <sys/time.h>
#include "periph/gpio.h"
#include "dht11_module.h"
#include "gnrc_udp.h"
#include "ztimer.h"
#include <string.h>
#include "encrypt.h"

#define MAX_LEN 256
#define AES_KEY_SIZE 32   // AES-256 bit key size
#define AES_BLOCK_SIZE 16 // AES block size

const uint8_t key[AES_KEY_SIZE] = {
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4};

int main(void)
{
        puts("Welcome to RIOT!\n");

        uint32_t seed = ztimer_now(ZTIMER_MSEC);
        srand(seed);

        cipher_t cipher;
        if (cipher_init(&cipher, CIPHER_AES, key, AES_KEY_SIZE) < 0)
                printf("Cipher init failed!\n");

#ifdef TEST_UDP_IPV6
        int i = 0;
        while (i < 5)
        {
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
                char json_temp[MAX_LEN];
                char json_humidity[MAX_LEN];
                int encrypted_temp_len;
                int encrypted_humidity_len;

                sprintf(json_temp, "{\"sensor_id\": 1, \"value\": %d.%d}", temp_integral, temp_decimal);
                sprintf(json_humidity, "{\"sensor_id\": 2, \"value\": %d.%d}", humidity_integral, humidity_decimal);

                if ((encrypted_temp_len = encrypt(&cipher, json_temp)) < 0)
                        printf("Temp encryption failed!\n");
                if ((encrypted_humidity_len = encrypt(&cipher, json_humidity)) < 0)
                        printf("Humidity encryption failed!\n");

                /* json format:
                 * {
                 *     "sensor_id": <int>,
                 *     "value": <float>
                 * }
                 */
                gnrc_udp_send(HOST_IPV6, HOST_PORT, json_temp, encrypted_temp_len, 1, 1000);
                gnrc_udp_send(HOST_IPV6, HOST_PORT, json_humidity, encrypted_humidity_len, 1, 1000);

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
