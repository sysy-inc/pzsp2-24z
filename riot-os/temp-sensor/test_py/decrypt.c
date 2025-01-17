#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "aes.h"

#define MAX_FILE_SIZE 1024

// AES-256: klucz 32 bajty (256 bitów)
unsigned char key[32] = {
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4};

// AES CBC wymaga wektora inicjalizacyjnego (IV)
unsigned char iv[16] = {
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f};

// Globalny bufor na odszyfrowane dane
static unsigned char decrypted_text[MAX_FILE_SIZE];

// Funkcja deszyfrująca, przyjmująca dane od Pythona
const unsigned char *decrypt(const unsigned char *ciphertext, size_t length)
{
    if (length > MAX_FILE_SIZE)
    {
        fprintf(stderr, "Błąd: długość danych przekracza limit %d bajtów!\n", MAX_FILE_SIZE);
        return NULL;
    }

    struct AES_ctx ctx;
    AES_init_ctx_iv(&ctx, key, iv);

    // Skopiowanie danych do bufora przed odszyfrowaniem (aby uniknąć modyfikacji oryginalnego wskaźnika)
    memcpy(decrypted_text, ciphertext, length);

    // Odszyfrowanie danych
    AES_CBC_decrypt_buffer(&ctx, decrypted_text, length);

    // Zapewnienie, że dane są poprawnie zakończone
    decrypted_text[length] = '\0';

    return decrypted_text;
}
