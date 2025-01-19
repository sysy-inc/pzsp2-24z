import asyncio
import os
from typing import Callable
from src.backend.utils.database_utils.storing import save_sample_to_db
from cffi import FFI


class UDPServer(asyncio.DatagramProtocol):
    def __init__(self, save_to_db_callback: Callable[[str], asyncio.Task]):
        self.save_to_db = save_to_db_callback
        self.init_decrypt_function()
        
    def connection_made(self, transport):
        self.transport = transport

    def datagram_received(self, data, addr):
        message = self.decrypt(data, addr)

        # Schedule the save task
        asyncio.create_task(self.save_to_db(message))

    def connection_lost(self, exc):
        print("Connection lost")

    def init_decrypt_function(self):
        self.ffi = FFI()
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        self.lib = self.ffi.dlopen(os.path.join(BASE_DIR, "decrypt.so"))

        # self.lib = self.ffi.dlopen("./decrypt.so")
        # C function interface
        self.ffi.cdef("""
            const unsigned char *decrypt(const unsigned char *ciphertext, size_t length);
        """)

    def decrypt(self, data, addr):
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


async def init_udp_server(host_addr="::", port="12345"):
    loop = asyncio.get_event_loop()
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: UDPServer(save_sample_to_db), local_addr=(host_addr, port)
    )
    print(f"UDP server listening on {host_addr}:{port}")
