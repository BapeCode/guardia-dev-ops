from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

# Config MySQL
app.config['SQLALCHEMY_DATABASE_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@db/{os.getenv('DB_NAME')}"
db = SQLAlchemy(app)

@app.route('/api/status')
def status():
    return jsonify({"message": "Le Backend Flask est en ligne et connecté à MySQL !"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)