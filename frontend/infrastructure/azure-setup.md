# Azure AD B2C Manual Setup Guide

This guide covers the manual steps required to set up Azure AD B2C for authentication in the StratOS platform.

## Prerequisites

- Azure subscription with Owner or Global Administrator role
- Completed running `infrastructure/setup.sh`

## Step 1: Create Azure AD B2C Tenant

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Search for "Azure AD B2C" in the top search bar

2. **Create B2C Tenant**
   - Click "Create a resource" → "Identity" → "Azure Active Directory B2C"
   - Select "Create a new Azure AD B2C Tenant"
   - Fill in the details:
     - **Organization name**: StratOS Platform
     - **Initial domain name**: stratos-platform (or your preferred name)
     - **Country/Region**: United States (or your region)
   - Click "Review + create" and then "Create"
   - Wait 2-3 minutes for tenant creation

3. **Switch to B2C Tenant**
   - Click on your profile icon (top right)
   - Select "Switch directory"
   - Choose the newly created B2C tenant

## Step 2: Register Application

1. **Register the Application**
   - In Azure AD B2C, go to "App registrations"
   - Click "New registration"
   - Fill in:
     - **Name**: StratOS Platform
     - **Supported account types**: "Accounts in any identity provider or organizational directory"
     - **Redirect URI**: 
       - Type: Web
       - URI: `http://localhost:3000/api/auth/callback/azure-ad-b2c` (for development)
   - Click "Register"

2. **Note the Application Details**
   ```
   Application (client) ID: [Copy this - you'll need it for .env]
   Directory (tenant) ID: [Copy this - you'll need it for .env]
   ```

3. **Create Client Secret**
   - In your app registration, go to "Certificates & secrets"
   - Click "New client secret"
   - Description: "StratOS Backend Secret"
   - Expires: 24 months (or your preference)
   - Click "Add"
   - **⚠️ IMPORTANT**: Copy the secret VALUE immediately (you won't see it again)
   ```
   Client Secret Value: [Copy this for .env]
   ```

## Step 3: Configure Authentication

1. **Add Redirect URIs**
   - Go to "Authentication" in your app registration
   - Under "Platform configurations" → "Web", add:
     ```
     http://localhost:3000/api/auth/callback/azure-ad-b2c
     https://<your-domain>/api/auth/callback/azure-ad-b2c
     ```
   - Under "Implicit grant and hybrid flows", enable:
     - ✅ ID tokens
   - Click "Save"

2. **Configure Token Configuration**
   - Go to "Token configuration"
   - Click "Add optional claim"
   - Token type: ID
   - Select claims: `email`, `family_name`, `given_name`
   - Click "Add"

## Step 4: Create User Flows

### Sign-up and Sign-in Flow

1. **Create User Flow**
   - In Azure AD B2C, go to "User flows"
   - Click "New user flow"
   - Select "Sign up and sign in" → "Recommended"
   - Give it a name: `B2C_1_signupsignin`

2. **Configure Identity Providers**
   - Enable:
     - ✅ Email signup
     - ✅ Google (requires setup - see below)
     - ✅ Microsoft Account (built-in)
     - ✅ Apple (requires setup - see below)

3. **Configure User Attributes**
   - Collect attributes (during sign-up):
     - ✅ Display Name
     - ✅ Email Address
     - ✅ Given Name
     - ✅ Surname
   - Return claims (in token):
     - ✅ Email Addresses
     - ✅ Display Name
     - ✅ Given Name
     - ✅ Surname
     - ✅ User's Object ID

4. **Multifactor Authentication**
   - Set to "Optional" or "Required" based on your security needs

5. **Click "Create"**

### Profile Editing Flow

1. **Create User Flow**
   - Click "New user flow"
   - Select "Profile editing" → "Recommended"
   - Name: `B2C_1_profileediting`

2. **Configure User Attributes**
   - Collect and return:
     - ✅ Display Name
     - ✅ Given Name
     - ✅ Surname

3. **Click "Create"**

### Password Reset Flow

1. **Create User Flow**
   - Click "New user flow"
   - Select "Password reset" → "Recommended"
   - Name: `B2C_1_passwordreset`

2. **Configure**
   - Return claims:
     - ✅ Email Addresses
     - ✅ User's Object ID

3. **Click "Create"**

## Step 5: Configure Social Identity Providers

### Google Sign-in

1. **Create Google OAuth Client**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Google+ API"
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/oauth2/authresp
     ```
   - Copy Client ID and Client Secret

2. **Add to Azure AD B2C**
   - In Azure AD B2C, go to "Identity providers"
   - Click "Google"
   - Enter Client ID and Client Secret from Google
   - Click "Save"

3. **Add to User Flow**
   - Edit your `B2C_1_signupsignin` user flow
   - Under "Identity providers", check ✅ Google
   - Click "Save"

### Apple Sign-in

1. **Create Apple Service ID**
   - Go to [Apple Developer Portal](https://developer.apple.com/)
   - Sign in with your Apple Developer account
   - Go to "Certificates, Identifiers & Profiles"
   - Create an App ID (if not exists)
   - Create a Service ID
   - Configure Service ID with redirect URL:
     ```
     https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/oauth2/authresp
     ```
   - Download the private key

2. **Add to Azure AD B2C**
   - In Azure AD B2C, go to "Identity providers"
   - Click "Apple"
   - Upload the private key
   - Enter Service ID, Team ID, Key ID
   - Click "Save"

3. **Add to User Flow**
   - Edit your `B2C_1_signupsignin` user flow
   - Under "Identity providers", check ✅ Apple
   - Click "Save"

### Microsoft Account (Built-in)

Microsoft Account is already available by default in Azure AD B2C.

1. **Add to User Flow**
   - Edit your `B2C_1_signupsignin` user flow
   - Under "Identity providers", check ✅ Microsoft Account
   - Click "Save"

## Step 6: Configure API Permissions

1. **Expose an API**
   - In your app registration, go to "Expose an API"
   - Click "Add a scope"
   - Application ID URI: Accept default or customize
   - Scope name: `user_impersonation`
   - Admin consent display name: "Access StratOS API"
   - Admin consent description: "Allow the application to access StratOS API on behalf of the signed-in user"
   - Click "Add scope"

2. **API Permissions**
   - Go to "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Select "Delegated permissions"
   - Add: `email`, `openid`, `profile`
   - Click "Add permissions"
   - Click "Grant admin consent" (requires admin)

## Step 7: Update Environment Variables

Add the following to your `.env` file:

```bash
# Azure AD B2C Configuration
AZURE_AD_B2C_TENANT_NAME=stratos-platform  # Your tenant name
AZURE_AD_B2C_CLIENT_ID=<your-client-id>
AZURE_AD_B2C_CLIENT_SECRET=<your-client-secret>
AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
AZURE_AD_B2C_DOMAIN=<your-tenant-name>.b2clogin.com

# For Next.js frontend (.env.local)
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=stratos-platform
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=<your-client-id>
NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN=<your-tenant-name>.b2clogin.com
```

## Step 8: Test Authentication

1. **Run the validation script**:
   ```bash
   cd infrastructure
   ./validate-setup.sh
   ```

2. **Test user flow**:
   - In Azure AD B2C, go to "User flows"
   - Select `B2C_1_signupsignin`
   - Click "Run user flow"
   - Select your application
   - Click "Run user flow"
   - Try signing up with email, Google, Apple, or Microsoft

## Troubleshooting

### Common Issues

**Issue**: "AADB2C90205: This application does not have sufficient permissions"
- **Solution**: Grant admin consent for API permissions

**Issue**: Google/Apple sign-in not working
- **Solution**: Verify redirect URIs are correctly configured in both Google/Apple console and Azure AD B2C

**Issue**: Token doesn't contain email claim
- **Solution**: Check "Token configuration" and ensure email is added as optional claim

**Issue**: User flow not found error
- **Solution**: Verify user flow name matches exactly (case-sensitive): `B2C_1_signupsignin`

### Support Resources

- [Azure AD B2C Documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/)
- [User Flows](https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview)
- [Social Identity Providers](https://docs.microsoft.com/en-us/azure/active-directory-b2c/identity-provider-google)

## Security Best Practices

1. **Client Secrets**
   - Rotate secrets every 6-12 months
   - Store secrets in Azure Key Vault (not in code)
   - Use different secrets for dev/staging/production

2. **Token Configuration**
   - Use shortest appropriate token lifetime
   - Enable token validation on backend
   - Implement proper logout functionality

3. **User Data**
   - Minimize user attributes collected
   - Implement GDPR compliance
   - Enable audit logging

4. **Multi-Factor Authentication**
   - Enable MFA for production environment
   - Consider conditional access policies

---

**Setup Complete!** Your Azure AD B2C tenant is now configured for StratOS platform authentication.

