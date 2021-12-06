from flask import Flask
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os

load_dotenv()
def create_app():
    app = Flask(__name__) #name of file
    from .auth import auth
    from .views import views
    
    oauth = OAuth(app)
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(views, url_prefix='/')
    
    app.config['SECRET_KEY'] =str(os.getenv("WEB_KEY"))
    
    return app
