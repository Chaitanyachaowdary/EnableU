/**
 * Senior Best Practice: Declarative Request Validation
 */
const validate = (schema) => {
    return (req, res, next) => {
        const errors = [];
        const data = req.body;

        Object.keys(schema).forEach(key => {
            const rules = schema[key];
            const value = data[key];

            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push(`${key} is required`);
            } else if (value !== undefined) {
                if (rules.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
                    errors.push(`${key} must be a valid email`);
                }
                if (rules.minLength && value.length < rules.minLength) {
                    errors.push(`${key} must be at least ${rules.minLength} characters`);
                }
            }
        });

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }
        next();
    };
};

module.exports = { validate };
