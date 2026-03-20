from flask import Blueprint, request, jsonify
from database import db
from model.User import User

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
        return jsonify({"message": "Connexion réussite, vous allez être redirigé"}), 200


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
    return jsonify({"message": "Registration successful"}), 200