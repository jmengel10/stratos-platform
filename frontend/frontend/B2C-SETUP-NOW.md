# 🔐 Azure AD B2C Setup - Let's Do This!

**Time Required**: 15-20 minutes  
**What You'll Get**: Full user authentication for your platform

---

## 🎯 **STEP 1: Create B2C Tenant (5 min)**

### Open Azure Portal
1. **Go to**: https://portal.azure.com
2. **Search** (top search bar): Type "Azure Active Directory B2C"
3. **Click**: "Azure Active Directory B2C" service

### Create New Tenant
4. **Click**: "Create" button
5. **Select**: "Create a new Azure AD B2C Tenant"
6. **Fill in the form**:
   - **Organization name**: `StratOS Platform`
   - **Initial domain name**: `stratosplatform` ← **SAVE THIS!**
     - (Must be globally unique - try variations if taken)
     - Examples: stratosai, stratosapp, stratos-platform
   - **Country/Region**: United States
7. **Click**: "Review + create"
8. **Click**: "Create"
9. **Wait**: 2-3 minutes (you'll see "Deployment in progress")

**✅ SAVE**: Your tenant name (e.g., `stratosplatform`)

---

## 🎯 **STEP 2: Switch to B2C Tenant (1 min)**

### Switch Directory
1. **Click**: Your profile icon (top-right corner of Azure Portal)
2. **Click**: "Switch directory"
3. **Find**: StratOS Platform (your new B2C tenant)
4. **Click**: "Switch" button

**You're now in your B2C tenant!**

---

## 🎯 **STEP 3: Register Application (5 min)**

### Navigate to App Registrations
1. **In B2C tenant**, click "App registrations" (left menu)
2. **Click**: "+ New registration"

### Fill in Application Details
3. **Name**: `StratOS Platform`
4. **Supported account types**: Select "Accounts in any identity provider or organizational directory (for authenticating users with user flows)"
5. **Redirect URI**:
   - **Platform**: Single-page application (SPA) ← **IMPORTANT!**
   - **URI**: `https://stratos.vercel.app`
6. **Click**: "Register"

### Save Application ID
7. **You'll see**: Application (client) ID on the screen
8. **COPY THIS ID** - Example: `12345678-abcd-1234-abcd-123456789012`
9. **Save it somewhere** - You'll need it!

### Add More Redirect URIs
10. **Click**: "Authentication" (left menu)
11. **Under "Single-page application"**, click "+ Add URI"
12. **Add**: `http://localhost:3000` (for local testing)
13. **Add**: `https://stratos-*.vercel.app` (for preview deployments)
14. **Under "Implicit grant and hybrid flows"**:
    - ✅ Check "Access tokens (used for implicit flows)"
    - ✅ Check "ID tokens (used for implicit and hybrid flows)"
15. **Click**: "Save"

**✅ SAVE**: Your Application (client) ID

---

## 🎯 **STEP 4: Create User Flow (4 min)**

### Navigate to User Flows
1. **In B2C tenant**, click "User flows" (left menu)
2. **Click**: "+ New user flow"

### Select Flow Type
3. **Select**: "Sign up and sign in"
4. **Select**: "Recommended" version
5. **Click**: "Create"

### Configure User Flow
6. **Name**: `signupsignin` (will become `B2C_1_signupsignin`)
7. **Identity providers**:
   - ✅ Check "Email signup"
8. **Multifactor authentication**: Email (optional - you can skip for now)
9. **User attributes and token claims**:
   - **Select to collect**:
     - ✅ Display Name
     - ✅ Email Address
   - **Select to return in token**:
     - ✅ Display Name
     - ✅ Email Addresses
     - ✅ User's Object ID
10. **Click**: "Create"

**✅ SAVE**: Flow name is `B2C_1_signupsignin`

---

## 📝 **STEP 5: Note Your B2C Configuration**

**You should have saved these 4 values**:

```
1. Tenant Name: stratosplatform (or what you chose)
2. Domain: stratosplatform.b2clogin.com (tenant name + .b2clogin.com)
3. Client ID: <the application ID from Step 3>
4. User Flow: B2C_1_signupsignin
```

**If you didn't save them, here's how to find them**:

**Tenant Name & Domain**:
- In B2C tenant, click "Overview"
- Look for "Domain name" - Example: stratosplatform.b2clogin.com
- Tenant name is everything before .b2clogin.com

**Client ID**:
- Click "App registrations"
- Click on "StratOS Platform"
- Copy the "Application (client) ID"

**User Flow**:
- Click "User flows"
- You should see "B2C_1_signupsignin"

---

## 🎯 **STEP 6: Configure Backend (2 min)**

**In PowerShell, run this** (replace with YOUR values):

```powershell
# Replace these with YOUR actual values from Step 5
$B2C_TENANT_NAME = "stratosplatform"  # ← YOUR tenant name
$B2C_CLIENT_ID = "YOUR-CLIENT-ID-HERE"  # ← YOUR client ID
$B2C_DOMAIN = "stratosplatform.b2clogin.com"  # ← YOUR domain

# Configure backend
az functionapp config appsettings set `
  --name stratos-platform-func-829197 `
  --resource-group stratos-rg `
  --settings `
    AZURE_AD_B2C_TENANT_NAME="$B2C_TENANT_NAME" `
    AZURE_AD_B2C_CLIENT_ID="$B2C_CLIENT_ID" `
    AZURE_AD_B2C_PRIMARY_USER_FLOW="B2C_1_signupsignin" `
    AZURE_AD_B2C_DOMAIN="$B2C_DOMAIN"

Write-Host "`n✅ Backend B2C configured!`n" -ForegroundColor Green
```

---

## 🎯 **STEP 7: Configure Frontend (3 min)**

### In Vercel Dashboard:

1. **Go to**: https://vercel.com/stratos/settings
2. **Click**: "Environment Variables" (left menu)
3. **Add these 4 variables** (click "Add" for each):

**Variable 1**:
```
Name: NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID
Value: <YOUR-CLIENT-ID-FROM-STEP-3>
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2**:
```
Name: NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME
Value: stratosplatform (YOUR tenant name)
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 3**:
```
Name: NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN
Value: stratosplatform.b2clogin.com (YOUR domain)
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 4**:
```
Name: NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW
Value: B2C_1_signupsignin
Environments: ✅ Production ✅ Preview ✅ Development
```

4. **After adding all 4**, go to "Deployments" tab
5. **Click**: "..." on latest → "Redeploy"
6. **Wait**: 2-3 minutes

---

## ✅ **STEP 8: Test Authentication (5 min)**

### After Redeploy Completes:

1. **Visit**: https://stratos.vercel.app
2. **Look for**: Login button (if integrated in frontend)
3. **Try**: Creating an account
4. **Should**: Redirect to B2C sign-up page
5. **Complete**: Registration
6. **Should**: Redirect back to your app

---

## 📋 **QUICK REFERENCE CARD**

**Copy this and fill in YOUR values**:

```
═══════════════════════════════════════
MY B2C CONFIGURATION
═══════════════════════════════════════

Tenant Name: _________________
Domain: _________________.b2clogin.com
Client ID: _________________
User Flow: B2C_1_signupsignin

Frontend URL: https://stratos.vercel.app
Backend URL: https://stratos-platform-func-829197.azurewebsites.net
═══════════════════════════════════════
```

---

## 🆘 **IF YOU GET STUCK**

**Tell me**:
1. Which step you're on
2. What you see
3. Any error messages

**I'll help you through it!**

---

## 🎯 **START NOW!**

**Go to**: https://portal.azure.com

**Search for**: Azure Active Directory B2C

**Let's create your B2C tenant!** 🚀

---

**Once you complete Steps 1-4, come back with your 4 values and I'll give you the exact PowerShell commands to run!**

