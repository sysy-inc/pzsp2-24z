from functools import wraps
from typing import Any, Callable
import psycopg2


def run_pg_query(
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


def postgres_db_fixture(
    db_name: str,
    db_user: str,
    db_password: str,
    db_host: str,
    db_port: int,
    queries: list[str],
):
    def decorator(func: Callable[..., Any]):
        @wraps(func)
        def wrapper():
            for query in queries:
                run_pg_query(
                    db_name=db_name,
                    db_user=db_user,
                    db_password=db_password,
                    db_host=db_host,
                    db_port=db_port,
                    query_file=query,
                )
            func()

        return wrapper

    return decorator
