class VehicleValidator {
    static patterns = {
        vehicleNumber: /^[A-Z]{2}\d{2}[A-Z]+\d{4}$/,
        contact: /^[0-9]{10}$/,
        ticketId: /^[A-Z0-9]{8}$/
    };

    static validateVehicleNumber(vehicleNo) {
        if (!vehicleNo || typeof vehicleNo !== 'string') {
            return { isValid: false, message: 'Vehicle number is required' };
        }

        const cleanVehicleNo = vehicleNo.trim().replace(/\s+/g, '');
        if (!this.patterns.vehicleNumber.test(cleanVehicleNo)) {
            return {
                isValid: false,
                message: 'Invalid vehicle number format. Expected format: XX99XX9999'
            };
        }

        return { isValid: true, cleanValue: cleanVehicleNo };
    }

    static validateOwnerName(name) {
        if (!name || typeof name !== 'string') {
            return { isValid: false, message: 'Owner name is required' };
        }

        const cleanName = name.trim().replace(/\s+/g, ' ');
        if (cleanName.length < 3 || cleanName.length > 50) {
            return {
                isValid: false,
                message: 'Owner name must be between 3 and 50 characters'
            };
        }

        return { isValid: true, cleanValue: cleanName };
    }

    static validateOwnerContact(contact) {
        if (!contact || typeof contact !== 'string') {
            return { isValid: false, message: 'Contact number is required' };
        }

        const cleanContact = contact.trim().replace(/\s+/g, '');
        if (!this.patterns.contact.test(cleanContact)) {
            return {
                isValid: false,
                message: 'Invalid contact number. Must be exactly 10 digits'
            };
        }

        return { isValid: true, cleanValue: cleanContact };
    }

    static validateTicketId(ticketId) {
        if (!ticketId || typeof ticketId !== 'string') {
            return { isValid: false, message: 'Ticket ID is required' };
        }

        const cleanTicketId = ticketId.trim();
        if (cleanTicketId.length !== 8) {
            return {
                isValid: false,
                message: 'Invalid ticket ID. Must be exactly 8 characters'
            };
        }

        return { isValid: true, cleanValue: cleanTicketId };
    }

    static validateVehicleDetails(vehicleData) {
        const { type, vehicleNo, ownerName, ownerContact } = vehicleData;
        const errors = [];
        const cleanData = { type };

        // Validate vehicle type
        if (!type || !['mini', 'compact', 'large'].includes(type.toLowerCase())) {
            errors.push('Please select a valid vehicle type');
        }
        // Convert to lowercase to match backend expectations
        if (type) {
            cleanData.type = type.toLowerCase();
        }

        // Validate vehicle number
        const vehicleValidation = this.validateVehicleNumber(vehicleNo);
        if (!vehicleValidation.isValid) {
            errors.push(vehicleValidation.message);
        } else {
            cleanData.vehicleNo = vehicleValidation.cleanValue;
        }

        // Validate owner name
        const nameValidation = this.validateOwnerName(ownerName);
        if (!nameValidation.isValid) {
            errors.push(nameValidation.message);
        } else {
            cleanData.ownerName = nameValidation.cleanValue;
        }

        // Validate owner contact
        const contactValidation = this.validateOwnerContact(ownerContact);
        if (!contactValidation.isValid) {
            errors.push(contactValidation.message);
        } else {
            cleanData.ownerContact = contactValidation.cleanValue;
        }

        return {
            isValid: errors.length === 0,
            errors,
            cleanData: errors.length === 0 ? cleanData : null
        };
    }
}

// Admin validation functions
class AdminValidator {
    static validateCredentials(username, password) {
        const errors = [];

        if (!username || username.trim().length === 0) {
            errors.push('Username is required');
        }

        if (!password || password.trim().length === 0) {
            errors.push('Password is required');
        }

        return {
            isValid: errors.length === 0,
            errors,
            cleanData: errors.length === 0 ? {
                username: username.trim(),
                password: password.trim()
            } : null
        };
    }
}

// Gate validation functions
class GateValidator {
    static validateGateData(gateData) {
        const { gateId, gateName, gateType, guardName, gateStatus } = gateData;
        const errors = [];
        const cleanData = {};

        // Validate gate ID
        if (!gateId || gateId.trim().length === 0) {
            errors.push('Gate ID is required');
        } else {
            cleanData.id = gateId.trim();
        }

        // Validate gate name
        if (!gateName || gateName.trim().length === 0) {
            errors.push('Gate name is required');
        } else if (gateName.trim().length > 50) {
            errors.push('Gate name must be less than 50 characters');
        } else {
            cleanData.name = gateName.trim();
        }

        // Validate gate type
        if (!gateType || !['ENTRY', 'EXIT', 'BOTH'].includes(gateType)) {
            errors.push('Please select a valid gate type');
        } else {
            cleanData.type = gateType;
        }

        // Validate guard name
        if (!guardName || guardName.trim().length === 0) {
            errors.push('Guard name is required');
        } else if (guardName.trim().length > 50) {
            errors.push('Guard name must be less than 50 characters');
        } else {
            cleanData.guardName = guardName.trim();
        }

        // Validate gate status
        if (gateStatus !== undefined) {
            cleanData.status = Boolean(gateStatus);
        }

        return {
            isValid: errors.length === 0,
            errors,
            cleanData: errors.length === 0 ? cleanData : null
        };
    }
}

// Generic form validation utilities
class FormValidator {
    static validateRequired(data, requiredFields) {
        const missing = [];

        for (const field of requiredFields) {
            if (!data[field] || data[field].toString().trim().length === 0) {
                missing.push(field);
            }
        }

        return {
            isValid: missing.length === 0,
            missingFields: missing,
            message: missing.length > 0 ?
                `Please fill in the following required fields: ${missing.join(', ')}` :
                null
        };
    }

    static validateEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: pattern.test(email),
            message: 'Please enter a valid email address'
        };
    }

    static validateNumeric(value, min = null, max = null) {
        const num = parseFloat(value);

        if (isNaN(num)) {
            return { isValid: false, message: 'Must be a valid number' };
        }

        if (min !== null && num < min) {
            return { isValid: false, message: `Must be at least ${min}` };
        }

        if (max !== null && num > max) {
            return { isValid: false, message: `Must be no more than ${max}` };
        }

        return { isValid: true, value: num };
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        return input
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[<>]/g, ''); // Basic XSS prevention
    }

    static cleanFormData(formData) {
        const cleaned = {};

        for (const [key, value] of Object.entries(formData)) {
            cleaned[key] = this.sanitizeInput(value);
        }

        return cleaned;
    }
}

// Validation message display utilities
class ValidationDisplay {
    static showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Remove existing error styling
        field.classList.remove('error');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        if (message) {
            // Add error styling
            field.classList.add('error');

            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #dc3545; font-size: 0.8em; margin-top: 5px;';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    static clearFieldErrors(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Remove error styling
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });

        // Remove error messages
        form.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
    }

    static showValidationErrors(errors, containerId = null) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                const errorHtml = `
                    <div class="alert alert-error">
                        <h4>❌ Validation Errors</h4>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            ${errors.map(error => `<li>${error}</li>`).join('')}
                        </ul>
                    </div>
                `;
                container.innerHTML = errorHtml;
            }
        }
    }
}