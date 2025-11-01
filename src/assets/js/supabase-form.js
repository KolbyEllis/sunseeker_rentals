// Supabase configuration and form handling
// Load Supabase from CDN
let supabase = null;

// Initialize Supabase client
// Supabase project credentials
const supabaseUrl = 'https://tukqivldrbcxijqjgqkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1a3FpdmxkcmJjeGlqcWpncWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2Mjg4ODcsImV4cCI6MjA3MzIwNDg4N30.0zp-fED7GB7QgajlzmHk3M7iYTPaXob-rH1bY63_Eq4'

// Initialize Supabase when script loads
async function initializeSupabase() {
    try {
        // Load Supabase from CDN
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2')
        supabase = createClient(supabaseUrl, supabaseKey)
        console.log('Supabase initialized successfully')
        return true
    } catch (error) {
        console.error('Failed to initialize Supabase:', error)
        return false
    }
}

// Form submission handler
async function handleFormSubmission(formData) {
    try {
        // Check if Supabase is initialized
        if (!supabase) {
            throw new Error('Supabase not initialized')
        }

        // Prepare data for Supabase
        const submissionData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            location: formData.get('location'),
            message: formData.get('Message'),
            form_name: formData.get('form-name'),
            submitted_at: new Date().toISOString(),
            page_url: window.location.href,
            user_agent: navigator.userAgent
        }

        // Insert data into Supabase
        const { data, error } = await supabase
            .from('form_submissions')
            .insert([submissionData])

        if (error) {
            console.error('Error submitting form:', error)
            throw error
        }

        console.log('Form submitted successfully:', data)
        return { success: true, data }
    } catch (error) {
        console.error('Form submission failed:', error)
        return { success: false, error: error.message }
    }
}

// Enhanced form submission with Supabase integration
function setupFormSubmission() {
    const form = document.getElementById('cs-form-486')
    
    if (!form) {
        console.error('Form not found')
        return
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const submitButton = form.querySelector('.cs-submit')
        const originalText = submitButton.textContent
        
        // Show loading state
        submitButton.textContent = 'Submitting...'
        submitButton.disabled = true
        
        try {
            // Check if reCAPTCHA is present and validate it
            const recaptchaResponse = await validateRecaptcha()
            if (!recaptchaResponse) {
                throw new Error('Please complete the reCAPTCHA verification')
            }
            
            const formData = new FormData(form)
            
            // Submit to Supabase
            const result = await handleFormSubmission(formData)
            
            if (result.success) {
                // Show success message
                showMessage('Thank you! Your information has been submitted successfully.', 'success')
                
                // Reset form
                form.reset()
                
                // Redirect to thank you page after a short delay
                setTimeout(() => {
                    window.location.href = '/submission-complete/'
                }, 2000)
            } else {
                throw new Error(result.error || 'Submission failed')
            }
        } catch (error) {
            console.error('Form submission error:', error)
            showMessage('Sorry, there was an error submitting your form. Please try again or contact us directly.', 'error')
        } finally {
            // Reset button state
            submitButton.textContent = originalText
            submitButton.disabled = false
        }
    })
}

// Validate reCAPTCHA
async function validateRecaptcha() {
    return new Promise((resolve) => {
        // Check if reCAPTCHA is loaded
        if (typeof grecaptcha === 'undefined') {
            console.warn('reCAPTCHA not loaded')
            resolve(true) // Allow submission if reCAPTCHA isn't loaded
            return
        }
        
        // Find the reCAPTCHA widget
        const recaptchaElement = document.querySelector('[data-netlify-recaptcha]')
        if (!recaptchaElement) {
            resolve(true) // No reCAPTCHA found, allow submission
            return
        }
        
        // Get the reCAPTCHA response
        const recaptchaResponse = grecaptcha.getResponse()
        if (!recaptchaResponse) {
            showMessage('Please complete the reCAPTCHA verification.', 'error')
            resolve(false)
            return
        }
        
        resolve(true)
    })
}

// Show user feedback messages
function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message')
    if (existingMessage) {
        existingMessage.remove()
    }
    
    // Create message element
    const messageEl = document.createElement('div')
    messageEl.className = `form-message form-message-${type}`
    messageEl.textContent = message
    messageEl.style.cssText = `
        padding: 15px;
        margin: 15px 0;
        border-radius: 5px;
        font-weight: 500;
        text-align: center;
        ${type === 'success' ? 
            'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
            'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `
    
    // Insert message after form title
    const formTitle = document.querySelector('#cs-form-486 .cs-h3')
    if (formTitle) {
        formTitle.parentNode.insertBefore(messageEl, formTitle.nextSibling)
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Supabase form script loaded')
    console.log('Supabase URL:', supabaseUrl)
    
    // Initialize Supabase first
    const initialized = await initializeSupabase()
    
    if (initialized) {
        // Test Supabase connection on page load
        await testSupabaseConnection()
        
        // Setup form submission
        setupFormSubmission()
    } else {
        console.error('Failed to initialize Supabase, form will not work')
    }
})

// Test Supabase connection
async function testSupabaseConnection() {
    try {
        console.log('Testing Supabase connection...')
        const { data, error } = await supabase
            .from('form_submissions')
            .select('count')
            .limit(1)
        
        if (error) {
            console.error('Supabase connection test failed:', error)
        } else {
            console.log('Supabase connection test successful:', data)
        }
    } catch (err) {
        console.error('Supabase connection error:', err)
    }
}

// Trigger n8n webhook
async function triggerN8nWebhook(formData) {
    try {
        // Your n8n webhook URL
        const n8nWebhookUrl = 'https://n8n.sunseekerrentals.com/webhook/contact-form'
        
        if (n8nWebhookUrl === 'YOUR_N8N_WEBHOOK_URL') {
            console.warn('n8n webhook URL not configured')
            return
        }
        
        const webhookData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            location: formData.get('location'),
            message: formData.get('Message'),
            form_name: formData.get('form-name'),
            submitted_at: new Date().toISOString(),
            page_url: window.location.href
        }
        
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
        })
        
        if (response.ok) {
            console.log('n8n webhook triggered successfully')
        } else {
            console.error('n8n webhook failed:', response.status)
        }
    } catch (error) {
        console.error('Error triggering n8n webhook:', error)
    }
}

// Export for potential use in other scripts
window.SupabaseFormHandler = {
    handleFormSubmission,
    setupFormSubmission
}
