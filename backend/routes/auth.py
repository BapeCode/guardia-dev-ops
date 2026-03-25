import uuid
import os
from flask import Blueprint, request, jsonify, current_app
from ..database import db
from ..models.User import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

auth_bp = Blueprint("auth", __name__)

# Fonction

def get_user(user):
    return {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'username': user.username,
            'bio': user.bio,
            'location': user.locate,
            'created_at': user.created_at,
            'updated_at': user.updated_at,
            'avatar': user.avatar,
            'banner': user.banner,
            'followers': user.followers_count,
            'following': user.following_count,
    }

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route

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
            'user': get_user(user)
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
        'user': get_user(new_user)
    }), 201

@auth_bp.route('/update', methods=['POST'])
def update():
    data = request.get_json()
    id = data.get("id")
    name = data.get("name")
    locate = data.get('locate')
    bio = data.get("bio")

    user_update = User.query.get(id)
    user_update.name = name
    user_update.locate = locate
    user_update.bio = bio

    db.session.commit()

    return jsonify({
        'message': 'Mise à jour réussie',
        'user_update': get_user(user_update)
    })

@auth_bp.route("/avatar_upload", methods=['POST'])
@jwt_required()
def avatar_upload():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if 'avatar' not in request.files:
        return jsonify({'error': 'Aucune fichier envoyé'}), 400

    file = request.files['avatar']

    if file.filename == '':
        return jsonify({'error', 'Aucun fichier sélectionné'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Format non autorisé (png, jpg, jpeg, webp)'}), 400

    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"

    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'avatars')
    os.makedirs(upload_folder, exist_ok=True)

    if user.avatar:
        old_path = os.path.join(current_app.root_path, user.avatar.lstrip('/'))
        if os.path.exists(old_path):
            os.remove(old_path)

    file.save(os.path.join(upload_folder, filename))
    user.avatar = f"/static/uploads/avatars/{filename}"
    db.session.commit()

    return jsonify({'message': 'Photo de profil sauvegardé', 'user': get_user(user)}), 200

@auth_bp.route("/banner_upload", methods=['POST'])
@jwt_required()
def banner_upload():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if 'banner' not in request.files:
        return jsonify({'error': 'Aucune fichier envoyé'}), 400

    file = request.files['banner']

    if file.filename == '':
        return jsonify({'error', 'Aucun fichier sélectionné'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Format non autorisé (png, jpg, jpeg, webp)'}), 400

    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"

    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'banners')
    os.makedirs(upload_folder, exist_ok=True)

    if user.banner:
        old_path = os.path.join(current_app.root_path, user.banner.lstrip('/'))
        if os.path.exists(old_path):
            os.remove(old_path)

    file.save(os.path.join(upload_folder, filename))
    user.banner = f"/static/uploads/banners/{filename}"
    db.session.commit()
    return jsonify({'message': 'Bannière sauvegardé', 'user': get_user(user)}), 200