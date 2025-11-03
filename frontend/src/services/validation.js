/**
 * Validation utility functions for form validation
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Validates Indian contact number (10 digits starting with 6-9)
 * @param {string} contactNo - Contact number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateContactNo = (contactNo) => {
    const contactRegex = /^[6-9][0-9]{9}$/;
    return contactRegex.test(contactNo);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 6)
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password, minLength = 6) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }
    if (password.length < minLength) {
        return { isValid: false, message: `Password must be at least ${minLength} characters` };
    }
    return { isValid: true, message: '' };
};

/**
 * Validates if two passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - { isValid: boolean, message: string }
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

/**
 * Validates update user form data
 * @param {object} formData - Form data object
 * @returns {object} - Object containing validation errors (empty if no errors)
 */
export const validateUpdateUserForm = (formData) => {
    const errors = {};

    // Email validation (if provided)
    if (formData.email && formData.email.trim()) {
        if (!validateEmail(formData.email)) {
            errors.email = 'Invalid email format';
        }
    }

    // Contact Number validation (if provided)
    if (formData.contactNo && formData.contactNo.trim()) {
        if (!validateContactNo(formData.contactNo)) {
            errors.contactNo = 'Invalid contact number (must be 10 digits starting with 6-9)';
        }
    }

    // Password validation (if provided)
    if (formData.password) {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.message;
        }
    }

    // Confirm Password validation (if password is being changed)
    if (formData.password && formData.confirmPassword !== undefined) {
        const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
        if (!passwordMatchValidation.isValid) {
            errors.confirmPassword = passwordMatchValidation.message;
        }
    }

    return errors;
};
