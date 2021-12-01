from flask import Blueprint, render_template, request, redirect, jsonify, session, Flask
from flask.helpers import flash
import json
from pymongo import MongoClient

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
        valid_password = True
        valid_email = True
        for data in valid_logins:
            if data['email'] == email:
                print('email exists in database')
            else:
                print('email does not exist in database')
                valid_email = False

            if data['password'] == password:
                print('password exists in database')
            else:
                print('password does not exist in database')
                valid_password = False

        if valid_email and valid_password:
            # login_with_user(email, password)
            session["email"] = email
            print("Successful login with " + email + " " + password)
            print("Loading calender...")
            return redirect('/calen')
        else:
            print("Login was not valid")

    # current_login_instance = {"email: ": email, "password": password}

    return render_template("login.html", text="test")



@auth.route('/logout')
def logout():
    return render_template("logout.html")

@auth.route('/calen.json')
def calenJson():
    email = session["email"]
    jsonData = get_user_events(email)
    return jsonify(jsonData)
@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('firstName')
        password = request.form.get('password1')
        password_confirm = request.form.get('password2')

        if password != password_confirm:
            print("Passwords need to be the same")
            return

        user_data = {"email": email, "name": name, "password": password_confirm}

        print(user_data)

        collection.insert_one(user_data)

        for data in valid_logins:
            print(data)

       

        # check = False
        # # check statements for if valid
        # if '@' in email:
        #     check = True
        # if len(password) < 8:
        #     print("Password must be 8 characters or longer.")
        # if password != password_confirm:
        #     check = False
        #     print("Password does not match with the Confirm password")
        # if check:
        #     print('All valid checks passed to create an account.')
    return render_template('signup.html')


@auth.route('/calen', methods=['GET', 'POST'])
def calen():
    email = session["email"]
    events = get_user_events(email)
    if request.method == 'POST':
        strDes = request.form.get('eventName')
        startD= request.form.get('startD')
        endD = request.form.get('endD')
        dic = {'title': strDes, 'start': startD, "end" : endD}
        add_event(email, dic)
        calenJson()
        return render_template("calendar.html")
        
    else:
        print("hi not post request")
    return render_template("calendar.html")
def add_event(email, dict):
    #Testing adding a list of events to an account
    #if valid email, update from given collection
    collection.update_one(     
        {"email": email},   #given email to identify the account to update
        {
            "$push":{           #pushes values into a given array name.
                                #documentation:https://docs.mongodb.com/manual/reference/operator/update/push/#use--push-operator-with-multiple-modifiers
            "events":
                    {
                        "$each": [dict]
                    }
                }
        }
    )
def delete_event(email, thingToDelete):
    print("deleting someitem value")    
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
    flash("Successfully added something")
def get_user_events(email):
    cursor = collection.find({"email": email})
    for item in cursor:
        events = item["events"]
        # with open('C:\SJSU-Dev2\projects\Python\FlaskProjectCmpe120./app\static\calendar_test\examples\json\events.json', 'w') as f:
        #     json.dump(events, f)
    return events

