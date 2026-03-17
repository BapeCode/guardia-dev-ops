@echo off
echo [INFO] Starting the application...
docker compose down
docker compose up -d --build
echo [INFO] Application started successfully.
docker compose logs -f
