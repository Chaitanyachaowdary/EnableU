# 02. Setup Guide

This guide will help you set up the EnableU platform on your local machine.

## ✅ Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**

## 📥 1. Clone the Repository

```bash
git clone <repository-url>
cd enableu
```

## 🐍 2. Backend Setup (Python)

The core application logic resides in `server_py`.

1.  **Navigate to the directory:**
    ```bash
    cd server_py
    ```

2.  **Create virtual environment (Optional but Recommended):**
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment:**
    Create a `.env` file in `server_py/` with the following content:
    ```ini
    JWT_SECRET_KEY=dev_secret_key_change_in_prod
    DATABASE_URL=postgresql://postgres:password@localhost:5432/enableu
    ADMIN_EMAIL=admin@enableu.com
    ADMIN_PASSWORD=InitialPassword123!
    ```
    *Update `DATABASE_URL` with your local PostgreSQL credentials.*

5.  **Initialize Database:**
    ```bash
    python seed.py        # Creates tables and initial data
    python setup_admin.py # Sets up the admin account
    ```

6.  **Start the Server:**
    ```bash
    python app.py
    ```
    *The server will start on `http://localhost:5001`*

## 🎨 3. Frontend Setup

1.  **Navigate to the directory:**
    Open a new terminal and go to `client/`:
    ```bash
    cd client
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    *The application will run at `http://localhost:5173`*

## ⬢ 4. Node.js Service (Optional)

The Node.js service is secondary and currently not required for the main user flow.

1.  **Navigate:** `cd server`
2.  **Install:** `npm install`
3.  **Start:** `npm start` (Runs on port 5000)

## 🔍 Verification

1.  Open your browser to `http://localhost:5173`.
2.  Login with the admin credentials you configured.
3.  If you see the dashboard, you are valid!

[Next: System Architecture ->](03_ARCHITECTURE.md)
