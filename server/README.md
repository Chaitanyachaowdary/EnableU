# EnableU - Node.js Backend (Express)

> **Note**: This service is currently **secondary** to the Python Flask backend. It is preserved for specific microservices or legacy feature support.

A lightweight Express-based service layer for the EnableU platform.

## 🛠️ Tech Stack ("Pin to Pin")

### Core
- **Framework**: `express` (^5.2.1) - The fast, unopinionated web framework for Node.js.
- **CORS**: `cors` (^2.8.6) - Cross-Origin Resource Sharing support.
- **Middleware**: `body-parser` (^2.2.2) - Inbound request body parsing.

### Security
- **Authentication**: `jsonwebtoken` (^9.0.3) - JWT issuance and verification.
- **Hashing**: `bcryptjs` (^3.0.3) - Secure password hashing for locally-stored users.
- **Environment**: `dotenv` (^17.2.4) - Configuration management.

### Development
- **Process Manager**: `nodemon` (^3.1.11) - Automatic server restarts during development.

---

## 🚀 Getting Started

### 1. Installation
Install dependencies via npm:
```bash
npm install
```

### 2. Running the Server
Start the production server:
```bash
npm start
```

Or start in development mode with auto-reload:
```bash
npm run dev
```
*The service will be active at: `http://localhost:5000`*

---

## 📂 Features
- **JSON Persistence**: Uses atomic JSON writes for rapid prototyping and lightweight data storage (`users.json`, `quizzes.json`).
- **Synchronized Auth**: Compatible with the Python backend's JWT secrets for seamless cross-service navigation.
- **Modular Routes**: Separated logic for Auth, Quizzes, Leaderboard, and Progress.

---
**EnableU Node.js Service - Scalable & Modular**
