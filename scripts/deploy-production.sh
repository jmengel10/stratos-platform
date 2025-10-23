#!/bin/bash

# StratOS Platform Production Deployment Script
# This script handles the complete production deployment process

set -e  # Exit on any error

echo "🚀 Starting StratOS Platform Production Deployment..."

# Configuration
RESOURCE_GROUP="stratos-rg"
FUNCTION_APP_NAME="stratos-platform-func-829197"
STATIC_WEB_APP_NAME="stratos-platform-web"
COSMOS_DB_NAME="stratos-platform-cosmos-829197"
STORAGE_ACCOUNT_NAME="stratos829197"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Azure CLI is installed and user is logged in
check_azure_cli() {
    print_status "Checking Azure CLI installation..."
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Please install it first."
        exit 1
    fi

    print_status "Checking Azure login status..."
    if ! az account show &> /dev/null; then
        print_error "Not logged in to Azure. Please run 'az login' first."
        exit 1
    fi

    print_success "Azure CLI is ready"
}

# Check if required environment variables are set
check_environment() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "COSMOS_ENDPOINT"
        "COSMOS_KEY"
        "COSMOS_DATABASE_ID"
        "NODE_ENV"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    print_success "Environment variables are configured"
}

# Build the frontend application
build_frontend() {
    print_status "Building frontend application..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm ci --production=false
    
    # Run linting
    print_status "Running linting..."
    npm run lint || print_warning "Linting completed with warnings"
    
    # Build the application
    print_status "Building Next.js application..."
    npm run build
    
    print_success "Frontend build completed"
    cd ..
}

# Deploy to Azure Static Web Apps
deploy_frontend() {
    print_status "Deploying frontend to Azure Static Web Apps..."
    
    cd frontend
    
    # Get deployment token
    DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "properties.apiKey" -o tsv)
    
    if [ -z "$DEPLOYMENT_TOKEN" ]; then
        print_error "Failed to get deployment token"
        exit 1
    fi
    
    # Deploy using SWA CLI
    print_status "Deploying frontend..."
    npx @azure/static-web-apps-cli deploy . --deployment-token $DEPLOYMENT_TOKEN --app-location "." --output-location ".next"
    
    print_success "Frontend deployed successfully"
    cd ..
}

# Configure Function App environment variables
configure_function_app() {
    print_status "Configuring Function App environment variables..."
    
    # Get Cosmos DB connection details
    COSMOS_ENDPOINT=$(az cosmosdb show --name $COSMOS_DB_NAME --resource-group $RESOURCE_GROUP --query "documentEndpoint" -o tsv)
    COSMOS_KEY=$(az cosmosdb keys list --name $COSMOS_DB_NAME --resource-group $RESOURCE_GROUP --query "primaryMasterKey" -o tsv)
    
    # Configure app settings
    az functionapp config appsettings set \
        --name $FUNCTION_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --settings \
            COSMOS_ENDPOINT="$COSMOS_ENDPOINT" \
            COSMOS_KEY="$COSMOS_KEY" \
            COSMOS_DATABASE_ID="stratos" \
            NODE_ENV="production" \
            FRONTEND_URL="https://nice-coast-09695130f.3.azurestaticapps.net" \
            JWT_SECRET="$(openssl rand -base64 32)" \
            APPINSIGHTS_CONNECTION_STRING="$(az monitor app-insights component show --app stratos-platform-insights --resource-group $RESOURCE_GROUP --query connectionString -o tsv)"
    
    print_success "Function App configured"
}

# Create Cosmos DB containers if they don't exist
setup_database() {
    print_status "Setting up Cosmos DB containers..."
    
    # Create database if it doesn't exist
    az cosmosdb sql database create \
        --account-name $COSMOS_DB_NAME \
        --resource-group $RESOURCE_GROUP \
        --name stratos \
        --throughput 400 || print_warning "Database may already exist"
    
    # Create containers
    containers=("stratos_config" "clients" "audit_logs" "users" "projects" "conversations" "prompts" "outputs" "tenants")
    
    for container in "${containers[@]}"; do
        print_status "Creating container: $container"
        az cosmosdb sql container create \
            --account-name $COSMOS_DB_NAME \
            --resource-group $RESOURCE_GROUP \
            --database-name stratos \
            --name $container \
            --partition-key-path "/id" \
            --throughput 400 || print_warning "Container $container may already exist"
    done
    
    print_success "Database setup completed"
}

# Run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Wait for deployment to be ready
    print_status "Waiting for deployment to be ready..."
    sleep 30
    
    # Check frontend
    FRONTEND_URL="https://nice-coast-09695130f.3.azurestaticapps.net"
    print_status "Checking frontend health..."
    if curl -f -s "$FRONTEND_URL" > /dev/null; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend health check failed"
    fi
    
    # Check API health
    API_URL="https://$FUNCTION_APP_NAME.azurewebsites.net/api/health"
    print_status "Checking API health..."
    if curl -f -s "$API_URL" > /dev/null; then
        print_success "API is healthy"
    else
        print_warning "API health check failed"
    fi
    
    print_success "Health checks completed"
}

# Main deployment function
main() {
    echo "🎯 StratOS Platform Production Deployment"
    echo "========================================"
    
    check_azure_cli
    check_environment
    build_frontend
    setup_database
    configure_function_app
    deploy_frontend
    run_health_checks
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Summary:"
    echo "  Frontend URL: https://nice-coast-09695130f.3.azurestaticapps.net"
    echo "  API URL: https://$FUNCTION_APP_NAME.azurewebsites.net"
    echo "  Resource Group: $RESOURCE_GROUP"
    echo "  Region: East US"
    echo ""
    echo "🔧 Next Steps:"
    echo "  1. Test the application functionality"
    echo "  2. Configure custom domain (optional)"
    echo "  3. Set up monitoring alerts"
    echo "  4. Configure backup policies"
    echo "  5. Review security settings"
    echo ""
}

# Run main function
main "$@"

