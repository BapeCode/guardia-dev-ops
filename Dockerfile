FROM python:3.14-slim AS builder

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends  \
    gcc=4:14.2.0-1 \
    sqlite3=3.46.1-7+deb13u1 \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Code 
COPY . .

# Créer les dossiers uploads dans le builder
RUN mkdir -p /app/app/static/uploads/avatars \
    /app/app/static/uploads/banners \
    /app/app/static/uploads/posts

# Distroless 
FROM gcr.io/distroless/python3-debian12:nonroot

WORKDIR /app

# Copier les dépendances installées depuis l'étape de build
COPY --from=builder /install /install

# Copier le code
COPY --from=builder /app .

# ENV PYTHONPATCH
ENV PYTHONPATH=/install/lib/python3.14/site-packages

# Switch à un utilisateur non-root pour la sécurité
USER nonroot

EXPOSE 5000

CMD ["app.py"]