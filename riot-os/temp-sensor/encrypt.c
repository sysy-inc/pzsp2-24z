#include <string.h>
#include <stdlib.h>
#include "crypto/ciphers.h"
#include "crypto/modes/cbc.h"

#define MAX_LENGTH 240

void generate_random_iv(unsigned char *iv, size_t iv_len)
{
    for (size_t i = 0; i < iv_len; i++)
    {
        iv[i] = rand() % 255 + 1; // Random value between 1-255
    }
}

int encrypt(cipher_t *cipher, char *plaintext)
{
    unsigned char iv[16];
    generate_random_iv(iv, sizeof(iv)); // Generate a new random IV

    size_t plaintext_len = strlen(plaintext);

    // Pad the plaintext to a multiple of 16 bytes (128 bits)
    size_t padded_len = ((plaintext_len + 15) / 16) * 16;
    uint8_t padded_plaintext[MAX_LENGTH];
    memset(padded_plaintext, 0, padded_len);
    memcpy(padded_plaintext, plaintext, plaintext_len);

    uint8_t encrypted_temp[MAX_LENGTH] = {0};

    if (cipher_encrypt_cbc(cipher, iv, padded_plaintext, padded_len, encrypted_temp) < 0)
    {
        return -1;
    }

    size_t total_len = sizeof(size_t) + sizeof(iv) + padded_len; // IV + length of ciphertext (4 bytes) + ciphertext

    // Create a new buffer to hold the IV, length, and ciphertext
    unsigned char encrypted_message[MAX_LENGTH + sizeof(size_t) + sizeof(iv)];           // 256
    memcpy(encrypted_message, &padded_len, sizeof(size_t));                              // Copy the length of ciphertext after IV
    memcpy(encrypted_message + sizeof(size_t), iv, sizeof(iv));                          // Copy the IV to the beginning
    memcpy(encrypted_message + sizeof(size_t) + sizeof(iv), encrypted_temp, padded_len); // Copy the ciphertext

    // Copy the final encrypted message (IV + length + ciphertext) back to plaintext buffer
    memcpy(plaintext, encrypted_message, total_len);

    // Null-terminate if needed
    plaintext[total_len] = '\0';

    return total_len;
}
