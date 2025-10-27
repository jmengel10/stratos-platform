# StratOS Platform - Backend

Azure Functions-based backend with AI agents, RAG, and comprehensive Azure services integration.

## Architecture

```
backend/
├── src/
│   ├── agents/          # AI agent implementations
│   │   ├── base-agent.ts           # Abstract base class
│   │   ├── gtm-strategist.ts       # GTM Strategy agent
│   │   ├── ops-analyst.ts          # Operations & Cost agent
│   │   ├── fundraising-advisor.ts  # Fundraising agent
│   │   ├── product-strategist.ts   # Product strategy agent
│   │   └── data-analyst.ts         # Data analysis agent
│   │
│   ├── functions/       # HTTP-triggered Azure Functions
│   │   ├── chat.ts                # Main chat endpoint
│   │   ├── search-context.ts       # Document search
│   │   ├── upload-document.ts      # File uploads
│   │   ├── get-conversations.ts    # Conversation history
│   │   └── get-tenant-usage.ts     # Usage statistics
│   │
│   ├── services/        # Azure service clients
│   │   ├── openai.service.ts      # Azure OpenAI
│   │   ├── cosmos.service.ts       # Cosmos DB
│   │   ├── search.service.ts       # Cognitive Search
│   │   ├── storage.service.ts      # Blob Storage
│   │   └── insights.service.ts     # Application Insights
│   │
│   ├── models/          # TypeScript interfaces
│   │   └── index.ts
│   │
│   └── utils/           # Utilities
│       ├── routing.ts              # Agent router
│       └── auth.ts                 # JWT authentication
│
├── package.json
├── tsconfig.json
├── host.json
└── local.settings.json  # (Create from template)
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `local.settings.json` from the template:

```bash
cp local.settings.json.template local.settings.json
```

Fill in Azure credentials from `infrastructure/azure-resources.txt`.

### 3. Build

```bash
npm run build
```

### 4. Run Locally

```bash
npm start
```

Functions will be available at `http://localhost:7071/api/`

## API Endpoints

### POST /api/chat

Main chat endpoint for agent conversations.

**Request:**
```json
{
  "message": "How should I position my SaaS product?",
  "agentName": "GTM Strategist",  // Optional
  "industry": "saas",              // Optional
  "conversationId": "uuid",         // Optional
  "previousContext": {}             // Optional
}
```

**Response:**
```json
{
  "agentName": "GTM Strategist",
  "response": {
    "content": "...",
    "artifacts": [...],
    "suggestions": [...],
    "nextAgent": "Ops & Cost Analyst",
    "metadata": {
      "tokensUsed": 1500,
      "duration": 3500,
      "model": "gpt-4"
    }
  },
  "conversationId": "uuid"
}
```

### POST /api/search

Search documents using hybrid search.

**Request:**
```json
{
  "query": "pricing strategy",
  "filters": {
    "industry": "saas",
    "documentType": "strategy"
  },
  "limit": 10,
  "useVector": true
}
```

**Response:**
```json
{
  "results": [
    {
      "document": {...},
      "score": 0.95,
      "highlights": ["..."]
    }
  ],
  "count": 10
}
```

### POST /api/upload

Upload and index documents.

**Request:** Multipart form data
- `file`: File to upload
- `title`: Optional title
- `tags`: Comma-separated tags
- `documentType`: Document category

**Response:**
```json
{
  "documentId": "uuid",
  "fileName": "strategy.pdf",
  "indexed": true,
  "url": "https://..."
}
```

### GET /api/conversations

Get conversation history.

**Query Parameters:**
- `limit`: Number of conversations (default: 20)
- `skip`: Offset for pagination
- `agent`: Filter by agent name
- `startDate`: Filter by date range
- `endDate`: Filter by date range

**Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "title": "...",
      "agentName": "GTM Strategist",
      "messageCount": 5,
      "lastMessage": "...",
      "createdAt": "2024-01-15T10:00:00Z",
      "lastMessageAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 20,
  "hasMore": true
}
```

### GET /api/tenant/usage

Get tenant usage statistics.

**Response:**
```json
{
  "tenant": {
    "id": "uuid",
    "name": "Acme Corp",
    "industry": "saas",
    "plan": "professional"
  },
  "usage": {
    "requestsThisMonth": 250,
    "storageUsedMB": 1500
  },
  "quota": {
    "maxRequestsPerMonth": 1000,
    "maxStorageMB": 5000
  },
  "percentages": {
    "requests": 25,
    "storage": 30
  },
  "remaining": {
    "requests": 750,
    "storageMB": 3500
  },
  "trends": [...]
}
```

## AI Agents

### 1. GTM Strategist
- Market analysis and sizing
- Customer segmentation
- Positioning and messaging
- Channel strategy
- Launch planning

### 2. Ops & Cost Analyst
- Cost modeling and breakdown
- Operational efficiency
- Process optimization
- ROI calculation
- Vendor analysis

### 3. Fundraising Advisor
- Pitch deck development
- Financial projections
- Investor targeting
- Valuation guidance
- Due diligence prep

### 4. Product Strategist
- Product roadmapping
- Feature prioritization (RICE, ICE)
- User persona development
- Competitive analysis
- Success metrics

### 5. Data Analyst
- Statistical analysis
- Data visualization
- Trend identification
- Insight extraction
- Predictive modeling

## Agent Routing

The system uses intelligent routing to select the best agent:

1. **AI-based routing**: GPT-4 analyzes user intent
2. **Keyword fallback**: Pattern matching if AI fails
3. **Follow-up detection**: Continues with same agent
4. **Agent chaining**: Suggests next agent based on context

## Authentication

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

Token payload:
```json
{
  "userId": "uuid",
  "tenantId": "uuid",
  "email": "user@example.com",
  "role": "admin|member|viewer"
}
```

## Testing

```bash
# Run tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Azure

```bash
func azure functionapp publish <function-app-name>
```

Or use GitHub Actions (see `.github/workflows/`).

## Environment Variables

See `local.settings.json.template` for all required variables:

- **Azure OpenAI**: Endpoint, key, deployment names
- **Cosmos DB**: Endpoint, key, database name
- **Storage**: Connection string
- **Cognitive Search**: Endpoint, key
- **App Insights**: Instrumentation key
- **Azure AD B2C**: Tenant, client ID, secret
- **Application**: JWT secret, feature flags

## Monitoring

Application Insights tracks:
- Request/response times
- Token usage per agent
- Error rates and exceptions
- Custom events (routing, searches, uploads)
- Dependency calls (OpenAI, Cosmos, etc.)

View telemetry in Azure Portal → Application Insights.

## Development

### Adding a New Agent

1. Create agent class extending `BaseAgent`:
```typescript
export class MyAgent extends BaseAgent {
  readonly name = 'My Agent';
  readonly description = '...';
  readonly systemPrompt = '...';
  readonly capabilities = [...];

  protected getIndustryModifier(industry: string): string { }
  protected parseResponse(response: string, context: AgentContext): AgentResponse { }
  protected extractArtifacts(response: string): Artifact[] { }
}
```

2. Register in `chat.ts`:
```typescript
const agents = {
  // ...
  'my-agent': new MyAgent(),
};
```

3. Add to router definitions in `chat.ts`.

### Adding a New Function

1. Create file in `src/functions/`:
```typescript
import { app, HttpRequest, HttpResponseInit } from '@azure/functions';

async function handler(request: HttpRequest): Promise<HttpResponseInit> {
  // Implementation
}

app.http('function-name', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'custom-route',
  handler,
});
```

2. Build and test locally.

## Troubleshooting

### Functions not starting

- Check `local.settings.json` has all required variables
- Ensure Azure Functions Core Tools v4 is installed
- Check port 7071 is not in use

### OpenAI errors

- Verify deployment names match exactly
- Check API key is valid
- Ensure sufficient quota

### Cosmos DB connection issues

- Verify endpoint URL includes https:// and :443/
- Check firewall allows your IP
- Ensure using primary master key

### Search not working

- Verify search service is running
- Check index exists and has documents
- Ensure vector search is configured

## Support

For issues:
1. Check Application Insights for errors
2. Review function logs
3. Validate environment variables
4. See main project README for general setup

---

**Built with Azure Functions, TypeScript, and OpenAI**

