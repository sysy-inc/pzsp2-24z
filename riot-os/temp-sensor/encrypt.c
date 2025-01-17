#include <string.h>
#include <stdlib.h>
#include "aes.h"

unsigned char key[32] = {
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4};

void generate_random_iv(unsigned char *iv, size_t iv_len)
{
    for (size_t i = 0; i < iv_len; i++)
    {
        iv[i] = rand() % 255 + 1; // Random value between 1-255
    }
}

void encrypt(char *plaintext)
{
    unsigned char iv[16];
    generate_random_iv(iv, sizeof(iv)); // Generate a new random IV

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

    // Append the IV at the beginning of the plaintext buffer
    memmove(plaintext + sizeof(iv), padded_plaintext, padded_len); // Shift ciphertext forward
    memcpy(plaintext, iv, sizeof(iv));                             // Place IV at the beginning

    // Null-terminate if needed
    plaintext[sizeof(iv) + padded_len] = '\0';
}