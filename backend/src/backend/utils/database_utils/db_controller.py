from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# Within docker network:
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"  # TODO: This should be an environment variable. Password should be a secret.
# DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/testdatabase"

engine = create_engine(DATABASE_URL)
session_factory = sessionmaker(engine, expire_on_commit=False)


def get_session():
    db = session_factory()
    try:
        yield db
    finally:
        db.close()


# class Base(AsyncAttrs, DeclarativeBase):
#     pass
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
