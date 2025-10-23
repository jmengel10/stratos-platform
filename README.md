# Stratos - AI-Powered Strategy Consulting Platform

A modern, responsive web application built with Next.js 14, TypeScript, and Tailwind CSS, designed to match Figma designs pixel-perfect.

## 🚀 Features

- **15 Complete Pages** - Dashboard, Clients, Projects, Conversations, Calendar, Files, Templates, Team Management, Reports, and Settings
- **Pixel-Perfect Design** - Matches Figma designs exactly with proper colors, fonts, and spacing
- **Responsive Layout** - Works on desktop, tablet, and mobile devices
- **Modern UI Components** - Reusable components with consistent styling
- **Mock Data** - Comprehensive sample data for all features
- **TypeScript** - Full type safety throughout the application

## 🎨 Design System

- **Primary Color**: `#33A7B5` (teal/cyan)
- **Navy Text**: `#0F172A`
- **Background**: `#F9FAFB`
- **Fonts**: Playfair Display (headings) + Inter (body)
- **Borders**: `#E5E7EB`

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Authentication**: Azure MSAL
- **Database**: Azure Cosmos DB
- **Deployment**: Vercel, Azure Static Web Apps

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 app router pages
│   ├── home/              # Dashboard
│   ├── clients/           # Client management
│   ├── projects/          # Project management
│   ├── console/           # Chat conversations
│   ├── calendar/          # Calendar view
│   ├── files/             # File library
│   ├── templates/         # Template library
│   ├── team/              # Team management
│   ├── settings/          # Account settings
│   └── reports/           # Analytics & reports
├── components/            # Reusable components
│   ├── layout/           # Sidebar, TopBar, Breadcrumb
│   ├── ui/               # Basic UI components
│   └── features/         # Feature-specific components
├── lib/                  # Utilities and mock data
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stratos-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages Overview

### Dashboard (`/home`)
- Welcome message with user name
- Key statistics cards (clients, projects, conversations, completion rate)
- Activity overview chart
- Quick action cards
- Recent activity timeline
- Upcoming events

### Client Management (`/clients`)
- Client list with search and filters
- Client detail overview with stats and projects
- Client information (company details, contacts, notes, documents)
- Client settings with form fields

### Project Management (`/projects`)
- Project list with search and filters
- Project detail with stats and activity
- Project settings with form fields

### Conversations (`/console`)
- Conversation list with AI agents
- Chat interface with message history
- Agent selection and conversation management

### Calendar (`/calendar`)
- Month view with events
- Mini calendar with navigation
- Upcoming events sidebar
- Event creation and management

### File Library (`/files`)
- Storage usage indicator
- File grid with search and filters
- File categories (clients, projects, all files)
- File actions (download, share, delete)

### Templates (`/templates`)
- Template library with categories
- Featured templates section
- Template cards with ratings and usage
- Filter pills for categories

### Team Management (`/team`)
- Team member table with roles
- User statistics cards
- Pending invitations
- Role permissions overview

### Reports (`/reports`)
- Analytics dashboard
- Key metrics with trends
- AI agent performance
- Client engagement charts
- Export functionality

### Settings (`/settings`)
- Account settings with profile form
- Photo upload functionality
- Personal information management

## 🎨 Components

### Layout Components
- **Sidebar**: 250px fixed navigation with collapsible functionality
- **TopBar**: 64px header with search and user menu
- **Breadcrumb**: Navigation breadcrumbs for deep pages

### UI Components
- **Button**: Primary, secondary, and outline variants
- **Card**: White background with borders and shadows
- **StatsCard**: Icon, label, value, and trend display
- **Badge**: Colored pills for status and roles
- **Avatar**: Colored circles with user initials

### Feature Components
- **ProjectCard**: Project display with progress, stats, and actions
- **ClientCard**: Client display with industry and activity
- **ActivityItem**: Timeline item with icon and description
- **FileCard**: File display with metadata and actions
- **TemplateCard**: Template display with ratings and usage

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Azure Static Web Apps
1. Create Azure Static Web App resource
2. Connect to GitHub repository
3. Configure build settings for Next.js
4. Deploy automatically on push

### Environment Variables
```bash
# Azure Configuration
AZURE_CLIENT_ID=your_client_id
AZURE_TENANT_ID=your_tenant_id
AZURE_REDIRECT_URI=your_redirect_uri

# API Configuration
API_BASE_URL=your_api_url
```

## 📊 Mock Data

The application includes comprehensive mock data for:
- 12 clients with full company details
- 25 projects with progress and metadata
- Activity timeline with different types
- Files with sizes, dates, and clients
- Templates with ratings and usage
- Team members with roles and permissions
- Calendar events with times and clients

## 🎯 Design Compliance

This application has been built to match Figma designs exactly:
- ✅ Pixel-perfect color matching
- ✅ Exact typography (Playfair Display + Inter)
- ✅ Precise spacing and layout
- ✅ Consistent component styling
- ✅ Proper responsive behavior
- ✅ Accurate navigation structure

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:azure     # Deploy to Azure
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@stratos.com or create an issue in the GitHub repository.
