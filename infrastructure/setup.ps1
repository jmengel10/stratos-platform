# StratOS Platform - Azure Infrastructure Setup Script (PowerShell)
# This script creates all required Azure resources for the platform

$ErrorActionPreference = "Continue"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "StratOS Platform - Azure Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration variables
$RESOURCE_GROUP = "stratos-rg"
$LOCATION = "eastus"
$APP_NAME = "stratos-platform"
$TIMESTAMP = [int][double]::Parse((Get-Date -UFormat %s))
$UNIQUE_SUFFIX = $TIMESTAMP.ToString().Substring($TIMESTAMP.ToString().Length - 6)

# Derived resource names (must be globally unique)
$OPENAI_NAME = "$APP_NAME-openai-$UNIQUE_SUFFIX"
$COSMOS_NAME = "$APP_NAME-cosmos-$UNIQUE_SUFFIX"
$STORAGE_NAME = "stratos$UNIQUE_SUFFIX"
$SEARCH_NAME = "$APP_NAME-search-$UNIQUE_SUFFIX"
$KEYVAULT_NAME = "stratos-kv-$UNIQUE_SUFFIX"
$APPINSIGHTS_NAME = "$APP_NAME-insights"
$FUNCTIONAPP_NAME = "$APP_NAME-func-$UNIQUE_SUFFIX"
$APPSERVICE_PLAN = "$APP_NAME-plan"

# Output file for connection strings
$OUTPUT_FILE = "./azure-resources.txt"

Write-Host "Checking Azure CLI..." -ForegroundColor Yellow
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Not logged in. Please login:" -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}

Write-Host "✅ Logged in to Azure" -ForegroundColor Green
Write-Host "   Subscription: $($account.name)" -ForegroundColor Gray
Write-Host "   ID: $($account.id)" -ForegroundColor Gray
Write-Host ""

# Create Resource Group
Write-Host "Creating Resource Group..." -ForegroundColor Yellow
$groupExists = az group exists --name $RESOURCE_GROUP
if ($groupExists -eq "true") {
    Write-Host "⚠️  Resource Group '$RESOURCE_GROUP' already exists" -ForegroundColor Yellow
} else {
    az group create --name $RESOURCE_GROUP --location $LOCATION | Out-Null
    Write-Host "✅ Resource Group created" -ForegroundColor Green
}
Write-Host ""

# Initialize output file
"StratOS Platform - Azure Resources" | Out-File -FilePath $OUTPUT_FILE
"Generated: $(Get-Date)" | Out-File -FilePath $OUTPUT_FILE -Append
"======================================" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append

# Create Azure OpenAI
Write-Host "Creating Azure OpenAI service (this may take 5-10 minutes)..." -ForegroundColor Yellow
$openaiExists = az cognitiveservices account show --name $OPENAI_NAME --resource-group $RESOURCE_GROUP 2>$null
if ($openaiExists) {
    Write-Host "⚠️  OpenAI service already exists" -ForegroundColor Yellow
} else {
    az cognitiveservices account create `
        --name $OPENAI_NAME `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --kind OpenAI `
        --sku S0 `
        --custom-domain $OPENAI_NAME `
        --yes | Out-Null
    Write-Host "✅ Azure OpenAI service created" -ForegroundColor Green
}

# Get OpenAI details
$OPENAI_ENDPOINT = az cognitiveservices account show --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query properties.endpoint -o tsv
$OPENAI_KEY = az cognitiveservices account keys list --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query key1 -o tsv

"AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT" | Out-File -FilePath $OUTPUT_FILE -Append
"AZURE_OPENAI_KEY=$OPENAI_KEY" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append

# Deploy OpenAI models
Write-Host "Deploying GPT-4 model..." -ForegroundColor Yellow
az cognitiveservices account deployment create `
    --name $OPENAI_NAME `
    --resource-group $RESOURCE_GROUP `
    --deployment-name gpt-4 `
    --model-name gpt-4 `
    --model-version "turbo-2024-04-09" `
    --model-format OpenAI `
    --sku-capacity 10 `
    --sku-name "Standard" 2>$null | Out-Null

Write-Host "Deploying text-embedding-ada-002 model..." -ForegroundColor Yellow
az cognitiveservices account deployment create `
    --name $OPENAI_NAME `
    --resource-group $RESOURCE_GROUP `
    --deployment-name text-embedding-ada-002 `
    --model-name text-embedding-ada-002 `
    --model-version "2" `
    --model-format OpenAI `
    --sku-capacity 10 `
    --sku-name "Standard" 2>$null | Out-Null

"AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4" | Out-File -FilePath $OUTPUT_FILE -Append
"AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append
Write-Host ""

# Create Cosmos DB
Write-Host "Creating Cosmos DB account (this may take 5-10 minutes)..." -ForegroundColor Yellow
$cosmosExists = az cosmosdb show --name $COSMOS_NAME --resource-group $RESOURCE_GROUP 2>$null
if ($cosmosExists) {
    Write-Host "⚠️  Cosmos DB account already exists" -ForegroundColor Yellow
} else {
    az cosmosdb create `
        --name $COSMOS_NAME `
        --resource-group $RESOURCE_GROUP `
        --locations regionName=$LOCATION failoverPriority=0 `
        --default-consistency-level Session `
        --enable-automatic-failover false | Out-Null
    Write-Host "✅ Cosmos DB account created" -ForegroundColor Green
}

# Create Cosmos database
Write-Host "Creating Cosmos database 'stratos'..." -ForegroundColor Yellow
az cosmosdb sql database create `
    --account-name $COSMOS_NAME `
    --resource-group $RESOURCE_GROUP `
    --name stratos 2>$null | Out-Null

# Create Cosmos containers
$CONTAINERS = @("users", "tenants", "conversations", "outputs", "prompts")
foreach ($CONTAINER in $CONTAINERS) {
    Write-Host "Creating container '$CONTAINER'..." -ForegroundColor Gray
    az cosmosdb sql container create `
        --account-name $COSMOS_NAME `
        --resource-group $RESOURCE_GROUP `
        --database-name stratos `
        --name $CONTAINER `
        --partition-key-path "/tenantId" `
        --throughput 400 2>$null | Out-Null
}

# Get Cosmos connection details
$COSMOS_ENDPOINT = az cosmosdb show --name $COSMOS_NAME --resource-group $RESOURCE_GROUP --query documentEndpoint -o tsv
$COSMOS_KEY = az cosmosdb keys list --name $COSMOS_NAME --resource-group $RESOURCE_GROUP --query primaryMasterKey -o tsv

"COSMOS_DB_ENDPOINT=$COSMOS_ENDPOINT" | Out-File -FilePath $OUTPUT_FILE -Append
"COSMOS_DB_KEY=$COSMOS_KEY" | Out-File -FilePath $OUTPUT_FILE -Append
"COSMOS_DB_DATABASE_NAME=stratos" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append
Write-Host ""

# Create Storage Account
Write-Host "Creating Storage Account..." -ForegroundColor Yellow
$storageExists = az storage account show --name $STORAGE_NAME --resource-group $RESOURCE_GROUP 2>$null
if ($storageExists) {
    Write-Host "⚠️  Storage Account already exists" -ForegroundColor Yellow
} else {
    az storage account create `
        --name $STORAGE_NAME `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --sku Standard_LRS `
        --kind StorageV2 | Out-Null
    Write-Host "✅ Storage Account created" -ForegroundColor Green
}

# Get storage connection string
$STORAGE_CONNECTION_STRING = az storage account show-connection-string --name $STORAGE_NAME --resource-group $RESOURCE_GROUP --query connectionString -o tsv

# Create blob containers
$BLOB_CONTAINERS = @("documents", "exports", "temp")
foreach ($CONTAINER in $BLOB_CONTAINERS) {
    Write-Host "Creating blob container '$CONTAINER'..." -ForegroundColor Gray
    az storage container create `
        --name $CONTAINER `
        --connection-string $STORAGE_CONNECTION_STRING 2>$null | Out-Null
}

"AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append
Write-Host ""

# Create Cognitive Search
Write-Host "Creating Cognitive Search service..." -ForegroundColor Yellow
$searchExists = az search service show --name $SEARCH_NAME --resource-group $RESOURCE_GROUP 2>$null
if ($searchExists) {
    Write-Host "⚠️  Search service already exists" -ForegroundColor Yellow
} else {
    az search service create `
        --name $SEARCH_NAME `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --sku basic | Out-Null
    Write-Host "✅ Cognitive Search service created" -ForegroundColor Green
}

# Get Search details
$SEARCH_ENDPOINT = "https://$SEARCH_NAME.search.windows.net"
$SEARCH_KEY = az search admin-key show --service-name $SEARCH_NAME --resource-group $RESOURCE_GROUP --query primaryKey -o tsv

"AZURE_SEARCH_ENDPOINT=$SEARCH_ENDPOINT" | Out-File -FilePath $OUTPUT_FILE -Append
"AZURE_SEARCH_KEY=$SEARCH_KEY" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append
Write-Host ""

# Create Key Vault
Write-Host "Creating Key Vault..." -ForegroundColor Yellow
$kvExists = az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP 2>$null
if ($kvExists) {
    Write-Host "⚠️  Key Vault already exists" -ForegroundColor Yellow
} else {
    az keyvault create `
        --name $KEYVAULT_NAME `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --sku standard | Out-Null
    Write-Host "✅ Key Vault created" -ForegroundColor Green
}

$KEYVAULT_URI = az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP --query properties.vaultUri -o tsv

"AZURE_KEYVAULT_URI=$KEYVAULT_URI" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append
Write-Host ""

# Create Application Insights
Write-Host "Creating Application Insights..." -ForegroundColor Yellow
$aiExists = az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP 2>$null
if ($aiExists) {
    Write-Host "⚠️  Application Insights already exists" -ForegroundColor Yellow
} else {
    az monitor app-insights component create `
        --app $APPINSIGHTS_NAME `
        --location $LOCATION `
        --resource-group $RESOURCE_GROUP `
        --application-type web | Out-Null
    Write-Host "✅ Application Insights created" -ForegroundColor Green
}

$APPINSIGHTS_KEY = az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP --query instrumentationKey -o tsv
$APPINSIGHTS_CONNECTION_STRING = az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP --query connectionString -o tsv

"APPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY" | Out-File -FilePath $OUTPUT_FILE -Append
"APPINSIGHTS_CONNECTION_STRING=$APPINSIGHTS_CONNECTION_STRING" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append
Write-Host ""

# Create App Service Plan (Consumption)
Write-Host "Creating App Service Plan for Functions..." -ForegroundColor Yellow
$planExists = az functionapp plan show --name $APPSERVICE_PLAN --resource-group $RESOURCE_GROUP 2>$null
if ($planExists) {
    Write-Host "⚠️  App Service Plan already exists" -ForegroundColor Yellow
} else {
    az functionapp plan create `
        --name $APPSERVICE_PLAN `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --sku Y1 `
        --is-linux false | Out-Null
    Write-Host "✅ App Service Plan created" -ForegroundColor Green
}
Write-Host ""

# Create Function App
Write-Host "Creating Function App..." -ForegroundColor Yellow
$funcExists = az functionapp show --name $FUNCTIONAPP_NAME --resource-group $RESOURCE_GROUP 2>$null
if ($funcExists) {
    Write-Host "⚠️  Function App already exists" -ForegroundColor Yellow
} else {
    az functionapp create `
        --name $FUNCTIONAPP_NAME `
        --resource-group $RESOURCE_GROUP `
        --plan $APPSERVICE_PLAN `
        --runtime node `
        --runtime-version 18 `
        --functions-version 4 `
        --storage-account $STORAGE_NAME | Out-Null
    Write-Host "✅ Function App created" -ForegroundColor Green
}

$FUNCTION_APP_URL = "https://$FUNCTIONAPP_NAME.azurewebsites.net"

"FUNCTION_APP_NAME=$FUNCTIONAPP_NAME" | Out-File -FilePath $OUTPUT_FILE -Append
"FUNCTION_APP_URL=$FUNCTION_APP_URL" | Out-File -FilePath $OUTPUT_FILE -Append
"" | Out-File -FilePath $OUTPUT_FILE -Append

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Azure Infrastructure Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "Location: $LOCATION" -ForegroundColor White
Write-Host ""
Write-Host "Created Resources:" -ForegroundColor Yellow
Write-Host "  - Azure OpenAI: $OPENAI_NAME" -ForegroundColor Gray
Write-Host "  - Cosmos DB: $COSMOS_NAME" -ForegroundColor Gray
Write-Host "  - Storage Account: $STORAGE_NAME" -ForegroundColor Gray
Write-Host "  - Cognitive Search: $SEARCH_NAME" -ForegroundColor Gray
Write-Host "  - Key Vault: $KEYVAULT_NAME" -ForegroundColor Gray
Write-Host "  - Application Insights: $APPINSIGHTS_NAME" -ForegroundColor Gray
Write-Host "  - Function App: $FUNCTIONAPP_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 Connection strings saved to: $OUTPUT_FILE" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review infrastructure/azure-setup.md for Azure AD B2C setup" -ForegroundColor White
Write-Host "  2. Copy values from $OUTPUT_FILE to .env files" -ForegroundColor White
Write-Host "  3. Deploy backend to Function App: $FUNCTIONAPP_NAME" -ForegroundColor White
Write-Host ""

