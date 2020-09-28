import datetime

from flask_login import UserMixin
from flask_bcrypt import generate_password_hash
from peewee import *

DATABASE = SqliteDatabase('journal.db')

class BaseModel(Model):
    class Meta:
        database = DATABASE


class Entry(BaseModel):
    title = CharField(max_length=100)
    date = DateTimeField(default=datetime.datetime.now)
    time_spent = IntegerField(default=0)
    learned = TextField(null=False)
    remember = TextField(default=" ")


class Tags(BaseModel):
    tag = CharField(unique=True)


class EntryTags(BaseModel):
    entry_id = ForeignKeyField(Entry)
    tag_id = ForeignKeyField(Tags)


class User(UserMixin, BaseModel):
    username = CharField(unique=True)
    password = CharField(max_length=100)

    @classmethod
    def create_user(cls, username, password, admin=False):
        try:
            with DATABASE.transaction():
                cls.create(
                    username=username,
                    password=generate_password_hash(password),
                    # is_active=True,
                    # is_admin=True
                    )
        except IntegrityError:
            raise ValueError("User already exists")


def initialize():
    DATABASE.connect()
    DATABASE.create_tables([Entry, Tags, EntryTags, User], safe=True)
    DATABASE.close()
