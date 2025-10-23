#!/bin/bash

# StratOS Platform - Azure Setup Validation Script
# This script validates that all Azure resources are properly configured

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="stratos-rg"

# Counters
SUCCESS_COUNT=0
FAIL_COUNT=0
WARNING_COUNT=0

# Helper functions
print_header() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
    echo ""
}

print_check() {
    echo -n "Checking $1... "
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((SUCCESS_COUNT++))
}

print_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAIL_COUNT++))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNING_COUNT++))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Load environment variables if .env exists
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
    print_info "Loaded environment variables from .env"
elif [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    print_info "Loaded environment variables from .env"
else
    print_warning "No .env file found. Some tests will be skipped."
fi

print_header "StratOS - Azure Setup Validation"

# ============================================
# Check Azure CLI
# ============================================
print_header "1. Azure CLI"

print_check "Azure CLI installation"
if command -v az &> /dev/null; then
    AZ_VERSION=$(az version --query '"azure-cli"' -o tsv)
    print_success "Azure CLI is installed (version $AZ_VERSION)"
else
    print_fail "Azure CLI is not installed"
    echo "   Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

print_check "Azure login status"
if az account show &> /dev/null; then
    SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
    SUBSCRIPTION_ID=$(az account show --query id -o tsv)
    print_success "Logged in to Azure"
    print_info "   Subscription: $SUBSCRIPTION_NAME"
    print_info "   ID: $SUBSCRIPTION_ID"
else
    print_fail "Not logged in to Azure"
    echo "   Run: az login"
    exit 1
fi

# ============================================
# Check Resource Group
# ============================================
print_header "2. Resource Group"

print_check "Resource Group existence"
if az group exists --name $RESOURCE_GROUP | grep -q "true"; then
    LOCATION=$(az group show --name $RESOURCE_GROUP --query location -o tsv)
    print_success "Resource Group '$RESOURCE_GROUP' exists in $LOCATION"
else
    print_fail "Resource Group '$RESOURCE_GROUP' not found"
    echo "   Run: ./setup.sh"
    exit 1
fi

# ============================================
# Check Azure OpenAI
# ============================================
print_header "3. Azure OpenAI"

# Find OpenAI service
OPENAI_NAME=$(az cognitiveservices account list --resource-group $RESOURCE_GROUP --query "[?kind=='OpenAI'].name | [0]" -o tsv)

if [ -z "$OPENAI_NAME" ]; then
    print_fail "No OpenAI service found in resource group"
else
    print_success "OpenAI service '$OPENAI_NAME' exists"
    
    # Check deployments
    print_check "GPT-4 deployment"
    if az cognitiveservices account deployment show \
        --name $OPENAI_NAME \
        --resource-group $RESOURCE_GROUP \
        --deployment-name gpt-4 &> /dev/null; then
        print_success "GPT-4 deployment exists"
    else
        print_warning "GPT-4 deployment not found"
    fi
    
    print_check "Embedding deployment"
    if az cognitiveservices account deployment show \
        --name $OPENAI_NAME \
        --resource-group $RESOURCE_GROUP \
        --deployment-name text-embedding-ada-002 &> /dev/null; then
        print_success "Embedding deployment exists"
    else
        print_warning "text-embedding-ada-002 deployment not found"
    fi
    
    # Test API connection
    if [ ! -z "$AZURE_OPENAI_ENDPOINT" ] && [ ! -z "$AZURE_OPENAI_KEY" ]; then
        print_check "OpenAI API connectivity"
        # Simple curl test (won't work without proper API call, but checks endpoint)
        if curl -s -o /dev/null -w "%{http_code}" "$AZURE_OPENAI_ENDPOINT" | grep -q "404\|401"; then
            print_success "Can reach OpenAI endpoint"
        else
            print_warning "Cannot verify OpenAI endpoint connectivity"
        fi
    else
        print_warning "OpenAI environment variables not set, skipping API test"
    fi
fi

# ============================================
# Check Cosmos DB
# ============================================
print_header "4. Cosmos DB"

COSMOS_NAME=$(az cosmosdb list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv)

if [ -z "$COSMOS_NAME" ]; then
    print_fail "No Cosmos DB account found in resource group"
else
    print_success "Cosmos DB account '$COSMOS_NAME' exists"
    
    # Check database
    print_check "Database 'stratos'"
    if az cosmosdb sql database show \
        --account-name $COSMOS_NAME \
        --resource-group $RESOURCE_GROUP \
        --name stratos &> /dev/null; then
        print_success "Database 'stratos' exists"
        
        # Check containers
        CONTAINERS=("users" "tenants" "conversations" "outputs" "prompts")
        for CONTAINER in "${CONTAINERS[@]}"; do
            print_check "Container '$CONTAINER'"
            if az cosmosdb sql container show \
                --account-name $COSMOS_NAME \
                --resource-group $RESOURCE_GROUP \
                --database-name stratos \
                --name $CONTAINER &> /dev/null; then
                print_success "Container '$CONTAINER' exists"
            else
                print_fail "Container '$CONTAINER' not found"
            fi
        done
    else
        print_fail "Database 'stratos' not found"
    fi
fi

# ============================================
# Check Storage Account
# ============================================
print_header "5. Storage Account"

STORAGE_NAME=$(az storage account list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv)

if [ -z "$STORAGE_NAME" ]; then
    print_fail "No Storage Account found in resource group"
else
    print_success "Storage Account '$STORAGE_NAME' exists"
    
    # Check blob containers
    if [ ! -z "$AZURE_STORAGE_CONNECTION_STRING" ]; then
        BLOB_CONTAINERS=("documents" "exports" "temp")
        for CONTAINER in "${BLOB_CONTAINERS[@]}"; do
            print_check "Blob container '$CONTAINER'"
            if az storage container exists \
                --name $CONTAINER \
                --connection-string "$AZURE_STORAGE_CONNECTION_STRING" \
                --query exists -o tsv | grep -q "true"; then
                print_success "Container '$CONTAINER' exists"
            else
                print_fail "Container '$CONTAINER' not found"
            fi
        done
    else
        print_warning "Storage connection string not set, skipping container checks"
    fi
fi

# ============================================
# Check Cognitive Search
# ============================================
print_header "6. Cognitive Search"

SEARCH_NAME=$(az search service list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv)

if [ -z "$SEARCH_NAME" ]; then
    print_fail "No Cognitive Search service found in resource group"
else
    print_success "Cognitive Search service '$SEARCH_NAME' exists"
    
    # Get search service status
    STATUS=$(az search service show --name $SEARCH_NAME --resource-group $RESOURCE_GROUP --query status -o tsv)
    if [ "$STATUS" == "running" ]; then
        print_success "Search service is running"
    else
        print_warning "Search service status: $STATUS"
    fi
fi

# ============================================
# Check Key Vault
# ============================================
print_header "7. Key Vault"

KEYVAULT_NAME=$(az keyvault list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv)

if [ -z "$KEYVAULT_NAME" ]; then
    print_fail "No Key Vault found in resource group"
else
    print_success "Key Vault '$KEYVAULT_NAME' exists"
    
    # Check access
    print_check "Key Vault access"
    if az keyvault secret list --vault-name $KEYVAULT_NAME &> /dev/null; then
        print_success "Can access Key Vault"
    else
        print_warning "Cannot access Key Vault (may need permissions)"
    fi
fi

# ============================================
# Check Application Insights
# ============================================
print_header "8. Application Insights"

APPINSIGHTS_NAME=$(az monitor app-insights component list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv)

if [ -z "$APPINSIGHTS_NAME" ]; then
    print_fail "No Application Insights found in resource group"
else
    print_success "Application Insights '$APPINSIGHTS_NAME' exists"
    
    INSTRUMENTATION_KEY=$(az monitor app-insights component show \
        --app $APPINSIGHTS_NAME \
        --resource-group $RESOURCE_GROUP \
        --query instrumentationKey -o tsv)
    print_info "   Instrumentation Key: ${INSTRUMENTATION_KEY:0:8}..."
fi

# ============================================
# Check Function App
# ============================================
print_header "9. Function App"

FUNCTIONAPP_NAME=$(az functionapp list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv)

if [ -z "$FUNCTIONAPP_NAME" ]; then
    print_warning "No Function App found (this is optional for local development)"
else
    print_success "Function App '$FUNCTIONAPP_NAME' exists"
    
    # Check runtime
    RUNTIME=$(az functionapp show --name $FUNCTIONAPP_NAME --resource-group $RESOURCE_GROUP --query "siteConfig.linuxFxVersion" -o tsv)
    print_info "   Runtime: $RUNTIME"
fi

# ============================================
# Check Environment Variables
# ============================================
print_header "10. Environment Variables"

ENV_VARS=(
    "AZURE_OPENAI_ENDPOINT"
    "AZURE_OPENAI_KEY"
    "AZURE_OPENAI_DEPLOYMENT_NAME"
    "COSMOS_DB_ENDPOINT"
    "COSMOS_DB_KEY"
    "AZURE_STORAGE_CONNECTION_STRING"
    "AZURE_SEARCH_ENDPOINT"
    "AZURE_SEARCH_KEY"
    "APPINSIGHTS_INSTRUMENTATIONKEY"
)

for VAR in "${ENV_VARS[@]}"; do
    print_check "$VAR"
    if [ ! -z "${!VAR}" ]; then
        print_success "Set"
    else
        print_warning "Not set"
    fi
done

# ============================================
# Check Azure AD B2C Variables
# ============================================
print_header "11. Azure AD B2C Configuration"

B2C_VARS=(
    "AZURE_AD_B2C_TENANT_NAME"
    "AZURE_AD_B2C_CLIENT_ID"
    "AZURE_AD_B2C_CLIENT_SECRET"
    "AZURE_AD_B2C_PRIMARY_USER_FLOW"
)

for VAR in "${B2C_VARS[@]}"; do
    print_check "$VAR"
    if [ ! -z "${!VAR}" ]; then
        print_success "Set"
    else
        print_warning "Not set (see infrastructure/azure-setup.md)"
    fi
done

# ============================================
# Summary
# ============================================
print_header "Validation Summary"

TOTAL=$((SUCCESS_COUNT + FAIL_COUNT + WARNING_COUNT))

echo -e "${GREEN}✅ Successful checks: $SUCCESS_COUNT${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNING_COUNT${NC}"
echo -e "${RED}❌ Failed checks: $FAIL_COUNT${NC}"
echo "   Total checks: $TOTAL"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    if [ $WARNING_COUNT -eq 0 ]; then
        echo -e "${GREEN}🎉 All checks passed! Your Azure setup is complete.${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. cd backend && npm install"
        echo "  2. cd frontend && npm install"
        echo "  3. npm run dev (in root directory)"
    else
        echo -e "${YELLOW}✓ Setup is mostly complete with some warnings.${NC}"
        echo ""
        echo "Review warnings above and:"
        echo "  1. Complete Azure AD B2C setup (see infrastructure/azure-setup.md)"
        echo "  2. Ensure all environment variables are set"
        echo "  3. Re-run this script to verify"
    fi
else
    echo -e "${RED}❌ Setup is incomplete. Please address failed checks above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  - Run: ./setup.sh (to create Azure resources)"
    echo "  - Copy env.template to .env and fill in values"
    echo "  - Check azure-resources.txt for connection strings"
    echo "  - Review docs/environment-setup.md for detailed instructions"
    exit 1
fi

# ============================================
# Troubleshooting Tips
# ============================================
if [ $WARNING_COUNT -gt 0 ] || [ $FAIL_COUNT -gt 0 ]; then
    print_header "Troubleshooting Tips"
    
    echo "Common issues and solutions:"
    echo ""
    echo "1. Resource not found:"
    echo "   → Run: ./setup.sh"
    echo ""
    echo "2. Environment variables not set:"
    echo "   → Copy env.template to .env"
    echo "   → Fill in values from azure-resources.txt"
    echo ""
    echo "3. Azure AD B2C not configured:"
    echo "   → Follow: infrastructure/azure-setup.md"
    echo ""
    echo "4. Permission denied:"
    echo "   → Ensure you have Contributor role on subscription"
    echo "   → Check: az role assignment list --assignee \$(az account show --query user.name -o tsv)"
    echo ""
    echo "5. API connectivity issues:"
    echo "   → Check firewall rules in Azure Portal"
    echo "   → Verify your IP is allowed"
    echo ""
    
    echo "For more help, see:"
    echo "  📖 docs/environment-setup.md"
    echo "  📖 infrastructure/azure-setup.md"
    echo ""
fi

exit 0

