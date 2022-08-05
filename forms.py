from wtforms import validators
from wtforms.fields.core import SelectField
import datetime

from flask_wtf import FlaskForm
from peewee import BooleanField, TextField
from wtforms import (StringField, PasswordField, TextAreaField, 
    DateField, IntegerField, BooleanField)
from wtforms.fields.simple import HiddenField
from wtforms.validators import (DataRequired, Regexp, ValidationError,
                               Length, EqualTo)
import models

class Post(FlaskForm):
    title = StringField(u"Title (Max. 100 characters)", validators=[
        DataRequired(),
        Length(max=100)
    ])  
    # date = HiddenField(default=datetime.datetime.now())
    # time_spent = IntegerField(u"Time Spent (round to nearest hour)", 
    #     validators=[
    #                 DataRequired(),
    #             ])
    learned = TextAreaField(u"Share a Revelation\nAsk a Question!", validators=[
                DataRequired(),
            ])
    remember = TextAreaField(u"Links and other things to remember\n(Optional)")
    private = BooleanField(u"Private (only you can see)", default=False)
    tags = StringField(u"Add tags, separated by a comma.")


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])


class RegisterForm(FlaskForm):
    username = StringField(
        'Username',
        validators=[
            DataRequired(),
            Regexp(
                r'^[a-zA-Z0-9_]+$',
                message=("Username should be one word, letters, "
                         "numbers, and underscores only.")
            ),
        ])
    avatar = StringField()
    password = PasswordField(
        'Password',
        validators=[
            DataRequired(),
            Length(min=2),
            EqualTo('password2', message='Passwords must match')
        ])
    password2 = PasswordField(
        'Confirm Password',
        validators=[DataRequired()]
    )
    