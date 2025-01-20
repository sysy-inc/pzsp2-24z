import socket
import subprocess
import time
import threading
from pydantic import BaseModel
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


class MeasurementMessage(BaseModel):
    """Measurement message sent by the sensor node."""

    sensor_id: int
    value: float

key = bytes([
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4
])


received_messages: list[str] = []

def decrypt(data):
    ciphertext_length = int.from_bytes(data[:4], byteorder="little")
    iv = data[4:20]  # Next 16 bytes for IV
    ciphertext = data[20:20 + ciphertext_length]  # Remaining bytes for ciphertext

    # Decrypt the ciphertext
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
    decrypted = decrypted_padded.rstrip(b'\x00')    # unpad data
    return decrypted.decode('utf-8')


def udp_server(
    host: str = "::", port: int = 12345, duration: int = 10, timeout: int = 2
):
    """Run a UDP server that collects messages for a specified duration."""
    print("IN UDP THREAD.")
    with socket.socket(socket.AF_INET6, socket.SOCK_DGRAM) as server_socket:
        server_socket.bind((host, port))
        server_socket.settimeout(timeout)
        start_time = time.time()

        print(f"UDP server started on {host}:{port}")
        while time.time() - start_time < duration:
            try:
                print("recvfrom.")
                message, addr = server_socket.recvfrom(512)

                decrypted = decrypt(message)
                print(decrypted)
                received_messages.append(decrypted)
            except socket.timeout:
                continue
        print("UDP server stopped.")


def test_sending_unencrypted_data_udp_ipv6():
    """Encapsulate the entire E2E test."""
    print("Compiling RIOT OS app...")
    # Might be problematic when missing sudo privileges
    subprocess.run(
        [
            "make",
            "HOST_IPV6=fe80::fcc1:23ff:fee8:2472",
            "HOST_PORT=12345",
            "TEST_UDP_IPV6=yes",
            "TEST=yes",
            "all",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    print("Finished compiling RIOT OS app.")

    print("Starting UDP server...")
    server_thread = threading.Thread(target=udp_server)
    server_thread.start()
    print("UDP server started.")

    time.sleep(1)

    print("Running RIOT OS app...")
    subprocess.run(["make", "term"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("Finished running RIOT OS app.")

    server_thread.join()

    assert len(received_messages) == 10

    for message in received_messages:
        MeasurementMessage.model_validate_json(message)

    print(f"Received messages: {received_messages}")


if __name__ == "__main__":
    test_sending_unencrypted_data_udp_ipv6()
    # udp_server()
