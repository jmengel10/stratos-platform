# Get all Azure connection strings
$RESOURCE_GROUP = "stratos-rg"
$OPENAI_NAME = "stratos-platform-openai-829197"
$COSMOS_NAME = "stratos-platform-cosmos-829197"
$STORAGE_NAME = "stratos829197"
$SEARCH_NAME = "stratos-platform-search-829197"
$APPINSIGHTS_NAME = "stratos-platform-insights"
$FUNCTIONAPP_NAME = "stratos-platform-func-829197"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "StratOS - Azure Connection Strings" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Create output file
$OUTPUT = "connection-strings.txt"
"StratOS Platform - Connection Strings" | Out-File -FilePath $OUTPUT
"Generated: $(Get-Date)" | Out-File -FilePath $OUTPUT -Append
"======================================`n" | Out-File -FilePath $OUTPUT -Append

# OpenAI
Write-Host "Getting OpenAI details..." -ForegroundColor Yellow
try {
    $OPENAI_ENDPOINT = az cognitiveservices account show --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query properties.endpoint -o tsv 2>$null
    $OPENAI_KEY = az cognitiveservices account keys list --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query key1 -o tsv 2>$null
    
    "AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT" | Out-File -FilePath $OUTPUT -Append
    "AZURE_OPENAI_KEY=$OPENAI_KEY" | Out-File -FilePath $OUTPUT -Append
    "AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4" | Out-File -FilePath $OUTPUT -Append
    "AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002" | Out-File -FilePath $OUTPUT -Append
    "" | Out-File -FilePath $OUTPUT -Append
    
    Write-Host "✅ OpenAI" -ForegroundColor Green
} catch {
    Write-Host "❌ OpenAI failed" -ForegroundColor Red
}

# Cosmos DB
Write-Host "Getting Cosmos DB details..." -ForegroundColor Yellow
try {
    $COSMOS_ENDPOINT = az cosmosdb show --name $COSMOS_NAME --resource-group $RESOURCE_GROUP --query documentEndpoint -o tsv 2>$null
    $COSMOS_KEY = az cosmosdb keys list --name $COSMOS_NAME --resource-group $RESOURCE_GROUP --query primaryMasterKey -o tsv 2>$null
    
    "COSMOS_DB_ENDPOINT=$COSMOS_ENDPOINT" | Out-File -FilePath $OUTPUT -Append
    "COSMOS_DB_KEY=$COSMOS_KEY" | Out-File -FilePath $OUTPUT -Append
    "COSMOS_DB_DATABASE_NAME=stratos" | Out-File -FilePath $OUTPUT -Append
    "" | Out-File -FilePath $OUTPUT -Append
    
    Write-Host "✅ Cosmos DB" -ForegroundColor Green
} catch {
    Write-Host "❌ Cosmos DB failed" -ForegroundColor Red
}

# Storage
Write-Host "Getting Storage details..." -ForegroundColor Yellow
try {
    $STORAGE_CONNECTION_STRING = az storage account show-connection-string --name $STORAGE_NAME --resource-group $RESOURCE_GROUP --query connectionString -o tsv 2>$null
    
    "AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING" | Out-File -FilePath $OUTPUT -Append
    "" | Out-File -FilePath $OUTPUT -Append
    
    Write-Host "✅ Storage" -ForegroundColor Green
} catch {
    Write-Host "❌ Storage failed" -ForegroundColor Red
}

# Search
Write-Host "Getting Search details..." -ForegroundColor Yellow
try {
    $SEARCH_ENDPOINT = "https://$SEARCH_NAME.search.windows.net"
    $SEARCH_KEY = az search admin-key show --service-name $SEARCH_NAME --resource-group $RESOURCE_GROUP --query primaryKey -o tsv 2>$null
    
    "AZURE_SEARCH_ENDPOINT=$SEARCH_ENDPOINT" | Out-File -FilePath $OUTPUT -Append
    "AZURE_SEARCH_KEY=$SEARCH_KEY" | Out-File -FilePath $OUTPUT -Append
    "" | Out-File -FilePath $OUTPUT -Append
    
    Write-Host "✅ Search" -ForegroundColor Green
} catch {
    Write-Host "❌ Search failed" -ForegroundColor Red
}

# Application Insights (try different method)
Write-Host "Getting Application Insights details..." -ForegroundColor Yellow
try {
    $APPINSIGHTS_KEY = az resource show --resource-group $RESOURCE_GROUP --name $APPINSIGHTS_NAME --resource-type "Microsoft.Insights/components" --query properties.InstrumentationKey -o tsv 2>$null
    
    "APPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY" | Out-File -FilePath $OUTPUT -Append
    "" | Out-File -FilePath $OUTPUT -Append
    
    Write-Host "✅ Application Insights" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Application Insights (optional)" -ForegroundColor Yellow
}

# Function App
"FUNCTION_APP_NAME=$FUNCTIONAPP_NAME" | Out-File -FilePath $OUTPUT -Append
"FUNCTION_APP_URL=https://$FUNCTIONAPP_NAME.azurewebsites.net" | Out-File -FilePath $OUTPUT -Append
"FRONTEND_URL=https://stratos.vercel.app" | Out-File -FilePath $OUTPUT -Append
"" | Out-File -FilePath $OUTPUT -Append

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Connection strings saved to:" -ForegroundColor Green
Write-Host "   $OUTPUT" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

# Display file
Write-Host "Connection Strings:" -ForegroundColor Yellow
Get-Content $OUTPUT

