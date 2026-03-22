import hashlib
import uuid
from datetime import datetime, timezone
from ..database import db


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    amount = db.Column(db.Float, nullable=False)

    currency = db.Column(db.String(3), nullable=False, default='EUR')

    method = db.Column(db.String(50), nullable=False)

    status = db.Column(db.String(20), nullable=False, default='pending')

    description = db.Column(db.String(255), nullable=True)

    reference = db.Column(db.String(100), unique=True, nullable=False)

    security_hash = db.Column(db.String(64), nullable=False)

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    user = db.relationship('User', backref=db.backref('payments', lazy=True))


    def generate_reference(self):
        self.reference = f"PAY-{uuid.uuid4().hex[:8]}"

    def generate_security_hash(self, secret_key):
        """
        Crée un hash SHA-256 à partir des données critiques du paiement.

        Pourquoi ? Si quelqu'un modifie directement la DB (le montant,
        le statut...), le hash ne correspondra plus → on sait que
        les données ont été falsifiées.

        Le secret_key est un mot de passe que seul ton serveur connaît.
        """
        # On concatène les données importantes + le secret
        data = f"{self.user_id}{self.amount}{self.currency}{self.reference}{secret_key}"

        # hashlib.sha256() transforme ça en une chaîne de 64 caractères
        # impossible à inverser
        self.security_hash = hashlib.sha256(data.encode()).hexdigest()

    def verify_hash(self, secret_key):
        """
        Vérifie que le hash stocké correspond toujours aux données.
        Retourne True si tout est OK, False si les données ont été modifiées.
        """
        data = f"{self.user_id}{self.amount}{self.currency}{self.reference}{secret_key}"
        expected_hash = hashlib.sha256(data.encode()).hexdigest()
        return self.security_hash == expected_hash

    def to_dict(self):
        """
        Convertit le paiement en dictionnaire Python.
        Utile pour renvoyer du JSON au frontend.
        (on ne renvoie PAS le security_hash au client !)
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'currency': self.currency,
            'method': self.method,
            'status': self.status,
            'description': self.description,
            'reference': self.reference,
            'created_at': self.created_at.isoformat()
        }