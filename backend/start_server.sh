#!/bin/bash

# UV sync
uv sync

# Activate virtual environment
source .venv/bin/activate

# Run all pending Alembic migrations before starting the server
echo "⏳ Running database migrations..."
alembic upgrade head
echo "✅ Migrations complete"

# Run FastAPI server with reload
fastapi run --reload app/main.py
