#!/bin/bash

# StratOS Platform - Final Health Check
# Run this before launch to verify all systems are operational

set -e

echo "=========================================="
echo "🔍 StratOS Platform - Final Health Check"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
    echo -e "${GREEN}✅ $1 is installed${NC}"
    return 0
}

# Function to check URL
check_url() {
    local url=$1
    local name=$2
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo -e "${GREEN}✅ $name is accessible (HTTP $status_code)${NC}"
        return 0
    elif [ "$status_code" -eq 401 ] || [ "$status_code" -eq 403 ]; then
        echo -e "${YELLOW}⚠️  $name requires authentication (HTTP $status_code)${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 0
    else
        echo -e "${RED}❌ $name returned HTTP $status_code${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# 1. Check Prerequisites
echo "1️⃣  Checking Prerequisites..."
check_command curl
check_command az
check_command node
check_command npm
echo ""

# 2. Check Azure CLI Authentication
echo "2️⃣  Checking Azure CLI Authentication..."
if az account show > /dev/null 2>&1; then
    SUBSCRIPTION=$(az account show --query name -o tsv)
    echo -e "${GREEN}✅ Logged in to Azure${NC}"
    echo "   Subscription: $SUBSCRIPTION"
else
    echo -e "${RED}❌ Not logged in to Azure${NC}"
    echo "   Run: az login"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 3. Check Azure Resources
echo "3️⃣  Checking Azure Resources..."
RESOURCE_GROUP="stratos-rg"

if az group show --name $RESOURCE_GROUP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Resource group '$RESOURCE_GROUP' exists${NC}"
    
    # Count resources
    RESOURCE_COUNT=$(az resource list --resource-group $RESOURCE_GROUP --query "length(@)" -o tsv 2>/dev/null || echo "0")
    echo "   Found $RESOURCE_COUNT resources"
    
    # List resources
    echo ""
    echo "   Resources in $RESOURCE_GROUP:"
    az resource list --resource-group $RESOURCE_GROUP \
        --query "[].{Name:name, Type:type}" \
        --output table 2>/dev/null || echo "   Could not list resources"
    
else
    echo -e "${RED}❌ Resource group '$RESOURCE_GROUP' not found${NC}"
    echo "   Run: cd infrastructure && ./setup.sh"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. Check Backend (if deployed)
echo "4️⃣  Checking Backend..."
BACKEND_URL=$(az functionapp show --name stratos-platform-func --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv 2>/dev/null || echo "")

if [ -n "$BACKEND_URL" ]; then
    echo "   Backend URL: https://$BACKEND_URL"
    check_url "https://$BACKEND_URL/api/health" "Backend health endpoint"
    check_url "https://$BACKEND_URL/api/tenant/onboard" "Backend API"
else
    echo -e "${YELLOW}⚠️  Backend not found or not deployed${NC}"
    echo "   Deploy with: cd backend && func azure functionapp publish stratos-platform-func"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 5. Check Frontend (if configured)
echo "5️⃣  Checking Frontend..."
if [ -f "../frontend/.vercel/project.json" ]; then
    echo "   Vercel project configured"
    # Try to get deployment URL from vercel
    if command -v vercel &> /dev/null; then
        FRONTEND_URL=$(vercel ls --prod 2>/dev/null | grep -oP 'https://[^\s]+' | head -1 || echo "")
        if [ -n "$FRONTEND_URL" ]; then
            echo "   Frontend URL: $FRONTEND_URL"
            check_url "$FRONTEND_URL" "Frontend"
        else
            echo -e "${YELLOW}⚠️  Could not determine frontend URL${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${YELLOW}⚠️  Vercel CLI not installed${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Frontend not deployed to Vercel${NC}"
    echo "   Deploy with: cd frontend && vercel --prod"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 6. Check Environment Variables
echo "6️⃣  Checking Environment Variables..."
if [ -f "../infrastructure/azure-resources.txt" ]; then
    echo -e "${GREEN}✅ Azure resources file exists${NC}"
    echo "   Connection strings available in infrastructure/azure-resources.txt"
else
    echo -e "${RED}❌ Azure resources file not found${NC}"
    echo "   Run infrastructure setup first"
    ERRORS=$((ERRORS + 1))
fi

# Check backend env
if [ -f "../backend/.env" ] || [ -f "../backend/local.settings.json" ]; then
    echo -e "${GREEN}✅ Backend environment configured${NC}"
else
    echo -e "${YELLOW}⚠️  Backend environment not configured${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check frontend env
if [ -f "../frontend/.env.local" ]; then
    echo -e "${GREEN}✅ Frontend environment configured${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend environment not configured${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 7. Check Application Insights
echo "7️⃣  Checking Application Insights..."
APPINSIGHTS=$(az monitor app-insights component list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv 2>/dev/null || echo "")
if [ -n "$APPINSIGHTS" ]; then
    echo -e "${GREEN}✅ Application Insights configured: $APPINSIGHTS${NC}"
    INSTRUMENTATION_KEY=$(az monitor app-insights component show \
        --app $APPINSIGHTS \
        --resource-group $RESOURCE_GROUP \
        --query instrumentationKey -o tsv 2>/dev/null || echo "")
    if [ -n "$INSTRUMENTATION_KEY" ]; then
        echo "   Instrumentation Key: ${INSTRUMENTATION_KEY:0:8}...${INSTRUMENTATION_KEY: -4}"
    fi
else
    echo -e "${YELLOW}⚠️  Application Insights not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 8. Check Database
echo "8️⃣  Checking Cosmos DB..."
COSMOS_ACCOUNT=$(az cosmosdb list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv 2>/dev/null || echo "")
if [ -n "$COSMOS_ACCOUNT" ]; then
    echo -e "${GREEN}✅ Cosmos DB account found: $COSMOS_ACCOUNT${NC}"
    
    # Check database
    DATABASE_EXISTS=$(az cosmosdb sql database exists \
        --account-name $COSMOS_ACCOUNT \
        --resource-group $RESOURCE_GROUP \
        --name stratos 2>/dev/null || echo "false")
    
    if [ "$DATABASE_EXISTS" = "true" ]; then
        echo -e "${GREEN}✅ Database 'stratos' exists${NC}"
        
        # Check containers
        CONTAINERS=$(az cosmosdb sql container list \
            --account-name $COSMOS_ACCOUNT \
            --resource-group $RESOURCE_GROUP \
            --database-name stratos \
            --query "[].id" -o tsv 2>/dev/null || echo "")
        
        if [ -n "$CONTAINERS" ]; then
            echo "   Containers: $(echo $CONTAINERS | tr '\n' ', ' | sed 's/,$//')"
        fi
    else
        echo -e "${YELLOW}⚠️  Database 'stratos' not found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Cosmos DB not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 9. Check Storage
echo "9️⃣  Checking Storage Account..."
STORAGE_ACCOUNT=$(az storage account list --resource-group $RESOURCE_GROUP --query "[0].name" -o tsv 2>/dev/null || echo "")
if [ -n "$STORAGE_ACCOUNT" ]; then
    echo -e "${GREEN}✅ Storage account found: $STORAGE_ACCOUNT${NC}"
    
    # Check containers
    CONNECTION_STRING=$(az storage account show-connection-string \
        --name $STORAGE_ACCOUNT \
        --resource-group $RESOURCE_GROUP \
        --query connectionString -o tsv 2>/dev/null || echo "")
    
    if [ -n "$CONNECTION_STRING" ]; then
        CONTAINERS=$(az storage container list \
            --connection-string "$CONNECTION_STRING" \
            --query "[].name" -o tsv 2>/dev/null || echo "")
        if [ -n "$CONTAINERS" ]; then
            echo "   Containers: $(echo $CONTAINERS | tr '\n' ', ' | sed 's/,$//')"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Storage account not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 10. Summary
echo "=========================================="
echo "📊 Health Check Summary"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All systems operational!${NC}"
    echo ""
    echo "🚀 Ready to launch!"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    echo ""
    echo "System is mostly ready, but some components need attention."
    echo "Review warnings above and fix before launch."
    echo ""
    exit 1
else
    echo -e "${RED}❌ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo "Critical issues detected. Fix errors before proceeding."
    echo ""
    exit 2
fi

