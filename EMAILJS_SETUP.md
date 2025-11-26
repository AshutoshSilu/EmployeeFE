# EmailJS Setup for Direct Website Email Sending

## Quick Setup Steps:

### 1. Create EmailJS Account
- Go to [EmailJS.com](https://www.emailjs.com/)
- Sign up for free account

### 2. Add Email Service
- Go to Email Services
- Click "Add New Service" 
- Choose Gmail/Outlook/etc.
- Follow connection steps

### 3. Create Email Template
- Go to Email Templates
- Click "Create New Template"
- Use these template variables:
```
Subject: New Contact Form Message from {{from_name}}

Hello,

You have received a new message from your website contact form:

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

Best regards,
Website Contact Form
```

### 4. Get Your Keys
- Service ID: Found in Email Services section
- Template ID: Found in Email Templates section  
- Public Key: Found in Account > API Keys

### 5. Update Angular Code
Replace in `email.service.ts`:
```typescript
private readonly EMAILJS_SERVICE_ID = 'your_actual_service_id';
private readonly EMAILJS_TEMPLATE_ID = 'your_actual_template_id'; 
private readonly EMAILJS_PUBLIC_KEY = 'your_actual_public_key';
```

### 6. Test
- Fill out contact form
- Should send email directly from website
- Check your email inbox

## Features:
- ✅ No email client required
- ✅ Sends directly from website
- ✅ Auto-loads EmailJS library
- ✅ Proper error handling
- ✅ User-friendly messages