# EnableU Learning Platform - Admin Credentials

## 🔐 Primary Admin Account

**Email:** `admin@Enable.com`  
**Password:** `12345678`  
**Role:** Administrator

---

## 🎯 Usage Instructions

### Initial Login
1. Navigate to: `http://localhost:5173/login`
2. Enter the admin credentials above
3. You'll be redirected to the dashboard
4. Access Admin Panel from the sidebar

### Adding More Admins
1. Login with primary admin account
2. Navigate to **Admin Panel** in sidebar
3. Go to **User Management** tab
4. Find the user you want to promote
5. Change their role to "admin" using the dropdown
6. User will now have admin access on next login

### Security Notes
- ⚠️ **Only this account is admin initially**
- ⚠️ **Change password after first login**
- ⚠️ **Keep credentials secure**
- ✅ Admin session timeout: 30 minutes
- ✅ All admin actions are logged in audit trail

---

## 📊 Admin Panel Features

### User Management
- View all users
- Change user roles (student/teacher/admin)
- Bulk operations
- Export user data to CSV

### Quiz Management
- Create new quizzes
- Edit existing quizzes
- Delete quizzes (with confirmation)
- Export quiz data

### Analytics
- Total users count
- Active learners
- Platform statistics
- Recent activity

### Security Features
- Role-based access control
- Session timeout management
- Activity audit logging
- IP address tracking

---

## 🔄 Password Reset (If Needed)

If you forget the admin password, run:
```bash
cd server_py
python setup_admin.py
```

This will reset the admin account to the default credentials.
