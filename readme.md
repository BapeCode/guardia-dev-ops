# GLINT 🌟

> Un réseau social intime, conçu pour des connexions authentiques entre amis.

---

## À propos

**GLINT** est une application de réseau social développée dans le cadre d'un projet scolaire DevSecOps à Guardia Cybersecurity School (Lyon, 2ème année).

L'objectif est de proposer une plateforme minimaliste et sécurisée permettant à ses utilisateurs de partager des posts, interagir via des likes et reposts, s'envoyer des messages privés et gérer leur profil — le tout dans une interface inspirée de Twitter/X, avec une identité visuelle warm & gold unique.

Le projet suit une approche **DevSecOps** : pipeline CI/CD, conteneurisation Docker, gestion des migrations de base de données, sécurisation des routes et des uploads, hashage des paiements, et architecture orientée contrôleurs.

---

## Stack technique

### Backend

| Technologie                               | Usage                                       |
| ----------------------------------------- | ------------------------------------------- |
| **Python 3.12**                           | Langage principal                           |
| **Flask**                                 | Framework web                               |
| **SQLAlchemy** (Mapped / `mapped_column`) | ORM avec typage moderne                     |
| **Flask-Migrate** / **Alembic**           | Migrations de base de données               |
| **Flask-JWT-Extended**                    | Authentification JWT via cookies HttpOnly   |
| **Flask-CORS**                            | Gestion des origines cross-domain           |
| **Werkzeug**                              | Hashage des mots de passe, utilitaires HTTP |
| **SQLite**                                | Base de données (développement)             |
| **Docker**                                | Conteneurisation                            |
| **Kubernetes** (Minikube)                 | Orchestration de conteneurs                 |

### Frontend

| Technologie            | Usage                                               |
| ---------------------- | --------------------------------------------------- |
| **Jinja2**             | Moteur de templates Flask                           |
| **Tailwind CSS** (CDN) | Framework CSS utilitaire                            |
| **HTMX**               | Interactions dynamiques sans rechargement           |
| **JavaScript vanilla** | Composants interactifs (dropdown, tabs, animations) |

### Architecture

- Pattern **MVC** (Models / Controllers / Routes)
- **Decorators** custom (`@login_required` avec injection de `current_user`)
- **Validators** (DTOs) pour la validation des formulaires
- **Context processors** pour injecter `current_user` dans tous les templates
- **Services** dédiés pour la gestion des uploads (avatar, bannière)
- **Macros Jinja2** pour les composants réutilisables (Button, Input, Icon, Flash...)

---

## Fonctionnalités

- 🔐 Authentification (inscription / connexion) avec JWT stocké en cookie HttpOnly
- 📝 Création, suppression de posts
- ❤️ Like et repost (toggle) via HTMX sans rechargement
- 👤 Profil utilisateur avec avatar, bannière, bio, localisation
- ✏️ Édition du profil (upload d'images sécurisé)
- 👥 Système de follow / unfollow
- 💬 Messagerie privée (conversations)
- 💳 Système de paiement sécurisé avec hash SHA-256
- 🔔 Notifications
- 💡 Suggestions d'utilisateurs à suivre

---

## Installation

### Prérequis

- Python 3.14+
- Git

### 1. Cloner le projet

```bash
git clone https://github.com/BapeCode/guardia-dev-ops.git
cd guardia-dev-ops
```

### 2. Créer et activer le venv

```bash
# Créer le venv
python3.14 -m venv venv

# Activer (Mac/Linux)
source venv/bin/activate

# Activer (Windows)
venv\Scripts\activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configurer les variables d'environnement

Crée un fichier `.env` à la racine :

```env
SECRET_KEY
JWT_SECRET_KEY
FLASK_APP=run.py
FLASK_DEBUG=1
```

Génère des clés sécurisées :

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 5. Initialiser la base de données

```bash
flask db init
flask db migrate -m "initial"
flask db upgrade
```

### 6. Lancer l'application

```bash
python run.py
```

L'application est accessible sur [http://localhost:5000](http://localhost:5000)

---

## Installation avec Docker

```bash
# Build et lancement
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

L'application est accessible sur [http://localhost:5000](http://localhost:5000)

---

## Installation avec Kubernetes (Minikube)

Cette méthode déploie l'application sur un cluster Kubernetes local, utile pour reproduire un environnement proche de la production. L'image Docker `dshellz/glint` doit être disponible publiquement sur Docker Hub.

### Prérequis (à installer une fois sur la machine)

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Minikube** : `winget install Kubernetes.minikube` (Windows) ou voir [doc officielle](https://minikube.sigs.k8s.io/docs/start/)
- **kubectl** : `winget install Kubernetes.kubectl`

> 💡 Pour comprendre les alternatives à Minikube (clusters cloud, autres drivers, etc.), voir [`docs/k8s-setup-alternatives.md`](docs/k8s-setup-alternatives.md).

### 1. Démarrer le cluster

```powershell
minikube start --driver=docker --cpus=4 --memory=4g --kubernetes-version=v1.31.0
```

Vérification :
```powershell
kubectl get nodes
```

### 2. Créer le fichier Secret

Le fichier `k8s/01-secret.yaml` **n'est pas versionné** (présent dans `.gitignore`). Il faut le créer à partir de l'exemple :

```powershell
Copy-Item k8s/01-secret.example.yaml k8s/01-secret.yaml
```

Encoder tes vraies valeurs en base64 :
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("ta-secret-key"))
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("ta-jwt-key"))
```

Puis remplacer les valeurs dans `k8s/01-secret.yaml`.

### 3. Appliquer tous les manifests

```powershell
kubectl apply -f k8s/
```

Cela crée :
- Le **Secret** `glint-secrets` (clés sensibles)
- La **ConfigMap** `nginx-config` (fichier `nginx.conf`)
- Les **PersistentVolumeClaim** `uploads-pvc` (1 Gi) et `db-pvc` (500 Mi)
- Le **Deployment** + **Service** `backend` (Flask)
- Le **Deployment** + **Service** `nginx` (reverse proxy)

Vérifier que tous les pods sont en `Running` :
```powershell
kubectl get pods
```

### 4. Initialiser la base de données (première fois uniquement)

```powershell
kubectl exec deployment/backend -- python -m flask db upgrade
```

Les tables sont créées dans le PVC `db-pvc` et **persistent** au redémarrage des pods.

### 5. Accéder à l'application

```powershell
minikube service nginx
```

La commande ouvre automatiquement le navigateur sur l'URL exposée par Minikube.

### Commandes utiles

| Commande | Effet |
|---|---|
| `kubectl get pods` | État des pods |
| `kubectl get pvc` | État des volumes persistants |
| `kubectl logs deployment/backend` | Logs du backend Flask |
| `kubectl logs deployment/nginx` | Logs du reverse proxy |
| `kubectl describe pod <nom>` | Détails et événements d'un pod |
| `kubectl delete pod -l app=backend` | Forcer le redémarrage du backend (test de résilience) |
| `minikube stop` | Arrêter le cluster (libère CPU/RAM, garde l'état) |
| `minikube delete` | Détruire le cluster (perd toutes les ressources) |

### ⚠️ Limitations actuelles

- **1 seul replica du backend** (SQLite ne supporte pas les écritures concurrentes via plusieurs pods). Pour scaler horizontalement, migrer vers PostgreSQL.
- Migrations à lancer **manuellement** après chaque déploiement de nouvelle image. Une évolution future ajoutera un init container pour automatiser.
- Sur Windows + driver Docker, l'IP du node Minikube (`192.168.49.2`) n'est pas routable directement : utiliser `minikube service nginx` pour le tunneling.

---

## Structure du projet

```
guardia-dev-ops/
├── app/
│   ├── __init__.py              # Factory pattern create_app()
│   ├── extensions.py            # SQLAlchemy, JWT, Migrate
│   ├── context_processors.py    # Injection current_user dans templates
│   ├── controllers/             # Logique métier
│   │   ├── DashboardControllers.py
│   │   ├── AuthControllers.py
│   │   └── PostController.py
│   ├── decorators/              # @login_required custom
│   │   └── auth.py
│   ├── models/                  # Modèles SQLAlchemy (Mapped)
│   │   ├── User.py
│   │   ├── Post.py
│   │   ├── Comment.py
│   │   ├── Like.py
│   │   ├── Follow.py
│   │   ├── Repost.py
│   │   ├── Notification.py
│   │   ├── Conversation.py
│   │   └── Payment.py
│   ├── routes/                  # Blueprints Flask
│   │   ├── auth.py
│   │   ├── dashboard.py
│   │   └── posts.py
│   ├── validators/              # DTOs et validation des formulaires
│   │   └── AuthValidator.py
│   ├── services/                # Upload, hashage
│   │   └── uploads_services.py
│   ├── static/                  # CSS, JS, uploads
│   │   ├── css/
│   │   ├── scripts/
│   │   └── uploads/
│   │       ├── avatars/
│   │       └── banners/
│   └── templates/               # Jinja2 templates
│       ├── layout.html
│       ├── base.html
│       ├── auth/
│       ├── dashboard/
│       └── components/
├── migrations/                  # Alembic migrations
├── .env                         # Variables d'environnement (non versionné)
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── run.py                       # Point d'entrée
```
## Pipeline CI/CD

Le projet utilise **GitHub Actions** avec une approche **DevSecOps** ("Shift Left Security"). Le pipeline s'exécute sur push et pull request vers `master` et `dev`.

### Jobs

| # | Job | Type | Outil | Description |
|---|---|---|---|---|
| 0 | **Check_changes** | Optimisation | `paths-filter` | Détecte les fichiers modifiés pour skip les jobs inutiles |
| 1 | **Gitleaks** | Secrets | `gitleaks` | Détection de secrets commités |
| 2 | **Semgrep** | SAST | `semgrep` | Analyse statique (règles custom + `p/secrets`) |
| 3 | **Ruff** | Lint | `ruff` | Linting + formatage auto (auto-commit) |
| 4 | **Bandit** | SAST | `bandit` | Vulnérabilités de sécurité Python |
| 5 | **Pip Audit** | SCA | `pip-audit` | CVE des dépendances Python |
| 6 | **Pre-build** | Config | `Hadolint` + `Trivy` | Lint Dockerfile + scan config |
| 7 | **Build** | Build | `docker/build-push` | Build & push image sur DockerHub |
| 8 | **Post-build** | Image | `Trivy` | Scan de l'image Docker buildée |
| 9 | **DAST** | Runtime | `Nikto` | Scan dynamique de l'app en runtime |

### Sécurité intégrée

- 🔍 **Secrets scanning** au checkout (Gitleaks)
- 🛡️ **SAST** avant build (Semgrep, Bandit)
- 📦 **SCA** sur les dépendances (Pip Audit)
- 🐳 **Container security** avant/après build (Hadolint, Trivy)
- 🌐 **DAST** en runtime (Nikto)
- ⚙️ Chaque job bloque le suivant en cas d'échec critique
---

## Patches & Changelog

### v0.4.0 — Orchestration Kubernetes

- Intégration **Kubernetes** via Minikube en local
- Manifests YAML versionnés dans `k8s/` :
  - `Secret` pour les clés sensibles (non versionné, exemple fourni)
  - `ConfigMap` pour `nginx.conf`
  - `PersistentVolumeClaim` pour les uploads et la base SQLite
  - `Deployment` + `Service` du backend Flask (1 replica, contrainte SQLite)
  - `Deployment` + `Service` Nginx exposé via NodePort
- Variables d'environnement injectées depuis le Secret (`SECRET_KEY`, `JWT_SECRET_KEY`)
- Volumes persistants validés : les données survivent au redémarrage des pods
- Documentation des alternatives K8s (cloud managé, autres drivers) dans `docs/k8s-setup-alternatives.md`

### v0.3.0 — Architecture MVC & DevSecOps

- Refactorisation complète en pattern Controllers / Routes / Models
- Ajout du decorator `@login_required` avec injection de `current_user`
- Ajout des validators (DTOs) pour la validation des formulaires
- Service d'upload sécurisé (validation extension, uuid filename, suppression ancien fichier)
- Hash SHA-256 sur les paiements pour détecter toute falsification en BDD
- Naming convention Alembic pour compatibilité SQLite

### v0.2.0 — Authentification & Modèles

- JWT stocké en cookie HttpOnly (plus de localStorage)
- Modèles réécrits avec la syntaxe `Mapped` / `mapped_column` (SQLAlchemy moderne)
- Relations `back_populates` sur tous les modèles
- Context processor pour injecter `current_user` dans tous les templates
- Système de follow / unfollow
- Suggestions d'utilisateurs

### v0.1.0 — Bootstrap du projet

- Initialisation Flask avec factory pattern `create_app()`
- `extensions.py` pour éviter les imports circulaires
- Mise en place Flask-Migrate avec naming convention
- Templates Jinja2 avec Tailwind CSS + HTMX
- Macros Jinja2 réutilisables (Button, Input, Icon, Flash, Dropdown)
- Système de like / repost via HTMX (sans rechargement)
- Upload avatar et bannière
- Docker + volumes persistants pour BDD et uploads

---

## Sécurité

- Mots de passe hashés avec **Werkzeug** (`generate_password_hash` / `check_password_hash`)
- JWT stockés en **cookie HttpOnly** (inaccessible depuis JavaScript)
- Validation stricte des types de fichiers uploadés (whitelist d'extensions)
- Filenames des uploads générés avec **UUID** (pas de path traversal possible)
- Hash **SHA-256** sur les données critiques de paiement
- Protection contre la suppression de ressources d'autres utilisateurs (`author_id == current_user.id`)
- Variables d'environnement pour toutes les clés secrètes

---

## Licence

Projet scolaire — Guardia Cybersecurity School 2024–2027
