import asyncio
import os
from typing import Any, Callable, Coroutine, Optional
from src.backend.utils.database_utils.storing import save_sample_to_db
from cffi import FFI


class UDPServer(asyncio.DatagramProtocol):
    def __init__(self, save_to_db_callback: Callable[[str], Coroutine[Any, Any, None]]):
        self.save_to_db = save_to_db_callback
        self.init_decrypt_function()
        
    def connection_made(self, transport: asyncio.BaseTransport) -> None:
        self.transport = transport

    def datagram_received(self, data: bytes, addr: Any) -> None:
        message = self.decrypt(data, addr)

        # Schedule the save task
        asyncio.create_task(self.save_to_db(message))

    def connection_lost(self, exc: Optional[Exception]) -> None:
        print("Connection lost")


    def init_decrypt_function(self) -> None:
        # need to encrypt and decrypt using the same library, combining two different libraries caused problems
        self.ffi = FFI()
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        self.lib = self.ffi.dlopen(os.path.join(BASE_DIR, "decrypt.so"))
        # self.lib = self.ffi.dlopen("./decrypt.so")

        # C function interface
        self.ffi.cdef("""
            const unsigned char *decrypt(const unsigned char *ciphertext, size_t length);
        """)

    def decrypt(self, data: bytes, addr: Any) -> str:
        ciphertext_len = int.from_bytes(data[:4], byteorder="little")
        expected_len = 16 + ciphertext_len
        ciphertext_c = self.ffi.new("unsigned char[]", data)
        ptr = self.lib.decrypt(ciphertext_c, expected_len)
        if ptr:
            message = self.ffi.string(ptr).decode('utf-8', errors="ignore")
            print(f"Received message from {addr}: {message}")
            return message
        else:
            print(f"Received message from {addr} - decryption error.")
            return ""


async def init_udp_server(host_addr: str = "::", port: str = "5000") -> None:
    loop = asyncio.get_event_loop()
    transport, protocol = await loop.create_datagram_endpoint(  # type: ignore
        lambda: UDPServer(save_sample_to_db), local_addr=(host_addr, port)  # type: ignore
    )
    print(f"UDP server listening on {host_addr}:{port}")
