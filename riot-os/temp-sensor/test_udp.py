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


key = bytes(
    [
        0x60,
        0x3D,
        0xEB,
        0x10,
        0x15,
        0xCA,
        0x71,
        0xBE,
        0x2B,
        0x73,
        0xAE,
        0xF0,
        0x85,
        0x7D,
        0x77,
        0x81,
        0x1F,
        0x35,
        0x2C,
        0x07,
        0x3B,
        0x61,
        0x08,
        0xD7,
        0x2D,
        0x98,
        0x10,
        0xA3,
        0x09,
        0x14,
        0xDF,
        0xF4,
    ]
)


received_messages: list[str] = []


def decrypt(data):
    ciphertext_length = int.from_bytes(data[:4], byteorder="little")
    iv = data[4:20]  # Next 16 bytes for IV
    ciphertext = data[20 : 20 + ciphertext_length]  # Remaining bytes for ciphertext

    # Decrypt the ciphertext
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
    decrypted = decrypted_padded.rstrip(b"\x00")  # unpad data
    return decrypted.decode("utf-8")


def udp_server(
    host: str = "::", port: int = 12345, duration: int = 10, timeout: int = 2
):
    """
    Run a UDP server that collects messages for a specified duration.
    """
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


def test_sending_encrypted_data_udp_ipv6():
    """
    Integration tests between UDP server and RIOT OS instance.
    Tested steps:
    1. RIOT OS compilation.
    2. RIOT OS sending encrypted UDP packet over IPv6.
    3. UDP server receiving packets.
    4. Decryption of packets.
    5. Validation of received packets.
    """
    print("Compiling RIOT OS app...")
    # Might be problematic when missing sudo privileges
    subprocess.run(
        [
            "sudo",
            "make",
            "HOST_IPV6=fe80::fcc1:23ff:fee8:2472",
            "HOST_PORT=12345",
            "MEASUREMENT_INTERVAL_MSEC=500",
            "SENSOR_ID_TEMP=1",
            "SENSOR_ID_HUM=2",
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
