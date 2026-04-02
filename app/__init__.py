import os
from datetime import datetime
from datetime import timedelta

from flask import Flask
from flask_cors import CORS

from app.extensions import database, migrate, jwt
from .context_processors import inject_user


def timeago(dt):
    if not dt:
        return ""
    if isinstance(dt, str):
        try:
            dt = datetime.fromisoformat(dt)
        except ValueError:
            return dt
    now = datetime.now()
    diff = now - dt
    s = int(diff.total_seconds())
    if s < 60:      return "à l'instant"
    if s < 3600:    return f"{s // 60}min"
    if s < 86400:   return f"{s // 3600}h"
    if s < 604800:  return f"{s // 86400}j"
    if s < 2592000: return f"{s // 604800} sem"
    return dt.strftime("%d/%m/%Y à %H:%M")


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
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

    CORS(app)

    database.init_app(app)
    migrate.init_app(app, database)
    jwt.init_app(app)
    app.context_processor(inject_user)

    from .routes.home import home_bp
    from .routes.auth import auth_bp
    from .routes.dashboard import dashboard_bp
    app.register_blueprint(home_bp, url_prefix="/")
    app.register_blueprint(auth_bp, url_prefix="/")
    app.register_blueprint(dashboard_bp, url_prefix="/")

    app.jinja_env.filters["timeago"] = timeago

    return app
