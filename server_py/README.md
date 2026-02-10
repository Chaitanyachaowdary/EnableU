# EnableU - Python Backend (Flask)

The primary data and gamification engine for the EnableU platform. This server handles user authentication, persistent quiz progress, leaderboard calculations, and administrative data management.

## 🛠️ Tech Stack ("Pin to Pin")

### Framework & Extensions
- **Web Framework**: `Flask` - Lightweight and flexible WSGI web application framework.
- **CORS**: `flask-cors` - Handles Cross-Origin Resource Sharing for frontend communication.
- **Security**: `flask-jwt-extended` - Provides robust JWT authentication and token management.
- **Database ORM**: `flask-sqlalchemy` - SQL toolkit and Object Relational Mapper.
- **SQL Driver**: `psycopg2-binary` - PostgreSQL adapter for Python.
- **Environment**: `python-dotenv` - Loads environment variables from `.env`.
- **Security**: `werkzeug` - Utilities for password hashing and secure request handling.

---

## 🚀 Getting Started

### 1. Prerequisite
Ensure you have a PostgreSQL database instance running.

### 2. Environment Setup
Create a `.env` file in this directory based on `.env.example`:
```ini
JWT_SECRET_KEY=your_secure_random_string
DATABASE_URL=postgresql://username:password@localhost:5432/enableu
ADMIN_EMAIL=admin@enable.com
ADMIN_PASSWORD=your_admin_password
```

### 3. Installation
Install the required packages using pip:
```bash
pip install -r requirements.txt
```

### 4. Database Initialization
Seed the database with the initial curriculum and admin account:
```bash
# Seed the core database
python seed.py

# (Optional) Verify or Reset Admin
python setup_admin.py
```

### 5. Running the Server
```bash
python app.py
```
*The API will be available at: `http://localhost:5001`*

---

## 📋 API Overview

### User Routes (`/api/auth`)
- `POST /register`: Create new student accounts.
- `POST /login`: JWT issuance and status retrieval.
- `POST /reset-password`: Token-based recovery.

### Gamification Routes (`/api`)
- `GET /quizzes`: Curriculum retrieval (sanitized).
- `POST /quizzes/<id>/submit`: Real-time quiz scoring and badge awarding.
- `GET /progress`: Granular user tracking and stats.
- `GET /leaderboard`: Real-time global rankings.

### Admin Routes (`/api/admin`)
- `GET /users`: Full user list with management metadata.
- `PUT /users/<id>`: Role and detail updates.
- `GET /analytics/export`: CSV/Excel data generation.

---

## 📁 Architecture
- `routes/`: Blueprint-per-module architecture for clean separation of concerns.
- `models.py`: Unified SQLAlchemy models for Students, Quizzes, Results, and Audit Logs.
- `utils/`: Reusable logic for password validation and data formatting.

---
**EnableU Python Backend - Powering Inclusive Learning**
