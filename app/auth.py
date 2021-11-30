from typing import Text
from flask import Blueprint, render_template, request, flash, jsonify
import pymongo

from pymongo import MongoClient

auth = Blueprint('auth', __name__)

cluster = MongoClient("mongodb+srv://Connor:Bustos@cluster0.z1idj.mongodb.net/Login?retryWrites=true&w=majority")
db = cluster["Login"]
collection = db["data"]

valid_logins = collection.find({}, {'_id': 0, 'email': 1, 'password': 1})

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password1')

        print(email + " " + password)

        valid_email = True
        valid_password = True
        for data in valid_logins:
            if data['email'] == email:
                
                print('email exists in database')
            else:
                
                print('email does not exist in database')
                valid_email = False

            if data['password'] == password:
                flash("login successful", category="success")
                print('password exists in database')
            else:
                print('password does not exist in database')
                valid_password = False

        if valid_password and valid_email:
            # login_with_user(email, password)
            flash("Login successful", category="success")
            print("Successful login with " + email + " " + password)
            print("Loading calender...")
            return render_template("calendar.html")
        else:
            print("Login was not valid")

    # current_login_instance = {"email: ": email, "password": password}

    return render_template("login.html", text="test")


@auth.route('/logout')
def logout():
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
            print("Passwords need to be the same")
            # return

        # user_data = {"email": email, "name": name, "password": password_confirm}

        # print(user_data)

        # collection.insert_one(user_data)

        # for data in valid_logins:
        #     print(data)

        # all_data = collection.find()
        #
        # for db_data in all_data:
        #     print(db_data)
        #
        # print(user_data)

        check = False
        # check statements for if valid
        if '@' in email:
            check = True
        if len(password) < 8:
            print("Password must be 8 characters or longer.")
        if password != password_confirm:
            check = False
            print("Password does not match with the Confirm password")
        if check:
            flash("account created", category="success")
            print('All valid checks passed to create an account.')
    return render_template("signup.html")


@auth.route('/calen', methods=['GET', 'POST'])
def calen():
    if request.method == 'POST':
        strDes = request.form.get('eventName')
        startD= request.form.get('startD')
        endD = request.form.get('endD')
        dic = {'title': strDes, 'start date': startD, "end date" : endD}
        return jsonify(dic)
    else:
        print("hi")
    return render_template("calendar.html" )

