from flask import Flask
from authlib.integrations.flask_client import OAuth
def create_app():
    app = Flask(__name__) #name of file
    
    from .views import views
    from .auth import auth
    oauth = OAuth(app)
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.config['SECRET_KEY'] ='WeTried13'
    print("success")
    return app
