from flask import Blueprint, render_template, request, redirect, jsonify, session, Flask
from flask.helpers import flash
from flask.sessions import NullSession
from pymongo import MongoClient
import bcrypt
salt = bcrypt.gensalt()

auth = Blueprint('auth', __name__)

cluster = MongoClient("mongodb+srv://Connor:Bustos@cluster0.z1idj.mongodb.net/Login?retryWrites=true&w=majority")
db = cluster["Login"]
collection = db["data"]

valid_logins = collection.find({}, {'_id': 1, 'email': 1, 'password': 1, 'events':[]})

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password1')
        print(email + " " + password)
        password = password.encode('utf-8')
        password = bcrypt.hashpw(password, salt)
        print(password)
        valid_password = True
        valid_email = True
        for data in valid_logins:
            if data['email'] == email:
                print('email exists in database')
            else:
            
                print('email does not exist in database')
                valid_email = False

            if data["password"] == password:
                print('password exists in database')
            else:
                
                print('password does not exist in database')
                valid_password = False

        if valid_email and valid_password:
            session["email"] = email            #LOG IN THE USER
            print("Successful login with " + email + " " + password.decode('utf-8'))
            print("Loading calender...")
            calenJson()
            return redirect('/calen')
        else:
            flash('email or pass does not exist in database', category="error")

            print("Login was not valid")

    return render_template("login.html", text="test")



@auth.route('/logout')
def logout():
    session["email"] = NullSession.__name__     #LOG OUT THE USER
    return render_template("logout.html")


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('firstName')
        password = request.form.get('password1')
        password_confirm = request.form.get('password2')
        if password != password_confirm:
            flash("Passwords need to be the same", category="error")
            
        password = password.encode('utf-8')
        hashed = bcrypt.hashpw(password, salt)
        print(hashed)
        user_data = {"email": email, "name": name, "password": hashed, "events": []}
        collection.insert_one(user_data)


    return render_template('signup.html')

@auth.route('/calen.json')
def calenJson():
    email = session["email"]
    if email == NullSession.__name__:
        return "NOT LOGGED IN"
    jsonData = get_user_events(email)
    return jsonify(jsonData)

@auth.route('/calen', methods=['GET', 'POST'])
def calen():
    email = session["email"]
    if email == NullSession.__name__:
        return "NOT LOGGED IN"
    if request.method == 'POST':
        test = request.form.get('inlineRadioOptions')
        #test = createEve = create event/ deleteEve=  delete event
        strDes = request.form.get('eventName')
        startD= request.form.get('startD')
        endD = request.form.get('endD')
        eventToAdd = {'title': strDes, 'start': startD, "end" : endD}
        add_event(email, eventToAdd)
        calenJson()
        return render_template("calendar.html")
    return render_template("calendar.html")
def add_event(email, thingToAdd):
    #Testing adding a list of events to an account
    #if valid email, update from given collection
    collection.update_one(     
        {"email": email},   #given email to identify the account to update
        {
            "$push":{           #pushes values into a given array name.
                                #documentation:https://docs.mongodb.com/manual/reference/operator/update/push/#use--push-operator-with-multiple-modifiers
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
                "events":                       #name of thing to pull out
                {
                    "title": thingToDelete    #thing to pull out, if it is a dict, it pulls out the entire dict
                }
            }
        }
    )
def get_user_events(email):
    cursor = collection.find({"email": email})
    for item in cursor:
        events = item["events"]
    return events
