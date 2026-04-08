FROM python:3.12-slim

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends  \
    gcc=4:14.2.0-1 \
    sqlite3=3.46.1-7+deb13u1 \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code
COPY . .

# Dossier uploads persistant & permissions
RUN mkdir -p /app/app/static/uploads/avatars \
    /app/app/static/uploads/banners \
    /app/app/static/uploads/posts \
    && adduser --disabled-password --gecos "" glintuser \
    && chown -R glintuser:glintuser /app

# Switch à un utilisateur non-root pour la sécurité
USER glintuser

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]