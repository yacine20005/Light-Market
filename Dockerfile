# Utiliser une image Python officielle
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de requirements
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY ./backend ./backend

# Exposer le port 8000
EXPOSE 8000

# Commande pour lancer l'application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
