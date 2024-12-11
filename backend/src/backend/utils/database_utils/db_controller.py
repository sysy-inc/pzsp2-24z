from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncAttrs,
)
from sqlalchemy.orm import DeclarativeBase


# Within docker network:
DATABASE_URL = "postgresql+asyncpg://user:password@db:5432/testdatabase"
# DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/testdatabase"

engine = create_async_engine(DATABASE_URL)

async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(AsyncAttrs, DeclarativeBase):
    pass


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database connection established.")


async def close_db():
    await engine.dispose()
