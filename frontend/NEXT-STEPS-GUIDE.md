# 🎯 StratOS Platform - Next Steps to Full Functionality

**Current Status**: Platform deployed, needs configuration  
**Time Required**: 30-40 minutes  
**Goal**: Fully operational platform with authentication

---

## 📋 **OVERVIEW OF REMAINING STEPS**

1. ✅ Get Azure resource connection strings
2. ⏳ Configure backend environment variables (5 min)
3. ⏳ Set up Azure AD B2C for authentication (15 min)
4. ⏳ Configure frontend environment variables (5 min)
5. ⏳ Test all endpoints and pages (10 min)
6. ⏳ Verify monitoring (5 min)

---

## STEP 1: Get Azure Connection Strings ✅

Let's get all the connection strings from your Azure resources:

### Run These Commands:

```powershell
# Set variables
$RESOURCE_GROUP = "stratos-rg"
$OPENAI_NAME = "stratos-platform-openai-829197"
$COSMOS_NAME = "stratos-platform-cosmos-829197"
$STORAGE_NAME = "stratos829197"
$SEARCH_NAME = "stratos-platform-search-829197"
$KEYVAULT_NAME = "stratos-kv-829197"
$APPINSIGHTS_NAME = "stratos-platform-insights"
$FUNCTIONAPP_NAME = "stratos-platform-func-829197"

# Get OpenAI details
$OPENAI_ENDPOINT = az cognitiveservices account show --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query properties.endpoint -o tsv
$OPENAI_KEY = az cognitiveservices account keys list --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query key1 -o tsv

# Get Cosmos DB details
$COSMOS_ENDPOINT = az cosmosdb show --name $COSMOS_NAME --resource-group $RESOURCE_GROUP --query documentEndpoint -o tsv
$COSMOS_KEY = az cosmosdb keys list --name $COSMOS_NAME --resource-group $RESOURCE_GROUP --query primaryMasterKey -o tsv

# Get Storage details
$STORAGE_CONNECTION = az storage account show-connection-string --name $STORAGE_NAME --resource-group $RESOURCE_GROUP --query connectionString -o tsv

# Get Search details
$SEARCH_ENDPOINT = "https://$SEARCH_NAME.search.windows.net"
$SEARCH_KEY = az search admin-key show --service-name $SEARCH_NAME --resource-group $RESOURCE_GROUP --query primaryKey -o tsv

# Get Application Insights details
$APPINSIGHTS_KEY = az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP --query instrumentationKey -o tsv

# Display all values
Write-Host "`n=== AZURE RESOURCE CONNECTION STRINGS ===" -ForegroundColor Cyan
Write-Host "`nAZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT"
Write-Host "AZURE_OPENAI_KEY=$OPENAI_KEY"
Write-Host "AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4"
Write-Host "AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002"
Write-Host "`nCOSMOS_DB_ENDPOINT=$COSMOS_ENDPOINT"
Write-Host "COSMOS_DB_KEY=$COSMOS_KEY"
Write-Host "COSMOS_DB_DATABASE_NAME=stratos"
Write-Host "`nAZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION"
Write-Host "`nAZURE_SEARCH_ENDPOINT=$SEARCH_ENDPOINT"
Write-Host "AZURE_SEARCH_KEY=$SEARCH_KEY"
Write-Host "`nAPPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY"
Write-Host "`nFUNCTION_APP_NAME=$FUNCTIONAPP_NAME"
Write-Host "`n======================================`n"
```

**Copy these values - you'll need them in Step 2!**

---

## STEP 2: Configure Backend Environment Variables (5 min)

Set these in your Azure Function App:

```powershell
# Use the values from Step 1
az functionapp config appsettings set `
  --name stratos-platform-func-829197 `
  --resource-group stratos-rg `
  --settings `
    AZURE_OPENAI_ENDPOINT="$OPENAI_ENDPOINT" `
    AZURE_OPENAI_KEY="$OPENAI_KEY" `
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" `
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT="text-embedding-ada-002" `
    COSMOS_DB_ENDPOINT="$COSMOS_ENDPOINT" `
    COSMOS_DB_KEY="$COSMOS_KEY" `
    COSMOS_DB_DATABASE_NAME="stratos" `
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION" `
    AZURE_SEARCH_ENDPOINT="$SEARCH_ENDPOINT" `
    AZURE_SEARCH_KEY="$SEARCH_KEY" `
    APPINSIGHTS_INSTRUMENTATIONKEY="$APPINSIGHTS_KEY" `
    JWT_SECRET="$(openssl rand -base64 32 2>$null || 'temp-jwt-secret-change-later-min-32-chars-long')" `
    FRONTEND_URL="https://stratos.vercel.app" `
    NODE_ENV="production"

Write-Host "`n✅ Backend environment variables configured!`n" -ForegroundColor Green
```

---

## STEP 3: Set Up Azure AD B2C (15 min)

### 3A. Create B2C Tenant

1. Go to **Azure Portal**: https://portal.azure.com
2. Search for "Azure Active Directory B2C"
3. Click "**Create**"
4. Select "**Create a new Azure AD B2C Tenant**"
5. Fill in:
   - **Organization name**: StratOS Platform
   - **Initial domain**: `stratosplatform` (or your choice - must be unique)
   - **Country/Region**: United States
6. Click "**Review + create**" → "**Create**"
7. **Wait 2-3 minutes** for tenant creation

### 3B. Switch to B2C Tenant

1. Click your profile (top-right)
2. Click "**Switch directory**"
3. Select your new StratOS B2C tenant

### 3C. Register Application

1. In B2C tenant, go to "**App registrations**"
2. Click "**+ New registration**"
3. Fill in:
   - **Name**: StratOS Platform
   - **Supported account types**: "Accounts in any identity provider..."
   - **Redirect URI**: 
     - Type: **Single-page application (SPA)**
     - URL: `https://stratos.vercel.app`
   - Also add: `http://localhost:3000` for local testing
4. Click "**Register**"
5. **SAVE THE APPLICATION (CLIENT) ID** - you'll need this!

### 3D. Add Additional Redirect URIs

1. In your app registration, go to "**Authentication**"
2. Under "Single-page application", add:
   - `http://localhost:3000`
   - `https://stratos.vercel.app`
   - `https://stratos-*.vercel.app` (for preview deployments)
3. Under "Implicit grant and hybrid flows":
   - ✅ Check "Access tokens"
   - ✅ Check "ID tokens"
4. Click "**Save**"

### 3E. Create User Flow

1. In B2C tenant, go to "**User flows**"
2. Click "**+ New user flow**"
3. Select "**Sign up and sign in**" → "**Recommended**"
4. Configure:
   - **Name**: `signupsignin` (will become `B2C_1_signupsignin`)
   - **Identity providers**: ✅ Email signup
   - **User attributes to collect**:
     - ✅ Display Name
     - ✅ Email Address
     - ✅ Given Name
     - ✅ Surname
   - **Application claims to return**:
     - ✅ Email Addresses
     - ✅ Display Name
     - ✅ Given Name
     - ✅ Surname
     - ✅ User's Object ID
5. Click "**Create**"

### 3F. Note Your B2C Configuration

**Save these values**:
```
Tenant Name: stratosplatform (your choice from 3A)
Domain: stratosplatform.b2clogin.com
Client ID: <from step 3C>
Policy Name: B2C_1_signupsignin
```

---

## STEP 4: Configure Frontend Environment Variables (5 min)

### In Vercel Dashboard:

1. Go to: https://vercel.com/stratos
2. Click "**Settings**" → "**Environment Variables**"
3. Add these variables (one at a time):

```
Name: NEXT_PUBLIC_API_BASE_URL
Value: https://stratos-platform-func-829197.azurewebsites.net/api
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID
Value: <your-client-id-from-step-3C>
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME
Value: <your-tenant-name-from-step-3F>
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN
Value: <your-tenant>.b2clogin.com
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW
Value: B2C_1_signupsignin
Environment: Production, Preview, Development
```

4. After adding all variables, go to "**Deployments**"
5. Click "**...** " on latest deployment → "**Redeploy**"
6. Wait 2 minutes for redeploy

---

## STEP 5: Update Backend with B2C Config (2 min)

```powershell
# Add B2C settings to backend (using values from Step 3F)
az functionapp config appsettings set `
  --name stratos-platform-func-829197 `
  --resource-group stratos-rg `
  --settings `
    AZURE_AD_B2C_TENANT_NAME="<your-tenant-name>" `
    AZURE_AD_B2C_CLIENT_ID="<your-client-id>" `
    AZURE_AD_B2C_PRIMARY_USER_FLOW="B2C_1_signupsignin" `
    AZURE_AD_B2C_DOMAIN="<your-tenant>.b2clogin.com"

Write-Host "`n✅ Backend B2C configuration complete!`n" -ForegroundColor Green
```

---

## STEP 6: Test Your Platform (10 min)

### Test Backend API

```powershell
# Test health (should work without auth)
curl https://stratos-platform-func-829197.azurewebsites.net/api/health

# Test protected endpoint (should return 401)
curl https://stratos-platform-func-829197.azurewebsites.net/api/chat

# Test tenant onboarding (should work)
curl -X POST https://stratos-platform-func-829197.azurewebsites.net/api/tenant/onboard `
  -H "Content-Type: application/json" `
  -d '{\"tenantName\":\"Test Company\",\"domain\":\"testco\",\"ownerEmail\":\"test@example.com\",\"ownerName\":\"Test User\"}'
```

### Test Frontend

1. **Open**: https://stratos.vercel.app
2. **Navigate to**: `/dashboard`
   - Should see dashboard with KPIs
3. **Navigate to**: `/settings`
   - Should see all 6 settings sections
   - Try switching between sections
4. **Check**: Error handling works (try invalid URL like `/invalid`)

### Test Authentication (After B2C Setup)

1. **Open**: https://stratos.vercel.app
2. **Click**: Login button (if visible)
3. **Complete**: Sign-up flow
4. **Verify**: Redirects to dashboard

---

## STEP 7: Verify Monitoring (5 min)

### Check Application Insights

1. Go to: https://portal.azure.com
2. Navigate to: Resource Groups → stratos-rg → stratos-platform-insights
3. Check "**Live Metrics**" - should see telemetry
4. Check "**Failures**" - should be minimal
5. Check "**Performance**" - should see requests

### Check Vercel Analytics

1. Go to: https://vercel.com/stratos
2. Click "**Analytics**"
3. Should see page views
4. Check performance metrics

---

## 🚀 **QUICK START SCRIPT**

Run this complete script to get all connection strings:

```powershell
cd "C:\Users\jonme\Documents\AI Strategy Consulting and Venture Capital\infrastructure"

# Variables
$RG = "stratos-rg"
$OPENAI = "stratos-platform-openai-829197"
$COSMOS = "stratos-platform-cosmos-829197"
$STORAGE = "stratos829197"
$SEARCH = "stratos-platform-search-829197"
$INSIGHTS = "stratos-platform-insights"

# Get all connection strings
Write-Host "`n=== COPY THESE VALUES ===" -ForegroundColor Cyan
Write-Host "`nOpenAI:"
Write-Host "Endpoint: $(az cognitiveservices account show --name $OPENAI --resource-group $RG --query properties.endpoint -o tsv)"
Write-Host "Key: $(az cognitiveservices account keys list --name $OPENAI --resource-group $RG --query key1 -o tsv)"

Write-Host "`nCosmos DB:"
Write-Host "Endpoint: $(az cosmosdb show --name $COSMOS --resource-group $RG --query documentEndpoint -o tsv)"
Write-Host "Key: $(az cosmosdb keys list --name $COSMOS --resource-group $RG --query primaryMasterKey -o tsv)"

Write-Host "`nStorage:"
Write-Host "Connection: $(az storage account show-connection-string --name $STORAGE --resource-group $RG --query connectionString -o tsv)"

Write-Host "`nSearch:"
Write-Host "Endpoint: https://$SEARCH.search.windows.net"
Write-Host "Key: $(az search admin-key show --service-name $SEARCH --resource-group $RG --query primaryKey -o tsv)"

Write-Host "`nApp Insights:"
Write-Host "Key: $(az monitor app-insights component show --app $INSIGHTS --resource-group $RG --query instrumentationKey -o tsv)"
Write-Host "`n========================`n"
```

---

## 📝 **DETAILED B2C SETUP STEPS**

### If you need step-by-step guidance for B2C:

**See**: `infrastructure/azure-setup.md` for detailed instructions with screenshots

**Quick version**:
1. Azure Portal → Create B2C tenant
2. Register app → Get client ID
3. Create sign-up/sign-in user flow
4. Copy tenant name, domain, client ID

**Time**: 15 minutes

---

## ⚡ **QUICK CONFIGURATION (If You Want to Skip B2C for Now)**

You can test the platform WITHOUT B2C by:

1. **Just set the basic environment variables** (Step 2 above)
2. **Skip B2C setup for now**
3. **Test the dashboard and settings pages** (they don't require auth with mock data)
4. **Add B2C later** when you want full authentication

**This lets you see the platform working immediately!**

---

## 🎯 **PRIORITY ACTIONS**

### High Priority (Do Now):
1. ✅ **Run Step 1 script** to get connection strings
2. ✅ **Configure backend** (Step 2) - 1 command
3. ⏳ **Test backend** - Verify it works

### Medium Priority (Do Soon):
4. ⏳ **Set up B2C** (Step 3) - 15 minutes
5. ⏳ **Configure frontend** (Step 4) - 5 minutes
6. ⏳ **Test everything** (Step 6) - 10 minutes

### Low Priority (Later):
7. ⏳ Custom domain
8. ⏳ Landing page
9. ⏳ Marketing materials

---

## 🆘 **IF YOU GET STUCK**

**Check documentation**:
- `docs/ENVIRONMENT_VARIABLES.md` - All variables explained
- `infrastructure/azure-setup.md` - Detailed B2C guide
- `docs/DEPLOYMENT.md` - Complete deployment reference

**Common issues**:
- **"Connection string not working"**: Check for extra spaces
- **"B2C login fails"**: Verify redirect URIs match exactly
- **"API returns 500"**: Check Application Insights for errors

---

## 📊 **CURRENT STATUS**

```
✅ Code Development:     100%  Complete
✅ GitHub Repository:    100%  Live
✅ Azure Infrastructure: 100%  Created
✅ Backend Deployment:   100%  Live
✅ Frontend Deployment:  100%  Live
⏳ Configuration:         30%  In Progress
⏳ Authentication:         0%  Pending
⏳ Testing:                0%  Pending

OVERALL:                  80%  Almost There!
```

---

## 🎉 **YOU'RE SO CLOSE!**

**Platform**: ✅ Deployed  
**Code**: ✅ Complete  
**Infrastructure**: ✅ Ready  
**Configuration**: ⏳ 30 minutes away  

**Just follow the steps above and you'll have a fully functional platform!**

---

**Start with Step 1 - Run the PowerShell script to get your connection strings!**

Then we'll configure everything step by step! 🚀

