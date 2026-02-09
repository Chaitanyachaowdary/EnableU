# EnableU Learning Platform - Admin Credentials

## 🔐 Environment-Based Configuration

**IMPORTANT:** Admin credentials are now configured via environment variables for enhanced security.

### Setup Instructions

1. **Navigate to server directory:**
   ```bash
   cd server_py
   ```

2. **Create `.env` file from template:**
   ```bash
   # Copy the example file
   copy .env.example .env    # Windows
   # OR
   cp .env.example .env      # Linux/Mac
   ```

3. **Edit `.env` and set your credentials:**
   ```bash
   ADMIN_EMAIL=your-admin@yourdomain.com
   ADMIN_PASSWORD=YourSecurePassword123!
   ```

4. **Run setup script:**
   ```bash
   python setup_admin.py
   ```

---

## 🎯 First Login Flow

### What Happens on First Login

1. Navigate to: `http://localhost:5173/login`
2. Enter your admin credentials from `.env` file
3. **🔒 FORCED PASSWORD CHANGE:**
   - You will be presented with a password change modal
   - You **cannot dismiss** this modal
   - You **cannot access** any admin features until you change your password
4. Create a new secure password meeting these requirements:
   - Minimum 12 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
5. After successfully changing your password, you'll be redirected to the admin dashboard

---

## 📊 Admin Panel Features

### User Management
- View all users with advanced filtering and search
- Change user roles (student/teacher/admin)
- Bulk operations for multiple users
- Export user data to CSV

### Quiz Management
- Create new quizzes with custom questions
- Edit existing quizzes
- Delete quizzes (with confirmation)
- Export quiz data to CSV

### Analytics Dashboard
- Total users count
- Active learners statistics
- Platform usage metrics
- Recent activity logs

### Security & Audit Features
- Role-based access control
- Session timeout management (configurable)
- Activity audit logging for all admin actions
- IP address and user agent tracking
- Password change history

---

## 🔄 Changing Your Password

### After Initial Setup

You can change your password anytime from the admin panel:

1. Login to admin panel
2. Navigate to **Profile** or **Settings**
3. Click **Change Password**
4. Enter current password
5. Enter new password (must meet security requirements)
6. Confirm new password
7. Submit

All password changes are logged in the audit trail.

---

## 🔒 Security Best Practices

### Password Requirements
✅ Minimum 12 characters  
✅ Mix of uppercase and lowercase letters  
✅ At least one number  
✅ At least one special character (!@#$%^&*...)  
✅ Different from current password  

### Environment Security
⚠️ **NEVER commit `.env` file to version control**  
⚠️ Keep `.env` file permissions restricted (chmod 600 on Linux/Mac)  
⚠️ Use different credentials for production vs development  
⚠️ Rotate passwords regularly (recommended: every 90 days)  

### Session Management
- Admin sessions timeout after 30 minutes of inactivity (configurable)
- All admin actions are logged with IP address and timestamp
- Unauthorized access attempts are recorded in audit logs

---

## 🛠️ Troubleshooting

### "Missing required environment variables" Error

**Problem:** You see this error when running `setup_admin.py`

**Solution:**
1. Ensure `.env` file exists in `server_py/` directory
2. Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `.env`
3. Check for typos in variable names (case-sensitive)

### Can't Access Admin Panel After Login

**Problem:** You're stuck on password change screen

**Solution:**
- This is intentional security behavior
- Complete the password change process
- Your new password must meet all security requirements
- Check the password strength indicator and requirements checklist

### Forgot Admin Password

**Problem:** Lost access to admin account

**Solution:**
1. Update `ADMIN_PASSWORD` in `.env` file with a new secure password
2. Run: `python setup_admin.py`
3. This will reset the admin password and mark it for change on next login
4. Login with the new password from `.env`
5. Complete the forced password change

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ADMIN_EMAIL` | Yes | Admin account email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Yes | Initial admin password | `SecurePass123!` |
| `JWT_SECRET_KEY` | Yes | Secret for JWT tokens | `your-secret-key` |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `FLASK_ENV` | No | Environment mode | `development` or `production` |
| `DEBUG` | No | Enable debug mode | `True` or `False` |

See `.env.example` for complete configuration template.

