from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os


DB_PROVIDER = "postgresql"
DB_DRIVER = "psycopg2"
# TODO: load using env vars depending on environment
DB_NAME = os.getenv("DB_NAME") or "testdatabase"
DB_USER = os.getenv("DB_USER") or "user"
DB_PORT = os.getenv("DB_PORT") or "5432"
DB_PASSWORD = os.getenv("DB_PASSWORD") or "password"
DB_HOST = os.getenv("DB_HOST") or "0.0.0.0"

DATABASE_URL = (
    f"{DB_PROVIDER}+{DB_DRIVER}://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


engine = create_engine(DATABASE_URL)
session_factory = sessionmaker(engine, expire_on_commit=False)


def get_session():
    db = session_factory()
    try:
        yield db
    finally:
        db.close()


Base = declarative_base()


def init_db():
    """
    Initializes the database connection.
    """
    with engine.begin() as conn:
        Base.metadata.create_all(conn)
    print("Database connection established.")


def close_db():
    """
    Closes the database connection.
    """
    engine.dispose()
