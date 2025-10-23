--- 
# StratOS Platform - Complete Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure Infrastructure Setup](#azure-infrastructure-setup)
3. [Azure AD B2C Configuration](#azure-ad-b2c-configuration)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [CI/CD Setup](#cicd-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ Azure account with active subscription
- ✅ GitHub account for repository
- ✅ Vercel account for frontend hosting (or use Azure Static Web Apps)

### Required Tools
- ✅ Azure CLI (version 2.40+)
- ✅ Node.js 18.x or later
- ✅ Git
- ✅ Azure Functions Core Tools v4

### Installation

**macOS**:
```bash
brew install azure-cli node git
npm install -g azure-functions-core-tools@4
```

**Windows**:
```powershell
winget install Microsoft.AzureCLI
winget install OpenJS.NodeJS.LTS
winget install Git.Git
npm install -g azure-functions-core-tools@4
```

**Linux**:
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git
npm install -g azure-functions-core-tools@4
```

**Verify Installation**:
```bash
az --version          # Should show 2.40+
node --version        # Should show 18.x+
func --version        # Should show 4.x+
git --version
```

---

## Azure Infrastructure Setup

### Step 1: Login to Azure

```bash
# Login
az login

# List subscriptions
az account list --output table

# Set active subscription
az account set --subscription "<subscription-id>"

# Verify
az account show
```

### Step 2: Run Automated Setup Script

```bash
cd infrastructure

# Make script executable (macOS/Linux)
chmod +x setup.sh

# Run setup
./setup.sh

# Wait 10-15 minutes for all resources to provision
```

**On Windows**: Use Git Bash or WSL to run bash scripts, or use Azure Cloud Shell.

**What Gets Created**:
- Resource Group: `stratos-rg`
- Azure OpenAI: GPT-4 + text-embedding-ada-002
- Cosmos DB: Database with 5 containers
- Storage Account: 3 blob containers
- Cognitive Search: Basic tier
- Key Vault: For secrets
- Application Insights: For monitoring
- Function App: Node.js 18, consumption plan

### Step 3: Save Connection Strings

The script outputs all connection strings to `infrastructure/azure-resources.txt`:

```bash
cat infrastructure/azure-resources.txt
```

**Save these values securely** - you'll need them for environment configuration.

### Step 4: Validate Setup

```bash
chmod +x validate-setup.sh
./validate-setup.sh
```

Expected output:
```
✅ Azure CLI is installed
✅ Logged in to Azure
✅ Resource Group 'stratos-rg' exists
✅ OpenAI service exists
✅ Cosmos DB account exists
...
```

---

## Azure AD B2C Configuration

### Step 1: Create B2C Tenant

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Search "Azure Active Directory B2C" → Create
3. Select "Create a new Azure AD B2C Tenant"
4. Fill in details:
   - **Organization name**: StratOS Platform
   - **Initial domain**: `stratosb2c` (must be globally unique)
   - **Country/Region**: United States (or your country)
5. Click "Review + create" → "Create"
6. Wait 1-2 minutes for creation

### Step 2: Switch to B2C Tenant

1. Click your profile (top-right)
2. Select "Switch directory"
3. Choose the StratOS B2C tenant

### Step 3: Register Application

1. Go to "App registrations" → "New registration"
2. Configure:
   - **Name**: StratOS Platform
   - **Supported account types**: "Accounts in any identity provider..."
   - **Redirect URI**: 
     - Platform: Single-page application (SPA)
     - URI: `http://localhost:3000`
3. Click "Register"
4. **SAVE**: Application (client) ID

### Step 4: Add Production Redirect URIs

1. In app registration → "Authentication"
2. Add redirect URIs:
   ```
   http://localhost:3000
   https://your-domain.vercel.app
   https://www.your-domain.com
   ```
3. Under "Implicit grant and hybrid flows":
   - ✅ Access tokens
   - ✅ ID tokens
4. Click "Save"

### Step 5: Create User Flows

**Sign Up and Sign In Flow**:
1. Go to "User flows" → "New user flow"
2. Select "Sign up and sign in" → "Recommended"
3. Name: `B2C_1_signupsignin`
4. Identity providers:
   - ✅ Email signup
   - ✅ Google (optional - requires setup)
   - ✅ Microsoft Account (optional)
5. User attributes to collect:
   - ✅ Display Name
   - ✅ Email Address
   - ✅ Given Name
   - ✅ Surname
6. Application claims to return:
   - ✅ Email Addresses
   - ✅ Display Name
   - ✅ Given Name
   - ✅ Surname  
   - ✅ User's Object ID
7. Click "Create"

**Profile Editing Flow** (Optional):
1. "New user flow" → "Profile editing"
2. Name: `B2C_1_profileediting`
3. Configure similar to above
4. Click "Create"

### Step 6: Note Configuration Values

Save these for environment variables:
```
AZURE_AD_B2C_TENANT_NAME=stratosb2c
AZURE_AD_B2C_DOMAIN=stratosb2c.b2clogin.com
AZURE_AD_B2C_CLIENT_ID=<from-step-3>
AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
```

---

## Backend Deployment

### Option A: Manual Deployment (Quick Test)

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. Deploy to Azure
func azure functionapp publish stratos-platform-functions

# Wait 2-3 minutes for deployment
```

### Option B: Automated CI/CD (Production)

**Step 1**: Get Publish Profile

```bash
az functionapp deployment list-publishing-profiles \
  --name stratos-platform-functions \
  --resource-group stratos-rg \
  --xml > publish-profile.xml
```

**Step 2**: Add GitHub Secret

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
4. Value: Paste entire contents of `publish-profile.xml`
5. Click "Add secret"

**Step 3**: Configure Environment Variables in Azure

```bash
# Set all environment variables
az functionapp config appsettings set \
  --name stratos-platform-functions \
  --resource-group stratos-rg \
  --settings \
    AZURE_OPENAI_ENDPOINT="<from-azure-resources.txt>" \
    AZURE_OPENAI_KEY="<from-azure-resources.txt>" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" \
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT="text-embedding-ada-002" \
    COSMOS_DB_ENDPOINT="<from-azure-resources.txt>" \
    COSMOS_DB_KEY="<from-azure-resources.txt>" \
    COSMOS_DB_DATABASE_NAME="stratos" \
    AZURE_STORAGE_CONNECTION_STRING="<from-azure-resources.txt>" \
    AZURE_SEARCH_ENDPOINT="<from-azure-resources.txt>" \
    AZURE_SEARCH_KEY="<from-azure-resources.txt>" \
    APPINSIGHTS_INSTRUMENTATIONKEY="<from-azure-resources.txt>" \
    AZURE_AD_B2C_TENANT_NAME="stratosb2c" \
    AZURE_AD_B2C_CLIENT_ID="<from-b2c-setup>" \
    JWT_SECRET="$(openssl rand -base64 32)" \
    FRONTEND_URL="https://your-domain.vercel.app"
```

**Step 4**: Push to Trigger Deployment

```bash
git add .
git commit -m "Deploy backend to production"
git push origin main
```

The GitHub Action will automatically:
- Install dependencies
- Build TypeScript
- Run tests
- Deploy to Azure Functions
- Notify on success/failure

### Option C: Azure Static Web Apps (Alternative)

If you prefer to keep everything in Azure:

```bash
# Deploy frontend as Azure Static Web App
az staticwebapp create \
  --name stratos-frontend \
  --resource-group stratos-rg \
  --source frontend/ \
  --location eastus \
  --branch main \
  --app-location "/" \
  --api-location "" \
  --output-location ".next"
```

---

## Frontend Deployment

### Option A: Vercel (Recommended)

**Step 1**: Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

**Step 2**: Link Project

```bash
cd frontend
vercel link
```

Prompts:
- Set up and deploy: **Yes**
- Scope: **Your account**
- Link to existing project: **No**
- Project name: **stratos-platform**
- Directory: **.**

**Step 3**: Configure Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables:

```
NEXT_PUBLIC_API_BASE_URL=https://stratos-platform-functions.azurewebsites.net/api
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=<your-b2c-client-id>
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=stratosb2c
NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN=stratosb2c.b2clogin.com
NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
NEXT_PUBLIC_APP_NAME=StratOS Platform
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.vercel.app
```

**Step 4**: Deploy

```bash
# Deploy to production
vercel --prod

# Or push to GitHub (if GitHub integration configured)
git push origin main
```

### Option B: GitHub Actions (Automated)

**Step 1**: Get Vercel Credentials

```bash
cd frontend
vercel link

# Get project details
cat .vercel/project.json
```

**Step 2**: Add GitHub Secrets

Add these secrets to GitHub repository:
- `VERCEL_TOKEN` - From Vercel account settings
- `VERCEL_ORG_ID` - From `.vercel/project.json`
- `VERCEL_PROJECT_ID` - From `.vercel/project.json`
- All `NEXT_PUBLIC_*` environment variables

**Step 3**: Push to Deploy

```bash
git push origin main
```

GitHub Actions automatically deploys on push to `frontend/` directory.

---

## Post-Deployment Verification

### 1. Test Backend Health

```bash
# Health check
curl https://stratos-platform-functions.azurewebsites.net/api/chat

# Should return 401 (auth required) - this is correct
```

### 2. Test Tenant Onboarding

```bash
curl -X POST https://stratos-platform-functions.azurewebsites.net/api/tenant/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Test Company",
    "domain": "testco",
    "ownerEmail": "test@example.com",
    "ownerName": "Test User"
  }'

# Should return 201 with tenant details
```

### 3. Test Frontend

1. Visit your Vercel URL
2. Click "Login" (if auth integrated)
3. Navigate to `/dashboard`
4. Navigate to `/settings`
5. Try `/console` (if components integrated)

### 4. Verify Azure Resources

**Application Insights**:
```bash
az monitor app-insights component show \
  --app stratos-platform-insights \
  --resource-group stratos-rg
```

**Cosmos DB**:
```bash
az cosmosdb show \
  --name <cosmos-account-name> \
  --resource-group stratos-rg
```

---

## CI/CD Setup

### Backend CI/CD Configuration

**File**: `.github/workflows/deploy-backend.yml`

**Triggers**:
- Push to `main` branch
- Changes in `backend/` directory
- Manual workflow dispatch

**Required Secrets**:
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`

**Process**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build TypeScript
5. Run tests (if any)
6. Deploy to Azure Functions
7. Notify success/failure

**Setup**:
```bash
# Get publish profile
az functionapp deployment list-publishing-profiles \
  --name stratos-platform-functions \
  --resource-group stratos-rg \
  --xml

# Add to GitHub Secrets as AZURE_FUNCTIONAPP_PUBLISH_PROFILE
```

### Frontend CI/CD Configuration

**File**: `.github/workflows/deploy-frontend.yml`

**Triggers**:
- Push to `main` branch
- Changes in `frontend/` directory
- Manual workflow dispatch

**Required Secrets**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- All `NEXT_PUBLIC_*` environment variables

**Process**:
1. Checkout code
2. Setup Node.js
3. Install Vercel CLI
4. Pull Vercel config
5. Build project
6. Deploy to Vercel
7. Return deployment URL

**Setup**:
```bash
# Get Vercel token
vercel login
# Go to vercel.com/account/tokens → Create Token

# Get project IDs
cd frontend && vercel link
cat .vercel/project.json

# Add all to GitHub Secrets
```

---

## Environment Variables Reference

### Backend (Azure Function App Settings)

```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://...
AZURE_OPENAI_KEY=...
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002

# Cosmos DB
COSMOS_DB_ENDPOINT=https://...
COSMOS_DB_KEY=...
COSMOS_DB_DATABASE_NAME=stratos

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=...

# Cognitive Search
AZURE_SEARCH_ENDPOINT=https://...
AZURE_SEARCH_KEY=...

# Application Insights
APPINSIGHTS_INSTRUMENTATIONKEY=...
APPINSIGHTS_CONNECTION_STRING=...

# Azure AD B2C
AZURE_AD_B2C_TENANT_NAME=stratosb2c
AZURE_AD_B2C_CLIENT_ID=...
AZURE_AD_B2C_CLIENT_SECRET=...
AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin

# Application
JWT_SECRET=<generate-random-32-chars>
FRONTEND_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Frontend (Vercel Environment Variables)

```bash
# API
NEXT_PUBLIC_API_BASE_URL=https://stratos-platform-functions.azurewebsites.net/api

# Azure AD B2C (Public)
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=...
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=stratosb2c
NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN=stratosb2c.b2clogin.com
NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin

# Application
NEXT_PUBLIC_APP_NAME=StratOS Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# NextAuth (Private)
NEXTAUTH_SECRET=<generate-random-32-chars>
NEXTAUTH_URL=https://your-domain.vercel.app

# Azure AD B2C Secret (Private)
AZURE_AD_B2C_CLIENT_SECRET=...
```

---

## Monitoring & Maintenance

### Application Insights

**View Logs**:
```bash
az monitor app-insights component show \
  --app stratos-platform-insights \
  --resource-group stratos-rg

# Get instrumentation key
az monitor app-insights component show \
  --app stratos-platform-insights \
  --resource-group stratos-rg \
  --query instrumentationKey
```

**Dashboard**: https://portal.azure.com → Application Insights

**Key Metrics to Monitor**:
- Request rate
- Response time
- Failed requests
- Exceptions
- Dependency calls (OpenAI, Cosmos)
- Token usage

### Cost Monitoring

```bash
# Check current costs
az consumption usage list \
  --start-date 2024-01-01 \
  --end-date 2024-01-31

# Set up cost alert
az monitor metrics alert create \
  --name "StratOS-Cost-Alert" \
  --resource-group stratos-rg \
  --condition "total cost > 500"
```

### Backup Strategy

**Cosmos DB**:
- Automatic backups enabled (7-day retention)
- Point-in-time restore available

**Blob Storage**:
- Enable soft delete (7-day retention)
- Consider geo-redundant storage for production

---

## Troubleshooting

### Backend Issues

**Issue**: Functions not starting
```bash
# Check logs
func azure functionapp logstream stratos-platform-functions

# Check configuration
az functionapp config appsettings list \
  --name stratos-platform-functions \
  --resource-group stratos-rg
```

**Issue**: OpenAI errors
- Verify deployment names match exactly
- Check API key is valid
- Ensure sufficient quota

**Issue**: Cosmos DB connection timeouts
- Verify endpoint URL includes https:// and :443/
- Check firewall settings allow Azure services
- Verify using primary master key

### Frontend Issues

**Issue**: Build fails
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

**Issue**: Authentication not working
- Verify B2C redirect URIs match exactly
- Check client ID is correct
- Ensure user flows exist

**Issue**: API calls failing
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check CORS settings in Function App
- Verify JWT tokens are being sent

---

## Production Checklist

### Before Launch
- [ ] All Azure resources provisioned
- [ ] Environment variables configured
- [ ] Azure AD B2C tenant created
- [ ] User flows configured
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Custom domain configured (optional)
- [ ] SSL certificates installed
- [ ] Monitoring dashboards created
- [ ] Cost alerts configured
- [ ] Backup strategy implemented

### After Launch
- [ ] Monitor Application Insights
- [ ] Check error rates
- [ ] Verify user signups working
- [ ] Test all critical paths
- [ ] Monitor costs
- [ ] Gather user feedback
- [ ] Plan iterations

---

## Cost Estimates

### Monthly Azure Costs (Production)

**Small Scale** (100 users, 1K queries/month):
- Azure OpenAI: ~$30
- Cosmos DB: ~$25
- Functions: ~$5
- Storage: ~$5
- Search: ~$75
- Other: ~$10
**Total**: ~**$150/month**

**Medium Scale** (1K users, 10K queries/month):
- Azure OpenAI: ~$200
- Cosmos DB: ~$100
- Functions: ~$20
- Storage: ~$20
- Search: ~$150
- Other: ~$20
**Total**: ~**$510/month**

**Large Scale** (10K users, 100K queries/month):
- Azure OpenAI: ~$1,500
- Cosmos DB: ~$500
- Functions: ~$100
- Storage: ~$100
- Search: ~$250
- Other: ~$50
**Total**: ~**$2,500/month**

### Vercel Costs
- **Hobby**: Free (personal projects)
- **Pro**: $20/month (production apps)
- **Enterprise**: Custom pricing

---

## Support Resources

### Azure
- [Azure Portal](https://portal.azure.com)
- [Azure Documentation](https://docs.microsoft.com/azure)
- [Azure Support](https://azure.microsoft.com/support)

### Vercel
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

### Application
- Application Insights: Monitor logs
- Cosmos DB Data Explorer: View data
- Azure Storage Explorer: Browse files

---

## 🎉 Deployment Complete!

Once deployed, your platform will be:
- ✅ Accessible globally
- ✅ Automatically scaling
- ✅ Fully monitored
- ✅ Highly available
- ✅ Production-ready

**Next**: Monitor, iterate, and grow! 🚀

---

*For questions, check the 22 documentation files or Application Insights logs.*

