import datetime

from flask_wtf import Form
from wtforms import (StringField, PasswordField, TextAreaField, 
    DateField, IntegerField)
from wtforms.validators import (DataRequired, Regexp, ValidationError,
                               Length, EqualTo)
import models

class Post(Form):
    title = StringField(u"Title (Max. 100 characters)", validators=[
        DataRequired(),
        Length(max=100)
    ])  
    date = DateField(default=datetime.date.today())
    time_spent = IntegerField(u"Time Spent (round to nearest hour)", 
        validators=[
                    DataRequired(),
                ])
    learned = TextAreaField(u"What did you learn?", validators=[
                DataRequired(),
            ])
    remember = TextAreaField(u"Links and other things to remember")
    tags = StringField(u"Add tags, separated by a comma.")


class LoginForm(Form):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])


class RegisterForm(Form):
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
    