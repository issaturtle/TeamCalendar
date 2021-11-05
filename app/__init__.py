from flask import Flask

def create_app():
    app = Flask(__name__) #name of file
    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.config['SECRET_KEY'] ='WeTried13'
    return app
