"""
Database Migration Script - Add Audit Logs Table
Run this script to add the audit_logs table to your database
"""

from app import app
from extensions import db
from models import AuditLog

def migrate():
    with app.app_context():
        print("Creating audit_logs table...")
        
        # Create the audit_logs table
        db.create_all()
        
        print("✅ Audit logs table created successfully!")
        print("\nTable structure:")
        print("- id: UUID (primary key)")
        print("- user_id: UUID (foreign key to users)")
        print("- action: String(100) - Action type")
        print("- details: Text - Action details")
        print("- ip_address: String(50)")
        print("- user_agent: String(256)")
        print("- timestamp: DateTime (indexed)")
        print("\nAudit logging is now enabled for all admin actions!")

if __name__ == '__main__':
    migrate()
