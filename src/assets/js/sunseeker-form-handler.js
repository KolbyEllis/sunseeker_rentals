function submitToCRM(event) {
    // Prevent the default form submission temporarily
    event.preventDefault();
    
    // Get form data
    const form = document.getElementById('cs-form-486');
    const formData = new FormData(form);
    
    // Convert to object
    const contactData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        Message: formData.get('Message'),
        location: formData.get('location')
    };
    
    // Send to CRM via fetch
    const crmUrl = 'https://jovial-melomakarona-ad9e4e.netlify.app/contacts/';
    const params = new URLSearchParams(contactData);
    
    // Create hidden iframe to load CRM with data
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `${crmUrl}?${params.toString()}`;
    document.body.appendChild(iframe);
    
    // Remove iframe after 3 seconds
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 3000);
    
    // Now submit the form normally to Netlify
    setTimeout(() => {
        form.submit();
    }, 100);
}