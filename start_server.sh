#!/usr/bin/env bash

# Démarrage du serveur
uvicorn sql_app.main:app --reload
