# EnableU - Frontend (React + Vite)

This is the premium, accessibility-first frontend for the EnableU platform. It leverages a modern React 19 + Vite stack with integrated 3D effects and high-performance styling.

## 🛠️ Tech Stack ("Pin to Pin")

### Core
- **Framework**: `react` (^19.2.0)
- **Runtime**: `react-dom` (^19.2.0)
- **Routing**: `react-router-dom` (^7.13.0)
- **Build Tool**: `vite` (^7.2.4)

### Styling & UI
- **CSS Framework**: `tailwindcss` (^4.1.18)
- **Post-processing**: `postcss` (^8.5.6), `autoprefixer` (^10.4.24)
- **Icons**: `lucide-react` (^0.563.0)
- **Utility**: `clsx` (^2.1.1), `tailwind-merge` (^3.4.0)
- **Charts**: `recharts` (^3.7.0)
- **Drag & Drop**: `@hello-pangea/dnd` (^18.0.1)

### API & State
- **HTTP Client**: `axios` (^1.13.5)
- **Context API**: Centralized `AuthContext` and `AccessibilityContext`.

---

## 🚀 Getting Started

### 1. Installation
Install all required Node.js packages:
```bash
npm install
```

### 2. Development Mode
Start the Vite development server with HMR:
```bash
npm run dev
```
*Accessible at: `http://localhost:5173`*

### 3. Build for Production
```bash
npm run build
```

---

## 📖 Key Features & Architecture

### 🛡️ Premium 3D Theme
The UI uses a custom-built 3D engine (`ThreeDElement.jsx`) that propagates throughout the application:
- **Perspective Tilt**: Cards and headers respond to mouse proximity.
- **Parallax Layers**: Background and foreground elements move at different speeds for depth.
- **Glassmorphism**: High-blur, semi-transparent backgrounds for a modern aesthetic.

### ♿ Accessibility Suite
- **Reading Guide Overlay**: A focus-assisting bar for users with processing difficulties.
- **Dyslexia Font Support**: Real-time font-swapping via `AccessibilityContext`.
- **Advanced High Contrast**: Dedicated CSS themes for high-visibility.
- **ARIA Live Implementation**: Screen readers receive real-time updates for dynamic content like timers and leaderboards.

### 📁 Directory Structure
```
src/
├── components/
│   ├── admin/       # Admin-specific pages and layouts
│   ├── auth/        # Login, Signup, Password Management
│   ├── common/      # Shared components (StatsCard, SkeletonLoaders)
│   └── user/        # Dashboard, Quiz Player, Profile
├── contexts/        # Accessibility and Auth state
├── hooks/           # useApi, useTilt, etc.
└── App.jsx          # Root routing and theme orchestration
```

---

## 🔌 API Interaction
The frontend acts as a consumer of the **Python Flask** backend (`server_py`). The API base path is configured via the Vite proxy in `vite.config.js` to point to `http://127.0.0.1:5001`.

> The Node.js backend (port 5000) is currently not used by the main application flow.

---
**EnableU Frontend - Designed for Everyone**
