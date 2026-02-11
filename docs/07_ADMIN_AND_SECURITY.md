# 07. Admin & Security Manual

## 🔐 Admin Setup

1.  **Configure `.env`**: Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server_py/.env`.
2.  **Run Setup**: `python setup_admin.py`.
3.  **First Login**: Use the credentials from your `.env` file. You will be forced to change your password immediately upon first login.

## 🛡️ Security Features

### Password Policy
- Minimum 12 characters.
- Must contain uppercase, lowercase, numbers, and special characters.
- Passwords are hashed using `pbkdf2:sha256`.

### Audit Logging
All critical admin actions are logged to the database with:
- Timestamp
- Admin User ID
- IP Address
- User Agent
- Action Details (e.g., "Deleted quiz: Math 101")

### Session Management
- JWT Tokens expire after 24 hours.
- Admin sessions have strict role checks on every request via the `@admin_required` decorator.

## 🚨 Troubleshooting Admin Access

**Problem**: Stuck on "Change Password" screen?
**Solution**: This is mandatory. You must update your password to proceed.

**Problem**: Forgot Admin Password?
**Solution**:
1. Update `ADMIN_PASSWORD` in `.env` to a new temporary password.
2. Run `python setup_admin.py` again.
3. Log in with the new `.env` password and complete the change password flow.

[Back to Introduction ->](01_INTRODUCTION.md)
