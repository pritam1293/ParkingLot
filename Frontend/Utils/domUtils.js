/**
 * DOM Utilities for QuickPark Application
 * Centralized DOM manipulation and element update functions
 */

/**
 * Safely update element content if element exists
 */
function updateElementIfExists(elementId, value, property = 'textContent') {
    const element = document.getElementById(elementId);
    if (element) {
        element[property] = value;
        return true;
    }
    console.log(`Element ${elementId} not found`);
    return false;
}

/**
 * Safely update multiple elements at once
 */
function updateElements(updates) {
    const results = {};
    for (const [elementId, value, property] of updates) {
        results[elementId] = updateElementIfExists(elementId, value, property);
    }
    return results;
}

/**
 * Show/hide elements safely
 */
function toggleElementDisplay(elementId, show = true) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
        return true;
    }
    return false;
}

/**
 * Button state management utility
 */
class ButtonManager {
    static setLoadingState(button, loadingText = '⏳ Loading...') {
        if (!button) return null;

        const originalState = {
            text: button.innerHTML,
            opacity: button.style.opacity,
            disabled: button.disabled
        };

        button.style.opacity = '0.6';
        button.disabled = true;
        button.innerHTML = loadingText;

        return originalState;
    }

    static restoreState(button, originalState, delay = 1000) {
        if (!button || !originalState) return;

        setTimeout(() => {
            button.style.opacity = originalState.opacity || '1';
            button.disabled = originalState.disabled || false;
            button.innerHTML = originalState.text;
        }, delay);
    }

    static withLoadingState(button, asyncFunction, loadingText, delay = 1000) {
        const originalState = this.setLoadingState(button, loadingText);
        return asyncFunction().finally(() => {
            this.restoreState(button, originalState, delay);
        });
    }
}

/**
 * Alert/Message display utilities
 */
class MessageDisplay {
    static createAlert(type, title, message, actions = []) {
        const alertClass = `alert alert-${type}`;
        const actionsHtml = actions.length > 0 ?
            `<div class="alert-actions" style="margin-top: 15px;">${actions.join('')}</div>` : '';

        return `
            <div class="${alertClass}">
                <h4>${title}</h4>
                <p>${message}</p>
                ${actionsHtml}
            </div>
        `;
    }

    static showError(containerId, message, title = '❌ Error') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.createAlert('error', title, message);
        }
    }

    static showSuccess(containerId, message, title = '✅ Success', actions = []) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.createAlert('success', title, message, actions);
        }
    }

    static showInfo(containerId, message, title = 'ℹ️ Info') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.createAlert('info', title, message);
        }
    }

    static clearMessages(containerId) {
        updateElementIfExists(containerId, '', 'innerHTML');
    }
}

/**
 * Status indicator utilities
 */
class StatusIndicator {
    static getStatusClass(availabilityPercentage) {
        if (availabilityPercentage > 50) return 'available';
        if (availabilityPercentage > 20) return 'limited';
        return 'full';
    }

    static getStatusText(availabilityPercentage) {
        if (availabilityPercentage > 50) return 'Available';
        if (availabilityPercentage > 20) return 'Limited';
        return 'Full';
    }

    static getOccupancyStatusClass(occupancyPercentage) {
        if (occupancyPercentage < 50) return 'available';
        if (occupancyPercentage < 80) return 'limited';
        return 'full';
    }

    static updateProgressBar(elementId, percentage, useOccupancyColors = false) {
        const progressBar = document.getElementById(elementId);
        if (progressBar) {
            progressBar.style.width = percentage + '%';
            const statusClass = useOccupancyColors ?
                this.getOccupancyStatusClass(percentage) :
                this.getStatusClass(100 - percentage);
            progressBar.className = `progress-fill ${statusClass}`;
            return true;
        }
        return false;
    }
}

/**
 * Form utilities
 */
class FormUtils {
    static resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            return true;
        }
        return false;
    }

    static getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return null;

        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        return data;
    }

    static validateRequired(data, requiredFields) {
        const missing = requiredFields.filter(field => !data[field]);
        return {
            isValid: missing.length === 0,
            missingFields: missing
        };
    }
}

/**
 * Navigation utilities
 */
class Navigation {
    static smoothScrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            return true;
        }
        return false;
    }

    static updateActiveNavLink(activeSectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeSectionId}`) {
                link.classList.add('active');
            } else if (href.startsWith('#')) {
                link.classList.remove('active');
            }
        });
    }

    static closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const hamburgerMenu = document.getElementById('hamburgerMenu');

        if (navMenu && hamburgerMenu) {
            navMenu.classList.remove('active');
            hamburgerMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

/**
 * Table utilities
 */
class TableUtils {
    static showLoadingRow(tableBodyId, colspan, message = '⏳ Loading...') {
        const tableBody = document.getElementById(tableBodyId);
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${colspan}" class="loading-row">${message}</td>
                </tr>
            `;
        }
    }

    static showErrorRow(tableBodyId, colspan, message = '❌ Failed to load data. Please try refreshing.') {
        const tableBody = document.getElementById(tableBodyId);
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${colspan}" class="error-row" style="color: #dc3545; padding: 20px; text-align: center;">
                        ${message}
                    </td>
                </tr>
            `;
        }
    }

    static showEmptyRow(tableBodyId, colspan, message = 'No data found') {
        const tableBody = document.getElementById(tableBodyId);
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${colspan}" class="no-data">${message}</td>
                </tr>
            `;
        }
    }

    static populateTable(tableBodyId, data, rowGenerator) {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return false;

        if (!data || data.length === 0) {
            this.showEmptyRow(tableBodyId, 6, 'No data found');
            return false;
        }

        tableBody.innerHTML = data.map(rowGenerator).join('');
        return true;
    }
}

/**
 * Date/Time utilities
 */
class DateTimeUtils {
    static formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    }

    static formatDuration(totalMinutes) {
        if (!totalMinutes || totalMinutes < 0) return 'N/A';
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }

    static calculateDuration(startDate, startTime, endDate, endTime) {
        try {
            const start = new Date(`${startDate}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);
            const diffMinutes = Math.floor((end - start) / (1000 * 60));
            return diffMinutes >= 0 ? diffMinutes : 0;
        } catch (e) {
            return 0;
        }
    }

    static getCurrentDateTime() {
        const now = new Date();
        return {
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString()
        };
    }
}