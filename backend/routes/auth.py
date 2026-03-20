from flask import Blueprint, request, jsonify
from database import db
from model.User import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Utilisateur introuvable"}), 404
    elif user.password != password:
        return jsonify({"message": "Mot de passe non valide"}), 401
    else:
        token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'Connexion réussite, vous allez être redirigé',
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'username': user.username,
                'bio': user.bio,
                'location': user.locate,
                'followers': user.followers,
                'following': user.following,
                'created_at': user.created_at,
                'avatar': user.avatar,
                'banner': user.banner
            }
        }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("fullName")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message": "Email already registered"}), 400

    new_user = User(name=name, username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    token = create_access_token(identity=str(new_user.id))
    return jsonify({
        'message': 'Inscription réussie',
        'token': token,
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email,
            'username': new_user.username,
            'bio': new_user.bio,
            'location': new_user.locate,
            'followers': new_user.followers,
            'following': new_user.following,
        }
    }), 201