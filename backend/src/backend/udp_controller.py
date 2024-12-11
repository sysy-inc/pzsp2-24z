import asyncio
from typing import Callable
from src.backend.utils.database_utils.storing import save_sample_to_db


class UDPServer(asyncio.DatagramProtocol):
    def __init__(self, save_to_db_callback: Callable[[str], asyncio.Task]):
        self.save_to_db = save_to_db_callback

    def connection_made(self, transport):
        self.transport = transport

    def datagram_received(self, data, addr):
        message = data.decode()
        print(f"Received message from {addr}: {message}")

        # Schedule the save task
        asyncio.create_task(self.save_to_db(message))

    def connection_lost(self, exc):
        print("Connection lost")


async def init_udp_server(host_addr="0.0.0.0", port="5000"):
    loop = asyncio.get_event_loop()
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: UDPServer(save_sample_to_db), local_addr=(host_addr, port)
    )
    print(f"UDP server listening on {host_addr}:{port}")
