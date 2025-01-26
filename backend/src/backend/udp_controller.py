import asyncio
from typing import Any, Callable, Coroutine, Optional
from src.backend.utils.database_utils.storing import save_sample_to_db
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

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


class UDPServer(asyncio.DatagramProtocol):
    def __init__(
        self,
        save_to_db_callback: Callable[[str], Coroutine[Any, Any, None]],
        key: bytes,
    ):
        self.save_to_db = save_to_db_callback
        self.key = key

    def connection_made(self, transport: asyncio.BaseTransport) -> None:
        self.transport = transport

    def datagram_received(self, data: bytes, addr: Any) -> None:
        message = self.decrypt(data, addr)
        # Schedule the save task
        asyncio.create_task(self.save_to_db(message))

    def connection_lost(self, exc: Optional[Exception]) -> None:
        print("Connection lost")

    def decrypt(self, data: bytes, addr: Any) -> str:
        ciphertext_length = int.from_bytes(data[:4], byteorder="little")
        iv = data[4:20]  # Next 16 bytes for IV
        ciphertext = data[20 : 20 + ciphertext_length]  # Remaining bytes for ciphertext

        # Decrypt the ciphertext
        cipher = Cipher(
            algorithms.AES(self.key), modes.CBC(iv), backend=default_backend()
        )
        decryptor = cipher.decryptor()
        decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
        decrypted = decrypted_padded.rstrip(b"\x00")  # unpad data
        try:
            decrypted = decrypted.decode("utf-8")
            print(f"Received message from {addr}: {decrypted}")
            return decrypted
        except UnicodeDecodeError:
            print(
                f"Error while decoding deprycted message from {addr}: (bytes) ",
                decrypted,
            )
            return ""


async def init_udp_server(host_addr: str = "::", port: str = "5000") -> None:
    loop = asyncio.get_event_loop()
    transport, protocol = await loop.create_datagram_endpoint(  # type: ignore
        lambda: UDPServer(save_sample_to_db, key), local_addr=(host_addr, port)  # type: ignore
    )
    print(f"UDP server listening on {host_addr}:{port}")
