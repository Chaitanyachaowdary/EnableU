# Security Setup & Deployment Guide

## 🚀 Production Deployment Checklist

### 1. Environment Configuration
- [ ] **Create production `.env` file**: Do not use the example values.
- [ ] **Generate strong keys**:
  ```bash
  # Generate a random 32-byte hex string for JWT_SECRET_KEY
  python -c "import os; print(os.urandom(32).hex())"
  ```
- [ ] **Database URL**: Use a secure connection string with SSL enabled if possible.
- [ ] **Debug Mode**: Ensure `DEBUG=False` in production `.env`.

### 2. Admin Account Security
- [ ] **Initial Setup**: Run `python setup_admin.py` to create the initial admin.
- [ ] **Change Password**: Log in immediately and change the admin password.
- [ ] **Audit**: Verify the "Password Change Required" modal appears on first login.
- [ ] **Limit Access**: Only share admin credentials with authorized personnel.

### 3. Application Security
- [ ] **HTTPS**: Configure your web server (Nginx/Apache) to force HTTPS.
- [ ] **Firewall**: Restrict access to the database port (5432) to the application server only.
- [ ] **Updates**: Keep Python and Node.js dependencies updated.
  ```bash
  pip list --outdated
  npm outdated
  ```

### 4. Database Backups
- [ ] **Automated Backups**: Configure daily backups for your PostgreSQL database.
- [ ] **Retention Policy**: Keep backups for at least 30 days.

---

## 🛡️ Security Features Overview

| Feature | Implementation | Description |
|---------|----------------|-------------|
| **Password Hashing** | Werkzeug (PBKDF2) | Passwords are never stored in plain text. |
| **Authentication** | JWT (JSON Web Tokens) | Stateless, secure authentication with expiration. |
| **Admin Protection** | `admin_required` | Decorator ensures only users with 'admin' role access sensitive routes. |
| **Force Password Change** | Database Flag | Admins must change password on first login (or reset). |
| **Password Strength** | Regex Validation | Enforces 12+ chars, mixed case, numbers, special chars. |
| **Audit Logging** | Database Table | Tracks critical actions (login, password change, etc.) with IP/User-Agent. |

---

## 🆘 Incident Response

### Compromised Admin Account
1. **Reset Password Immediately**:
   - If you have access: Change via Admin Panel.
   - If locked out: Update `ADMIN_PASSWORD` in `.env` and run `setup_admin.py`.
2. **Rotate Secrets**:
   - Generate new `JWT_SECRET_KEY`.
   - Update `.env` and restart server.
   - *Note: This will log out all active users.*
3. **Review Logs**:
   - Check `audit_logs` table for suspicious activity.

### Database Breach
1. **Isolate**: Stop the application server.
2. **Rotate Credentials**: Change database passwords.
3. **Restore**: Restore from the last known good backup if data integrity is compromised.
