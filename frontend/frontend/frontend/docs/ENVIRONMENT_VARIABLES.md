# Environment Variables Guide

## Overview

StratOS uses environment variables to configure connections to Azure services, authentication providers, and application settings. This guide provides a comprehensive reference for all required and optional environment variables.

**Important**: Never commit `.env` files containing real credentials to version control.

---

## Backend Variables

These variables are used by the Azure Functions backend. Set them in:
- **Local development**: `.env` or `backend/local.settings.json`
- **Production**: Azure Function App Settings (via Azure Portal or CLI)

### Azure OpenAI

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI service endpoint URL | ✅ Yes | `https://stratos-openai-123456.openai.azure.com/` |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key | ✅ Yes | `a1b2c3d4e5f6g7h8i9j0...` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | GPT-4 deployment name | ✅ Yes | `gpt-4` |
| `AZURE_OPENAI_EMBEDDING_DEPLOYMENT` | Embedding model deployment name | ✅ Yes | `text-embedding-ada-002` |

**Where to find**: Azure Portal → Your OpenAI resource → Keys and Endpoint

### Cosmos DB

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `COSMOS_DB_ENDPOINT` | Cosmos DB account endpoint | ✅ Yes | `https://stratos-cosmos-123456.documents.azure.com:443/` |
| `COSMOS_DB_KEY` | Cosmos DB primary master key | ✅ Yes | `a1b2c3d4e5f6g7h8i9j0...==` |
| `COSMOS_DB_DATABASE_NAME` | Database name | ✅ Yes | `stratos` |

**Where to find**: Azure Portal → Your Cosmos DB account → Keys → URI and Primary Key

### Azure Storage

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `AZURE_STORAGE_CONNECTION_STRING` | Storage account connection string | ✅ Yes | `DefaultEndpointsProtocol=https;AccountName=stratos123456;AccountKey=...;EndpointSuffix=core.windows.net` |

**Where to find**: Azure Portal → Your Storage Account → Access keys → Connection string

### Azure Cognitive Search

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `AZURE_SEARCH_ENDPOINT` | Cognitive Search service URL | ✅ Yes | `https://stratos-search-123456.search.windows.net` |
| `AZURE_SEARCH_KEY` | Cognitive Search admin API key | ✅ Yes | `a1b2c3d4e5f6g7h8i9j0...` |

**Where to find**: Azure Portal → Your Search service → Keys → Primary admin key

### Azure AD B2C Authentication

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `AZURE_AD_B2C_TENANT_NAME` | B2C tenant name (without .onmicrosoft.com) | ✅ Yes | `stratosb2c` |
| `AZURE_AD_B2C_CLIENT_ID` | Application (client) ID | ✅ Yes | `12345678-1234-1234-1234-123456789012` |
| `AZURE_AD_B2C_CLIENT_SECRET` | Client secret value | ✅ Yes | `a1b2c3~d4e5f6g7h8i9j0...` |
| `AZURE_AD_B2C_PRIMARY_USER_FLOW` | Sign up/sign in user flow name | ✅ Yes | `B2C_1_signupsignin` |
| `AZURE_AD_B2C_DOMAIN` | B2C tenant domain | ✅ Yes | `stratosb2c.b2clogin.com` |

**Where to find**: 
- Tenant name: Azure Portal → Azure AD B2C → Overview → Domain name
- Client ID: Azure AD B2C → App registrations → Your app → Application ID
- Client secret: Azure AD B2C → App registrations → Your app → Certificates & secrets
- User flow: Azure AD B2C → User flows

### Application Insights

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `APPINSIGHTS_INSTRUMENTATIONKEY` | Application Insights instrumentation key | ✅ Yes | `12345678-1234-1234-1234-123456789012` |
| `APPINSIGHTS_CONNECTION_STRING` | Full connection string | No | `InstrumentationKey=...;IngestionEndpoint=...` |

**Where to find**: Azure Portal → Your Application Insights resource → Properties → Instrumentation Key

### Application Settings

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret for signing JWT tokens | ✅ Yes | `your-super-secret-jwt-key-min-32-chars` |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ Yes | `https://stratos-platform.vercel.app` |
| `NODE_ENV` | Environment mode | No | `production` |

**How to generate JWT_SECRET**: 
```bash
# Generate a secure random key
openssl rand -base64 32
```

### Azure Key Vault (Optional)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `AZURE_KEYVAULT_URI` | Key Vault URI for storing secrets | No | `https://stratos-kv-123456.vault.azure.net/` |

---

## Frontend Variables

These variables are used by the Next.js frontend. Set them in:
- **Local development**: `frontend/.env.local`
- **Production**: Vercel environment variables (dashboard or CLI)

### API Configuration

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | ✅ Yes | `https://stratos-platform-func-123456.azurewebsites.net/api` |

### Azure AD B2C (Public)

**Note**: Variables with `NEXT_PUBLIC_` prefix are exposed to the browser.

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID` | Application (client) ID | ✅ Yes | `12345678-1234-1234-1234-123456789012` |
| `NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME` | B2C tenant name | ✅ Yes | `stratosb2c` |
| `NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN` | B2C tenant domain | ✅ Yes | `stratosb2c.b2clogin.com` |
| `NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW` | User flow name | ✅ Yes | `B2C_1_signupsignin` |

### Application Settings

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application display name | No | `StratOS Platform` |
| `NEXT_PUBLIC_APP_VERSION` | Version number | No | `1.0.0` |
| `NEXT_PUBLIC_ENVIRONMENT` | Environment name | No | `production` |

### Analytics (Optional)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics service ID (Segment, etc.) | No | `abc123xyz` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID | No | `G-XXXXXXXXXX` |

---

## Development vs Production

### Local Development Setup

1. **Backend** - Create `backend/.env`:
```bash
AZURE_OPENAI_ENDPOINT=https://your-service.openai.azure.com/
AZURE_OPENAI_KEY=your-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002
COSMOS_DB_ENDPOINT=https://your-cosmos.documents.azure.com:443/
COSMOS_DB_KEY=your-key
COSMOS_DB_DATABASE_NAME=stratos
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_SEARCH_ENDPOINT=https://your-search.search.windows.net
AZURE_SEARCH_KEY=your-key
AZURE_AD_B2C_TENANT_NAME=your-tenant
AZURE_AD_B2C_CLIENT_ID=your-client-id
AZURE_AD_B2C_CLIENT_SECRET=your-secret
AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
AZURE_AD_B2C_DOMAIN=your-tenant.b2clogin.com
APPINSIGHTS_INSTRUMENTATIONKEY=your-key
JWT_SECRET=your-jwt-secret-min-32-characters
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

2. **Frontend** - Create `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071/api
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=your-tenant
NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN=your-tenant.b2clogin.com
NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
NEXT_PUBLIC_APP_NAME=StratOS Platform
NEXT_PUBLIC_ENVIRONMENT=development
```

### Production Deployment

#### Backend (Azure Function App Settings)

Set via Azure CLI:
```bash
az functionapp config appsettings set \
  --name stratos-platform-func-123456 \
  --resource-group stratos-rg \
  --settings \
    AZURE_OPENAI_ENDPOINT="https://..." \
    AZURE_OPENAI_KEY="..." \
    # ... all other variables
```

Or via Azure Portal:
1. Navigate to Function App → Configuration
2. Add new application settings
3. Click "Save" and restart the app

#### Frontend (Vercel)

Set via Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production
# Enter value when prompted
```

Or via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate scope (Production, Preview, Development)
3. Redeploy for changes to take effect

---

## Using Template Files

### Backend Template (`backend/local.settings.json.template`)

Copy and fill in:
```bash
cd backend
cp local.settings.json.template local.settings.json
# Edit local.settings.json with your values
```

### Frontend Template (`frontend/.env.local.example`)

Copy and fill in:
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your values
```

---

## Security Best Practices

### General Security

✅ **DO**:
- Use Azure Key Vault for production secrets
- Rotate keys regularly (every 90 days recommended)
- Use different values for dev/staging/production
- Limit access to environment variables (RBAC)
- Use managed identities when possible
- Enable Azure AD authentication for services

❌ **DON'T**:
- Commit `.env` files to git (always in `.gitignore`)
- Share credentials via email or chat
- Use production credentials in development
- Hard-code secrets in application code
- Store secrets in source control or CI logs
- Use weak JWT secrets (min 32 characters)

### Verifying .gitignore

Ensure your `.gitignore` includes:
```
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env
!.env.template
!.env.local.example

# Azure Functions
backend/local.settings.json
```

### Key Rotation

When rotating keys:
1. Create new key in Azure Portal
2. Update both primary and secondary keys
3. Test with new key in staging
4. Update production environment variables
5. Delete old key after verification
6. Document rotation date

---

## Troubleshooting

### Common Issues

#### "OpenAI API key invalid"
- **Cause**: Key is incorrect or regenerated
- **Fix**: Get new key from Azure Portal → OpenAI resource → Keys and Endpoint
- **Verify**: Key should be 32+ characters, no extra spaces

#### "Cosmos DB connection failed"
- **Cause**: Endpoint or key incorrect, firewall blocking
- **Fix**: Verify endpoint includes `https://` and `:443/`
- **Check**: Cosmos DB → Firewall → Allow access from Azure services

#### "B2C authentication not working"
- **Cause**: Mismatch between frontend and backend B2C config
- **Fix**: Ensure all B2C variables match exactly in both environments
- **Verify**: Redirect URIs in B2C app registration include your URLs

#### "CORS errors on API calls"
- **Cause**: `FRONTEND_URL` not set correctly in backend
- **Fix**: Set to exact frontend URL (no trailing slash)
- **Check**: Function App CORS settings include frontend URL

#### "Environment variables not loading"
- **Cause**: Wrong file name or location
- **Fix**: 
  - Backend: Must be `backend/.env` or `local.settings.json`
  - Frontend: Must be `frontend/.env.local`
- **Restart**: Restart development server after changes

---

## Quick Reference

### Finding Azure Resource Values

```bash
# OpenAI Endpoint and Key
az cognitiveservices account show \
  --name your-openai-name \
  --resource-group stratos-rg

az cognitiveservices account keys list \
  --name your-openai-name \
  --resource-group stratos-rg

# Cosmos DB Endpoint and Key
az cosmosdb show \
  --name your-cosmos-name \
  --resource-group stratos-rg

az cosmosdb keys list \
  --name your-cosmos-name \
  --resource-group stratos-rg

# Storage Connection String
az storage account show-connection-string \
  --name your-storage-name \
  --resource-group stratos-rg

# Search Endpoint and Key
az search service show \
  --name your-search-name \
  --resource-group stratos-rg

az search admin-key show \
  --service-name your-search-name \
  --resource-group stratos-rg

# Application Insights Key
az monitor app-insights component show \
  --app your-insights-name \
  --resource-group stratos-rg
```

### Complete Example Values

All values from `infrastructure/azure-resources.txt` after running setup script.

---

## Support

- **Azure Documentation**: https://docs.microsoft.com/azure
- **Vercel Documentation**: https://vercel.com/docs/environment-variables
- **Next.js Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables

---

**Last Updated**: October 2025  
**Version**: 1.0.0

