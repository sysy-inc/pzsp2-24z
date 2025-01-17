import socket
import subprocess
import time
import threading
from pydantic import BaseModel
from cffi import FFI


class MeasurementMessage(BaseModel):
    """Measurement message sent by the sensor node."""

    sensor_id: int
    value: float


received_messages: list[str] = []

ffi = FFI()
lib = ffi.dlopen("./test_py/decrypt.so")

# Definiujemy interfejs funkcji C
ffi.cdef("""
    const unsigned char *decrypt(const unsigned char *ciphertext, size_t length);
""")


# def decrypt_datagram(message):
#     return message


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
                message, addr = server_socket.recvfrom(1024)
                # received_messages.append(message.decode())
                ciphertext_c = ffi.new("unsigned char[]", message)
                ptr = lib.decrypt(ciphertext_c, len(message))
                if ptr:
                    decrypted_text = ffi.string(ptr).decode("utf-8", errors="ignore")
                    # print("Odszyfrowany tekst:", decrypted_text)
                    print(f"Received message from {addr}: {decrypted_text}")
                else:
                    print("Błąd deszyfrowania!")
                # print(f"Received message from {addr}: {message.decode()}")
            except socket.timeout:
                continue
        print("UDP server stopped.")


def test_sending_unencrypted_data_udp_ipv6():
    """Encapsulate the entire E2E test."""
    print("Compiling RIOT OS app...")
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

    # assert len(received_messages) == 10

    # for message in received_messages:
    #     MeasurementMessage.model_validate_json(message)

    # print(f"Received messages: {received_messages}")


if __name__ == "__main__":
    test_sending_unencrypted_data_udp_ipv6()