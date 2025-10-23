#!/bin/bash

# Stratos Deployment Script
# Deploys to Vercel, Azure Static Web Apps, and GitHub

set -e

echo "🚀 Starting Stratos Deployment..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run type check
print_status "Running type check..."
npm run type-check

# Run linting
print_status "Running linter..."
npm run lint

# Build the application
print_status "Building application..."
npm run build

print_success "Build completed successfully!"

# Deploy to Vercel (if Vercel CLI is installed)
if command -v vercel &> /dev/null; then
    print_status "Deploying to Vercel..."
    vercel --prod
    print_success "Vercel deployment completed!"
else
    print_warning "Vercel CLI not found. Install with: npm i -g vercel"
fi

# Deploy to Azure (if Azure CLI is installed)
if command -v az &> /dev/null; then
    print_status "Deploying to Azure Static Web Apps..."
    az staticwebapp deploy --name stratos-app --resource-group stratos-rg --source . --output-location out
    print_success "Azure deployment completed!"
else
    print_warning "Azure CLI not found. Install with: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
fi

print_success "🎉 Deployment process completed!"
print_status "Your application should now be available on:"
print_status "- Vercel: https://your-app.vercel.app"
print_status "- Azure: https://your-app.azurestaticapps.net"
print_status "- GitHub: https://github.com/your-username/stratos"
