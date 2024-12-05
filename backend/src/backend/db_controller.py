from sqlalchemy import create_engine, MetaData
from databases import Database

DATABASE_URL = "postgresql://user:password@db:5432/testdatabase"

database = Database(DATABASE_URL)
metadata = MetaData()
engine = create_engine(DATABASE_URL)


async def init_db():
    await database.connect()
    print("Database connection established")


async def close_db():
    await database.disconnect()
