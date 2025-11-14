/*
* Simple regex for email validation
* Example: user@example.com
*/
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/*
* A 10 digit contact number with no leading zero and starts with digits 6-9
* Example: 9876543210, 6123456789, 7890123456, 890123456
*/
export const validateContactNo = (contactNo) => {
    const contactRegex = /^[6-9][0-9]{9}$/;
    return contactRegex.test(contactNo);
};

/*
* Password length must be 6-15 characters,
* containing at least one uppercase, one lowercase, one digit,
* and one special character
* Example: Abc@1234
*/
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
    if (!passwordRegex.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
        };
    }
    return { isValid: true, message: '' };
};

/*
* Validates if password and confirmPassword match 
* Example: password: Abc@1234, confirmPassword: Abc@1234
*/
export const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) {
        return { isValid: false, message: 'Please confirm your password' };
    }
    if (password !== confirmPassword) {
        return { isValid: false, message: 'Passwords do not match' };
    }
    return { isValid: true, message: '' };
};

/**
 * Validates signup form data
 * @param {object} formData - Form data object containing firstName, lastName, email, contactNo, password, confirmPassword
 * @returns {object} - Object containing validation errors (empty if no errors)
 */
export const validateSignupForm = (formData) => {
    const errors = {};

    // First Name validation
    if (!formData.firstName || !formData.firstName.trim()) {
        errors.firstName = 'First name is required';
    }

    // Email validation
    if (!formData.email || !formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Invalid email format';
    }

    // Contact Number validation
    if (!formData.contactNo || !formData.contactNo.trim()) {
        errors.contactNo = 'Contact number is required';
    } else if (!validateContactNo(formData.contactNo)) {
        errors.contactNo = 'Invalid contact number (must be 10 digits starting with 6-9)';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
    }

    // Confirm Password validation
    const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!passwordMatchValidation.isValid) {
        errors.confirmPassword = passwordMatchValidation.message;
    }

    return errors;
};

/**
 * Validates signin form data
 * @param {object} formData - Form data object containing email, contactNo, password
 * @returns {object} - Object containing validation errors (empty if no errors)
 */
export const validateSigninForm = (formData) => {
    const errors = {};

    // Email validation
    if (formData.email && formData.email.trim()) {
        if (!validateEmail(formData.email)) {
            errors.email = 'Invalid email format';
        }
    }

    // Contact Number validation
    if (formData.contactNo && formData.contactNo.trim()) {
        if (!validateContactNo(formData.contactNo)) {
            errors.contactNo = 'Invalid contact number (must be 10 digits starting with 6-9)';
        }
    }

    // At least one identifier (email or contact) required
    if ((!formData.email || !formData.email.trim()) && (!formData.contactNo || !formData.contactNo.trim())) {
        errors.identifier = 'Either email or contact number is required';
    }

    // Password validation
    if (!formData.password) {
        errors.password = 'Password is required';
    }

    return errors;
};
