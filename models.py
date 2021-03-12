import datetime

from flask_login import UserMixin
from flask_bcrypt import generate_password_hash
from peewee import *
from flask_wtf import Form
from wtforms.fields.simple import TextAreaField
# from wtforms.fields.simple import HiddenField

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
    user_id = IntegerField()
    entry_score = IntegerField(default=0)

    def increment_entry_score(self):
        self.entry_score += 1
        self.save()

    def decrement_entry_score(self):
        self.entry_score -= 1
        self.save()



class Tags(BaseModel):
    tag = CharField(unique=True)


class EntryTags(BaseModel):
    entry_id = ForeignKeyField(Entry)
    tag_id = ForeignKeyField(Tags)


class User(UserMixin, BaseModel):
    username = CharField(unique=True)
    password = CharField(max_length=100)
    avatar = CharField(default="img/avatar-svg/001-elephant.svg")

    @classmethod
    def create_user(cls, username, password, avatar, admin=False):
        try:
            with DATABASE.transaction():
                cls.create(
                    username=username,
                    password=generate_password_hash(password),
                    avatar=avatar
                    )
        except IntegrityError:
            raise ValueError("User already exists")


class EntryLikes(BaseModel):
    user_id = ForeignKeyField(User)
    entry_id = ForeignKeyField(Entry)


class Comment(BaseModel):
    contents = TextAreaField(null=False)
    user_id = IntegerField(null=False)
    entry_id = CharField(null=False)
    comment_score = IntegerField(default=0)

    def increment_comment_score(self):
        self.comment_score += 1
        self.save()

    def decrement_comment_score(self):
        self.comment_score -= 1
        self.save()


class EntryComments(BaseModel):
    entry_id = ForeignKeyField(Entry)
    comment_id = ForeignKeyField(Comment)


def initialize():
    DATABASE.connect()
    DATABASE.create_tables([Entry, Tags, EntryTags, User, EntryLikes, Comment], safe=True)
    DATABASE.close()
