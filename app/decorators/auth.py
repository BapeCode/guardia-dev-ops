from functools import wraps

from flask import redirect, url_for

from app.models.User import User
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request(locations=["cookies"])
            user_id = int(get_jwt_identity())
            print(f"[login_required] user_id: {user_id}")
            user = User.query.get(user_id)
            if not user:
                raise Exception("User not found")
            return f(current_user=user, *args, **kwargs)
        except Exception as e:
            print(f"[login_required] ERREUR: {type(e).__name__}: {e}")
            return redirect(url_for("auth.login"))
    return decorated