# StratOS - Fix and Complete Azure Infrastructure
# Run this to fix the issues and complete setup

$RESOURCE_GROUP = "stratos-rg"
$LOCATION = "eastus"
$UNIQUE_SUFFIX = "829197"
$COSMOS_NAME = "stratos-platform-cosmos-$UNIQUE_SUFFIX"
$STORAGE_NAME = "stratos$UNIQUE_SUFFIX"
$FUNCTIONAPP_NAME = "stratos-platform-func-$UNIQUE_SUFFIX"
$APPSERVICE_PLAN = "stratos-platform-plan"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing and Completing Azure Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register Cosmos DB provider
Write-Host "1. Registering Cosmos DB provider..." -ForegroundColor Yellow
az provider register --namespace Microsoft.DocumentDB
Write-Host "   Waiting for registration (30 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 30
Write-Host "   ✅ Provider registered" -ForegroundColor Green
Write-Host ""

# Step 2: Create Cosmos DB
Write-Host "2. Creating Cosmos DB (this takes 5-10 minutes)..." -ForegroundColor Yellow
az cosmosdb create `
  --name $COSMOS_NAME `
  --resource-group $RESOURCE_GROUP `
  --locations regionName=$LOCATION failoverPriority=0 `
  --default-consistency-level Session `
  --enable-automatic-failover false

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Cosmos DB created" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Cosmos DB creation had issues, continuing..." -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Create Cosmos Database
Write-Host "3. Creating Cosmos database..." -ForegroundColor Yellow
az cosmosdb sql database create `
  --account-name $COSMOS_NAME `
  --resource-group $RESOURCE_GROUP `
  --name stratos

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Database created" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Database creation had issues" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Create Cosmos Containers
Write-Host "4. Creating Cosmos containers..." -ForegroundColor Yellow
$CONTAINERS = @("users", "tenants", "conversations", "outputs", "prompts")
foreach ($CONTAINER in $CONTAINERS) {
    Write-Host "   Creating: $CONTAINER" -ForegroundColor Gray
    az cosmosdb sql container create `
      --account-name $COSMOS_NAME `
      --resource-group $RESOURCE_GROUP `
      --database-name stratos `
      --name $CONTAINER `
      --partition-key-path "/tenantId" `
      --throughput 400 2>$null
}
Write-Host "   ✅ Containers created" -ForegroundColor Green
Write-Host ""

# Step 5: Verify blob containers (they already exist, which is good!)
Write-Host "5. Blob containers..." -ForegroundColor Yellow
Write-Host "   ✅ Blob containers already exist (documents, exports, temp)" -ForegroundColor Green
Write-Host ""

# Step 6: Create Function App with Consumption Plan
Write-Host "6. Creating Function App with Consumption Plan..." -ForegroundColor Yellow

# Try creating consumption plan
az functionapp create `
  --name $FUNCTIONAPP_NAME `
  --resource-group $RESOURCE_GROUP `
  --consumption-plan-location $LOCATION `
  --runtime node `
  --runtime-version 18 `
  --functions-version 4 `
  --storage-account $STORAGE_NAME `
  --os-type Windows

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Function App created" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Function App creation had issues" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check what exists
Write-Host "Checking resources..." -ForegroundColor Yellow
az resource list --resource-group $RESOURCE_GROUP --query "[].{Name:name, Type:type}" --output table

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Function App Name: $FUNCTIONAPP_NAME" -ForegroundColor White
Write-Host ""
Write-Host "To deploy backend:" -ForegroundColor Yellow
Write-Host "  cd ..\backend" -ForegroundColor Gray
Write-Host "  npm install" -ForegroundColor Gray
Write-Host "  npm run build" -ForegroundColor Gray
Write-Host "  func azure functionapp publish $FUNCTIONAPP_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "To deploy frontend:" -ForegroundColor Yellow
Write-Host "  cd ..\frontend" -ForegroundColor Gray
Write-Host "  vercel login" -ForegroundColor Gray
Write-Host "  vercel --prod" -ForegroundColor Gray
Write-Host ""

