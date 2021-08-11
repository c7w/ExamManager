from datetime import datetime, timedelta
from sqlalchemy.sql.functions import user
from sqlalchemy.sql.sqltypes import DateTime
from DataManager.utils.Password import sha256
from sqlalchemy import Column, String, Integer, Boolean, schema
from sqlalchemy.orm.session import Session
from DataManager.database import engine
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey, Table
from DataManager.database import Base

class UserGroupAssociation(Base):
    __tablename__ = "account_user_group"
    user = Column(ForeignKey('account_users.id'), primary_key=True)
    group = Column(ForeignKey('account_groups.id'), primary_key=True)
    role = Column(String)

class User(Base):
    __tablename__ = "account_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    password = Column(String)
    is_active = Column(Boolean, default=True)
    groups = relationship("UserGroupAssociation")


class Group(Base):
    __tablename__ = "account_groups"
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    groupname = Column(String)
    is_active = Column(Boolean, default=True)
    users = relationship("UserGroupAssociation")
    
class SessionPool(Base):
    __tablename__ = "SessionPool"
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    sessionId = Column(String, unique=True)
    expireAt = Column(DateTime, default=datetime.now()+timedelta(days=2))
    user_id = Column(Integer, ForeignKey("account_users.id", ondelete="CASCADE"))
    user = relationship("User")
    
Base.metadata.create_all(bind=engine)

# User
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user_id: int, password: str, username: str = ""):
    if username == "":
        username = str(user_id)
    password = sha256(password)
    db_user = User(id=user_id, username=username, password = password)
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except:
        return None

def check_user(db: Session, user_id: int, password: str):
    password = sha256(password)
    db_user = get_user(db, user_id)
    if db_user:
        if db_user.password == password:
            return db_user
        return None
    return None

# Group

# SessionPool
def check_session(db: Session, sessionId: str):
    
    # First delete all the sessions that were expired.
    db.query(SessionPool).filter(SessionPool.expireAt < datetime.now()).delete()
    db.commit()
    # Then return the relevant session record.
    print(db.query(SessionPool).all())
    session =  db.query(SessionPool).filter(SessionPool.sessionId == sessionId).first()
    if session and session.user.is_active:
        # return user
        return {'status': 'ok', 'user_id': session.user.id, 'username': session.user.username, 'prompts': 4} # TODO: prompt count
    else:
        return {'status': 'failed'}
def create_session(db: Session, sessionId: str, user_id: int):
    new_session = SessionPool(sessionId=sessionId, user_id=user_id)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def auth_user(db: Session, sessionId: str, user_id: int, password: str):
    user = check_user(db, user_id, password)
    if user:
        return {'status': 'ok', 'session': create_session(db, sessionId, user_id)}
    else:
        return {'status': 'failed'}


def register_user(db: Session, sessionId: str, user_id: int, password: str, username: str):
    user = create_user(db, user_id, password, username)
    if user:
        return {'status': 'ok', 'user': user}
    return {'status': 'failed'}

def expire_session(db: Session, sessionId: str):
    db.query(SessionPool).filter(SessionPool.sessionId == sessionId).delete()
    db.commit()
    return {'status': 'ok'}