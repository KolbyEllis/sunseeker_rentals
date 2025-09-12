# Supabase Integration Setup Guide

## Overview
The Goodyear Property Management form has been configured to submit data directly to your Supabase database instead of using Netlify Forms.

## Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

### 2. Create Database Table
Run this SQL in your Supabase SQL editor to create the form submissions table:

```sql
-- Create form_submissions table
CREATE TABLE form_submissions (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT,
    message TEXT NOT NULL,
    form_name TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    page_url TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_form_submissions_email ON form_submissions(email);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at);
CREATE INDEX idx_form_submissions_form_name ON form_submissions(form_name);

-- Enable Row Level Security (RLS)
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (form submissions)
CREATE POLICY "Allow form submissions" ON form_submissions
    FOR INSERT WITH CHECK (true);
```

### 3. Update JavaScript Configuration
Edit `/public/assets/js/supabase-form.js` and replace the placeholder values:

```javascript
// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'your-anon-key-here'
```

### 4. Test the Integration
1. Deploy your changes
2. Visit the Goodyear Property Management page
3. Fill out and submit the form
4. Check your Supabase dashboard to verify the data was stored

## Form Data Structure
The form will store the following data in Supabase:

- `first_name` - Customer's first name
- `last_name` - Customer's last name  
- `phone` - Customer's phone number
- `email` - Customer's email address
- `location` - Property address or location
- `message` - Customer's message about their property
- `form_name` - "Goodyear PM Form"
- `submitted_at` - Timestamp of submission
- `page_url` - URL where form was submitted
- `user_agent` - Browser information

## Security Notes
- The anon key is safe to use in client-side code
- Row Level Security (RLS) is enabled for data protection
- Only INSERT operations are allowed for form submissions
- No sensitive data is exposed in the client-side code

## Troubleshooting
- Check browser console for any JavaScript errors
- Verify Supabase credentials are correct
- Ensure the database table was created successfully
- Check Supabase logs for any server-side errors

## Next Steps
Once this is working, you can:
1. Set up email notifications for new form submissions
2. Create a dashboard to view submissions
3. Add the same integration to other forms on your site
4. Set up automated follow-up workflows
