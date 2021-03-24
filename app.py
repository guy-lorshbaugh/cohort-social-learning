import datetime
import json
from os import listdir

from flask import (Flask, flash, jsonify, session, redirect,
                   render_template, request, url_for)
from flask_bcrypt import check_password_hash
from flask_login import (LoginManager, login_user, logout_user,
                             login_required, current_user)
from flask_wtf.csrf import CSRFProtect


import forms
import logging
import models

logger = logging.getLogger('peewee')
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.DEBUG)

app = Flask(__name__)
app.secret_key ="430po9tgjlkifdsc.p0ow40-23365fg4h,."
app.templates_auto_reload = True
app.debug = True
CSRFProtect(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


def start():
    """For the sake of code review, this funciton creates initial
    post and user login information.
    """
    journal= models.Entry
    if journal.select().where(journal.id==1).exists():
        pass
    else:
        models.Entry.create(
            id = 1,
            title="Welcome!",
            learned="Welcome to the Learning Journal!",
            user_id=1
        )
        tags_list = ["welcome", "python", "wtforms"]
        entry = models.Entry.get(models.Entry.title == "Welcome!")
        for item in tags_list:
            try:
                models.Tags.create(tag=item)
            except:
                pass
        for tag in tags_list:
            tag_data = models.Tags.get(models.Tags.tag ** tag)
            models.EntryTags.create(
                entry_id=entry.id,
                tag_id=tag_data
            )
    if models.User.select().where(models.User.id==1).exists():
        pass
    else:
        models.User.create_user(
            username="firstuser",
            password="firstword",
            avatar="static/img/avatar-svg/001-elephant.svg"
        )


def get_tags(id):
    """Selects entry tags by Entry PrimaryKey."""
    tags = (models.Tags
        .select()
        .join(models.EntryTags)
        .join(models.Entry)
        .where(models.Entry.id == id)
        .order_by(models.Tags.id)
        )
    return tags
    

def del_tags(id):
    """Deletes tag associations in EntryTags by entry_id."""
    query = (models.EntryTags
                .select()
                .where(models.EntryTags.entry_id == id)
            )
    for item in query:
        item.delete_instance()

def get_likes(id):
    """Retrieves likes associated with the Entry ID passed in"""
    likes = (
        models.Entry
        .select()
        .join(models.EntryLikes)
        .join(models.User)
        .where(models.Entry.id == id)
        .order_by(models.User.username)
    )
    return likes


def get_entries(id):
    """Retrieves entries by User ID"""
    entries = (
        models.Entry
        .where(models.Entry.user_id==id)
    )
    return entries


def get_avatars(path):
    avatar_list = []
    for item in listdir(path):
        name = item.split('-')[1].split('.')[0].title()
        item_dict = {"name": "{}".format(name), "url": "img/avatar-svg/{}".format(item)}
        avatar_list.append(item_dict)
    return sorted(avatar_list, key = lambda i: i['url'])


@login_manager.user_loader
def load_user(userid):
    try:
        return models.User.get(models.User.id == userid)
    except models.DoesNotExist:
        return None


@app.route('/avatar')
def avatar():
    avatar_path = "static/img/avatar-svg"
    avatars = get_avatars(avatar_path)
    return render_template('avatars.html', avatars=avatars)

@app.route('/emoji')
def emoji():
    with open('static/script/emoji_.json') as file:
        data = json.load(file)
    return render_template('emoji.html', emoji=data)


# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     form = forms.LoginForm()
#     if form.validate_on_submit():
#         try:
#             user = models.User.get(models.User.username == form.username.data)
#         except:
#             flash("User name or password incorrect")
#             return redirect(url_for('login'))
#         if check_password_hash(user.password, form.password.data):
#             login_user(user)
#             flash('Logged in successfully! Welcome!')
#         else:
#             flash("User name or password incorrect")
#             return redirect(url_for('login'))
#         return redirect(url_for('index'))
#     return render_template('login.html', form=form)


@app.route('/logout')
@login_required
def logout():
    """Logs the user out."""
    logout_user()
    flash("You've been logged out! Come back soon!", "success")
    return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Renders the User Registration page."""
    avatar_path = "static/img/avatar-svg"
    avatars = get_avatars(avatar_path)
    form = forms.RegisterForm()
    if form.validate_on_submit():
        try:
            models.User.create_user(
                username=form.username.data,
                avatar=form.avatar.data,
                password=form.password.data
            )
        except ValueError:
            flash("That username already exists")
            return redirect(url_for('register'))
        flash(f"Registration successful. Welcome aboard,{form.username.data}!")
        return redirect(url_for('index'))
    return render_template('register.html', form=form, avatars=avatars)


@app.route("/", methods=['GET', 'POST'])
@app.route("/entries", methods=['GET', 'POST'])
def index():
    journal = models.Entry.select().order_by(models.Entry.date.desc())
    login_form = forms.LoginForm()
    with open('static/script/emoji_.json') as file:
        emoji_data = json.load(file)
    if login_form.validate_on_submit():
        try:
            user = models.User.get(models.User.username == login_form.username.data)
        except:
            flash("User name or password incorrect")
            return redirect(url_for('index'))
        if check_password_hash(user.password, login_form.password.data):
            login_user(user)
            flash('Logged in successfully! Welcome!')
        else:
            flash("User name or password incorrect")
            return redirect(url_for('index'))
        return redirect(url_for('index'))
    return render_template('index.html', journal=journal, models=models, form=login_form, emoji=emoji_data)


@app.route("/entries/<id>")
def detail(id):
    info = models.Entry.get(models.Entry.id==id)
    return render_template("detail.html", id=info, models=models, tags=get_tags(id))


@app.route("/entries/new", methods=['GET', 'POST'])
@login_required
def create():
    form = forms.Post()
    if form.validate_on_submit():
        models.Entry.create(
            title=form.title.data,
            date=datetime.datetime.combine(form.date.data,
                datetime.datetime.now().time()),
            time_spent=form.time_spent.data,
            learned=form.learned.data,
            remember=form.remember.data,
            user_id=current_user.id
        )
        tags_list = form.tags.data.split(', ')
        entry = models.Entry.get(models.Entry.title == form.title.data)
        for item in tags_list:
            try:
                models.Tags.create(tag=item)
            except:
                pass
        for tag in tags_list:
            tag_data = models.Tags.get(models.Tags.tag == tag)
            models.EntryTags.create(
                entry_id=entry.id,
                tag_id=tag_data
            )
        flash("Your Entry has been created!")
        return redirect(url_for('index'))
    return render_template('new.html', form=form)


@app.route("/entries/<id>/edit", methods=['GET', 'POST'])
@login_required
def edit(id):
    entry = (models.Entry
            .select()
            .where(models.Entry.id == id)
            .get())
    tags_list = []
    for tag in get_tags(id):
        tags_list.append(tag.tag)
    tags = ", ".join(tags_list)
    form = forms.Post()
    if form.validate_on_submit():
        entry.title = form.title.data
        entry.date = (datetime.datetime
                        .combine(form.date.data, entry.date.time())
                        )
        entry.time_spent = form.time_spent.data
        entry.learned = form.learned.data
        entry.remember = form.remember.data
        for item in form.tags.data.split(', '):
            try:
                models.Tags.create(tag=item)
            except:
                pass
        entry.save()
        del_tags(id)
        for tag in form.tags.data.split(', '):
            tag_data = models.Tags.get(models.Tags.tag == tag)
            models.EntryTags.create(
                entry_id=entry.id,
                tag_id=tag_data.id
            )
        flash("Your Entry has been edited!")
        print(f"Token: {form.csrf_token()}")
        return redirect(url_for('index'))
    return render_template("edit.html", form=form, id=id, 
                            models=models, tags=tags)

@app.route("/entries/<tag>/tag")
def tag(tag):
    query = (models.Entry
                .select()
                .join(models.EntryTags)
                .join(models.Tags)
                .where(models.Tags.tag == tag)
    )
    return render_template("tag.html", models=models, id=query, tag=tag)


@app.route("/entries/<id>/user")
def user(id):
    entries = (models.Entry
            .select()
            .where(models.Entry.user_id == id)
            .order_by(models.Entry.date.desc())
    )
    user = models.User.get(models.User.id == id)
    return render_template("user.html", models=models, entries=entries,
                    user=user)

@app.route("/entries/<id>/delete")
@login_required
def delete(id):
    models.Entry.get(models.Entry.id==id).delete_instance()
    del_tags(id)
    flash("Your journal entry has been deleted.")
    return redirect(url_for('index'))


@app.route("/entries/<entry>/like", methods=['GET', 'POST'])
@login_required
def like(entry):
    entry_likes = models.EntryLikes
    entry = models.Entry.select().where(models.Entry.id == entry).get()
    user_like = (
        models.EntryLikes
        .select()
        .join(models.Entry)
        .where(entry_likes.user_id == current_user.id,
               entry_likes.entry_id == entry.id)
    )
    if user_like.exists():
        user_like.get().delete_instance()
        entry.decrement_entry_score()
    else:
        entry_likes.create(
            entry_id = entry.id,
            user_id = current_user.id
        )
        entry.increment_entry_score()
    likes = entry_likes.select().where(entry_likes.entry_id == entry.id)
    return str(len(list(likes)))

@app.route('/entries/<int:entry>/comment/<path:contents>/', methods=['GET', 'POST'])
@login_required
def comment(entry, contents):
    comment = models.Comment
    if request.method == 'GET':
        comment.create(
            contents = contents,
            entry_id = entry,
            user_id = current_user.id
        )
        target_entry = (
            models.Entry
            .select()
            .where(models.Entry.id == entry)
        )
        target_entry.get().increment_entry_score()
        new_comment = comment.get(comment.contents == contents);
        return jsonify({ "contents": contents, "entry": entry,
                         "username": current_user.username, 
                         "avatar": current_user.avatar, 
                         "comment": new_comment.id })
    else:
        print("Something Isn't Right")

@app.route('/entries/comment/<int:comment>/edit')
@login_required
def edit_comment(comment):
    return "edited"

@app.route('/entries/comment/<int:comment>/delete/')
@login_required
def delete_comment(comment):
    delete_comment = models.Comment.get(models.Comment.id==comment)
    if delete_comment.user_id == current_user.id:
        flash("Your Comment has been deleted.")
        delete_comment.delete_instance()
        return "deleted"
    else:
        flash("You can't delete someone else's comment!")
        return "You can't delete someone else's comment!"

if __name__ == '__main__':
    models.initialize()
    start()
    app.run(debug=True, host='localhost', port="8000")
