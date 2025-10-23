# 🔐 Azure AD B2C Setup - Simple Guide

**Time Required**: 15 minutes  
**Goal**: Enable user authentication for your platform

---

## ✅ WHAT'S ALREADY DONE

- ✅ Backend configured with all Azure services
- ✅ Frontend deployed to Vercel
- ✅ All code on GitHub

---

## 🎯 **STEP-BY-STEP B2C SETUP**

### Step 1: Create B2C Tenant (5 min)

1. **Go to**: https://portal.azure.com
2. **Search**: "Azure Active Directory B2C"
3. **Click**: "Create"
4. **Select**: "Create a new Azure AD B2C Tenant"
5. **Fill in**:
   - Organization name: **StratOS Platform**
   - Initial domain: **stratosplatform** (or any unique name)
   - Country: **United States**
6. **Click**: "Review + create" → "Create"
7. **Wait**: 2-3 minutes for creation

✅ **Save**: Your tenant name (e.g., `stratosplatform`)

---

### Step 2: Switch to B2C Tenant (1 min)

1. **Click**: Your profile icon (top-right corner)
2. **Click**: "Switch directory"
3. **Select**: StratOS Platform B2C tenant

---

### Step 3: Register Application (5 min)

1. **Go to**: "App registrations" (in left menu)
2. **Click**: "+ New registration"
3. **Fill in**:
   - Name: **StratOS Platform**
   - Supported account types: **Accounts in any identity provider...**
   - Redirect URI:
     - Platform: **Single-page application (SPA)**
     - URL: `https://stratos.vercel.app`
4. **Click**: "Register"

5. **SAVE THIS - YOU'LL NEED IT**:
   - **Application (client) ID**: (shown on the overview page)
   - Example: `12345678-1234-1234-1234-123456789012`

6. **Add more redirect URIs**:
   - Click "Authentication" (left menu)
   - Under "Single-page application", click "+ Add URI"
   - Add: `http://localhost:3000`
   - Add: `https://stratos-*.vercel.app` (for previews)

7. **Enable tokens**:
   - Still in "Authentication"
   - Under "Implicit grant and hybrid flows":
     - ✅ Check "Access tokens"
     - ✅ Check "ID tokens"
   - Click "**Save**"

---

### Step 4: Create User Flow (4 min)

1. **Go to**: "User flows" (in left menu)
2. **Click**: "+ New user flow"
3. **Select**: "Sign up and sign in" → "Recommended"
4. **Configure**:
   - Name: **signupsignin** (becomes `B2C_1_signupsignin`)
   - **Identity providers**:
     - ✅ Email signup
   - **User attributes** (what to collect):
     - ✅ Display Name
     - ✅ Email Address
   - **Application claims** (what to return):
     - ✅ Display Name
     - ✅ Email Addresses
     - ✅ User's Object ID
5. **Click**: "Create"

---

### Step 5: Note Your Configuration (1 min)

**Copy these values** (you'll need them):

```
Tenant Name: stratosplatform (from Step 1)
Domain: stratosplatform.b2clogin.com
Client ID: <from Step 3>
Primary User Flow: B2C_1_signupsignin
```

---

## 🔧 **CONFIGURE WITH YOUR B2C VALUES**

### Update Backend (2 min)

**In PowerShell**, replace with YOUR values:

```powershell
az functionapp config appsettings set `
  --name stratos-platform-func-829197 `
  --resource-group stratos-rg `
  --settings `
    AZURE_AD_B2C_TENANT_NAME="stratosplatform" `
    AZURE_AD_B2C_CLIENT_ID="<YOUR-CLIENT-ID>" `
    AZURE_AD_B2C_PRIMARY_USER_FLOW="B2C_1_signupsignin" `
    AZURE_AD_B2C_DOMAIN="stratosplatform.b2clogin.com"

Write-Host "`n✅ Backend B2C configured!`n" -ForegroundColor Green
```

### Update Frontend (3 min)

**In Vercel Dashboard**:

1. Go to: https://vercel.com/stratos
2. Click "**Settings**" → "**Environment Variables**"
3. Add (click "Add" for each):

```
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID = <YOUR-CLIENT-ID>
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME = stratosplatform
NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN = stratosplatform.b2clogin.com
NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW = B2C_1_signupsignin
```

4. **For each variable**, select all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **After adding all**, go to "Deployments"
6. Click "..." on latest → "**Redeploy**"
7. Wait 2 minutes

---

## ✅ **VERIFICATION**

### Test Authentication

1. **Open**: https://stratos.vercel.app
2. **Try**: Login button (if visible)
3. **Should**: Redirect to B2C login page
4. **Create**: Test account
5. **Should**: Redirect back to your app

### Test Backend with Auth

```powershell
# This should work now with a valid token
# (Get token by logging in via frontend first)
```

---

## 🎊 **AFTER B2C SETUP**

Your platform will have:
- ✅ User registration
- ✅ User login/logout
- ✅ Protected routes
- ✅ JWT authentication
- ✅ Multi-tenant support
- ✅ Full functionality!

---

## 📋 **QUICK REFERENCE**

**What You Need from B2C**:
1. Tenant Name (e.g., `stratosplatform`)
2. Client ID (from app registration)
3. Domain (tenant + `.b2clogin.com`)
4. User Flow (`B2C_1_signupsignin`)

**Where to Use Them**:
- Backend: Azure Function App Settings
- Frontend: Vercel Environment Variables

---

## 🆘 **TROUBLESHOOTING**

**"Can't create B2C tenant"**:
- Ensure you have proper subscription permissions
- Try a different tenant name (must be globally unique)

**"Redirect URI mismatch"**:
- Ensure `https://stratos.vercel.app` is added exactly
- Check for trailing slashes (shouldn't have any)
- Ensure SPA platform type is selected

**"Login doesn't work"**:
- Verify all 4 values match in both backend and frontend
- Check redirect URIs include your Vercel URL
- Test in incognito/private mode

---

## 📚 **MORE HELP**

- **Detailed guide**: `infrastructure/azure-setup.md`
- **Environment vars**: `docs/ENVIRONMENT_VARIABLES.md`
- **Deployment**: `docs/DEPLOYMENT.md`

---

**Start with Step 1 above!** Go to https://portal.azure.com and create your B2C tenant! 🚀

