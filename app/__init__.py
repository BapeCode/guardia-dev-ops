import os
from flask import Flask
from flask.cli import load_dotenv
from flask_cors import CORS
from .extensions import database, migrate, jwt

load_dotenv()

def create_app():
    app = Flask(
        __name__,
        template_folder='templates',
        static_folder='static',
        instance_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
    )
    os.makedirs(app.instance_path or "instance", exist_ok=True)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{app.instance_path}/database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev")
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False

    CORS(app)

    database.init_app(app)
    migrate.init_app(app, database)
    jwt.init_app(app)

    from .routes.home import  home_bp
    from .routes.auth import auth_bp
    from .routes.dashboard import dashboard_bp
    app.register_blueprint(home_bp, url_prefix="/")
    app.register_blueprint(auth_bp, url_prefix="/")
    app.register_blueprint(dashboard_bp, url_prefix="/")

    return app