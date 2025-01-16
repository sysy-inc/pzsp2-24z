from functools import wraps
from typing import Any, Callable
import psycopg2
from psycopg2.extensions import connection


def run_pg_query_file(
    db_name: str,
    db_user: str,
    db_password: str,
    db_host: str,
    db_port: int,
    query_file: str,
):
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


def make_user_admin(
    email: str, db_name: str, db_user: str, db_password: str, db_host: str, db_port: int
):
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
