# Utilisation d'une image légère de Python
FROM python:3.11-slim

# Évite que Python ne génère des fichiers .pyc et permet un affichage direct des logs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Définition du dossier de travail dans le container
WORKDIR /app

# Installation des dépendances système nécessaires pour MySQL (connecteur)
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copie et installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du reste du code source
COPY . .

# Port exposé par Flask
EXPOSE 5000

# Commande de lancement (en mode développement pour le moment)
CMD ["python", "run.py"]