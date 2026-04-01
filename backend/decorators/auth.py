from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from ..models import User

def jwt_user(f):
    @wraps(f)  # ← important pour Flask
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Introuvable"}), 404
        return f(current_user=user, *args, **kwargs)
    return decorated

def owner_only(model):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = int(get_jwt_identity())
            resource_id = kwargs.get("post_id") or kwargs.get("id")
            resource = model.query.get(resource_id)
            if not resource or resource.author_id != current_user_id:
                return jsonify({"error": "Accès refusé"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator