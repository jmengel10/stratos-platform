#!/bin/bash

# StratOS Platform - Azure Infrastructure Setup Script
# This script creates all required Azure resources for the platform

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "StratOS Platform - Azure Setup"
echo "=========================================="
echo ""

# Configuration variables
RESOURCE_GROUP="stratos-rg"
LOCATION="eastus"
APP_NAME="stratos-platform"
TIMESTAMP=$(date +%s)
UNIQUE_SUFFIX="${TIMESTAMP: -6}"

# Derived resource names (must be globally unique)
OPENAI_NAME="${APP_NAME}-openai-${UNIQUE_SUFFIX}"
COSMOS_NAME="${APP_NAME}-cosmos-${UNIQUE_SUFFIX}"
STORAGE_NAME="stratos${UNIQUE_SUFFIX}"  # Storage names can't have hyphens
SEARCH_NAME="${APP_NAME}-search-${UNIQUE_SUFFIX}"
KEYVAULT_NAME="stratos-kv-${UNIQUE_SUFFIX}"
APPINSIGHTS_NAME="${APP_NAME}-insights"
FUNCTIONAPP_NAME="${APP_NAME}-func-${UNIQUE_SUFFIX}"
APPSERVICE_PLAN="${APP_NAME}-plan"

# Output file for connection strings
OUTPUT_FILE="./azure-resources.txt"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
echo "Checking Azure CLI login status..."
az account show &> /dev/null || {
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Please login:${NC}"
    az login
}

# Get subscription info
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo -e "${GREEN}✅ Logged in to Azure${NC}"
echo "   Subscription: $SUBSCRIPTION_NAME"
echo "   ID: $SUBSCRIPTION_ID"
echo ""

# Create Resource Group
echo "Creating Resource Group..."
if az group exists --name $RESOURCE_GROUP | grep -q "true"; then
    echo -e "${YELLOW}⚠️  Resource Group '$RESOURCE_GROUP' already exists${NC}"
else
    az group create --name $RESOURCE_GROUP --location $LOCATION
    echo -e "${GREEN}✅ Resource Group created${NC}"
fi
echo ""

# Initialize output file
echo "StratOS Platform - Azure Resources" > $OUTPUT_FILE
echo "Generated: $(date)" >> $OUTPUT_FILE
echo "======================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Create Azure OpenAI
echo "Creating Azure OpenAI service..."
if az cognitiveservices account show --name $OPENAI_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  OpenAI service already exists${NC}"
else
    az cognitiveservices account create \
        --name $OPENAI_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --kind OpenAI \
        --sku S0 \
        --custom-domain $OPENAI_NAME \
        --yes
    echo -e "${GREEN}✅ Azure OpenAI service created${NC}"
fi

# Get OpenAI details
OPENAI_ENDPOINT=$(az cognitiveservices account show --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query properties.endpoint -o tsv)
OPENAI_KEY=$(az cognitiveservices account keys list --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query key1 -o tsv)

echo "AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT" >> $OUTPUT_FILE
echo "AZURE_OPENAI_KEY=$OPENAI_KEY" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Deploy OpenAI models
echo "Deploying GPT-4 model..."
az cognitiveservices account deployment create \
    --name $OPENAI_NAME \
    --resource-group $RESOURCE_GROUP \
    --deployment-name gpt-4 \
    --model-name gpt-4 \
    --model-version "turbo-2024-04-09" \
    --model-format OpenAI \
    --sku-capacity 10 \
    --sku-name "Standard" || echo -e "${YELLOW}⚠️  GPT-4 deployment may already exist${NC}"

echo "Deploying text-embedding-ada-002 model..."
az cognitiveservices account deployment create \
    --name $OPENAI_NAME \
    --resource-group $RESOURCE_GROUP \
    --deployment-name text-embedding-ada-002 \
    --model-name text-embedding-ada-002 \
    --model-version "2" \
    --model-format OpenAI \
    --sku-capacity 10 \
    --sku-name "Standard" || echo -e "${YELLOW}⚠️  Embedding deployment may already exist${NC}"

echo "AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4" >> $OUTPUT_FILE
echo "AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo ""

# Create Cosmos DB
echo "Creating Cosmos DB account..."
if az cosmosdb show --name $COSMOS_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Cosmos DB account already exists${NC}"
else
    az cosmosdb create \
        --name $COSMOS_NAME \
        --resource-group $RESOURCE_GROUP \
        --locations regionName=$LOCATION failoverPriority=0 \
        --default-consistency-level Session \
        --enable-automatic-failover false
    echo -e "${GREEN}✅ Cosmos DB account created${NC}"
fi

# Create Cosmos database
echo "Creating Cosmos database 'stratos'..."
az cosmosdb sql database create \
    --account-name $COSMOS_NAME \
    --resource-group $RESOURCE_GROUP \
    --name stratos || echo -e "${YELLOW}⚠️  Database may already exist${NC}"

# Create Cosmos containers
CONTAINERS=("users" "tenants" "conversations" "outputs" "prompts")
for CONTAINER in "${CONTAINERS[@]}"; do
    echo "Creating container '$CONTAINER'..."
    az cosmosdb sql container create \
        --account-name $COSMOS_NAME \
        --resource-group $RESOURCE_GROUP \
        --database-name stratos \
        --name $CONTAINER \
        --partition-key-path "/tenantId" \
        --throughput 400 || echo -e "${YELLOW}⚠️  Container may already exist${NC}"
done

# Get Cosmos connection details
COSMOS_ENDPOINT=$(az cosmosdb show --name $COSMOS_NAME --resource-group $RESOURCE_GROUP --query documentEndpoint -o tsv)
COSMOS_KEY=$(az cosmosdb keys list --name $COSMOS_NAME --resource-group $RESOURCE_GROUP --query primaryMasterKey -o tsv)

echo "COSMOS_DB_ENDPOINT=$COSMOS_ENDPOINT" >> $OUTPUT_FILE
echo "COSMOS_DB_KEY=$COSMOS_KEY" >> $OUTPUT_FILE
echo "COSMOS_DB_DATABASE_NAME=stratos" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo ""

# Create Storage Account
echo "Creating Storage Account..."
if az storage account show --name $STORAGE_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Storage Account already exists${NC}"
else
    az storage account create \
        --name $STORAGE_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku Standard_LRS \
        --kind StorageV2
    echo -e "${GREEN}✅ Storage Account created${NC}"
fi

# Get storage connection string
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string --name $STORAGE_NAME --resource-group $RESOURCE_GROUP --query connectionString -o tsv)

# Create blob containers
BLOB_CONTAINERS=("documents" "exports" "temp")
for CONTAINER in "${BLOB_CONTAINERS[@]}"; do
    echo "Creating blob container '$CONTAINER'..."
    az storage container create \
        --name $CONTAINER \
        --connection-string "$STORAGE_CONNECTION_STRING" || echo -e "${YELLOW}⚠️  Container may already exist${NC}"
done

echo "AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo ""

# Create Cognitive Search
echo "Creating Cognitive Search service..."
if az search service show --name $SEARCH_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Search service already exists${NC}"
else
    az search service create \
        --name $SEARCH_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku basic
    echo -e "${GREEN}✅ Cognitive Search service created${NC}"
fi

# Get Search details
SEARCH_ENDPOINT="https://${SEARCH_NAME}.search.windows.net"
SEARCH_KEY=$(az search admin-key show --service-name $SEARCH_NAME --resource-group $RESOURCE_GROUP --query primaryKey -o tsv)

echo "AZURE_SEARCH_ENDPOINT=$SEARCH_ENDPOINT" >> $OUTPUT_FILE
echo "AZURE_SEARCH_KEY=$SEARCH_KEY" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo ""

# Create Key Vault
echo "Creating Key Vault..."
if az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Key Vault already exists${NC}"
else
    az keyvault create \
        --name $KEYVAULT_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku standard
    echo -e "${GREEN}✅ Key Vault created${NC}"
fi

KEYVAULT_URI=$(az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP --query properties.vaultUri -o tsv)

echo "AZURE_KEYVAULT_URI=$KEYVAULT_URI" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo ""

# Create Application Insights
echo "Creating Application Insights..."
if az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Application Insights already exists${NC}"
else
    az monitor app-insights component create \
        --app $APPINSIGHTS_NAME \
        --location $LOCATION \
        --resource-group $RESOURCE_GROUP \
        --application-type web
    echo -e "${GREEN}✅ Application Insights created${NC}"
fi

APPINSIGHTS_KEY=$(az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP --query instrumentationKey -o tsv)
APPINSIGHTS_CONNECTION_STRING=$(az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP --query connectionString -o tsv)

echo "APPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY" >> $OUTPUT_FILE
echo "APPINSIGHTS_CONNECTION_STRING=$APPINSIGHTS_CONNECTION_STRING" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo ""

# Create App Service Plan (Consumption)
echo "Creating App Service Plan for Functions..."
if az functionapp plan show --name $APPSERVICE_PLAN --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  App Service Plan already exists${NC}"
else
    az functionapp plan create \
        --name $APPSERVICE_PLAN \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku Y1 \
        --is-linux false
    echo -e "${GREEN}✅ App Service Plan created${NC}"
fi
echo ""

# Create Function App
echo "Creating Function App..."
if az functionapp show --name $FUNCTIONAPP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Function App already exists${NC}"
else
    az functionapp create \
        --name $FUNCTIONAPP_NAME \
        --resource-group $RESOURCE_GROUP \
        --plan $APPSERVICE_PLAN \
        --runtime node \
        --runtime-version 18 \
        --functions-version 4 \
        --storage-account $STORAGE_NAME
    echo -e "${GREEN}✅ Function App created${NC}"
fi

FUNCTION_APP_URL="https://${FUNCTIONAPP_NAME}.azurewebsites.net"

echo "FUNCTION_APP_NAME=$FUNCTIONAPP_NAME" >> $OUTPUT_FILE
echo "FUNCTION_APP_URL=$FUNCTION_APP_URL" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo ""

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Azure Infrastructure Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo ""
echo "Created Resources:"
echo "  - Azure OpenAI: $OPENAI_NAME"
echo "  - Cosmos DB: $COSMOS_NAME"
echo "  - Storage Account: $STORAGE_NAME"
echo "  - Cognitive Search: $SEARCH_NAME"
echo "  - Key Vault: $KEYVAULT_NAME"
echo "  - Application Insights: $APPINSIGHTS_NAME"
echo "  - Function App: $FUNCTIONAPP_NAME"
echo ""
echo -e "${YELLOW}📋 Connection strings saved to: $OUTPUT_FILE${NC}"
echo ""
echo "Next Steps:"
echo "  1. Review infrastructure/azure-setup.md for Azure AD B2C setup"
echo "  2. Copy values from $OUTPUT_FILE to .env files"
echo "  3. Run ./validate-setup.sh to verify all resources"
echo ""

