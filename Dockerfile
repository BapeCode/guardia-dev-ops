FROM python:3.12-slim

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code
COPY . .

# Dossier uploads persistant
RUN mkdir -p /app/app/static/uploads/avatars \
             /app/app/static/uploads/banners \
             /app/app/static/uploads/posts

EXPOSE 5000

CMD ["flask", "run", "--debug"]