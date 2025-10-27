# StratOS Platform - Secure Deployment Guide

## 🔐 Security Best Practices

### Environment Variables Setup

1. **Copy the environment template:**
   ```bash
   cp env.example .env
   ```

2. **Fill in your actual values in `.env`:**
   - Never commit `.env` files to version control
   - Use strong, unique values for all secrets
   - Rotate secrets regularly

### Azure Deployment Token Security

**NEVER hardcode deployment tokens in scripts or commit them to version control!**

#### Option 1: Environment Variable (Recommended)
```bash
export SWA_DEPLOYMENT_TOKEN="your_deployment_token_here"
```

#### Option 2: Azure CLI (Fallback)
The deployment script will automatically fetch the token if not set in environment variables.

### Getting Your Deployment Token Securely

```bash
# Get the deployment token (run this once and store securely)
az staticwebapp secrets list \
  --name stratos-platform-web \
  --resource-group stratos-rg \
  --query "properties.apiKey" -o tsv
```

### Secure Deployment Process

1. **Set up environment variables:**
   ```bash
   # Copy the template
   cp env.example .env
   
   # Edit with your actual values
   nano .env
   ```

2. **Deploy using the secure script:**
   ```bash
   # The script will use SWA_DEPLOYMENT_TOKEN if set
   ./scripts/deploy-production.sh
   ```

### Security Checklist

- [ ] All secrets are in environment variables
- [ ] `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Deployment tokens are rotated regularly
- [ ] Azure CLI is properly authenticated
- [ ] Environment variables are set for production

### Rotating Secrets

1. **Generate new deployment token:**
   ```bash
   az staticwebapp secrets set \
     --name stratos-platform-web \
     --resource-group stratos-rg \
     --secrets apiKey="new_token_here"
   ```

2. **Update your environment variable:**
   ```bash
   export SWA_DEPLOYMENT_TOKEN="new_token_here"
   ```

3. **Redeploy:**
   ```bash
   ./scripts/deploy-production.sh
   ```

### Emergency Secret Rotation

If a secret is compromised:

1. **Immediately rotate the secret**
2. **Update all environment variables**
3. **Redeploy the application**
4. **Review access logs for unauthorized usage**

## 🚨 Security Warnings

- **NEVER** commit `.env` files
- **NEVER** hardcode secrets in scripts
- **NEVER** share deployment tokens in chat/email
- **ALWAYS** use environment variables for secrets
- **ALWAYS** rotate secrets regularly

## 📋 Environment Variables Reference

See `env.example` for the complete list of required environment variables.

## 🔧 Troubleshooting

### "Failed to get deployment token"
- Ensure Azure CLI is logged in: `az login`
- Check resource group and app names are correct
- Verify you have permissions to access the Static Web App

### "Environment variable not set"
- Ensure `.env` file exists and is properly formatted
- Check that `SWA_DEPLOYMENT_TOKEN` is set
- Verify no extra spaces or quotes in the value
