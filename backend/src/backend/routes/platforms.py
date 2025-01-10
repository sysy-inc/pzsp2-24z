from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.backend.utils.database_utils.db_controller import get_session
from src.backend.utils.database_utils.models import Platform, PlatformSchema


platforms = APIRouter()


@platforms.get("/", response_model=list[PlatformSchema])
async def read_platforms(session: AsyncSession = Depends(get_session)):
    results: list[PlatformSchema] = []
    res = await session.execute(select(Platform))
    for row in res.all():
        results.append(PlatformSchema.model_validate(row[0].__dict__))

    return results
