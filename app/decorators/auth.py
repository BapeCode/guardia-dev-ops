from functools import wraps

from flask import redirect, url_for

from app.models.User import User
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, current_user


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request(locations=["cookies"])
            user_id = int(get_jwt_identity())
            user = User.query.get(user_id)
            if not user:
                raise Exception("User not found")
            redirect(url_for("dashboard.index"))
            return f(current_user=user, *args, **kwargs)
        except Exception as e:
            print(f"[login_required] Erreur : {e}")  # ← pour voir ce qui plante
            return redirect(url_for("auth.login"))
    return decorated