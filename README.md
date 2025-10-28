# StratOS Platform

Enterprise AI Strategy Consulting Platform - Helping businesses make data-driven decisions and achieve sustainable growth.

## 🏗️ Project Structure

```
stratos-platform/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # React components
│   │   ├── lib/               # Utility functions
│   │   ├── store/             # Zustand state management
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── next.config.js         # Next.js configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── .nvmrc                 # Node version specification
├── backend/                   # Azure Functions backend
│   ├── src/
│   │   ├── functions/         # Azure Function endpoints
│   │   ├── services/          # Business logic services
│   │   ├── models/            # Data models
│   │   └── agents/            # AI agent implementations
│   ├── host.json              # Azure Functions host configuration
│   └── package.json           # Backend dependencies
├── infrastructure/            # Azure resource configurations
└── .github/
    └── workflows/             # GitHub Actions CI/CD pipelines
```

## 🚀 Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

### Backend Development

```bash
cd backend
npm install
npm start
```

API available at `http://localhost:7071/api`

## 📦 Deployment

### Production (Azure Static Web Apps)
- **URL**: https://thankful-dune-0bc99f70f-production.eastus2.3.azurestaticapps.net
- **Deployment**: Automatic on push to `master` branch via GitHub Actions

### Preview
- Automatic deployment for pull requests
- Preview URL generated for each PR

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Azure Functions, Node.js, TypeScript
- **Database**: Azure Cosmos DB
- **AI**: Azure OpenAI Service
- **Hosting**: Azure Static Web Apps
- **CI/CD**: GitHub Actions

## 📝 Key Features

- 🤖 AI-powered strategic consulting
- 👥 Multi-tenant architecture
- 📊 Data analytics and insights
- 📈 Project management
- 💬 AI conversation interface
- 📄 Document processing
- 🎨 Modern, responsive UI

## 🔐 Environment Variables

### Frontend
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071/api
```

### Backend
Create `backend/local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_OPENAI_ENDPOINT": "your-endpoint",
    "AZURE_OPENAI_API_KEY": "your-key",
    "COSMOS_DB_ENDPOINT": "your-endpoint",
    "COSMOS_DB_KEY": "your-key"
  }
}
```

## 📚 Documentation

- [Deployment Guide](frontend/AZURE_DEPLOYMENT_GUIDE.md)
- [Environment Setup](ENVIRONMENT_SETUP.md)
- [API Documentation](backend/README.md)

## 👥 Team

Built with ❤️ for strategic consultants

## 📄 License

All rights reserved © 2025 Stratos Platform
