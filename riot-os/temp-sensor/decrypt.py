from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

# Define the key and IV
key = bytes([
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4
])


# Unpad the plaintext after decryption
def unpad(data):
    return data.rstrip(b'\x00')


# Read ciphertext from file
with open("temp.bin", "rb") as file:
    data = file.read()

# Extract the length of the ciphertext, IV, and ciphertext
ciphertext_length = int.from_bytes(data[:4], byteorder="little")
iv = data[4:20]  # Next 16 bytes for IV
ciphertext = data[20:20 + ciphertext_length]  # Remaining bytes for ciphertext

# Decrypt the ciphertext
cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
decryptor = cipher.decryptor()
decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
decrypted = unpad(decrypted_padded)


# Print the decrypted text
try:
    print("Decrypted text:", decrypted.decode('utf-8'))
except UnicodeDecodeError:
    print("Decrypted binary data (not UTF-8):", decrypted)
