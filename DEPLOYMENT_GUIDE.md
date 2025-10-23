# StratOS Platform - Azure Deployment Guide

## 🚀 **Quick Start Deployment**

### **Prerequisites**
- Azure CLI installed and logged in
- GitHub repository with code
- Node.js 18+ installed locally

### **1. Automated Deployment (Recommended)**

```bash
# Make the deployment script executable
chmod +x azure-deploy.sh

# Run the automated deployment
./azure-deploy.sh
```

### **2. Manual Deployment Steps**

#### **Step 1: Create Azure Resources**

```bash
# Login to Azure
az login

# Create resource group
az group create --name stratos-rg --location "East US"

# Create storage account
az storage account create \
    --name stratosstorage \
    --resource-group stratos-rg \
    --location "East US" \
    --sku Standard_LRS

# Create Cosmos DB
az cosmosdb create \
    --name stratos-cosmos \
    --resource-group stratos-rg \
    --locations regionName="East US" failoverPriority=0
```

#### **Step 2: Set Up Database**

```bash
# Create database
az cosmosdb sql database create \
    --account-name stratos-cosmos \
    --resource-group stratos-rg \
    --name stratos

# Create containers
az cosmosdb sql container create \
    --account-name stratos-cosmos \
    --resource-group stratos-rg \
    --database-name stratos \
    --name stratos_config \
    --partition-key-path "/id"

az cosmosdb sql container create \
    --account-name stratos-cosmos \
    --resource-group stratos-rg \
    --database-name stratos \
    --name clients \
    --partition-key-path "/id"

az cosmosdb sql container create \
    --account-name stratos-cosmos \
    --resource-group stratos-rg \
    --database-name stratos \
    --name audit_logs \
    --partition-key-path "/timestamp"
```

#### **Step 3: Deploy Frontend (Azure Static Web Apps)**

```bash
# Create Static Web App
az staticwebapp create \
    --name stratos-frontend \
    --resource-group stratos-rg \
    --source https://github.com/jmengel10/stratos-platform \
    --location "East US" \
    --branch master \
    --app-location "frontend" \
    --api-location "backend" \
    --output-location ".next"
```

#### **Step 4: Deploy Backend (Azure Functions)**

```bash
# Create Function App
az functionapp create \
    --name stratos-backend \
    --resource-group stratos-rg \
    --consumption-plan-location "East US" \
    --runtime node \
    --runtime-version 18 \
    --functions-version 4

# Get connection strings
COSMOS_ENDPOINT=$(az cosmosdb show --name stratos-cosmos --resource-group stratos-rg --query documentEndpoint -o tsv)
COSMOS_KEY=$(az cosmosdb keys list --name stratos-cosmos --resource-group stratos-rg --query primaryMasterKey -o tsv)

# Configure app settings
az functionapp config appsettings set \
    --name stratos-backend \
    --resource-group stratos-rg \
    --settings \
        COSMOS_ENDPOINT=$COSMOS_ENDPOINT \
        COSMOS_KEY=$COSMOS_KEY \
        COSMOS_DATABASE_ID=stratos \
        NODE_ENV=production
```

## 🔧 **Environment Configuration**

### **Required Environment Variables**

#### **Frontend (Static Web App)**
```bash
NEXT_PUBLIC_APP_NAME=StratOS
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=https://your-app.azurestaticapps.net
NODE_ENV=production
```

#### **Backend (Function App)**
```bash
COSMOS_ENDPOINT=https://stratos-cosmos.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key
COSMOS_DATABASE_ID=stratos
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
NODE_ENV=production
```

### **Setting Environment Variables**

#### **For Static Web App:**
1. Go to Azure Portal
2. Navigate to your Static Web App
3. Go to Configuration
4. Add application settings

#### **For Function App:**
```bash
az functionapp config appsettings set \
    --name stratos-backend \
    --resource-group stratos-rg \
    --settings \
        JWT_SECRET=your-secret-key \
        OPENAI_API_KEY=your-openai-key \
        STRIPE_SECRET_KEY=your-stripe-key
```

## 🔄 **CI/CD Pipeline Setup**

### **GitHub Actions**

The repository includes a GitHub Actions workflow (`.github/workflows/azure-deploy.yml`) that automatically deploys on push to master.

#### **Required GitHub Secrets:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN`
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
- `COSMOS_ENDPOINT`
- `COSMOS_KEY`
- `JWT_SECRET`
- `OPENAI_API_KEY`

### **Azure DevOps**

Use the `azure-pipelines.yml` file to set up Azure DevOps CI/CD.

## 📊 **Monitoring & Health Checks**

### **Application Insights**
```bash
# Create Application Insights
az monitor app-insights component create \
    --app stratos-insights \
    --location "East US" \
    --resource-group stratos-rg
```

### **Health Check Endpoints**
- Frontend: `https://your-app.azurestaticapps.net/api/health`
- Backend: `https://stratos-backend.azurewebsites.net/api/health`

## 🔒 **Security Configuration**

### **HTTPS & SSL**
- Static Web Apps automatically provide HTTPS
- Function Apps use HTTPS by default

### **CORS Configuration**
```bash
# Configure CORS for Function App
az functionapp cors add \
    --name stratos-backend \
    --resource-group stratos-rg \
    --allowed-origins https://your-app.azurestaticapps.net
```

### **Authentication**
- Configure Azure AD B2C for authentication
- Set up JWT token validation
- Implement rate limiting

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs
az staticwebapp logs show --name stratos-frontend --resource-group stratos-rg
```

#### **Function App Issues**
```bash
# Check function logs
az functionapp logs tail --name stratos-backend --resource-group stratos-rg
```

#### **Database Connection Issues**
```bash
# Test Cosmos DB connection
az cosmosdb show --name stratos-cosmos --resource-group stratos-rg
```

### **Performance Optimization**

#### **CDN Configuration**
```bash
# Enable CDN for Static Web App
az cdn profile create \
    --name stratos-cdn \
    --resource-group stratos-rg \
    --sku Standard_Microsoft
```

#### **Caching**
- Configure Redis Cache for session storage
- Set up CDN for static assets
- Implement database connection pooling

## 📈 **Scaling**

### **Auto-scaling Configuration**
```bash
# Configure auto-scaling for Function App
az monitor autoscale create \
    --resource stratos-backend \
    --resource-group stratos-rg \
    --resource-type Microsoft.Web/sites \
    --name stratos-autoscale \
    --min-count 1 \
    --max-count 10 \
    --count 2
```

### **Database Scaling**
- Configure Cosmos DB auto-scaling
- Set up read replicas
- Implement connection pooling

## 🔍 **Monitoring & Alerts**

### **Application Insights Queries**
```kusto
// Error rate
requests
| where timestamp > ago(1h)
| summarize errorRate = countif(success == false) / count() * 100

// Response time
requests
| where timestamp > ago(1h)
| summarize avg(duration), max(duration), min(duration)
```

### **Alert Rules**
```bash
# Create alert for high error rate
az monitor metrics alert create \
    --name "High Error Rate" \
    --resource-group stratos-rg \
    --scopes /subscriptions/{subscription-id}/resourceGroups/stratos-rg \
    --condition "count 'Microsoft.Web/sites' 'Http5xx' > 10" \
    --description "Alert when error rate is high"
```

## 🎯 **Production Checklist**

- [ ] All environment variables configured
- [ ] HTTPS/SSL certificates in place
- [ ] CORS properly configured
- [ ] Authentication working
- [ ] Database connections tested
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security scan passed
- [ ] Documentation updated

## 📞 **Support**

For deployment issues:
1. Check Azure Portal logs
2. Review GitHub Actions logs
3. Verify environment variables
4. Test database connectivity
5. Check network connectivity

## 🔗 **Useful Links**

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/)
