from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

# Configuration SQLite (plus simple, pas d'utilisateur/mot de passe requis)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///oncity.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Exemple de modèle pour ton formulaire de contact
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    message = db.Column(db.Text)

# Création de la base au démarrage
with app.app_context():
    db.create_all()

@app.route('/api/status')
def status():
    return jsonify({"message": "Backend Flask OK avec SQLite !"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)