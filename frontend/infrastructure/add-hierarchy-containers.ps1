# Add Cosmos DB containers for Client-Project hierarchy

$COSMOS_NAME = "stratos-platform-cosmos-829197"
$RESOURCE_GROUP = "stratos-rg"

Write-Host "`n=== Adding Hierarchy Containers to Cosmos DB ===" -ForegroundColor Cyan
Write-Host ""

# Create clients container
Write-Host "Creating 'clients' container..." -ForegroundColor Yellow
az cosmosdb sql container create `
  --account-name $COSMOS_NAME `
  --resource-group $RESOURCE_GROUP `
  --database-name stratos `
  --name clients `
  --partition-key-path "/tenantId" `
  --throughput 400

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 'clients' container created" -ForegroundColor Green
} else {
    Write-Host "⚠️  'clients' container may already exist" -ForegroundColor Yellow
}

# Create projects container
Write-Host "Creating 'projects' container..." -ForegroundColor Yellow
az cosmosdb sql container create `
  --account-name $COSMOS_NAME `
  --resource-group $RESOURCE_GROUP `
  --database-name stratos `
  --name projects `
  --partition-key-path "/tenantId" `
  --throughput 400

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 'projects' container created" -ForegroundColor Green
} else {
    Write-Host "⚠️  'projects' container may already exist" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Containers Added Successfully ===" -ForegroundColor Green
Write-Host ""
Write-Host "Cosmos DB now has 7 containers:" -ForegroundColor White
Write-Host "  1. users" -ForegroundColor Gray
Write-Host "  2. tenants" -ForegroundColor Gray
Write-Host "  3. conversations" -ForegroundColor Gray
Write-Host "  4. outputs" -ForegroundColor Gray
Write-Host "  5. prompts" -ForegroundColor Gray
Write-Host "  6. clients (NEW)" -ForegroundColor Green
Write-Host "  7. projects (NEW)" -ForegroundColor Green
Write-Host ""

