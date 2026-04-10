import os
import uuid

from flask import current_app

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def harvest_file(filename):
    if filename == "":
        return "Aucun fichier sélectionner", "error"

    if not allowed_file(filename):
        return "Format non autorisé (png, jpg, jpeg, webp)", "error"

    return None, "Ok"


def encrypt_filename(file):
    ext = file.filename.rsplit(".", 1)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return "L'extension n'est pas autorisé", False
    return f"{uuid.uuid4().hex}.{ext}", True


def upload(file, filename, file_path, current_file):
    if "avatars" not in file_path and "banners" not in file_path:
        return False, "Chemin d'upload non autorisé"
    upload_file = os.path.join(current_app.root_path, "static", "uploads", file_path)
    os.makedirs(upload_file, exist_ok=True)

    if current_file:
        old_path = os.path.join(
            current_app.root_path, "static", "uploads", file_path, current_file
        )
        if os.path.exists(old_path):
            os.remove(old_path)
    file.save(os.path.join(upload_file, filename))
    return True, "Fichier uploadé avec succès"
