from flask import Blueprint, request, jsonify
from ..instance.db import db
from ..model.Payment import Payment

# ==========================================
# BLUEPRINT
# ==========================================
# Un Blueprint c'est un "groupe de routes".
# Comme auth_bp regroupe les routes d'authentification,
# payment_bp regroupe les routes de paiement.
payment_bp = Blueprint('payment', __name__)

# Clé secrète pour le hash de sécurité
# ⚠️  En production, mets ça dans une variable d'environnement !
# Pour l'instant on la met ici pour apprendre.
PAYMENT_SECRET = "change-moi-en-production-avec-une-vraie-cle-secrete"


# ==========================================
# ROUTE 1 : Créer un paiement
# ==========================================
# POST /api/payments
# Le frontend envoie : { user_id, amount, currency, method, description }
@payment_bp.route('/payments', methods=['POST'])
def create_payment():
    # request.get_json() récupère le JSON envoyé par le frontend
    data = request.get_json()

    # --- Validation : on vérifie que les champs obligatoires sont là ---
    required_fields = ['user_id', 'amount', 'method']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Le champ "{field}" est requis'}), 400

    # --- Création du paiement ---
    payment = Payment(
        user_id=data['user_id'],
        amount=data['amount'],
        currency=data.get('currency', 'EUR'),  # .get() = valeur par défaut si absent
        method=data['method'],
        description=data.get('description', '')
    )

    # On génère la référence unique et le hash de sécurité
    payment.generate_reference()
    payment.generate_security_hash(PAYMENT_SECRET)

    # On sauvegarde en base de données
    db.session.add(payment)    # "ajoute ce paiement à la file d'attente"
    db.session.commit()        # "enregistre tout en base"

    return jsonify({
        'message': 'Paiement créé avec succès',
        'payment': payment.to_dict()
    }), 201  # 201 = "Created" (ressource créée avec succès)


# ==========================================
# ROUTE 2 : Récupérer tous les paiements d'un utilisateur
# ==========================================
# GET /api/payments/user/3  → tous les paiements du user n°3
@payment_bp.route('/payments/user/<int:user_id>', methods=['GET'])
def get_user_payments(user_id):
    # .query.filter_by() cherche dans la table Payment
    # où user_id correspond
    payments = Payment.query.filter_by(user_id=user_id).all()

    return jsonify({
        'payments': [p.to_dict() for p in payments]
        # ↑ "list comprehension" : transforme chaque paiement en dict
    }), 200


# ==========================================
# ROUTE 3 : Récupérer un paiement par sa référence
# ==========================================
# GET /api/payments/PAY-a1b2c3d4
@payment_bp.route('/payments/<string:reference>', methods=['GET'])
def get_payment(reference):
    payment = Payment.query.filter_by(reference=reference).first()

    if not payment:
        return jsonify({'error': 'Paiement introuvable'}), 404

    # On vérifie l'intégrité du hash
    if not payment.verify_hash(PAYMENT_SECRET):
        return jsonify({'error': 'Alerte : les données de ce paiement semblent altérées'}), 403

    return jsonify({'payment': payment.to_dict()}), 200


# ==========================================
# ROUTE 4 : Mettre à jour le statut d'un paiement
# ==========================================
# PATCH /api/payments/PAY-a1b2c3d4/status
# Le frontend envoie : { "status": "completed" }
@payment_bp.route('/payments/<string:reference>/status', methods=['PATCH'])
def update_payment_status(reference):
    payment = Payment.query.filter_by(reference=reference).first()

    if not payment:
        return jsonify({'error': 'Paiement introuvable'}), 404

    data = request.get_json()
    new_status = data.get('status')

    # Liste des statuts autorisés
    allowed_statuses = ['pending', 'completed', 'failed', 'refunded']
    if new_status not in allowed_statuses:
        return jsonify({
            'error': f'Statut invalide. Valeurs possibles : {allowed_statuses}'
        }), 400

    payment.status = new_status
    db.session.commit()

    return jsonify({
        'message': f'Statut mis à jour → {new_status}',
        'payment': payment.to_dict()
    }), 200