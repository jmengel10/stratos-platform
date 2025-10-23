#!/bin/bash

# StratOS Platform - Azure Deployment Script
# This script deploys the StratOS platform to Azure

set -e

echo "🚀 Starting StratOS Platform Azure Deployment..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first:"
    echo "az login"
    exit 1
fi

# Configuration
RESOURCE_GROUP="stratos-rg"
LOCATION="East US"
FRONTEND_APP_NAME="stratos-frontend"
BACKEND_APP_NAME="stratos-backend"
STORAGE_ACCOUNT="stratosstorage"
COSMOS_DB="stratos-cosmos"

echo "📋 Deployment Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  Frontend App: $FRONTEND_APP_NAME"
echo "  Backend App: $BACKEND_APP_NAME"
echo "  Storage Account: $STORAGE_ACCOUNT"
echo "  Cosmos DB: $COSMOS_DB"

# Create resource group
echo "🏗️ Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create storage account
echo "💾 Creating storage account..."
az storage account create \
    --name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku Standard_LRS

# Create Cosmos DB
echo "🗄️ Creating Cosmos DB..."
az cosmosdb create \
    --name $COSMOS_DB \
    --resource-group $RESOURCE_GROUP \
    --locations regionName="$LOCATION" failoverPriority=0 isZoneRedundant=False

# Create Cosmos DB database
echo "📊 Creating Cosmos DB database..."
az cosmosdb sql database create \
    --account-name $COSMOS_DB \
    --resource-group $RESOURCE_GROUP \
    --name stratos

# Create Cosmos DB containers
echo "📦 Creating Cosmos DB containers..."
az cosmosdb sql container create \
    --account-name $COSMOS_DB \
    --resource-group $RESOURCE_GROUP \
    --database-name stratos \
    --name stratos_config \
    --partition-key-path "/id"

az cosmosdb sql container create \
    --account-name $COSMOS_DB \
    --resource-group $RESOURCE_GROUP \
    --database-name stratos \
    --name clients \
    --partition-key-path "/id"

az cosmosdb sql container create \
    --account-name $COSMOS_DB \
    --resource-group $RESOURCE_GROUP \
    --database-name stratos \
    --name audit_logs \
    --partition-key-path "/timestamp"

# Create Static Web App
echo "🌐 Creating Azure Static Web App..."
az staticwebapp create \
    --name $FRONTEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --source https://github.com/jmengel10/stratos-platform \
    --location "$LOCATION" \
    --branch master \
    --app-location "frontend" \
    --api-location "backend" \
    --output-location ".next"

# Create Function App
echo "⚡ Creating Azure Function App..."
az functionapp create \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --consumption-plan-location "$LOCATION" \
    --runtime node \
    --runtime-version 18 \
    --functions-version 4

# Get connection strings
echo "🔑 Getting connection strings..."
COSMOS_ENDPOINT=$(az cosmosdb show --name $COSMOS_DB --resource-group $RESOURCE_GROUP --query documentEndpoint -o tsv)
COSMOS_KEY=$(az cosmosdb keys list --name $COSMOS_DB --resource-group $RESOURCE_GROUP --query primaryMasterKey -o tsv)

# Configure app settings
echo "⚙️ Configuring app settings..."
az functionapp config appsettings set \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        COSMOS_ENDPOINT=$COSMOS_ENDPOINT \
        COSMOS_KEY=$COSMOS_KEY \
        COSMOS_DATABASE_ID=stratos \
        NODE_ENV=production

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure GitHub Actions secrets:"
echo "   - AZURE_STATIC_WEB_APPS_API_TOKEN"
echo "   - COSMOS_ENDPOINT: $COSMOS_ENDPOINT"
echo "   - COSMOS_KEY: $COSMOS_KEY"
echo "   - COSMOS_DATABASE_ID: stratos"
echo ""
echo "2. Set up environment variables in Azure Static Web App"
echo "3. Configure custom domain (optional)"
echo "4. Set up monitoring and alerts"
echo ""
echo "🔗 Useful Links:"
echo "  - Azure Portal: https://portal.azure.com"
echo "  - Resource Group: $RESOURCE_GROUP"
echo "  - Frontend App: $FRONTEND_APP_NAME"
echo "  - Backend App: $BACKEND_APP_NAME"
