import datetime, time
from operator import add
import json
from os import listdir

from flask import (Flask, flash, jsonify, session, redirect,
                   render_template, request, url_for)
from flask_bcrypt import check_password_hash
from flask_login import (LoginManager, login_user, logout_user,
                             login_required, current_user)
from flask_wtf.csrf import CSRFProtect
import jinja2
from jinja2 import Template, filters, Environment, FileSystemLoader

import forms
import logging
import models

# logger = logging.getLogger('peewee')
# logger.addHandler(logging.StreamHandler())
# logger.setLevel(logging.DEBUG)

app = Flask(__name__)
app.secret_key = "430po9tgjlkifdsc.p0ow40-23365fg4h,."
app.templates_auto_reload = True
app.debug = True
SESSION_COOKIE_SECURE = True
CSRFProtect(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

loader = jinja2.FileSystemLoader('/tmp')
environment = jinja2.Environment(autoescape=True, loader=loader)


@app.template_filter
def exclude(string, array):
    if any(x in string for x in array):
        return True
    else:
        return False

app.jinja_env.globals.update(exclude=exclude)
environment.filters['exclude'] = exclude

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
    tag_list = []
    for tag in tags:
        if tag.tag == '':
            print("Empty tag skipped")
            # pass
        else:
            tag_list.append(tag)
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


def del_entry_comments(id):
    """Deletes comments associated with a deleted entry"""
    comments = (models.Comment
                .select()
                .where(models.Comment.entry_id == id)
        )
    for item in comments:
        item.delete_instance()


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


def process_emoji():
    with open('static/script/emoji_copy.json', encoding='UTF-8') as file:
        emoji_data = json.load(file)
    emoji = {}
    for record in emoji_data:
        name = record["name"]
        if name not in emoji:
            emoji[name] = record
    return emoji


@app.context_processor
def insert_now():
    return { "insert_now": datetime.datetime.now() }


@app.context_processor
def get_browser():
    return { "browser": request.user_agent.browser }


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
@app.route("/entries/", methods=['GET', 'POST'])
def index():
    # journal = (models.Entry.select()
    #         .where(models.Entry.private==False)
    #         .order_by(models.Entry.date.desc())
    #         )
    journal = (models.Entry.select()
            .where(models.Entry.private==False)
            .order_by(models.Entry.date.desc()).limit(10)
            )
    login_form = forms.LoginForm()
    edit_form = forms.Post()
    emoji = process_emoji()
    if login_form.validate_on_submit():
        try:
            user = models.User.get(models.User.username == login_form.username.data.lower())
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
    return render_template('index.html', journal=journal, models=models,
                         login_form=login_form, edit_form=edit_form, emoji=emoji.values())


@app.route("/entries/<id>")
def detail(id):
    info = models.Entry.get(models.Entry.id==id)
    return render_template("detail.html", id=info, models=models, tags=get_tags(id))


@app.route("/entries/new", methods=['GET', 'POST'])
@login_required
def create():
    form = forms.Post()
    user = current_user
    if request.method == "POST":
        new_form = json.loads(request.data)
        print("Title: " + new_form['title'])
        models.Entry.create(
            title=new_form['title'],
            date = datetime.datetime.now(),
            learned=new_form['learned'],
            remember=new_form['remember'],
            user_id=current_user.id,
            private=form.private.data
        )
        tags_list = new_form['tags']
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
        # flash("Your Entry has been created!")
        response_body = jsonify({
            "action":"new",
            "id": entry.id,
            "title": entry.title,
            "learned": entry.learned,
            "remember": entry.remember,
            "private": entry.private
        })
        return response_body
    return render_template('new.html', form=form, user=user)


@app.route("/entries/<id>/edit", methods=['GET', 'POST'])
@login_required
def edit(id):
    user = current_user
    entry = (models.Entry
            .select()
            .where(models.Entry.id == id)
            .get())
    tags_list = []
    for tag in get_tags(id):
        tags_list.append(tag.tag)
    tags = json.dumps(tags_list)
    form = forms.Post()
    print(form.tags)
    return render_template("edit.html", form=form, id=id, 
                            models=models, tags=tags, user=user)

@app.route("/entries/<id>/edit/save", methods=['GET', 'POST'])
@login_required
def update_entry(id):
    # user = current_user
    entry = (models.Entry
            .select()
            .where(models.Entry.id == id)
            .get())
    if request.method == 'POST':
        form = json.loads(request.data)
        entry.title = form['title']
        entry.learned = form['learned']
        entry.rememeber = form['remember']
        entry.private = form['private']
        for item in form['tags']:
            print(item)
            try:
                models.Tags.create(tag=item)
            except:
                pass
        entry.save()
        del_tags(id)
        for tag in form['tags']:
            tag_data = models.Tags.get(models.Tags.tag == tag)
            models.EntryTags.create(
                entry_id=entry.id,
                tag_id=tag_data.id
            )
        tag_query = (models.Tags
                .select()
                .join(models.EntryTags)
                .join(models.Entry)
                .where(models.Entry.id == entry.id)
                .order_by(models.Tags.id))
        tags = []
        for tag in tag_query:
            tags.append(tag.tag)
        flash("Your Entry has been edited!")
    return jsonify({
        "action": "edit",
        "id": entry.id,
        "title": entry.title,
        "learned": entry.learned,
        "remember": entry.remember,
        "tags": tags,
        "private": entry.private
        })


@app.route("/entries/get/<path:contents>")
def get_entry(contents):
    contents = contents.replace("&quest;", "?")
    query = (models.Entry
            .select()
            .where(models.Entry.title == contents)
            .order_by(models.Entry.date.desc())
            .limit(1)
            )
    entry = query.dicts().get()
    print(contents)
    # time.sleep(5)
    return jsonify(render_template("get-entry.html", entry=entry, models=models))    

@app.route("/entries/<id>/get/", methods=['GET'])
def get_entry_by_id(id):
    query = (models.Entry
            .select()
            .where(models.Entry.id == id)
            .order_by(models.Entry.date.desc())
            .limit(1)
            )
    entry = query.dicts().get()
    return jsonify(render_template("get-entry.html", entry=entry, models=models)) 

@app.route("/entries/<tag>/tag")
def tag(tag):
    query = (models.Entry
                .select()
                .join(models.EntryTags)
                .join(models.Tags)
                .where(models.Tags.tag == tag)
                .order_by(models.Entry.date.desc())
    )
    return render_template("tag.html", models=models, id=query, tag=tag)


@app.route("/entries/<id>/user")
@app.route("/entries/<id>/user/")
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
def delete_entry(id):
    models.Entry.get(models.Entry.id==id).delete_instance()
    del_tags(id)
    del_entry_comments(id)
    flash("Your entry has been deleted.")
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
    liker_query = (
        models.User
        .select()
        .join(models.EntryLikes)
        .join(models.Entry)
        .where(models.Entry.id == entry.id)
        .order_by(models.User.username)
    )
    likers = []
    for user in liker_query:
        likers.append({
            "username": user.username,
            "avatar": user.avatar
            })
    return jsonify({
        "action": "like",
        "count": str(len(list(likes))),
        "likers": likers
        })


@app.route('/entries/<int:entry>/comment/', methods=['GET', 'POST'])
@login_required
def comment(entry):
    comment = models.Comment
    comments = (models.Comment
                .select()
                .where(models.Comment.entry_id == entry)
                .order_by(models.Comment.date.desc())
                .limit(1)
                )
    if request.method == 'POST':
        comment.create(
            contents = request.form["contents"],
            date = datetime.datetime.now(),
            entry_id = entry,
            user_id = current_user.id
        )
        target_entry = (
            models.Entry
            .select()
            .where(models.Entry.id == entry)
        )
        target_entry.get().increment_entry_score()
        # action = "'action': 'comment'"
        # new_comment = comment.get(comment.contents == contents);
        return jsonify({
            "action": "comment",
            "html": render_template('comment.html', comments=comments,
                models=models, current_user=current_user)
            })


@app.route('/entries/comment/<int:comment_id>/edit/', methods=['GET', 'POST'])
@login_required
def edit_comment(comment_id):
    """ Takes in edit data and writes it to the database """
    comment = models.Comment.get(models.Comment.id == comment_id)
    print(request.form)
    contents = request.form["contents"]
    comment.contents = contents
    comment.save()
    return jsonify({
        "action": "edit",
        "contents": contents,
        "id": comment.id,
        "flash": "Comment edited successfully."
    })


#  --- OLD MICKEY MOUSE EDIT ROUTE ---
# @app.route('/entries/comment/<int:comment_id>/edit/<path:contents>/', methods=['GET', 'POST'])
# @login_required
# def edit_comment(comment_id, contents):
    # comment = models.Comment.get(models.Comment.id == comment_id)
    # comment.contents = contents
    # comment.save()
    # return jsonify({
    #     "action": "edit",
    #     "contents": contents,
    #     "id": comment.id,
    #     "flash": "Comment edited successfully."
    # })


@app.route('/entries/comment/<int:comment>/delete', methods=['GET', 'POST'])
@login_required
def delete_comment(comment):
    delete_comment = models.Comment.get(models.Comment.id==comment)
    entry = models.Entry.get(models.Entry.id == delete_comment.entry_id)
    if delete_comment.user_id == current_user.id:
        delete_comment.delete_instance()
        entry.decrement_entry_score()
        return jsonify({ "action": "delete",
                "flash": "Your Comment has been deleted." })
    else:
        return jsonify({ "action": "delete",
                "flash": "You can't delete someone else's comment." })


@app.route('/entries/sortby/<string:choice>/')
def sort_entries(choice):
    journal = models.Entry.select().where(models.Entry.private==False)
    if choice == "top" or choice == "":
        journal = ( journal
                    .order_by(models.Entry.entry_score.desc())
                    .limit(10)
                )
    elif choice == "recent":
        journal = ( journal
                    .order_by(models.Entry.date
                    .desc())
                    .limit(10)
                )
    login_form = forms.LoginForm()
    emoji = process_emoji()
    return render_template('index.html', journal=journal, models=models,
                    login_form=login_form, emoji=emoji.values())


if __name__ == '__main__':
    models.initialize()
    start()
    app.run(debug=True, host='localhost', port="8000")
