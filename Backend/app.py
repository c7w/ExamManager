from DataManager.models.accounts import get_user
from typing import Optional
from fastapi import FastAPI, Cookie
from DataManager import database as db
from DataManager.models import *
from fastapi.param_functions import Depends


app = FastAPI()

def get_database():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

@app.get("/")
async def root():
    return {"detail": "ok"}

@app.get("/user/{user_id}")
async def user(user_id: int, db: db.SessionLocal = Depends(get_database)):
    return get_user(db, user_id)