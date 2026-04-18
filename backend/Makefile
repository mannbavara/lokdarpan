.PHONY: run test lint format migrate

run:
	./start_server.sh

test:
	pytest

lint:
	ruff check .
	mypy .

format:
	ruff check --fix .
	ruff format .

migrate:
	alembic upgrade head
