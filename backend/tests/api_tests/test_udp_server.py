import json
import os
import socket
from time import sleep

from fastapi.testclient import TestClient
from psycopg2.extensions import connection

from src.backend.app import app
from tests.api_tests.conftest import call_no_params, postgres_db_fixture
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


@call_no_params
@postgres_db_fixture(
    db_host="localhost",
    db_name="testdatabase",
    db_password="password",
    db_port=5432,
    db_user="user",
    queries=[
        "../scripts/clear_db.sql",
        "../scripts/create_database.sql",
        "../scripts/init_database.sql",
    ],
)
def test_udp_server_save_to_db(connection: connection):
    with TestClient(app):
        server_address = ("::", 5000)
        data = {  # type: ignore
            "sensor_id": 1,
            "value": 1337.0,
        }
        data_json = json.dumps(data).encode()

        pad_length = 16 - (len(data_json) % 16)
        if pad_length != 0:
            padded_data = data_json + b"\x00" * pad_length
        else:
            padded_data = data_json

        iv = os.urandom(16)

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

        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(padded_data) + encryptor.finalize()

        ciphertext_length = len(ciphertext).to_bytes(4, byteorder="little")
        encrypted_message = ciphertext_length + iv + ciphertext

        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
        sock.sendto(encrypted_message, server_address)
        sock.close()

        # Wait for the data to be processed
        sleep(0.1)

        cursor = connection.cursor()
        cursor.execute(
            "SELECT * FROM measurements WHERE value = 1337.0 AND sensor_id = 1"
        )
        result = cursor.fetchone()
        assert result is not None
        assert result[0] == 9
        assert result[1] == 1
        assert result[2] == 1337.0
        assert result[3] is not None
