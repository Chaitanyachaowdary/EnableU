import unittest
from utils.security import validate_password_strength

class TestPasswordValidation(unittest.TestCase):
    
    def test_password_length(self):
        # Too short
        result = validate_password_strength("Short1!")
        self.assertFalse(result['valid'])
        self.assertIn("Password must be at least 12 characters long", result['errors'])
        
        # Valid length
        result = validate_password_strength("LongEnoughPassword1!")
        self.assertTrue(result['valid'])

    def test_uppercase_requirement(self):
        # No uppercase
        result = validate_password_strength("lowercase123!")
        self.assertFalse(result['valid'])
        self.assertIn("Password must contain at least one uppercase letter", result['errors'])

    def test_lowercase_requirement(self):
        # No lowercase
        result = validate_password_strength("LOWERCASE123!")
        self.assertFalse(result['valid'])
        self.assertIn("Password must contain at least one lowercase letter", result['errors'])

    def test_number_requirement(self):
        # No number
        result = validate_password_strength("NoNumberPassword!")
        self.assertFalse(result['valid'])
        self.assertIn("Password must contain at least one number", result['errors'])

    def test_special_char_requirement(self):
        # No special char
        result = validate_password_strength("NoSpecialChar123")
        self.assertFalse(result['valid'])
        self.assertIn("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>- _+=/[]';)", result['errors'])

    def test_valid_strong_password(self):
        # Meets all requirements
        passwords = [
            "StrongPass123!",
            "Correct-Battery-Horse-Staple-1",
            "Complex@Password#2026"
        ]
        for pwd in passwords:
            result = validate_password_strength(pwd)
            self.assertTrue(result['valid'], f"Failed for password: {pwd}")
            self.assertEqual(len(result['errors']), 0)

if __name__ == '__main__':
    unittest.main()
