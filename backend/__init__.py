import os
from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from .database import db
from .routes.auth import auth_bp
from .routes.payment import payment_bp
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(
        __name__,
        static_folder='static',
        instance_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "instance"),
    )
    CORS(app)

    os.makedirs(app.instance_path, exist_ok=True)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "c133d8f3767c0667d1149bba38500713f2cf9f39c5864e799d85b1ec630aaecc"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)


    db.init_app(app)
    migrate = Migrate(app, db)
    from .models import (
        User, Post, Comment, Like, Follow,
        Repost, Conversation, ConversationMember,
        Message, Notification, Suggestion
    )
    from .models.Payment import Payment

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(payment_bp, url_prefix="/api")

    JWTManager(app)

    return app