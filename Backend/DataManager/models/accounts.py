from DataManager.utils.Password import sha256
from DataManager.schemas import CreateUser
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
    sessionId = Column(String)
    user_id = Column(Integer, ForeignKey("account_users.id", ondelete="CASCADE"))
    user = relationship("User")
    
Base.metadata.create_all(bind=engine)
print("Accounts Created")

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, data: CreateUser):
    password = sha256(data.password)
    db_user = User(id=data.id, username=data.username, password = password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login_user(db: Session, user_id: int, password: str):
    password = sha256(password)
    db_user = get_user(db, user_id)
    if db_user:
        if db_user.password == password:
            return db_user
        return None
    return None
