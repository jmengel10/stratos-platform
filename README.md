# StratOS Platform

> AI-powered strategy consulting and venture capital platform built on Azure

## 🚀 Overview

StratOS is an enterprise-grade platform that leverages Azure OpenAI to provide intelligent strategy consulting services. The platform features specialized AI agents for GTM strategy, operations analysis, fundraising, product strategy, and data analysis.

### Key Features

- **Multi-Agent AI System**: 5 specialized agents for different consulting domains
- **Intelligent Routing**: Automatic agent selection based on user intent
- **RAG-Enhanced**: Context-aware responses using Azure Cognitive Search
- **Multi-Tenant**: Secure tenant isolation with usage quotas
- **Real-time Insights**: Application Insights integration for monitoring
- **Artifact Generation**: Produces frameworks, charts, decks, and spreadsheets

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  - Authentication (Azure AD B2C)                            │
│  - Chat Interface                                           │
│  - Artifact Viewer                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTPS / REST API
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Backend (Azure Functions)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Agent Router → GTM / Ops / Fundraising / Product /    │ │
│  │                 Data Analyst Agents                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Services: OpenAI / Cosmos DB / Search / Storage       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
┌───────▼──────┐ ┌───▼────────┐ ┌──▼───────┐ ┌───▼─────────┐
│ Azure OpenAI │ │ Cosmos DB  │ │ Cognitive│ │   Blob      │
│   (GPT-4)    │ │ (NoSQL)    │ │  Search  │ │  Storage    │
└──────────────┘ └────────────┘ └──────────┘ └─────────────┘
```

## 📋 Prerequisites

- **Node.js** 18+ and npm 9+
- **Azure CLI** 2.50+
- **Azure Subscription** with Owner or Contributor role
- **Git**
- **Azure Functions Core Tools** v4

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stratos-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Azure Infrastructure

```bash
# Login to Azure
az login

# Run the setup script (creates all Azure resources)
cd infrastructure
chmod +x setup.sh
./setup.sh

# Follow manual steps for Azure AD B2C
# See infrastructure/azure-setup.md for detailed instructions
```

### 4. Configure Environment Variables

```bash
# Copy template files
cp .env.template .env
cp backend/local.settings.json.template backend/local.settings.json
cp frontend/.env.local.example frontend/.env.local

# Edit .env files with values from infrastructure/azure-resources.txt
# See docs/environment-setup.md for detailed instructions
```

### 5. Validate Setup

```bash
# Run validation script
cd infrastructure
chmod +x validate-setup.sh
./validate-setup.sh
```

### 6. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Next.js on http://localhost:3000
npm run dev:backend   # Azure Functions on http://localhost:7071
```

## 📁 Project Structure

```
stratos-platform/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and hooks
│   └── public/              # Static assets
├── backend/                 # Azure Functions
│   ├── src/
│   │   ├── agents/         # AI agent implementations
│   │   ├── functions/      # HTTP-triggered functions
│   │   ├── services/       # Azure service clients
│   │   ├── models/         # TypeScript interfaces
│   │   └── utils/          # Helpers and utilities
│   ├── host.json           # Functions host config
│   └── package.json
├── infrastructure/          # Azure setup scripts
│   ├── setup.sh            # Resource provisioning
│   ├── validate-setup.sh   # Validation script
│   └── azure-setup.md      # Manual setup steps
├── docs/                   # Documentation
│   └── environment-setup.md
├── .github/
│   └── workflows/          # CI/CD pipelines
├── package.json            # Root workspace config
└── README.md
```

## 🤖 AI Agents

### GTM Strategist
Develops go-to-market strategies, identifies target segments, creates positioning frameworks.

### Ops & Cost Analyst
Analyzes operational efficiency, builds cost models, optimizes processes.

### Fundraising Advisor
Creates pitch decks, financial projections, investor targeting strategies.

### Product Strategist
Develops product roadmaps, prioritizes features, conducts user research analysis.

### Data Analyst
Analyzes datasets, creates visualizations, extracts actionable insights.

## 🔐 Security

- **Authentication**: Azure AD B2C with OAuth 2.0
- **Authorization**: JWT token validation on all API endpoints
- **Data Isolation**: Tenant-based partitioning in Cosmos DB
- **Secrets Management**: Azure Key Vault for credentials
- **Network Security**: HTTPS only, CORS configured

## 📊 Monitoring

- **Application Insights**: Real-time telemetry and logging
- **Usage Tracking**: Per-tenant quota monitoring
- **Performance**: Request/response times, dependency tracking
- **Errors**: Exception logging with stack traces

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific workspace
npm test --workspace=backend
npm test --workspace=frontend

# Run with coverage
npm test -- --coverage
```

## 🚢 Deployment

### Backend (Azure Functions)

```bash
cd backend
npm run build
func azure functionapp publish <your-function-app-name>
```

### Frontend (Azure Static Web Apps or App Service)

```bash
cd frontend
npm run build
# Deploy using Azure CLI or GitHub Actions
```

See `.github/workflows/` for automated CI/CD pipelines.

## 📖 Documentation

- [Environment Setup Guide](docs/environment-setup.md)
- [Azure Infrastructure Setup](infrastructure/azure-setup.md)
- [API Documentation](docs/api-reference.md)
- [Agent Development Guide](docs/agent-development.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

UNLICENSED - Proprietary software

## 🆘 Support

For issues and questions:
- Check documentation in `/docs`
- Review validation script output
- Contact the development team

---

**Built with ❤️ using Azure, OpenAI, and Next.js**

