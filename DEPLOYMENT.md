# 🚀 Stratos Deployment Guide

This guide covers deploying the Stratos application to Azure, Vercel, and GitHub.

## 📋 Prerequisites

### Required Tools
- Node.js 18+
- npm or yarn
- Git
- Azure CLI (for Azure deployment)
- Vercel CLI (for Vercel deployment)

### Required Accounts
- GitHub account
- Azure account with subscription
- Vercel account

## 🔧 Environment Setup

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd stratos-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file:
```bash
cp env.example .env.local
```

Update the environment variables in `.env.local`:
```bash
# Azure Configuration
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_REDIRECT_URI=https://your-app.vercel.app/auth/callback

# API Configuration
API_BASE_URL=https://your-api-url.azurewebsites.net
NEXT_PUBLIC_API_URL=https://your-api-url.azurewebsites.net

# Database
COSMOS_DB_ENDPOINT=https://your-cosmosdb.documents.azure.com:443/
COSMOS_DB_KEY=your_cosmos_db_key
COSMOS_DB_DATABASE_ID=stratos
COSMOS_DB_CONTAINER_ID=users

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_VERSION=2024-02-15-preview
```

## 🚀 Deployment Options

### Option 1: Vercel Deployment (Recommended)

#### Automatic Deployment
1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all required environment variables
   - Set production, preview, and development values

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Get your live URL from the Vercel dashboard

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Azure Static Web Apps

#### Prerequisites
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login
```

#### Create Azure Resources
```bash
# Create resource group
az group create --name stratos-rg --location eastus

# Create Static Web App
az staticwebapp create \
  --name stratos-app \
  --resource-group stratos-rg \
  --source https://github.com/your-username/stratos \
  --location eastus \
  --branch main \
  --app-location "/frontend" \
  --output-location "out"
```

#### Configure GitHub Secrets
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: Get from Azure portal
   - `AZURE_CREDENTIALS`: Service principal credentials

#### Deploy
```bash
# Build and export
npm run build
npm run export

# Deploy to Azure
az staticwebapp deploy \
  --name stratos-app \
  --resource-group stratos-rg \
  --source . \
  --output-location out
```

### Option 3: Azure Container Registry + Container Instances

#### Create Azure Resources
```bash
# Create resource group
az group create --name stratos-rg --location eastus

# Create Container Registry
az acr create \
  --resource-group stratos-rg \
  --name stratosregistry \
  --sku Basic \
  --admin-enabled true

# Get ACR credentials
az acr credential show --name stratosregistry
```

#### Configure GitHub Secrets
Add these secrets to your GitHub repository:
- `AZURE_CREDENTIALS`: Service principal credentials
- `ACR_USERNAME`: Container registry username
- `ACR_PASSWORD`: Container registry password

#### Deploy
The GitHub Actions workflow will automatically:
1. Build Docker image
2. Push to Azure Container Registry
3. Deploy to Azure Container Instances

## 🔄 Continuous Deployment

### GitHub Actions
The repository includes GitHub Actions workflows for:
- **Azure Static Web Apps**: `.github/workflows/azure-static-web-apps.yml`
- **Vercel Deployment**: `.github/workflows/vercel-deploy.yml`
- **Azure Container Registry**: `.github/workflows/azure-container-deploy.yml`

### Automatic Triggers
- **Push to main**: Deploys to production
- **Pull Request**: Deploys to preview environment
- **Manual**: Use GitHub Actions "Run workflow" button

## 🛠️ Local Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Run Tests
```bash
npm run lint
npm run type-check
```

## 📊 Monitoring and Analytics

### Vercel Analytics
- Built-in analytics in Vercel dashboard
- Performance monitoring
- User analytics

### Azure Monitor
- Application Insights integration
- Performance monitoring
- Error tracking

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different values for development, staging, and production
- Rotate secrets regularly

### HTTPS
- All deployments use HTTPS by default
- SSL certificates are automatically managed

### Authentication
- Azure AD B2C integration
- MSAL (Microsoft Authentication Library)
- Secure token handling

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables
- Ensure all required variables are set
- Check variable names and values
- Verify environment-specific settings

#### Azure Deployment Issues
```bash
# Check Azure CLI login
az account show

# Verify resource group exists
az group show --name stratos-rg

# Check Static Web App status
az staticwebapp show --name stratos-app --resource-group stratos-rg
```

#### Vercel Deployment Issues
```bash
# Check Vercel CLI
vercel --version

# Verify project configuration
vercel project ls

# Check deployment logs
vercel logs <deployment-url>
```

## 📞 Support

For deployment issues:
1. Check the GitHub Actions logs
2. Review the deployment documentation
3. Contact the development team
4. Create an issue in the GitHub repository

## 🎯 Next Steps

After successful deployment:
1. Configure custom domain (optional)
2. Set up monitoring and alerts
3. Configure backup strategies
4. Set up staging environment
5. Implement CI/CD best practices
