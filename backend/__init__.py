import os
from flask import Flask
from flask_cors import CORS
from database import db
from routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, 'database.db')

    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        from model.User import User # Pas de point
        from model.Post import Post # Pas de point
        db.create_all()

    app.register_blueprint(auth_bp, url_prefix="/api")

    return app