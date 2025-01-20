#include <stddef.h>

void generate_random_iv(unsigned char *iv, size_t iv_len);

int encrypt(cipher_t *cipher, char *plaintext);