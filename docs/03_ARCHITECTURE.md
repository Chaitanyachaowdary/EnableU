# 03. System Architecture

EnableU utilizes a **modern, split-backend architecture** designed for high accessibility, performance, and scalability.

## 🏗️ High-Level Overview

The current primary architecture relies on **Python (Flask)** for the core application logic, data persistence, and gamification engine. The Frontend communicates exclusively with this Python backend via a proxy.

```mermaid
graph TD
    User[User / Client Browser]
    
    subgraph Frontend
        Ui[React + Vite Application]
        Proxy[Vite Dev Server Proxy]
    end
    
    subgraph Backends
        PythonServer[Python Flask Server (Port 5001)]
        NodeServer[Node.js Express Server (Port 5000)]
        DB[(PostgreSQL Database)]
    end
    
    User --> Ui
    Ui -- "/api requests" --> Proxy
    Proxy -- "Proxies to" --> PythonServer
    
    PythonServer -- "Reads/Writes" --> DB
    
    style PythonServer fill:#f9f,stroke:#333,stroke-width:2px
    style NodeServer fill:#eee,stroke:#999,stroke-dasharray: 5 5
```

## 🧩 Core Components

### 1. Frontend: React + Vite
- **Tech Stack**: React 19, Tailwind CSS 4, Three.js (via `ThreeDElement`).
- **Role**: Delivers the accessible, 3D user interface.
- **Communication**: Sends all API requests to `/api`. The Vite configuration proxies these to `http://127.0.0.1:5001`.

### 2. Primary Backend: Python (Flask)
- **Tech Stack**: Flask, SQLAlchemy, Flask-JWT-Extended, Psycopg2.
- **Port**: `5001`
- **Role**: 
    - **Authentication**: JWT issuance and validation.
    - **Gamification Engine**: Logic for points, badges, and leaderboards.
    - **Data Persistence**: Manages all data in the PostgreSQL database.
    - **Admin API**: Endpoints for user management and content creation.

### 3. Secondary Backend: Node.js (Express)
- **Tech Stack**: Express.js, JSON-based persistence.
- **Port**: `5000`
- **Role**: Legacy service or specialized microservice. Currently bypassed by the main client application but available for specific isolated tasks.

## 🔄 Data Flow Example: Quiz Submission

1.  **Action**: User finishes a quiz in the React UI.
2.  **Request**: Client sends `POST /api/quizzes/<id>/submit` with answers.
3.  **Processing**: 
    - Flask server receives answers.
    - Validates against correct options in Database.
    - Calculates Score.
    - Updates User's Gamification JSON (points, badges).
    - Creates a `Result` record.
4.  **Response**: Returns score, visual feedback, and any new badges earned.

## 🗄️ Database Schema (Simplified)

- **Users**: Stores profile, auth, and a `gamification` JSONB column (flexible storage for badges/stats).
- **Quizzes**: Stores quiz metadata (JSONB for questions).
- **Results**: Records of taken quizzes.
- **AuditLogs**: Admin activity tracking.

[Next: Frontend Guide ->](04_FRONTEND_GUIDE.md)
