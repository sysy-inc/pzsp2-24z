import asyncio
from typing import Any, Callable, Coroutine, Optional
from src.backend.utils.database_utils.storing import save_sample_to_db
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

key = bytes([
    0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
    0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
    0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
    0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4
])


class UDPServer(asyncio.DatagramProtocol):
    def __init__(self, save_to_db_callback: Callable[[str], Coroutine[Any, Any, None]], key):
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
        ciphertext = data[20:20 + ciphertext_length]  # Remaining bytes for ciphertext

        # Decrypt the ciphertext
        cipher = Cipher(algorithms.AES(self.key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
        decrypted = decrypted_padded.rstrip(b'\x00')    # unpad data
        try:
            decrypted = decrypted.decode('utf-8')
            print(f"Received message from {addr}: {decrypted}")
            return decrypted
        except UnicodeDecodeError:
            print(f"Error while decoding deprycted message from {addr}: (bytes) ", decrypted)
            return ""


async def init_udp_server(host_addr: str = "::", port: str = "12345") -> None:
    loop = asyncio.get_event_loop()
    transport, protocol = await loop.create_datagram_endpoint(  # type: ignore
        lambda: UDPServer(save_sample_to_db, key), local_addr=(host_addr, port)  # type: ignore
    )
    print(f"UDP server listening on {host_addr}:{port}")
