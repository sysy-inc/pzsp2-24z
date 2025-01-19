import asyncio
from typing import Any, Callable, Coroutine, Optional

from src.backend.utils.database_utils.storing import save_sample_to_db


class UDPServer(asyncio.DatagramProtocol):
    def __init__(self, save_to_db_callback: Callable[[str], Coroutine[Any, Any, None]]):
        self.save_to_db = save_to_db_callback

    def connection_made(self, transport: asyncio.transports.DatagramTransport) -> None:
        self.transport = transport

    def datagram_received(self, data: bytes, addr: tuple[str, int]) -> None:
        message = data.decode()
        print(f"Received message from {addr}: {message}")

        # Schedule the save task
        asyncio.create_task(self.save_to_db(message))

    def connection_lost(self, exc: Optional[Exception]) -> None:
        print("Connection lost")


async def init_udp_server(host_addr: str = "::", port: str = "5000") -> None:
    loop = asyncio.get_event_loop()
    transport, protocol = await loop.create_datagram_endpoint(  # type: ignore
        lambda: UDPServer(save_sample_to_db), local_addr=(host_addr, port)  # type: ignore
    )
    print(f"UDP server listening on {host_addr}:{port}")
