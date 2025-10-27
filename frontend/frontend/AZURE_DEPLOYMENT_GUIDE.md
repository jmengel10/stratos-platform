# Azure Static Web Apps Deployment Guide

This guide will help you deploy the StratOS platform to Azure Static Web Apps.

## Prerequisites

- Azure subscription
- GitHub repository with the StratOS platform code
- Azure CLI installed (optional, for manual deployment)

## Method 1: Azure Portal Deployment (Recommended)

### Step 1: Create Azure Static Web App

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Click "Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"

2. **Configure Basic Settings**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or select existing (e.g., `stratos-rg`)
   - **Name**: `stratos-platform` (must be globally unique)
   - **Plan type**: Free
   - **Region**: Choose your preferred region

3. **Configure Source**
   - **Source**: GitHub
   - **GitHub account**: Sign in to your GitHub account
   - **Organization**: Select your organization
   - **Repository**: `stratos-platform`
   - **Branch**: `master`

4. **Configure Build Details**
   - **Build Presets**: Custom
   - **App location**: `/frontend/frontend`
   - **API location**: Leave empty (no API in this deployment)
   - **Output location**: `.next`

5. **Review and Create**
   - Click "Review + create"
   - Click "Create"
   - Wait for deployment to complete (5-10 minutes)

### Step 2: Configure GitHub Actions

The deployment will automatically create a GitHub Actions workflow. You'll need to add the deployment token as a secret:

1. **Get the Deployment Token**
   - In Azure Portal, go to your Static Web App
   - Go to "Overview" → "Manage deployment token"
   - Copy the token

2. **Add GitHub Secret**
   - Go to your GitHub repository
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Paste the deployment token
   - Click "Add secret"

### Step 3: Configure Environment Variables

1. **In Azure Portal**
   - Go to your Static Web App
   - Go to "Configuration" → "Application settings"
   - Add the following environment variables:

```bash
# Next.js Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.azurestaticapps.net
NODE_ENV=production

# Azure AD B2C Configuration (if using authentication)
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=your-tenant-name
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN=your-tenant-name.b2clogin.com
```

## Method 2: Azure CLI Deployment

### Step 1: Install Azure CLI

```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# macOS
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Step 2: Login to Azure

```bash
az login
```

### Step 3: Create Static Web App

```bash
# Create resource group
az group create --name stratos-rg --location "East US"

# Create static web app
az staticwebapp create \
  --name stratos-platform \
  --resource-group stratos-rg \
  --source https://github.com/jmengel10/stratos-platform \
  --location "East US" \
  --branch master \
  --app-location "frontend/frontend" \
  --output-location ".next"
```

### Step 4: Get Deployment Token

```bash
# Get the deployment token
az staticwebapp secrets list \
  --name stratos-platform \
  --resource-group stratos-rg \
  --query "properties.apiKey" \
  --output tsv
```

## Method 3: GitHub Actions Deployment

### Step 1: Create GitHub Actions Workflow

The workflow file is already created at `.github/workflows/azure-static-web-apps.yml`.

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Go to Settings → Secrets and variables → Actions
3. Add the following secrets:

```bash
AZURE_STATIC_WEB_APPS_API_TOKEN=your-deployment-token
```

### Step 3: Push to Trigger Deployment

```bash
git add .
git commit -m "Deploy to Azure Static Web Apps"
git push origin master
```

## Post-Deployment Configuration

### Step 1: Custom Domain (Optional)

1. **In Azure Portal**
   - Go to your Static Web App
   - Go to "Custom domains"
   - Click "Add"
   - Enter your domain name
   - Follow the DNS configuration instructions

### Step 2: Configure Authentication (Optional)

If you're using Azure AD B2C authentication:

1. **Update Redirect URIs**
   - In Azure AD B2C, go to your app registration
   - Go to "Authentication"
   - Add your production URL:
     ```
     https://your-app-name.azurestaticapps.net/api/auth/callback/azure-ad-b2c
     ```

2. **Update Environment Variables**
   - In Azure Portal, update the environment variables with your production URLs

### Step 3: Configure Monitoring

1. **Application Insights**
   - In Azure Portal, go to your Static Web App
   - Go to "Monitoring" → "Application Insights"
   - Enable Application Insights

2. **Alerts**
   - Set up alerts for availability and performance
   - Configure email notifications

## Troubleshooting

### Common Issues

**Issue**: Build fails with "App location not found"
- **Solution**: Verify the app location path is correct (`/frontend/frontend`)

**Issue**: Static files not loading
- **Solution**: Check the output location is set to `.next`

**Issue**: Environment variables not working
- **Solution**: Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access

**Issue**: Authentication not working
- **Solution**: Verify redirect URIs are correctly configured in Azure AD B2C

### Build Logs

To view build logs:
1. Go to your GitHub repository
2. Go to Actions tab
3. Click on the latest workflow run
4. View the build logs

### Azure Portal Logs

To view Azure logs:
1. Go to Azure Portal
2. Go to your Static Web App
3. Go to "Monitoring" → "Logs"
4. Run queries to debug issues

## Performance Optimization

### Step 1: Enable CDN

Azure Static Web Apps automatically includes a CDN. No additional configuration needed.

### Step 2: Optimize Images

- Use Next.js Image component for automatic optimization
- Compress images before upload
- Use appropriate image formats (WebP, AVIF)

### Step 3: Enable Compression

- Gzip compression is automatically enabled
- Brotli compression is available for supported browsers

## Security Configuration

### Step 1: HTTPS

HTTPS is automatically enabled and enforced.

### Step 2: Security Headers

The `staticwebapp.config.json` file includes security headers:

```json
{
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
  }
}
```

### Step 3: Authentication

Configure Azure AD B2C for secure authentication (see Azure setup guide).

## Monitoring and Analytics

### Step 1: Application Insights

1. Enable Application Insights in Azure Portal
2. Monitor performance metrics
3. Set up alerts for errors

### Step 2: Custom Analytics

Add your preferred analytics solution (Google Analytics, etc.) to the Next.js app.

## Cost Management

### Free Tier Limits

- 100 GB bandwidth per month
- 1 GB storage
- 2,000 function executions per month

### Upgrade to Standard

If you exceed free tier limits:
1. Go to Azure Portal
2. Go to your Static Web App
3. Go to "Pricing"
4. Upgrade to Standard plan

## Backup and Recovery

### Step 1: Source Code Backup

Your source code is already backed up in GitHub.

### Step 2: Configuration Backup

Export your environment variables and configuration:
```bash
az staticwebapp config appsettings list \
  --name stratos-platform \
  --resource-group stratos-rg \
  --output table
```

## Support and Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Azure Support](https://azure.microsoft.com/en-us/support/)

---

**Deployment Complete!** Your StratOS platform is now live on Azure Static Web Apps.

**Live URL**: https://your-app-name.azurestaticapps.net
