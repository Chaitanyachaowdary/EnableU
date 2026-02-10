# EnableU - Premium Accessibility-First Learning Platfrom

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**EnableU** is a state-of-the-art, accessible learning platform that combines premium 3D aesthetics with rigorous inclusive design. Built to ensure equal access for all, it features dynamic themes, granular progress tracking, and a robust multi-backend architecture.

## 🌟 Key Features

### 🎮 Premium Experience
- **Interactive 3D UI**: Immersive 3D environments with mouse-parallax, perspective tilt, and glassmorphism.
- **Micro-Animations**: Fluid transitions and interactive elements that respond to user presence.
- **Dynamic Themes**: Context-aware color palettes for different app sections.

### ♿ World-Class Accessibility
- **Dyslexia-Friendly Modes**: Specialized typography and reading guides.
- **High Contrast Support**: AA-compliant visual modes for low vision.
- **Inclusive Navigation**: Fully keyboard-navigable with ARIA-ready screen reader support.
- **Reduced Motion**: Respects system preferences for motion-sensitive users.

### 📚 Gamified Education
- **Real-time Tracking**: Granular progress visualization "while you learn".
- **Dynamic Leaderboard**: Synchronized competitive rankings across user activity.
- **Achievement System**: Badge rewards for curriculum milestones and perfect scores.

---

## 🏗️ Architecture Overview

EnableU utilizes a modern split-backend architecture to balance robustness with high-performance learning modules.

```mermaid
graph TD
    subgraph Frontend
        C[React + Vite Admin/User UI]
    end
    
    subgraph Multi-Backend
        SP[Python Flask - Primary Data & Gamification]
        SN[Node.js Express - Legacy/Specific Services]
    end

    C -->|API Proxy| SP
    C -->|API Proxy| SN
    SP <-->|Shared Auth| SN
    SP -->|PostgreSQL| DB[(PostgreSQL DB)]
```

---

## 🚀 Quick Start (Unified Setup)

### 1. Repository Setup
```bash
git clone <repository-url>
cd enableu
```

### 2. Primary Backend (Python/Flask)
The core logic resides in `server_py`.
```bash
cd server_py
pip install -r requirements.txt
# Configure .env based on .env.example
python app.py
```
*Runs on: `http://localhost:5001`*

### 3. Frontend (React/Vite)
Modern, accessible UI with 3D effects.
```bash
cd client
npm install
npm run dev
```
*Runs on: `http://localhost:5173`*

---

## 📁 Component Deep Dives

For detailed "pin-to-pin" setup and dependency information, please refer to the individual module documentation:

- 🎨 **[Frontend Documentation](client/README.md)** - React, Tailwind 4, 3D Core.
- 🐍 **[Python Backend Documentation](server_py/README.md)** - Flask, SQLAlchemy, Gamification Engine.
- ⬢ **[Node Backend Documentation](server/README.md)** - Express services.

---

## 🔐 Credentials & Security
- **Admin Setup**: Run `python setup_admin.py` in `server_py`.
- **Reference**: See [ADMIN_CREDENTIALS.md](ADMIN_CREDENTIALS.md) for default logins.

## 🤝 Contributing
Contributions that uphold WCAG 2.1 AA standards are always welcome.

---
**Made with ❤️ for accessible education**
