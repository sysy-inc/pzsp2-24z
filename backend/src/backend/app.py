from contextlib import asynccontextmanager
from mimetypes import init
from multiprocessing import reduction
from fastapi import FastAPI
from src.backend.db_controller import close_db, init_db
from src.backend.routes.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix="/api")
