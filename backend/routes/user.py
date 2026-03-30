from flask import Flask, request, Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.User import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/users/suggest', methods=["GET"])
@jwt_required()
def user_suggestion():
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({
            "error": "Utilisateur est introuvable",
        }), 404

    user_suggestion = (User.query
        .filter(User.id != current_user_id)
        .order_by(User.created_at.desc())
        .limit(5)
        .all())
    return jsonify({
        "users": [p.to_dict() for p in user_suggestion]
    }), 200
