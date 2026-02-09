"""
Security utility functions for password validation and security checks
"""

import re
from typing import Dict, List

def validate_password_strength(password: str) -> Dict[str, any]:
    """
    Validate password strength according to enterprise security standards.
    
    Requirements:
    - Minimum 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    
    Args:
        password: The password to validate
        
    Returns:
        Dictionary with 'valid' boolean and 'errors' list of validation messages
    """
    errors = []
    
    if len(password) < 12:
        errors.append("Password must be at least 12 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>\-_+=/[\]\';]', password):
        errors.append("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>- _+=/[]';)")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }

def get_password_strength_score(password: str) -> Dict[str, any]:
    """
    Calculate password strength score for UI feedback.
    
    Returns:
        Dictionary with 'score' (0-4) and 'label' (weak/fair/good/strong/very strong)
    """
    score = 0
    
    # Length score
    if len(password) >= 12:
        score += 1
    if len(password) >= 16:
        score += 1
    
    # Complexity score
    if re.search(r'[A-Z]', password) and re.search(r'[a-z]', password):
        score += 1
    
    if re.search(r'\d', password):
        score += 0.5
    
    if re.search(r'[!@#$%^&*(),.?":{}|<>\-_+=/[\]\';]', password):
        score += 0.5
    
    # Variety score
    unique_chars = len(set(password))
    if unique_chars > 8:
        score += 0.5
    
    score = min(int(score), 4)
    
    labels = {
        0: 'very weak',
        1: 'weak',
        2: 'fair',
        3: 'strong',
        4: 'very strong'
    }
    
    return {
        'score': score,
        'label': labels[score]
    }
