# Environment Variables Template

Create a `.env.local` file in the `frontend` directory with the following variables:

```bash
# Multi-Tenant Configuration
# Default tenant for local development (stratos or sparkworks)
NEXT_PUBLIC_DEFAULT_TENANT=stratos

# Tenant domains (for production)
NEXT_PUBLIC_STRATOS_DOMAIN=stratos.com
NEXT_PUBLIC_SPARKWORKS_DOMAIN=sparkworks.io

# Azure AD B2C Configuration
NEXT_PUBLIC_B2C_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_B2C_TENANT_NAME=your-tenant-name
NEXT_PUBLIC_B2C_DOMAIN=yourtenantname.b2clogin.com
NEXT_PUBLIC_B2C_POLICY_NAME=B2C_1_signupsignin
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=https://your-function-app.azurewebsites.net/api

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## Testing Multi-Tenant Locally

To test both brands locally, add these entries to your hosts file:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

```
127.0.0.1 stratos.localhost
127.0.0.1 sparkworks.localhost
```

Then visit:
- `http://stratos.localhost:3000` for StratOS branding
- `http://sparkworks.localhost:3000` for Sparkworks branding

