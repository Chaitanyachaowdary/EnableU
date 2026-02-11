# 04. Frontend Guide

The EnableU frontend is built with **React 19**, **Vite**, and **Tailwind CSS 4**. It features a custom 3D engine for immersive effects and a strict accessibility-first design system.

## 📁 Directory Structure

```
src/
├── components/
│   ├── admin/       # Admin dashboard & management
│   ├── auth/        # Login/Register forms
│   ├── common/      # Reusable UI (Buttons, Cards, Inputs)
│   ├── layout/      # Layout wrappers (Navbar, Sidebar)
│   ├── user/        # Student dashboard & Quiz player
│   └── ThreeDElement.jsx # Core 3D effect component
├── contexts/        # React Context (Auth, Accessibility)
├── hooks/           # Custom Hooks (useApi, useTilt)
└── services/        # API configuration (Axios)
```

## 🎨 Styling System

### Tailwind CSS 4
We use Tailwind for utility-first styling.
- **Config**: `tailwind.config.js` defines our custom color palette (primary, secondary, accent) and font families.
- **Dark Mode**: Supported out-of-the-box via the `dark` class strategy.

### 3D Effects (`ThreeDElement.jsx`)
This wrapper component provides the signature "tilt" and parallax effects.
**Usage:**
```jsx
<ThreeDElement depth={20} perspective={1000}>
  <Card>Content</Card>
</ThreeDElement>
```

## ♿ Accessibility Features

The `AccessibilityContext` provides global state for user preferences:
- **Dyslexia Font**: Swaps the global font family to OpenDyslexic.
- **High Contrast**: Injects specific CSS variables for maximum visibility.
- **Reading Guide**: Renders a horizontal bar that follows the mouse cursor.

## 🔌 API Integration

All API calls are routed through `src/services/api.service.js`.
- **Base URL**: `/api` (Proxied by Vite).
- **Interceptors**: Automatically attach the JWT token from `localStorage` to every request.
- **Error Handling**: Global error catching for 401 Unauthorized responses (auto-logout).

[Next: Python Backend API ->](05_BACKEND_PYTHON_API.md)
