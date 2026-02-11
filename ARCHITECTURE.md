# EnableU System Architecture

EnableU is built on a **modern, split-backend architecture** designed for high accessibility, performance, and scalability. While it contains both Node.js and Python services, the current primary architecture relies on **Python (Flask)** for the core application logic, data persistence, and gamification engine.

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
    Ui -- /api requests --> Proxy
    Proxy -- Proxies to --> PythonServer
    
    PythonServer -- Reads/Writes --> DB
    
    style PythonServer fill:#f9f,stroke:#333,stroke-width:2px
    style NodeServer fill:#eee,stroke:#999,stroke-dasharray: 5 5
```

## Core Components

### 1. Frontend: React + Vite
- **Tech Stack**: React 19, Tailwind CSS 4, Framer Motion (assumed/planned), Three.js (via `ThreeDElement`).
- **Role**: Delivers the accessible, 3D user interface.
- **Communication**: Sends all API requests to `/api`, which are proxied to the backend.

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
- **Role**: Legacy service or specialized microservice. Currently bypassed by the main client application but available for specific isolated tasks or legacy support.

## Data Flow

1.  **Authentication**: Users log in via the React UI. Credentials are sent to `POST /api/auth/login` on the Flask server. A JWT is returned and stored (e.g., in localStorage).
2.  **Quiz Submission**: When a user finishes a quiz, the client sends answers to `POST /api/quizzes/<id>/submit`. The Flask server calculates the score, updates the user's `gamification` JSON blob in the database, and returns immediate feedback.
3.  **Leaderboard**: The `GET /api/leaderboard` endpoint aggregates user scores from the database and returns a sorted list for display.

## Key Design Decisions

- **Accessibility First**: The architecture supports high-contrast modes and screen reader optimization at the frontend level, backed by structured data from the API.
- **Hybrid Backend**: Allows leveraging Python's strengths in data analysis/AI (future roadmap) while maintaining a Node.js environment for potentially real-time features (WebSockets) in the future.
- **Proxy Configuration**: The frontend development server proxies API requests to avoid CORS issues and simplify environment configuration.
