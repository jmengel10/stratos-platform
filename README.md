# StratOS Platform

Enterprise AI Strategy Consulting Platform with Multi-Agent System, Data Analysis, and PowerPoint Generation.

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Azure Functions with TypeScript
- **Database**: Azure Cosmos DB
- **Deployment**: Azure Static Web Apps

## Quick Start

### Prerequisites
- Node.js 18+
- Azure CLI
- Azure subscription

### Development

1. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend Development**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Deployment

The application is configured for Azure deployment using GitHub Actions. The deployment is triggered automatically on push to the master branch.

## Project Structure

```
├── frontend/          # Next.js frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Dependencies
├── backend/           # Azure Functions backend
│   ├── src/           # Source code
│   └── package.json   # Dependencies
└── .github/           # GitHub Actions workflows
```

## Environment Variables

See `frontend/.env.example` and `backend/local.settings.json.template` for required environment variables.

## License

Private - All rights reserved.