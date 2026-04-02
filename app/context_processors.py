from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.User import User

def inject_user():
    try:
        verify_jwt_in_request(locations=["cookies"], optional=True)
        user_id = get_jwt_identity()
        if user_id:
            user = User.query.get(int(user_id))
            return {"current_user": user}
    except Exception:
        pass
    return {"current_user": None}