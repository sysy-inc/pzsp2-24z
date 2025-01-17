#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "aes.h"

#define MAX_FILE_SIZE 512

// AES-256 key
unsigned char key[32] = {
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4};

// Global bufor
static unsigned char decrypted_text[MAX_FILE_SIZE];

// Decrypting funtion, taking arguments from Python
const unsigned char *decrypt(const unsigned char *ciphertext, size_t length)
{
    if (length <= 0 || length > MAX_FILE_SIZE)
    {
        fprintf(stderr, "Error: incorrect datagram length: %zu\n", length);
        return NULL;
    }

    unsigned char iv[16];
    memcpy(iv, ciphertext + 4, 16); // First 16 bytes are the IV

    // Update the ciphertext to exclude the IV and length
    const unsigned char *actual_ciphertext = ciphertext + 16 + 4;
    size_t ciphertext_len = length;

    // Initialize AES context with the extracted IV
    struct AES_ctx ctx;
    AES_init_ctx_iv(&ctx, key, iv);

    // Copy the ciphertext to the buffer for in-place decryption
    memcpy(decrypted_text, actual_ciphertext, ciphertext_len);

    // Decrypt the ciphertext
    AES_CBC_decrypt_buffer(&ctx, decrypted_text, ciphertext_len);

    // Null-terminate the decrypted text for safety
    decrypted_text[ciphertext_len] = '\0';

    return decrypted_text;
}
