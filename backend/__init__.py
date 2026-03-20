import os
from flask import Flask
from flask_cors import CORS
from database import db
from routes.auth import auth_bp
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(
        __name__,
        instance_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "instance")
    )
    CORS(app)

    os.makedirs(app.instance_path, exist_ok=True)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


    db.init_app(app)
    migrate = Migrate(app, db)
    from model.User import User
    from model.Post import Post
    from routes.auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/api")

    JWTManager(app)

    return app