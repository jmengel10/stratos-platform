# Configure Backend Environment Variables
$FUNCTIONAPP = "stratos-platform-func-829197"
$RESOURCE_GROUP = "stratos-rg"

Write-Host "`nConfiguring backend environment variables..." -ForegroundColor Yellow

# Read connection strings from file
$config = @{}
Get-Content "connection-strings.txt" | ForEach-Object {
    if ($_ -match "^([A-Z_]+)=(.+)$") {
        $config[$matches[1]] = $matches[2]
    }
}

# Configure Function App settings
az functionapp config appsettings set `
  --name $FUNCTIONAPP `
  --resource-group $RESOURCE_GROUP `
  --settings `
    AZURE_OPENAI_ENDPOINT="$($config['AZURE_OPENAI_ENDPOINT'])" `
    AZURE_OPENAI_KEY="$($config['AZURE_OPENAI_KEY'])" `
    AZURE_OPENAI_DEPLOYMENT_NAME="$($config['AZURE_OPENAI_DEPLOYMENT_NAME'])" `
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT="$($config['AZURE_OPENAI_EMBEDDING_DEPLOYMENT'])" `
    COSMOS_DB_ENDPOINT="$($config['COSMOS_DB_ENDPOINT'])" `
    COSMOS_DB_KEY="$($config['COSMOS_DB_KEY'])" `
    COSMOS_DB_DATABASE_NAME="$($config['COSMOS_DB_DATABASE_NAME'])" `
    AZURE_STORAGE_CONNECTION_STRING="$($config['AZURE_STORAGE_CONNECTION_STRING'])" `
    AZURE_SEARCH_ENDPOINT="$($config['AZURE_SEARCH_ENDPOINT'])" `
    AZURE_SEARCH_KEY="$($config['AZURE_SEARCH_KEY'])" `
    APPINSIGHTS_INSTRUMENTATIONKEY="$($config['APPINSIGHTS_INSTRUMENTATIONKEY'])" `
    NODE_ENV="production" `
    FRONTEND_URL="https://stratos.vercel.app" `
    JWT_SECRET="stratos-platform-jwt-secret-key-min-32-characters-long"

Write-Host "`n✅ Backend environment variables configured!" -ForegroundColor Green
Write-Host "`nFunction App: $FUNCTIONAPP" -ForegroundColor White
Write-Host "Settings applied: 14 variables" -ForegroundColor Gray
Write-Host "`nRestarting Function App...`n" -ForegroundColor Yellow

az functionapp restart --name $FUNCTIONAPP --resource-group $RESOURCE_GROUP

Write-Host "✅ Backend restarted and ready!`n" -ForegroundColor Green

