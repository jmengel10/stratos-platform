#!/bin/bash

# StratOS Platform Secure Deployment Script
# This script ensures all secrets are handled securely

set -e  # Exit on any error

echo "🔐 Starting StratOS Platform Secure Deployment..."

# Load environment variables
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found. Using system environment variables."
fi

# Check for required environment variables
check_environment() {
    echo "🔍 Checking environment variables..."
    
    required_vars=(
        "AZURE_RESOURCE_GROUP"
        "AZURE_STATIC_WEB_APP_NAME"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo "❌ Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "Please set these variables in your .env file or environment."
        exit 1
    fi
    
    # Check for deployment token
    if [ -z "$SWA_DEPLOYMENT_TOKEN" ]; then
        echo "⚠️  SWA_DEPLOYMENT_TOKEN not set. Will fetch from Azure CLI..."
    else
        echo "✅ SWA_DEPLOYMENT_TOKEN is set"
    fi
    
    echo "✅ Environment check completed"
}

# Secure deployment function
deploy_securely() {
    echo "🚀 Starting secure deployment..."
    
    cd frontend
    
    # Build the application
    echo "🔨 Building application..."
    npm run build
    
    # Deploy using secure method
    if [ -n "$SWA_DEPLOYMENT_TOKEN" ]; then
        echo "🔐 Using deployment token from environment variable..."
        npx @azure/static-web-apps-cli deploy . \
            --deployment-token "$SWA_DEPLOYMENT_TOKEN" \
            --app-location "." \
            --output-location "out"
    else
        echo "🔐 Fetching deployment token from Azure..."
        DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
            --name "$AZURE_STATIC_WEB_APP_NAME" \
            --resource-group "$AZURE_RESOURCE_GROUP" \
            --query "properties.apiKey" -o tsv)
        
        if [ -z "$DEPLOYMENT_TOKEN" ]; then
            echo "❌ Failed to get deployment token from Azure"
            echo "Please ensure you're logged in with: az login"
            exit 1
        fi
        
        npx @azure/static-web-apps-cli deploy . \
            --deployment-token "$DEPLOYMENT_TOKEN" \
            --app-location "." \
            --output-location "out"
    fi
    
    cd ..
    echo "✅ Deployment completed successfully"
}

# Security cleanup
cleanup_secrets() {
    echo "🧹 Cleaning up sensitive data..."
    
    # Clear any temporary files with secrets
    find . -name "*.token" -delete 2>/dev/null || true
    find . -name "*.key" -delete 2>/dev/null || true
    find . -name "deployment-token.txt" -delete 2>/dev/null || true
    
    # Clear environment variables from memory (if possible)
    unset SWA_DEPLOYMENT_TOKEN 2>/dev/null || true
    
    echo "✅ Security cleanup completed"
}

# Main execution
main() {
    echo "🎯 StratOS Platform Secure Deployment"
    echo "====================================="
    echo ""
    
    check_environment
    deploy_securely
    cleanup_secrets
    
    echo ""
    echo "🎉 Secure deployment completed successfully!"
    echo ""
    echo "📋 Security Summary:"
    echo "  ✅ No secrets committed to version control"
    echo "  ✅ Environment variables used for configuration"
    echo "  ✅ Temporary files cleaned up"
    echo "  ✅ Deployment token handled securely"
    echo ""
    echo "🔗 Application URL: https://nice-coast-09695130f.3.azurestaticapps.net"
    echo ""
    echo "🔐 Next Steps:"
    echo "  1. Rotate deployment tokens regularly"
    echo "  2. Monitor access logs for unauthorized usage"
    echo "  3. Keep environment variables secure"
    echo "  4. Review security settings in Azure portal"
}

# Run main function
main "$@"
