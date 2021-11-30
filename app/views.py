from flask import Blueprint,render_template

views = Blueprint('views', __name__) #define blueprint

@views.route('/homepage')
def home():
    return render_template("homepage.html")

@views.route('/about')
def about():
    return render_template("about.html")

