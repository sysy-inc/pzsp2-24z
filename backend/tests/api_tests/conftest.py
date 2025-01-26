from functools import wraps
from typing import Any, Callable

import psycopg2
from fastapi.testclient import TestClient
from psycopg2.extensions import connection


def run_pg_query_file(
    db_name: str,
    db_user: str,
    db_password: str,
    db_host: str,
    db_port: int,
    query_file: str,
):
    """
    Execute a query from a file on a PostgreSQL database.
    """
    connection = psycopg2.connect(
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port,
        database=db_name,
    )

    cursor = connection.cursor()
    with open(query_file, "r") as file:
        query = file.read()
        cursor.execute(query)
    connection.commit()
    cursor.close()
    connection.close()


def run_pg_query_string(
    db_name: str,
    db_user: str,
    db_password: str,
    db_host: str,
    db_port: int,
    query: str,
):
    """
    Execute a query from a string on a PostgreSQL database.
    """
    connection = psycopg2.connect(
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port,
        database=db_name,
    )

    cursor = connection.cursor()
    cursor.execute(query)
    connection.commit()
    cursor.close()
    connection.close()


def call_no_params(func: Callable[..., Any]):
    """
    Wrapper for pytest tests.
    When test function is decorated and given some arguments from decorator,
    tells pytest that these arguments are not fixtures.
    """

    def wrapper():
        func()

    return wrapper


def register_user(email: str, password: str, client: TestClient) -> None:
    """
    Helper function to register a user.
    """
    response = client.post(
        "/auth/register",
        json={"name": "Test", "surname": "User", "email": email, "password": password},
    )
    assert response.status_code == 200


def add_user_to_platform(
    email: str, platform_id: int, admin_token: str, client: TestClient
) -> None:
    """
    Helper function to add a user to a platform.
    """
    response = client.post(
        f"/api/platforms/{platform_id}/users/",
        json={"email": email},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200


def get_auth_token(username: str, password: str, client: TestClient) -> str:
    """Get an authentication token by simulating a login request."""
    response = client.post(
        "/auth/token",
        data={"username": username, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def make_user_admin(
    email: str, db_name: str, db_user: str, db_password: str, db_host: str, db_port: int
):
    """
    helper to make a user an admin in the database.
    """
    query = f"UPDATE users SET is_admin = TRUE WHERE email = '{email}'"
    run_pg_query_string(
        db_name=db_name,
        db_user=db_user,
        db_password=db_password,
        db_host=db_host,
        db_port=db_port,
        query=query,
    )


def postgres_db_fixture(
    db_name: str,
    db_user: str,
    db_password: str,
    db_host: str,
    db_port: int,
    queries: list[str],
):
    """
    Fixture decorator for setting up a PostgreSQL database for each test.
    """

    def decorator(func: Callable[[connection], Any]):
        @wraps(func)
        def wrapper():
            for query in queries:
                run_pg_query_file(
                    db_name=db_name,
                    db_user=db_user,
                    db_password=db_password,
                    db_host=db_host,
                    db_port=db_port,
                    query_file=query,
                )
            connection = psycopg2.connect(
                user=db_user,
                password=db_password,
                host=db_host,
                port=db_port,
                database=db_name,
            )

            func(connection)
            connection.close()

        return wrapper

    return decorator
