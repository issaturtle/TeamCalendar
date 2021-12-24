from flask import Blueprint, render_template, request, redirect, jsonify, session, Flask, url_for
from flask.helpers import flash
from flask.sessions import NullSession
from pymongo import MongoClient, cursor
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os

load_dotenv()

import bcrypt
salt = bcrypt.gensalt()     #used for hashing, unique for every user

auth = Blueprint('auth', __name__)  

cluster = MongoClient("mongodb+srv://Connor:Bustos@cluster0.z1idj.mongodb.net/Login?retryWrites=true&w=majority")       #our database connection
db = cluster["Login"]               #our main collection
collection = db["data"]             #collection

valid_logins = collection.find({}, {'_id': 1, 'email': 1, 'password': 1, 'events':[]})      #search for data

@auth.route('/login', methods=['GET', 'POST'])          
def login():
    session["email"] = NullSession.__name__         #Sets session to NULL for security
    if request.method == 'POST':                    #if input is put into form
        email = request.form.get('email')
        password = request.form.get('password1')
        password = password.encode('utf-8')
        cursor = collection.find({"email": email})  #check if email is in database
        if cursor.count() == 1:                     #if yes
            for data in cursor:             
                if data["password"] == bcrypt.hashpw(password, data["salt"]):               #check password
                    session["email"] = email                                                #if passed session is now set for the user with a given email
                    print("Successful login with " + email + " " + password.decode('utf-8'))    #for server side management
                    print("Loading calender...")                                                #for server side management
                    calenJson()                                                             #loads calender for session user
                    return redirect('/calen')                                               #redirects to calendar
                else:
                    print("wrong password")                                                 #for server side management
                    flash('password is incorrect', category="error")                        #flashes user a password error
        else:
            flash('email does not exist in database', category="error")                     #flashes user an email error
    return render_template("login.html")                                                    #renders our login page



@auth.route('/logout')
def logout():
    session["email"] = NullSession.__name__     #LOG OUT THE USER
    return render_template("logout.html")       


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('firstName')
        email = request.form.get('email')
        password = request.form.get('password1')
        password_confirm = request.form.get('password2')

        if password != password_confirm:                                #passwords are not the same
            flash("Passwords need to be the same", category="error")
            return redirect('/signup')
        
        cursor = collection.find({"email": email})                      #looks for email in databse
        if cursor.count() == 1:                                         #if email already exists tell user to make a new account or login
            print("account already exists")
            flash("Account already exists, log in or make a new account", category="error")
            return redirect('/signup')
        
        password = password.encode('utf-8')                             #encodes password to bytes so it can be hashed
        hashed = bcrypt.hashpw(password, salt)                          #unique hash for every user

        user_data = {"email": email, "name": name, "password": hashed, "salt": salt, "events": []}     
        collection.insert_one(user_data)                                                                 #saves user information in database
        flash("New account created", category="success")
        redirect('/signup')


    return render_template('signup.html')


app = Flask(__name__)
oauth = OAuth(app)
user = oauth.register(
    name='user',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    client_id= str(os.getenv("CLIENT_ID")),
    client_secret=str(os.getenv("CLIENT_SECRET")),
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo', 
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile'},
)

@auth.route('/signupGoogle')
def signUpGoogle():
    user = oauth.create_client('user')
    redirect = url_for('auth.authorize', _external = True)
    return user.authorize_redirect(redirect)

@auth.route('/authorize')
def authorize():
    user = oauth.create_client('user')
    token = user.authorize_access_token()
    resp = user.get('userinfo').json()

    cursor = collection.find({"email": resp["email"]})
    if cursor.count() == 0:                          #if account does not exist
        new_user = {"email": resp["email"], "name": resp["name"], "password": bcrypt.hashpw(resp["id"].encode('utf-8'), salt), "salt": salt, "events": []}  #create an account  given google user info
        add_user(new_user)
        session["email"] = resp["email"]        #session is now by google user
        calenJson()                             #load calen for user
    elif cursor.count() == 1:
        for data in cursor:             
            if data["password"] == bcrypt.hashpw(resp["id"].encode('utf-8'), data["salt"]):               #check password
                session["email"] = resp["email"]                                                #if passed session is now set for the user with a given email
                print("Successful login with " + resp["email"] + " " + resp["id"])    #for server side management
                print("Loading calender...")                                                #for server side management
                calenJson()                                                             #loads calender for session user
                return redirect('/calen')                                               #redirects to calendar
            else:
                print("wrong password")                                                 #for server side management
                flash('password is incorrect', category="error")                        #flashes user a password error
    return redirect('/calen')               #redirect to calen for user

def add_user(user):
    collection.insert_one(user)
@auth.route('/calen.json')
def calenJson():
    email = session["email"]
    if email == NullSession.__name__:                           #if user is not logged in and tries to access the calendar it will give an error message
        return "NOT LOGGED IN"
    jsonData = get_user_events(email)
    return jsonify(jsonData)

@auth.route('/calen', methods=['GET', 'POST'])
def calen():
    email = session["email"]
    if email == NullSession.__name__:                           #if user is not logged in and tries to access the calendar it will give an error message
        return "NOT LOGGED IN"
    if request.method == 'POST':
        choice = request.form.get('inlineRadioOptions')         #either delete or enter an event
        strDes = request.form.get('eventName')
        startD= request.form.get('startD')
        endD = request.form.get('endD')
        event = {'title': strDes, 'start': startD, "end" : endD}    #creates an event object given the input from user

        if choice == "createEve":
            add_event(email, event)                                 #if addevent, adds an event
        elif choice == "deleteEve":
            delete_event(email, event)                              #if deleteevent, deletes an event
        else:
            print("no choice")                                      #else, there is nothing happening

        calenJson()                                                 #renders new information and outputs to the calendar
        return render_template("calendar.html")
    return render_template("calendar.html")
def add_event(email, thingToAdd):
    #Testing adding a list of events to an account
    #if valid email, update from given collection
    collection.update_one(     
        {"email": email},   #given email to identify the account to update
        {
            "$push":{           #pushes values into a given array name.
            "events":
                    {
                        "$each": [thingToAdd]
                    }
                }
        }
    )
def delete_event(email, thingToDelete):  
    collection.update_one(             #TO delete
        {"email": email},                       #given logged in
        {
            "$pull":                            #pull out of db
            {
                "events": thingToDelete    #thing to pull out, if it is a dict, it pulls out the entire dict
            }
        }
    )
def get_user_events(email):
    cursor = collection.find({"email": email})  #finds user in database by email
    for item in cursor:
        events = item["events"]                 #get user events
    return events