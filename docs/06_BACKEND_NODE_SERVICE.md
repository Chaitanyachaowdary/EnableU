# 06. Node.js Service Guide

> **Note**: This service is currently **secondary** and optional. It runs on port `5000`.

## 🎯 Purpose

The Node.js backend (`server/`) is preserved for specific use cases that Node.js handles particularly well, or for legacy feature support.

## 🛠️ Tech Stack

- **Express.js**: Lightweight web framework.
- **Filesystem Persistence**: Uses `proper-lockfile` to manage concurrency on local JSON files (`users.json`, `quizzes.json`).
- **JWT Compatibility**: Shares the same `JWT_SECRET` mechanism as the Python backend, allowing for potential interoperability.

## 🚀 Running the Service

If you need to run this service:

```bash
cd server
npm install
npm start
```

## 🔄 Potential Future Use Cases

- **Real-time features**: Implementing WebSockets (Socket.io) for live chat or multiplayer quiz modes.
- **Microservices**: Offloading specific heavy-duty background tasks.

[Next: Admin & Security ->](07_ADMIN_AND_SECURITY.md)
