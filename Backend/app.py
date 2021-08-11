from DataManager.models.schemas import CreateUserField
from DataManager.models.accounts import auth_user, check_session, create_user, expire_session, get_user, register_user
from fastapi import FastAPI, Cookie
from DataManager import database as db
from DataManager.models import *
from fastapi.param_functions import Depends
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
origins = [
    "http://localhost:3000",
]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

def get_database():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

@app.get("/")
async def root():
    return {"status": "ok"}

# @app.get("/user/{user_id}")
# async def user(user_id: int, db: db.SessionLocal = Depends(get_database)):
#     return get_user(db, user_id)

@app.get("/accounts/check")
async def check_sessionId(sessionId: str, db: db.SessionLocal = Depends(get_database)):
    return check_session(db, sessionId)

@app.get("/accounts/expire")
async def expire_sessionId(sessionId: str, db: db.SessionLocal = Depends(get_database)):
    return expire_session(db, sessionId)

@app.post("/accounts/login")
async def auth_sessionId(sessionId: str, user_id: int, password: str, db: db.SessionLocal = Depends(get_database)):
    return auth_user(db, sessionId,user_id, password)

@app.post("/accounts/register")
async def register(data: CreateUserField, db: db.SessionLocal = Depends(get_database)):
    return register_user(db, data.sessionId, data.user_id, data.password, data.username)
