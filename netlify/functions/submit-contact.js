/**
 * Netlify Function: Submit Contact to Keap Clone
 * 
 * This function receives form submissions from Sunseeker Rentals
 * and forwards them to your Keap clone contact system.
 * 
 * Deploy this to: netlify/functions/submit-contact.js
 */

const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the form data
        const formData = JSON.parse(event.body);
        
        // Extract the form fields (mapped to your Sunseeker form)
        const contactData = {
            firstName: formData.firstName || formData['first-name'] || '',
            lastName: formData.lastName || formData['last-name'] || '',
            email: formData.email || formData['email-address'] || '',
            phone: formData.phone || formData['phone-number'] || '',
            location: formData.location || formData['approximate-location'] || '',
            message: formData.message || formData['property-details'] || formData['tell-us-about-your-property'] || '',
            source: 'sunseeker-rentals',
            tags: [
                'Property Management Lead',
                'Goodyear Area',
                'Sunseeker Rental',
                new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' Lead'
            ]
        };

        // Validate required fields
        if (!contactData.firstName || !contactData.lastName || !contactData.email) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Missing required fields: firstName, lastName, email' 
                })
            };
        }

        // Send to your Keap clone
        const keapCloneResponse = await fetch('https://jovial-melomakarona-ad9e4e.netlify.app/api/contact-webhook.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Sunseeker-Rentals-Form/1.0'
            },
            body: JSON.stringify(contactData)
        });

        const keapCloneResult = await keapCloneResponse.json();

        if (!keapCloneResponse.ok) {
            console.error('Keap clone error:', keapCloneResult);
            throw new Error(`Keap clone error: ${keapCloneResult.error || 'Unknown error'}`);
        }

        // Log successful submission
        console.log('Contact submitted successfully:', {
            contactId: keapCloneResult.contactId,
            email: contactData.email,
            source: 'sunseeker-rentals'
        });

        // Return success response
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Contact submitted successfully',
                contactId: keapCloneResult.contactId
            })
        };

    } catch (error) {
        console.error('Form submission error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

// Handle preflight OPTIONS request
if (event && event.httpMethod === 'OPTIONS') {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: ''
    };
}

module.exports = { handler };
