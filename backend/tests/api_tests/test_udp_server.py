import pprint
from time import sleep
from fastapi.testclient import TestClient
from psycopg2.extensions import connection
import socket
import json
from src.backend.app import app
from tests.api_tests.conftest import call_no_params, postgres_db_fixture


@call_no_params
@postgres_db_fixture(
    db_host="localhost",
    db_name="postgres",
    db_password="postgres",
    db_port=5432,
    db_user="postgres",
    queries=[
        "../scripts/clear_db.sql",
        "../scripts/create_database.sql",
        "../scripts/init_database.sql",
    ],
)
def test_udp_server_save_to_db(connection: connection):
    with TestClient(app):
        server_address = ("0.0.0.0", 5000)
        data = {  # type: ignore
            "sensor_id": 1,
            "value": 1337.0,
        }
        data_json = json.dumps(data).encode()

        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.sendto(data_json, server_address)
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
