import datetime

from flask import (Flask, url_for, render_template, redirect,
                flash)
from flask_wtf.csrf import CSRFProtect
from flask_bcrypt import check_password_hash
from flask_login import (LoginManager, login_user, logout_user,
                             login_required, current_user)

import models
import forms

import logging
logger = logging.getLogger('peewee')
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.DEBUG)

app = Flask(__name__)
app.secret_key ="430po9tgjlkifdsc.p0ow40-23365fg4h,."
csrf = CSRFProtect()
csrf.init_app(app)


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
            password="firstword"
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


@login_manager.user_loader
def load_user(userid):
    try:
        return models.User.get(models.User.id == userid)
    except models.DoesNotExist:
        return None


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = forms.LoginForm()
    if form.validate_on_submit():
        try:
            user = models.User.get(models.User.username == form.username.data)
        except:
            flash("User name or password incorrect")
            return redirect(url_for('login'))
        if check_password_hash(user.password, form.password.data):
            login_user(user)
            flash('Logged in successfully.')
        else:
            flash("User name or password incorrect")
            return redirect(url_for('login'))
        return redirect(url_for('index'))
    return render_template('login.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("You've been logged out! Come back soon!", "success")
    return redirect(url_for('index'))


@app.route('/register', methods=('GET', 'POST'))
def register():
    form = forms.RegisterForm()
    if form.validate_on_submit():
        try:
            models.User.create_user(
                username=form.username.data,
                password=form.password.data
            )
        except ValueError:
            flash("That username already exists")
            return redirect(url_for('register'))
        flash(f"Registration successful. Welcome aboard, {form.username.data}!", "success")
        return redirect(url_for('index'))
    return render_template('register.html', form=form)


@app.route("/")
@app.route("/entries")
def index():
    journal = models.Entry.select().order_by(models.Entry.date.desc())
    return render_template('index.html', journal=journal, models=models)


@app.route("/entries/<id>")
def detail(id):
    info = models.Entry.get(models.Entry.id==id)
    return render_template("detail.html", id=info, tags=get_tags(id))


@app.route("/entries/new", methods=('GET', 'POST'))
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
            remember=form.remember.data
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


@app.route("/entries/<id>/edit", methods=('GET', 'POST'))
@login_required
def edit(id):
    entry = models.Entry.select().where(models.Entry.id == id).get()
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
    return render_template("tag.html", models=models, id=query)


@app.route("/entries/<id>/delete")
@login_required
def delete(id):
    models.Entry.get(models.Entry.id==id).delete_instance()
    del_tags(id)
    flash("Your journal entry has been deleted.")
    return redirect(url_for('index'))


if __name__ == '__main__':
    models.initialize()
    start()
    app.run(debug=True, host='127.0.0.1', port=80)
