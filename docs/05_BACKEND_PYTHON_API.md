# 05. Python Backend API Reference

The core backend (`server_py`) runs on **Flask** and exposes a RESTful API.

## 🔑 Authentication (`/api/auth`)

| Method | Endpoint | Description | Payload |
|:-------|:---------|:------------|:--------|
| `POST` | `/register` | Create a new student account | `{ email, password, name }` |
| `POST` | `/login` | Authenticate & receive JWT | `{ email, password }` |
| `POST` | `/reset-password` | Reset password via token | `{ token, newPassword }` |
| `GET` | `/me` | Get current user profile | headers: `Authorization: Bearer <token>` |
| `PUT` | `/me` | Update profile settings | `{ name, settings }` |

## 🎮 Gamification (`/api`)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/quizzes` | List all available quizzes (sanitized). |
| `GET` | `/quizzes/<id>` | Get details for a specific quiz. |
| `POST` | `/quizzes/<id>/submit` | Submit answers and get score. Payload: `{ answers: { qId: optId } }` |
| `GET` | `/progress` | Get user's detailed progress, stats, and badges. |
| `GET` | `/leaderboard` | Get top 10 users by points. |

## 🛡️ Admin (`/api/admin`)

*Requires `role: 'admin'` in JWT.*

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/users` | List all users. |
| `POST` | `/users` | Create a new user (student/teacher/admin). |
| `PUT` | `/users/<id>/role` | Change a user's role. |
| `POST` | `/quizzes` | Create a new quiz. |
| `DELETE` | `/quizzes/<id>` | Delete a quiz. |
| `GET` | `/analytics` | Get platform usage stats. |
| `GET` | `/audit-log` | View admin activity logs. |

## 📦 Data Models

- **User**: The central entity. Contains `gamification` (JSON) and `accessibility_settings` (JSON).
- **Quiz**: Contains `questions` (JSON list of objects).
- **Result**: Record of a completed quiz attempt.
- **AuditLog**: Security log for admin actions.

[Next: Node.js Service Guide ->](06_BACKEND_NODE_SERVICE.md)
