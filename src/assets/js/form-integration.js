/**
 * Sunseeker Rentals Contact Form Integration
 * 
 * Replace your existing form submission with this code.
 * This will send form data to your Keap clone instead of n8n.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find your contact form (adjust selector to match your form)
    const contactForm = document.querySelector('form'); // or use a more specific selector like '#contact-form'
    
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Extract form fields (adjust these to match your actual field names)
        const contactData = {
            firstName: formData.get('firstName') || formData.get('first-name') || '',
            lastName: formData.get('lastName') || formData.get('last-name') || '',
            email: formData.get('email') || formData.get('email-address') || '',
            phone: formData.get('phone') || formData.get('phone-number') || '',
            location: formData.get('location') || formData.get('approximate-location') || '',
            message: formData.get('Message') || formData.get('message') || formData.get('property-details') || '',
            source: 'sunseeker-rentals',
            tags: [
                'Property Management Lead',
                'Goodyear Area',
                'Sunseeker Rental',
                new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' Lead'
            ]
        };

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"], input[type="submit"]');
        const originalButtonText = submitButton.textContent || submitButton.value;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        if (submitButton.value) submitButton.value = 'Submitting...';

        try {
            // Send to Netlify function (which forwards to Keap clone)
            const response = await fetch('/.netlify/functions/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success! Show success message
                showSuccessMessage('Thank you! Your information has been submitted successfully. We\'ll contact you soon.');
                
                // Reset form
                contactForm.reset();
                
                // Optional: Track conversion
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submit', {
                        'event_category': 'engagement',
                        'event_label': 'sunseeker-rentals'
                    });
                }
                
            } else {
                throw new Error(result.error || 'Submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage('Sorry, there was an error submitting your information. Please try again or call us at (623) 248-1929.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            if (submitButton.value) submitButton.value = originalButtonText;
        }
    });
});

/**
 * Show success message to user
 */
function showSuccessMessage(message) {
    // Remove any existing messages
    removeExistingMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-message';
    successDiv.innerHTML = `
        <div style="
            background: #10b981;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        ">
            ✅ ${message}
        </div>
    `;
    
    // Insert after the form
    const form = document.querySelector('form');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    // Remove any existing messages
    removeExistingMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.innerHTML = `
        <div style="
            background: #ef4444;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        ">
            ❌ ${message}
        </div>
    `;
    
    // Insert after the form
    const form = document.querySelector('form');
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 8000);
}

/**
 * Remove existing success/error messages
 */
function removeExistingMessages() {
    const existingMessages = document.querySelectorAll('.form-success-message, .form-error-message');
    existingMessages.forEach(msg => msg.remove());
}

/**
 * Add CSS animations
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
