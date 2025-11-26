# Email Functionality Setup Guide

## Overview
The contact form now supports three email sending methods with automatic fallback:
1. **Backend API** (Primary) - Server-side email sending
2. **EmailJS** (Fallback) - Client-side email service
3. **Mailto** (Last resort) - Opens user's email client

## Setup Options

### Option 1: Backend API (Recommended)

Create a Node.js/Express backend:

```bash
npm init -y
npm install express nodemailer cors dotenv
```

**server.js:**
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, replyTo } = req.body;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      replyTo
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Create .env file:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Option 2: EmailJS Setup

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create a service (Gmail, Outlook, etc.)
3. Create an email template
4. Add EmailJS script to index.html:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

5. Update environment.ts with your credentials:
```typescript
emailjs: {
  serviceId: 'your_actual_service_id',
  templateId: 'your_actual_template_id', 
  publicKey: 'your_actual_public_key'
}
```

### Option 3: Mailto Only (Basic)

No additional setup required. Uses user's default email client.

## Required Dependencies

Add to app.config.ts:
```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ... other providers
  ]
};
```

## Email Template (EmailJS)

Create template with these variables:
- `{{from_name}}` - Sender name
- `{{from_email}}` - Sender email  
- `{{message}}` - Message content
- `{{to_email}}` - Recipient email

## Testing

1. Start backend: `node server.js`
2. Start Angular: `ng serve`
3. Test contact form with different scenarios

## Security Notes

- Use environment variables for sensitive data
- Implement rate limiting on backend
- Validate and sanitize all inputs
- Use HTTPS in production