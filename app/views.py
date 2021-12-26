from flask import Blueprint,render_template
import os

from flask.helpers import flash
views = Blueprint('views', __name__) #define blueprint
@views.route('/')
def main():
    return render_template("homepage.html")
@views.route('/homepage')
def home():
    return render_template("homepage.html")

@views.route('/about')
def about():
    return render_template("about.html")

@views.route('/tasklist')
def task():
    return render_template("tasklist.html")