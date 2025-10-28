# StratOS Platform - Environment Setup Guide

This guide walks you through setting up all environment variables and configuration files for the StratOS platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure Infrastructure Setup](#azure-infrastructure-setup)
3. [Environment Variables Configuration](#environment-variables-configuration)
4. [Azure AD B2C Setup](#azure-ad-b2c-setup)
5. [Testing Connections](#testing-connections)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:

- ✅ Azure CLI installed and configured
- ✅ Azure subscription with Owner or Contributor role
- ✅ Node.js 18+ and npm 9+
- ✅ Git installed
- ✅ Azure Functions Core Tools v4

## Azure Infrastructure Setup

### Step 1: Login to Azure

```bash
az login
```

Select the appropriate subscription:

```bash
# List all subscriptions
az account list --output table

# Set active subscription
az account set --subscription "<subscription-id>"
```

### Step 2: Run Setup Script

Navigate to the infrastructure directory and run the setup script:

```bash
cd infrastructure
chmod +x setup.sh
./setup.sh
```

The script will create:
- ✅ Resource Group
- ✅ Azure OpenAI service with GPT-4 and embedding deployments
- ✅ Cosmos DB with database and containers
- ✅ Storage Account with blob containers
- ✅ Cognitive Search service
- ✅ Key Vault
- ✅ Application Insights
- ✅ Function App

**Important**: The script outputs all connection strings to `infrastructure/azure-resources.txt`. Keep this file secure!

### Step 3: Review Azure Resources

Verify resources in Azure Portal:

1. Navigate to https://portal.azure.com
2. Go to Resource Groups → `stratos-rg`
3. Verify all resources are created successfully

## Environment Variables Configuration

### Root Environment Variables (.env)

1. Copy the template:
```bash
cp env.template .env
```

2. Open `.env` and fill in values from `infrastructure/azure-resources.txt`

3. Key variables to configure:

```bash
# From azure-resources.txt
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_KEY=...
COSMOS_DB_ENDPOINT=...
COSMOS_DB_KEY=...
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_SEARCH_ENDPOINT=...
AZURE_SEARCH_KEY=...
APPINSIGHTS_INSTRUMENTATIONKEY=...

# Generate these
JWT_SECRET=$(openssl rand -base64 32)
```

### Backend Environment Variables

1. Copy the template:
```bash
cd backend
cp local.settings.json.template local.settings.json
```

2. Update `local.settings.json` with the same values from `azure-resources.txt`

3. The file should look like:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AZURE_OPENAI_ENDPOINT": "https://...",
    "AZURE_OPENAI_KEY": "...",
    // ... other variables
  }
}
```

### Frontend Environment Variables

1. Copy the template:
```bash
cd frontend
cp env.local.example .env.local
```

2. Configure public variables (these will be exposed to the browser):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071/api
NEXT_PUBLIC_APP_NAME=StratOS Platform
# ... other NEXT_PUBLIC_ variables
```

3. Add private variables (server-side only):

```bash
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
```

## Azure AD B2C Setup

Azure AD B2C must be configured manually. Follow the comprehensive guide:

📖 **[Azure AD B2C Setup Guide](../infrastructure/azure-setup.md)**

Key steps:
1. Create Azure AD B2C tenant
2. Register application
3. Create user flows (sign-up/sign-in, profile editing, password reset)
4. Configure social identity providers (Google, Apple, Microsoft)
5. Update environment variables with B2C details

After completing the B2C setup, add these to your `.env` files:

```bash
AZURE_AD_B2C_TENANT_NAME=stratos-platform
AZURE_AD_B2C_DOMAIN=stratos-platform.b2clogin.com
AZURE_AD_B2C_CLIENT_ID=<from-b2c-portal>
AZURE_AD_B2C_CLIENT_SECRET=<from-b2c-portal>
AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
```

## Testing Connections

### Validate Azure Setup

Run the validation script to test all connections:

```bash
cd infrastructure
chmod +x validate-setup.sh
./validate-setup.sh
```

Expected output:
```
========================================
StratOS - Azure Setup Validation
========================================

Checking Azure CLI...
✅ Azure CLI is installed
✅ Logged in to Azure

Checking Resource Group...
✅ Resource Group 'stratos-rg' exists

Checking Azure OpenAI...
✅ OpenAI service exists
✅ Can connect to OpenAI API
✅ GPT-4 deployment exists

...
```

### Test Individual Services

#### Test Azure OpenAI

```bash
cd backend
npm install
node -e "
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
);
client.getChatCompletions(
  process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
  [{ role: 'user', content: 'Hello!' }]
).then(r => console.log('✅ OpenAI working:', r.choices[0].message.content));
"
```

#### Test Cosmos DB

```bash
node -e "
const { CosmosClient } = require('@azure/cosmos');
const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY
});
client.databases.readAll().fetchAll()
  .then(() => console.log('✅ Cosmos DB connected'));
"
```

#### Test Storage Account

```bash
node -e "
const { BlobServiceClient } = require('@azure/storage-blob');
const client = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
client.listContainers().next()
  .then(() => console.log('✅ Storage Account connected'));
"
```

#### Test Cognitive Search

```bash
node -e "
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const client = new SearchClient(
  process.env.AZURE_SEARCH_ENDPOINT,
  'documents',
  new AzureKeyCredential(process.env.AZURE_SEARCH_KEY)
);
client.getDocumentsCount()
  .then(count => console.log('✅ Search connected, documents:', count));
"
```

### Test Local Development

Start the development servers:

```bash
# Terminal 1: Start backend
cd backend
npm install
npm start
# Should start on http://localhost:7071

# Terminal 2: Start frontend
cd frontend
npm install
npm run dev
# Should start on http://localhost:3000
```

Visit http://localhost:3000 and verify:
- ✅ Frontend loads without errors
- ✅ Authentication flow works (Azure AD B2C)
- ✅ Can send chat messages to backend
- ✅ Backend responds with AI completions

## Troubleshooting

### Common Issues

#### 1. "Azure CLI not found"

**Solution**: Install Azure CLI
```bash
# Windows
winget install -e --id Microsoft.AzureCLI

# macOS
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

#### 2. "Insufficient permissions"

**Error**: `AuthorizationFailed` or `Forbidden`

**Solution**: 
- Ensure you have Owner or Contributor role on the subscription
- Check with: `az role assignment list --assignee $(az account show --query user.name -o tsv)`

#### 3. "OpenAI deployment not found"

**Error**: `DeploymentNotFound`

**Solution**:
- Verify deployment names in Azure Portal
- Check deployment names match exactly in `.env` files
- Wait 2-3 minutes after deployment creation

#### 4. "Cosmos DB connection timeout"

**Error**: `ServiceUnavailable` or timeout errors

**Solution**:
- Verify Cosmos DB firewall allows your IP
- Check endpoint URL is correct (must include https:// and :443/)
- Ensure key is the primary master key, not read-only key

#### 5. "Storage Account access denied"

**Error**: `AuthenticationFailed`

**Solution**:
- Verify connection string is complete and unmodified
- Check storage account is not behind firewall
- Ensure storage account key is correct

#### 6. "Function App not starting"

**Error**: `Cannot find module` or `ENOENT`

**Solution**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 7. "B2C authentication failed"

**Error**: `AADB2C90XXX` errors

**Solution**:
- Verify redirect URIs match exactly in B2C portal and code
- Check user flow names are correct (case-sensitive)
- Ensure client secret hasn't expired
- Grant admin consent for API permissions

### Environment Variable Checklist

Use this checklist to ensure all variables are set:

**Root .env**:
- [ ] AZURE_OPENAI_ENDPOINT
- [ ] AZURE_OPENAI_KEY
- [ ] AZURE_OPENAI_DEPLOYMENT_NAME
- [ ] COSMOS_DB_ENDPOINT
- [ ] COSMOS_DB_KEY
- [ ] AZURE_STORAGE_CONNECTION_STRING
- [ ] AZURE_SEARCH_ENDPOINT
- [ ] AZURE_SEARCH_KEY
- [ ] APPINSIGHTS_INSTRUMENTATIONKEY
- [ ] AZURE_AD_B2C_CLIENT_ID
- [ ] AZURE_AD_B2C_CLIENT_SECRET
- [ ] JWT_SECRET

**Backend local.settings.json**:
- [ ] All values from root .env
- [ ] FUNCTIONS_WORKER_RUNTIME=node

**Frontend .env.local**:
- [ ] NEXT_PUBLIC_API_BASE_URL
- [ ] NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID
- [ ] NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL

### Getting Help

If you encounter issues not covered here:

1. Check Azure Portal for resource status
2. Review Application Insights logs for backend errors
3. Check browser console for frontend errors
4. Review `infrastructure/azure-resources.txt` for connection strings
5. Consult Azure documentation for specific services

## Security Best Practices

### Secrets Management

**DO**:
- ✅ Use Azure Key Vault for production secrets
- ✅ Rotate keys and secrets regularly (every 90 days)
- ✅ Use managed identities for Azure-to-Azure connections
- ✅ Keep `.env` files out of version control (.gitignore)
- ✅ Use different secrets for dev/staging/production

**DON'T**:
- ❌ Commit `.env` files to git
- ❌ Share secrets in chat or email
- ❌ Use production secrets in development
- ❌ Store secrets in code or config files

### Access Control

1. **Azure Resources**:
   - Use least-privilege access (RBAC)
   - Enable audit logging
   - Set up alerts for unauthorized access

2. **Application**:
   - Implement proper authentication (Azure AD B2C)
   - Use JWT tokens with short expiration
   - Validate all user input
   - Implement rate limiting

### Monitoring

Set up monitoring for:
- Application Insights dashboards
- Azure Monitor alerts
- Cost Management alerts
- Security Center recommendations

## Next Steps

After completing environment setup:

1. ✅ **Initialize Backend**: Follow Prompt 1.1 to set up Azure Functions
2. ✅ **Create Services**: Implement OpenAI, Cosmos, Search, Storage services
3. ✅ **Build Agents**: Develop the 5 specialized AI agents
4. ✅ **Initialize Frontend**: Set up Next.js application
5. ✅ **Deploy**: Configure CI/CD pipelines

---

**Environment setup complete!** 🎉 You're ready to start developing the StratOS platform.

