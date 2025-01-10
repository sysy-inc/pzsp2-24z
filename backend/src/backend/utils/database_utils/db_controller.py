from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncAttrs,
)
from sqlalchemy.orm import DeclarativeBase


# Within docker network:
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres"  # TODO: This should be an environment variable. Password should be a secret.
# DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/testdatabase"

engine = create_async_engine(DATABASE_URL)

async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(AsyncAttrs, DeclarativeBase):
    pass


async def init_db():
    """
    Initializes the database connection.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database connection established.")


async def close_db():
    """
    Closes the database connection.
    """
    await engine.dispose()
