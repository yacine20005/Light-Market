#!/usr/bin/env bash

# Activation de l'environnement virtuel
source .venv/bin/activate

# Démarrage du serveur
python -m uvicorn sql_app.main:app --reload
