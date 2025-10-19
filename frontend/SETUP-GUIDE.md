# StratOS Frontend - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:

```bash
# Azure AD B2C Configuration
NEXT_PUBLIC_B2C_CLIENT_ID=your-client-id
NEXT_PUBLIC_B2C_TENANT_NAME=stratos-platform
NEXT_PUBLIC_B2C_DOMAIN=stratos-platform.b2clogin.com
NEXT_PUBLIC_B2C_POLICY_NAME=B2C_1_signupsignin
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071/api

# App Configuration
NEXT_PUBLIC_APP_NAME=StratOS Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Global styles
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── console/           # AI console
│   │   └── api/               # API routes
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── landing/           # Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── ...
│   │   ├── shared/            # Shared components
│   │   │   ├── Navbar.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── console/           # Console-specific
│   │
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # MSAL configuration
│   │   ├── api.ts            # API client
│   │   └── utils.ts          # Helper functions
│   │
│   ├── store/                 # Zustand stores
│   │   ├── authStore.ts      # Auth state
│   │   ├── chatStore.ts      # Chat state
│   │   └── dashboardStore.ts # Dashboard state
│   │
│   └── types/                 # TypeScript types
│       ├── agent.types.ts
│       └── api.types.ts
│
├── public/                    # Static assets
│   ├── logo.svg
│   └── ...
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔑 Key Files to Create

### Priority 1: Authentication

1. **src/lib/auth.ts** - MSAL configuration
2. **src/store/authStore.ts** - Auth state management
3. **src/components/shared/ProtectedRoute.tsx** - Route protection

### Priority 2: API Integration

4. **src/lib/api.ts** - API client with axios
5. **src/types/api.types.ts** - API type definitions

### Priority 3: UI Components

6. **src/components/ui/button.tsx**
7. **src/components/ui/input.tsx**
8. **src/components/shared/Navbar.tsx**
9. **src/components/shared/LoadingSpinner.tsx**

### Priority 4: Pages

10. **src/app/layout.tsx** - Root layout
11. **src/app/page.tsx** - Landing page
12. **src/app/dashboard/page.tsx** - Dashboard
13. **src/app/console/page.tsx** - AI Console

## 🎨 Tailwind Configuration

The project uses:
- **Primary**: Blue/Indigo palette
- **Fonts**: Inter (via Google Fonts)
- **Plugins**: Typography, Forms
- **Custom animations**: fade-in, slide-up, accordion

## 📦 Dependencies

### Core
- **Next.js 14**: App Router, Server Components
- **React 18**: Latest React features
- **TypeScript**: Type safety

### Authentication
- **@azure/msal-browser**: Azure AD B2C
- **@azure/msal-react**: React bindings

### State Management
- **zustand**: Lightweight state management
- **persist middleware**: LocalStorage persistence

### API & Data
- **axios**: HTTP client
- **react-hot-toast**: Notifications

### UI Components
- **@radix-ui**: Accessible primitives
- **lucide-react**: Icon library
- **recharts**: Charts
- **react-markdown**: Markdown rendering
- **tailwindcss**: Utility-first CSS

## 🔐 Authentication Flow

```
1. User visits landing page
2. Clicks "Get Started" → redirects to Azure AD B2C
3. User completes B2C login/signup
4. B2C redirects back with JWT token
5. MSAL stores token, extracts claims
6. authStore updates with user info
7. User redirected to /console
8. All API calls include Bearer token
```

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier

# Type Checking
npx tsc --noEmit        # Check types
```

## 📱 Responsive Design

All components are fully responsive:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## 🎯 Next Steps

1. **Complete authentication setup**:
   - Implement MSAL configuration
   - Create auth store
   - Add protected routes

2. **Build landing page**:
   - Hero section
   - Features showcase
   - Pricing table
   - FAQ section

3. **Develop AI Console**:
   - Chat interface
   - Agent selector
   - Artifact viewer
   - Conversation history

4. **Add Dashboard**:
   - Usage statistics
   - Recent conversations
   - Quick actions
   - Team management

5. **Implement user features**:
   - Profile settings
   - Team invitations
   - Plan upgrades
   - Export functionality

## 🧪 Testing

```bash
# Component testing (to be added)
npm run test

# E2E testing (to be added)
npm run test:e2e
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Azure Static Web Apps

```bash
az staticwebapp create \
  --name stratos-frontend \
  --resource-group stratos-rg \
  --location eastus \
  --source .
```

### Docker

```bash
docker build -t stratos-frontend .
docker run -p 3000:3000 stratos-frontend
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Zustand](https://docs.pmnd.rs/zustand)

## 🆘 Troubleshooting

### Authentication Issues
- Verify B2C configuration in Azure Portal
- Check redirect URIs match exactly
- Ensure policy names are correct

### API Connection Issues
- Confirm backend is running on port 7071
- Check CORS settings
- Verify JWT token is being sent

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check for TypeScript errors

---

**Frontend foundation is ready for development!** 🎨

