from contextlib import contextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.backend.routes.api import api_router
from src.backend.routes.platforms import platforms
from src.backend.udp_controller import init_udp_server

udp_server = None


# @contextmanager
# def lifespan(app: FastAPI):
#     init_db()
#     # init_udp_server()
#     yield
#     print("Shutting down")
#     close_db()


app = FastAPI()
app.include_router(api_router, prefix="/api")
app.include_router(platforms, prefix="/api/platforms")

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello World"}
