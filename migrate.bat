@echo off
echo [INFO] Migration started
Remove-Item -Path .\migrations\* -Recurse -Force
flask db init
flask db migrate -m "Initial migration."
flask db upgrade
echo [INFO] Migration completed successfully.