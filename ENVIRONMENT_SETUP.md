# StratOS Environment Setup Guide

This guide will help you set up all the necessary environment variables for the StratOS platform.

## Quick Start

1. Copy the environment template:
```bash
cp env.local.example .env.local
```

2. Fill in your actual values in `.env.local`
3. Run the development server:
```bash
npm run dev
```

## Environment Variables Explained

### 🔧 Application Configuration
```env
NEXT_PUBLIC_APP_NAME=StratOS
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 🗄️ Database Configuration
For development, you can use:
- **PostgreSQL** (recommended)
- **SQLite** (for quick testing)
- **MySQL** (alternative)

```env
DATABASE_URL=postgresql://username:password@localhost:5432/stratos_dev
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=stratos_dev
DATABASE_USER=username
DATABASE_PASSWORD=password
```

### 🔐 Authentication & Security
Generate secure keys for production:
```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 32

# Generate encryption key (32 characters)
openssl rand -hex 16
```

### 🤖 AI/LLM Configuration
Required for AI chat functionality:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
AI_MODEL=gpt-4
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=4000
```

### 📧 Email Configuration
For development, use Mailtrap:
1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Get your SMTP credentials
3. Update the email variables

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
SMTP_FROM=noreply@stratos.dev
```

### 💳 Payment & Billing
For Stripe integration:
1. Create a Stripe account
2. Get your test keys from the dashboard
3. Set up webhooks

```env
STRIPE_PUBLISHABLE_KEY=pk_test_51YourStripePublishableKeyHere
STRIPE_SECRET_KEY=sk_test_51YourStripeSecretKeyHere
STRIPE_WEBHOOK_SECRET=whsec_YourStripeWebhookSecretHere
```

### 📊 Analytics & Monitoring
Optional but recommended:
- **Google Analytics**: For user behavior tracking
- **Mixpanel**: For event tracking
- **Sentry**: For error monitoring

### 🔗 External Integrations
Configure as needed:
- **Salesforce**: CRM integration
- **Slack**: Team notifications
- **Google**: Calendar and authentication
- **Outlook**: Calendar integration

### 📱 Notification Services
For push notifications:
1. Generate VAPID keys
2. Set up Twilio for SMS (optional)

### 🚀 Feature Flags
Control feature availability:
```env
ENABLE_AI_CHAT=true
ENABLE_FILE_UPLOAD=true
ENABLE_CALENDAR_INTEGRATION=true
ENABLE_BILLING=true
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
```

## Development vs Production

### Development
- Use test API keys
- Enable debug mode
- Use local storage
- Mock external services

### Production
- Use production API keys
- Disable debug mode
- Use cloud storage
- Enable all security features

## Security Checklist

- [ ] Generate strong secrets
- [ ] Use HTTPS in production
- [ ] Enable security headers
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Use environment-specific keys

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure database is running
   - Verify credentials

2. **Authentication Not Working**
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain
   - Ensure JWT_SECRET is configured

3. **File Upload Issues**
   - Check UPLOAD_MAX_SIZE
   - Verify ALLOWED_FILE_TYPES
   - Ensure storage provider is configured

4. **Email Not Sending**
   - Check SMTP credentials
   - Verify SMTP_HOST and SMTP_PORT
   - Test with Mailtrap first

## Environment Validation

Create a simple validation script to check required variables:

```javascript
// scripts/validate-env.js
const requiredVars = [
  'NEXTAUTH_SECRET',
  'JWT_SECRET',
  'DATABASE_URL'
];

const missing = requiredVars.filter(varName => !process.env[varName]);

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing);
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

## Next Steps

1. Set up your database
2. Configure authentication providers
3. Set up file storage
4. Configure email service
5. Set up monitoring
6. Test all integrations

For more detailed setup instructions, see the main README.md file.
