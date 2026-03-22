import os
from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .instance.db import db
from .routes.auth import auth_bp
from .routes.payment import payment_bp

def create_app():
    app = Flask(__name__, instance_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "instance"))

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "ton-secret-super-secure"  # Change ça !
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)

    from .model.User import User
    from .model.Post import Post
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(payment_bp, url_prefix="/api")

    return app