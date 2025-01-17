#include <stdio.h>
#include <stdint.h>
#include <stdlib.h> // exit()
#include "periph/gpio.h"
#include "dht11_module.h"
#include "gnrc_udp.h"
#include "ztimer.h"
#include "aes.h"

unsigned char key[32] = {
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4};

// initialization vector
unsigned char iv[16] = {
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f};

void encrypt(char *plaintext)
{
    size_t plaintext_len = strlen(plaintext);

    // Pad the plaintext to a multiple of 16 bytes (128 bits)
    size_t padded_len = ((plaintext_len + 15) / 16) * 16;
    unsigned char padded_plaintext[padded_len];
    memset(padded_plaintext, 0, padded_len);
    memcpy(padded_plaintext, plaintext, plaintext_len);

    struct AES_ctx ctx;
    AES_init_ctx_iv(&ctx, key, iv);

    // Encrypt in-place
    AES_CBC_encrypt_buffer(&ctx, padded_plaintext, padded_len);

    // Copy the encrypted data back to the original buffer
    memcpy(plaintext, padded_plaintext, padded_len);

    // Null-terminate the string if necessary
    plaintext[padded_len] = '\0';
}

int main(void)
{
    puts("Welcome to RIOT!\n");

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
        char json_temp[256];
        char json_humidity[256];
        sprintf(json_temp, "{\"sensor_id\": 1, \"value\": %d.%d}", temp_integral, temp_decimal);
        encrypt(json_temp);
        printf("%s\n", json_temp);
        sprintf(json_humidity, "{\"sensor_id\": 2, \"value\": %d.%d}", humidity_integral, humidity_decimal);
        encrypt(json_humidity);
        printf("%s\n", json_humidity);
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
