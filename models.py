import datetime

from flask_login import UserMixin
from flask_bcrypt import generate_password_hash
from peewee import *
from wtforms.fields.simple import TextAreaField

DATABASE = SqliteDatabase('journal.db')

# DATABASE = {
#     'name': 'journal.db',
#     'engine': 'peewee.SqliteDatabase',
#     'threadlocals': True,
# }

class BaseModel(Model):
    class Meta:
        database = DATABASE


class Entry(BaseModel):
    title = CharField(max_length=100)
    date = DateTimeField(default=datetime.datetime.now)
    learned = TextField(null=False)
    remember = TextField(default=" ")
    private = BooleanField(default=False)
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
    contents = CharField(null=False)
    date = DateTimeField(null=False)
    user_id = IntegerField(null=False)
    entry_id = IntegerField(null=False)
    comment_score = IntegerField(default=0)

    def increment_comment_score(self):
        self.comment_score += 1
        self.save()

    def decrement_comment_score(self):
        self.comment_score -= 1
        self.save()


class CommentLikes(BaseModel):
    user_id = ForeignKeyField(User)
    comment_id = ForeignKeyField(Comment)


class CommentReplies(BaseModel):
    content = CharField(null=False)
    comment_id = ForeignKeyField(Comment)
    user_id = ForeignKeyField(User)


class Test(BaseModel):
    content = CharField()


def initialize():
    DATABASE.connect()
    DATABASE.create_tables([Entry, Tags, EntryTags, User, EntryLikes,
                Comment, CommentLikes, CommentReplies, Test], safe=True)
    DATABASE.close()
