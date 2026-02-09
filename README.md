# EnableU - Accessibility-First Gamified Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**EnableU** is a modern, accessible learning platform that combines gamification with inclusive design principles. Built to ensure equal access for all learners, including those with disabilities.

## 🌟 Features

### 📚 Core Learning
- **Interactive Quizzes**: Timed quizzes with multiple-choice questions
- **Progress Tracking**: Comprehensive dashboard showing learning journey
- **Review Mode**: Detailed explanations for each answer
- **Pause & Resume**: Flexible quiz sessions

### ♿ Accessibility Features (WCAG 2.1 AA Compliant)
- **Visual Accessibility**
  - High Contrast Mode
  - Adjustable Font Size (100%-200%)
  - Reduced Motion Support
- **Keyboard Navigation**
  - Skip-to-content link
  - Global keyboard shortcuts (Ctrl+H/Q/P)
  - Fully keyboard-navigable interface
- **Screen Reader Support**
  - ARIA live regions for dynamic updates
  - Semantic HTML5 elements
  - Proper heading hierarchy
  - Descriptive labels

### 🎮 Gamification
- **Points System**: Earn points based on quiz performance
- **Badges**: Unlock achievements for 100% scores
- **Leaderboard**: Compete with other learners (top 10)
- **Progress Tracking**: Visual stats and completion percentages

### 👨‍💼 Administration
- **User Management**: Control user roles and permissions
- **Quiz Creation**: Build custom quizzes with explanations
- **Analytics**: View platform engagement metrics

## 📋 Prerequisites

- **Node.js** v16+ and npm
- **Python** 3.8+
- **PostgreSQL** 12+

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd enableu
```

### 2. Backend Setup

```bash
cd server_py

# Install dependencies
pip install -r requirements.txt

# Set environment variables
# Create a .env file with:
# SECRET_KEY=your-secure-secret-key
# DATABASE_URL=postg resql://postgres:password@localhost:5432/enableu
# JWT_SECRET_KEY=your-jwt-secret-key (optional, auto-generated if not set)

# Create database
createdb enableu

# Initialize database
python reset_db.py

# Seed with sample quizzes
python seed.py

# Start server
python app.py
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

1. Open `http://localhost:5173` in your browser
2. Create an account (Sign Up)
3. Start taking quizzes!

### Default Admin Access

To create or reset the admin user, use the dedicated setup script:

```bash
cd server_py
python setup_admin.py
```

See [ADMIN_CREDENTIALS.md](ADMIN_CREDENTIALS.md) for detailed credentials and login instructions.
See [SECURITY_SETUP.md](SECURITY_SETUP.md) for production deployment guide.

## 🏗️ Project Structure

```
enableu/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Accessibility)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.jsx         # Main app component
│   │   └── index.css       # Global styles
│   └── package.json
│
├── server_py/              # Flask backend
│   ├── routes/             # API route blueprints
│   │   ├── auth.py         # Authentication routes
│   │   ├── gamification.py # Quiz & gamification routes
│   │   ├── admin.py        # Admin routes
│   │   └── tasks.py        # Task management routes
│   ├── models.py           # SQLAlchemy models
│   ├── app.py              # Flask application
│   ├── extensions.py       # Flask extensions
│   ├── seed.py             # Database seeding script
│   └── requirements.txt   
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login  
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password with token
```

### Quizzes & Gamification
```
GET    /api/quizzes                # List all quizzes
GET    /api/quizzes/{id}           # Get specific quiz
POST   /api/quizzes/{id}/submit    # Submit quiz answers
GET    /api/leaderboard            # Get top 10 leaderboard
GET    /api/progress               # Get user progress stats
```

### Admin (Requires admin role)
```
GET    /api/admin/users            # List all users
PUT    /api/admin/users/{id}/role  # Update user role
POST   /api/admin/quizzes          # Create new quiz
DELETE /api/admin/quizzes/{id}     # Delete quiz
```

## 🎨 Customization

### Accessibility Settings

Users can customize their experience via:
1. **Profile Page**: Persistent accessibility settings
2. **Floating Accessibility Menu**: Quick access to high contrast, font size, and reduced motion

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+H` | Navigate to Home/Dashboard |
| `Ctrl+Q` | Navigate to Quizzes |
| `Ctrl+P` | Navigate to Profile |
| `Esc` | Close open modals/menus |

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Complete a quiz
- [ ] View leaderboard
- [ ] Check progress dashboard
- [ ] Toggle accessibility settings
- [ ] Test keyboard navigation
- [ ] Create quiz (admin)

### Accessibility Testing

Recommended tools:
- **NVDA** or **JAWS** (screen readers)
- **axe DevTools** (browser extension)
- **Keyboard only** navigation test

## 🔐 Security Features

- ✅ Password hashing (Werkzeug)
- ✅ JWT authentication (32-byte secure keys)
- ✅ Role-based access control
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ XSS protection (React auto-escaping)

## 🌍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📸 Screenshots

*(Screenshots would be added here showing the dashboard, quiz interface, and accessibility menu)*

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow WCAG 2.1 AA standards for all new features
- Add ARIA attributes for dynamic content
- Test with keyboard navigation
- Ensure proper color contrast ratios

## 🐛 Known Issues

- Email sending is simulated (tokens logged to console)
- Time tracking is approximate (placeholder values)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Initial work - Development Team

## 🙏 Acknowledgments

- WCAG Guidelines for accessibility standards
- React community for excellent documentation
- Flask community for backend support

## 📧 Support

For support, email support@enableu.example.com or open an issue on GitHub.

---

**Made with ❤️ for accessible education**
