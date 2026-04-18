# Lokdarpan Civic Dashboard

Welcome to the Lokdarpan Civic Dashboard! This project features a robust administrative dashboard built with React (Frontend) and a blazing-fast Python/SQLModel API (Backend).

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en) (v18+) and [pnpm](https://pnpm.io/installation) (for the frontend)
* [Python](https://www.python.org/downloads/) 3.10+ (for the backend)
* [uv](https://docs.astral.sh/uv/) (Fast Python package manager used for backend dependencies)
* PostgreSQL Database

---

## 🛠 Backend Setup

The backend utilizes **FastAPI** connected to PostgreSQL via SQLModel, with dependencies managed by `uv`.

### 1. Install Dependencies
Navigate to the backend directory and synchronize the virtual environment.

```bash
cd backend
uv sync
```
> **Note:** `uv sync` automatically creates a virtual environment (`.venv`) and installs everything seamlessly on both Mac and Windows.

### 2. Environment Variables
Copy the example environment template into a local `.env` file.

* **Mac / Linux:**
  ```bash
  cp .env.example .env
  ```
* **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```

> Open the `.env` file and verify your `POSTGRES_SERVER`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` credentials!

### 3. Database Migrations
Activate your virtual environment and run the Alembic migrations to set up your database tables.

* **Mac / Linux:**
  ```bash
  source .venv/bin/activate
  alembic upgrade head
  ```
* **Windows:**
  ```powershell
  .venv\Scripts\activate
  alembic upgrade head
  ```

### 4. Start the Server
With the database prepared, you can boot up the FastAPI local development server.

```bash
uv run fastapi dev app/main.py
```
> The API will now be available at `http://127.0.0.1:8000`
> Swagger Documentation is accessible at `http://127.0.0.1:8000/docs`

---

## 💻 Frontend Setup

The frontend is a modern editorial-style interface utilizing React, Chakra UI, and Recharts.

### 1. Install Dependencies
Open a *new* terminal window, navigate to the frontend directory, and install the `node_modules` using `pnpm`.

```bash
cd frontend
pnpm install
```

### 2. Start the Development Server
Once packages are installed, launch the React development server.

```bash
pnpm start
# or explicitly: pnpm start dev
```

> The main dashboard application will open automatically in your browser at `http://localhost:3000`.

---

## Useful Commands

| Action | Command (from `backend/`) |
| :--- | :--- |
| **Upgrade Requirements** | `uv sync --upgrade` |
| **Create Migration** | `alembic revision --autogenerate -m "Changes"` |
| **Format & Lint** | `uv run ruff check` / `uv run ruff format` |

| Action | Command (from `frontend/`) |
| :--- | :--- |
| **Lint** | `pnpm lint` |
| **Build for Production** | `pnpm build` |
