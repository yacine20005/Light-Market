#!/usr/bin/env bash

# Start the FastAPI server with Uvicorn
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000