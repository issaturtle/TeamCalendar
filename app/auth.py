import re
from flask import Blueprint, render_template, request, redirect, jsonify, session, Flask, url_for
from flask.helpers import flash
from flask.sessions import NullSession
from pymongo import MongoClient, cursor
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os,json

load_dotenv()

import bcrypt


#####################TESTING###################



###############################################

#####################CONSTANTS##################
salt = bcrypt.gensalt()     #used for hashing, unique for every user

auth = Blueprint('auth', __name__)  

cluster = MongoClient("mongodb+srv://Connor:Bustos@cluster0.z1idj.mongodb.net/Login?retryWrites=true&w=majority")       #our database connection
db = cluster["Login"]               #our main collection
collection = db["data"]             #collection
teams = cluster["Teams"]
team_collection = teams["data"]

stack = [] #userInfo.json
valid_logins = collection.find({}, {'_id': 1, 'email': 1, 'password': 1, 'events':[]})      #search for data
temp = ""

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
#################################################


###################FUNCTIONS#####################
def add_user(user):
    collection.insert_one(user)


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
    return True

def get_user_events(email):
    cursor = collection.find({"email": email})  #finds user in database by email
    for item in cursor:
        events = item["events"]                 #get user events
    temp = {"email":email, "events":events}
    return temp

def create_team(email, team):
    cursor = collection.find({"email": email})      #look for user
    for item in cursor:
        teams = item["teams"]                       #look at teams user is in
    if team["team name"] in teams:                               #if the team they want to add is already in the team list exit
        return False            

    cursor = team_collection.find({"team name": team["team name"]})     #look for team in the database
    if cursor.count() == 1:                                             #if team already exists return
        return False
    else:
        team_collection.insert_one(team)                                #team does not exist, create a new team
        collection.update_one(
            {"email": email},
            {
                "$push":{
                    "teams": team["team name"]                          #updates the users list of teams they are in
                }
            }
        )


def add_to_team(email, team):
    cursor = collection.find({"email": email})      #look for user
    for item in cursor:
        teams = item["teams"]                       #look at teams user is in
    if team["team name"] in teams:                               #if the team they want to add is already in the team list exit
        return False
    cursor = team_collection.find({"team name": team["team name"]})     #look for team in the database
    
    if cursor.count() != 1:
        return "not a valid team"
    for data in cursor:
        members = data["members"]
        leader = data["leader"]
    if leader == email:                             #only leaders can add a member to the team #creator of the team
        if team["members"] not in members:
            team_collection.update_one(
                {"team name": team["team name"]},
                {
                    "$push":{
                        "members": team["members"]
                    }
                }
            )
            collection.update_one(     
            {"email": email},   #given email to identify the account to update
            {
                "$push":{           #pushes values into a given array name.
                "teams":
                        {
                            "$each": team["team name"]
                        }
                    }
            }
    )
            
    return

def join_team(email, team, password):
    cursor = collection.find({"email": email}) 
    for item in cursor:
        teams = item["teams"]                       #look at teams user is in
    if team in teams:                               #if the team they want to add is already in the team list exit
        return False
    cursor2 = team_collection.find({"team name": team}) #look for team in the database
    if cursor2.count() != 1:
        return "not a valid team"
    for data in cursor2:
        private = data["private"]
        team_password = data["password"]
        members = data["members"]
        leader = data["leader"]
    if private == True:                 #team is private, provide a password
        if password == team_password and email not in members:
            team_collection.update_one(
                {"team name": team},
                {
                    "$push":{
                        "members": email
                    }
                }
            )
            collection.update_one(     
            {"email": email},   #given email to identify the account to update
            {
                "$push":{           #pushes values into a given array name.
                "teams":team
                    }
            }
            )
    else:
        if email not in members:
            team_collection.update_one(
                {"team name": team},
                {
                    "$push":{
                        "members": email
                    }
                }
            )
            collection.update_one(     
            {"email": email},   #given email to identify the account to update
            {
                "$push":{           #pushes values into a given array name.
                    "teams": team
                    }
            }
            )
    return

def leave_team(email, team):
    cursor = collection.find({"email": email}) 
    for item in cursor:
        teams = item["teams"]                       #look at teams user is in
    if team not in teams:                               #if the team they want to add is already in the team list exit
        return False
    else:
        cursor = team_collection.find({"team name": team}) #look for team in the database
        if cursor.count() != 1:
            return "not a valid team"
        collection.update_one(             #TO delete
        {"email": email},                       #given logged in
        {
            "$pull":                            #pull out of db
            {
                "teams": team  #thing to pull out, if it is a dict, it pulls out the entire dict
            }
        }
        )
        team_collection.update_one(
                {"team name": team},
                {
                    "$pull":{
                        "members": email
                    }
                }
            )

def add_team_event(team, thingToAdd):
    team_collection.update_one(     
        {"team name": team},   #given email to identify the account to update
        {
            "$push":{           #pushes values into a given array name.
            "events":
                    {
                        "$each": [thingToAdd]
                    }
                }
        }
    )

def delete_team_event(team, thingToDelete):
    team_collection.update_one(             #TO delete
        {"team name": team},                       #given logged in
        {
            "$pull":                            #pull out of db
            {
                "events": thingToDelete    #thing to pull out, if it is a dict, it pulls out the entire dict
            }
        }
    )
    
def get_team_events(team):
    cursor = team_collection.find({"team name": team})
    for item in cursor:
        events = item["events"]
    temp = {"team":team, "events":events}
    return temp
    
#################################################

##################ROUTES#########################
@auth.route('/login', methods=['GET', 'POST'])          
def login():
    session["email"] = NullSession.__name__         #Sets session to NULL for security
    session["team"] = NullSession.__name__
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
                    print("Loading calender...") 
                    getUser()                                               #for server side management
                    calenJson()
                                                                                #loads calender for session user
                    return redirect('/calen')                                             #redirects to calendar
                else:
                    print("wrong password")                                                 #for server side management
                    flash('password is incorrect', category="error")                        #flashes user a password error
        else:
            flash('email does not exist in database', category="error")                     #flashes user an email error
    return render_template("login.html")                                                    #renders our login page

@auth.route('/logout')
def logout():
    session["email"] = NullSession.__name__     #LOG OUT THE USER
    session["team"] = NullSession.__name__   
    if(len(stack)!=0):
        stack.pop()
    
    return render_template("logout.html")   

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('firstName')
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

        user_data = {"email": email, "name": name, "teams": [],"password": hashed, "salt": salt, "teams": [], "events": []}     
        collection.insert_one(user_data)                                                                 #saves user information in database
        flash("New account created", category="success")
        redirect('/signup')


    return render_template('signup.html')

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
        new_user = {"email": resp["email"], "name": resp["name"], "password": bcrypt.hashpw(resp["id"].encode('utf-8'), salt), "salt": salt, "teams": [], "events": []}  #create an account  given google user info
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
    return redirect('/calen')                #redirect to calen for user


@auth.route('/userInfo.json')
def getUser():
    email = session["email"]
    userInfo = {"email":email}
    return jsonify(userInfo)

@auth.route('/calen.json')
def calenJson():
    email = session["email"]
    if email == NullSession.__name__:                           #if user is not logged in and tries to access the calendar it will give an error message
        return "NOT LOGGED IN"
    if session["team"] != NullSession.__name__:
        teamname = session["team"]
        jsonData = get_team_events(teamname)
    else:
        jsonData = get_user_events(email)
    return jsonify(jsonData)

@auth.route('/tasklist', methods=['GET', 'POST'])
def taskList():
    email = session["email"]
    session["team"] = NullSession.__name__
    if email == NullSession.__name__:                           #if user is not logged in and tries to access the calendar it will give an error message
        return "NOT LOGGED IN"
    if request.method == 'POST':
        title = request.form.get('eventTitle')

        start = request.form.get('eventStart')
        end = request.form.get('eventEnd')
        event = {"title":title, "start":start, "end":end}
        if(request.form.get('personalDismiss')):
            if (delete_event(email, event)):
                calenJson()
                stack.append(email)
                return render_template("tasklist.html")
        elif(request.form.get('teamTaskDismiss')):
            team = request.form.get('teamName')
            delete_team_event(team,event)
            calenJson()
            return render_template("tasklist.html")
                
    return render_template("tasklist.html")

@auth.route('/joinTeam', methods = ['GET', 'POST'])
def joinTeam():
    email = session["email"]
    session["team"] = NullSession.__name__
    if email == NullSession.__name__:                           #if user is not logged in and tries to access the calendar it will give an error message
        return "NOT LOGGED IN"
    if request.method == 'POST':
        choice = request.form.get("RadioOptions")
        password = request.form.get("passInput")
        join_team(email, choice, password)
    return render_template("joinTeam.html")

@auth.route('/calen', methods=['GET', 'POST'])
def calen():
    email = session["email"]
    
    if email == NullSession.__name__:                           #if user is not logged in and tries to access the calendar it will give an error message
        session["team"] = NullSession.__name__
        return "NOT LOGGED IN"
    
    if request.method == 'POST':
        choice = request.form.get('inlineRadioOptions')         #either delete or enter an event
        strDes = request.form.get('eventName').capitalize()
        startT = request.form.get('startT')
        startD= request.form.get('startD')
        endD = request.form.get('endD')
        endT = request.form.get('endT')
        if(str(startT) != 'noTime'):
            startD= startD + 'T' + str(startT)
        if(str(endT) != 'noTime'):
            endD = endD +'T'+str(endT)
        # if(str(lol) == 'None'):
        #     return "hi"
        
        event = {'title': strDes.strip(), 'start': startD, "end" : endD}    #creates an event object given the input from user
        team = session["team"]
        if  team != NullSession.__name__:
            if choice == "createEve":
                add_team_event(team, event)                                 #if addevent, adds an event
            elif choice == "deleteEve":
                delete_team_event(team, event)                              #if deleteevent, deletes an event
            else:
                print("no choice")                                      #else, there is nothing happening
            calenJson()                                                 #renders new information and outputs to the calendar
        else:  
            if choice == "createEve":
                add_event(email, event)                                 #if addevent, adds an event
            elif choice == "deleteEve":
                delete_event(email, event)                              #if deleteevent, deletes an event
            else:
                print("no choice")                                      #else, there is nothing happening
            calenJson() 
        return render_template("calendar.html")
    return render_template("calendar.html", teamName ="")

@auth.route('/teams.json')
def list_teams():
    teams = team_collection.find({}, {'id': 1, 'team name': 1, 'private': 1})
    team_list = []
    for team in teams:
        temp = {'team name': team['team name'], 'private': team['private']}
        team_list.append(temp)
    return jsonify(team_list)

@auth.route('/userTeams.json')
def getUserTeams():
    email = session["email"]
    if email == NullSession.__name__:                           #if user is not logged in and tries to access the calendar it will give an error message
        return "NOT LOGGED IN"
    cursor = collection.find({"email": email})  #finds user in database by email
    dict = []
    for item in cursor:
        teams = item["teams"]                 #get user events
        for team in teams:
            cursor2 = team_collection.find({"team name": team})
            for items in cursor2:
                events = items["events"]
            temp = {"teams" : team, "events": events}
            dict.append(temp)
    return jsonify(dict)

@auth.route('/myTeam', methods=['GET', 'POST'])
def myTeam():
    email = session["email"]
    session["team"] = NullSession.__name__
    if email == NullSession.__name__:
        return "Not Logged In"
    if request.method == 'POST':
        if(request.form.get('checkCalen')):
            title = request.form.get('teamName') 
            session["team"] = title
            calenJson()
            return redirect('/calen')
        elif(request.form.get('leaveT')):
            title = request.form.get('teamName') 
            leave_team(email,title)
            return redirect('/myTeam')
        
        
    return render_template("myTeam.html")


@auth.route('/createTeam', methods=['GET', 'POST'])
def createTeam():
    email = session["email"]
    session["team"] = NullSession.__name__
    if email == NullSession.__name__:                           #if user is not logged in and tries to access the calendar it will give an error message
        return "NOT LOGGED IN"
    if request.method == 'POST':
        private = request.form.get('inlineRadioOptions')
        temp = ""
        PRIV = False
        teamName = request.form.get('teamName')
        pass1 = request.form.get('password1')
        pass2 = request.form.get('password2')
        
        if(pass1 != pass2):
            return "PASSWORDS ARE DIFFERENT"
        if private == "private":
            temp = pass1
            PRIV = True
        team = {'team name': teamName, 'members': [email], 'leader': email, 'private': PRIV, 'password': temp, 'events': []}
        output = create_team(email, team)
        if(output == False):
            return "FAILED"
    return render_template('createTeam.html')
#################################################
