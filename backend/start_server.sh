#!/bin/bash

#UV sync
uv sync

# Activate virtual environment
source .venv/bin/activate

# Run FastAPI server with reload
fastapi run --reload app/main.py
