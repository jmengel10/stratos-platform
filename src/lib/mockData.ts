// Mock data for all pages

export const mockClients = [
  {
    id: '1',
    name: 'Acme Corporation',
    industry: 'Financial Services',
    projects: 6,
    conversations: 18,
    lastActive: '2 days ago',
    clientSince: 'March 2022',
    primaryContact: 'John Williams, CFO',
    location: 'New York, NY',
    phone: '(555) 123-4567',
    email: 'contact@acme.com',
    website: 'acmecorp.com',
    companySize: '500-1000 employees',
    annualRevenue: '$500M - $1B',
    founded: '1995',
    type: 'Public Company',
    stockSymbol: 'ACME',
    taxId: 'XX-XXXXXXX',
    parentCompany: 'None',
    employeeCount: 850,
    status: 'Active',
    contractRenewal: 'March 2025',
    billingContact: 'Jane Smith, AP Manager',
    accountManager: 'Sarah Chen',
    contractValue: '$450,000 annual',
    paymentTerms: 'Net 30',
    lastReviewDate: 'January 2024'
  },
  {
    id: '2',
    name: 'TechVentures Group',
    industry: 'Healthcare Technology',
    projects: 8,
    conversations: 24,
    lastActive: '1 week ago',
    clientSince: 'January 2023',
    primaryContact: 'Mike Johnson, CEO',
    location: 'San Francisco, CA',
    phone: '(555) 234-5678',
    email: 'contact@techventures.com',
    website: 'techventures.com',
    companySize: '100-500 employees',
    annualRevenue: '$100M - $500M',
    founded: '2018',
    type: 'Private Company',
    stockSymbol: 'N/A',
    taxId: 'XX-XXXXXXX',
    parentCompany: 'None',
    employeeCount: 250,
    status: 'Active',
    contractRenewal: 'January 2025',
    billingContact: 'Lisa Chen, CFO',
    accountManager: 'Sarah Chen',
    contractValue: '$300,000 annual',
    paymentTerms: 'Net 30',
    lastReviewDate: 'December 2023'
  },
  {
    id: '3',
    name: 'HealthFirst Systems',
    industry: 'Medical Devices',
    projects: 12,
    conversations: 32,
    lastActive: '3 days ago',
    clientSince: 'June 2022',
    primaryContact: 'Dr. Sarah Wilson, CMO',
    location: 'Boston, MA',
    phone: '(555) 345-6789',
    email: 'contact@healthfirst.com',
    website: 'healthfirst.com',
    companySize: '1000+ employees',
    annualRevenue: '$1B+',
    founded: '2010',
    type: 'Public Company',
    stockSymbol: 'HFS',
    taxId: 'XX-XXXXXXX',
    parentCompany: 'None',
    employeeCount: 1200,
    status: 'Active',
    contractRenewal: 'June 2025',
    billingContact: 'Robert Davis, Finance Director',
    accountManager: 'Sarah Chen',
    contractValue: '$750,000 annual',
    paymentTerms: 'Net 30',
    lastReviewDate: 'November 2023'
  }
];

export const mockProjects = [
  {
    id: '1',
    title: 'GTM Strategy 2024',
    type: 'GTM Strategy',
    status: 'active',
    progress: 60,
    conversations: 8,
    members: 3,
    startDate: 'Jan 2024',
    dueDate: 'Mar 2024',
    lastActive: '3 hours ago',
    clientId: '1',
    description: 'Comprehensive go-to-market strategy for new product launch',
    priority: 'High',
    budget: '$45,000',
    tags: ['Q1', 'Enterprise', 'Healthcare']
  },
  {
    id: '2',
    title: 'Operations Review Q1',
    type: 'Operations',
    status: 'in-progress',
    progress: 35,
    conversations: 5,
    members: 2,
    startDate: 'Feb 2024',
    dueDate: 'Apr 2024',
    lastActive: '2 days ago',
    clientId: '1',
    description: 'Quarterly operations review and optimization',
    priority: 'Medium',
    budget: '$25,000',
    tags: ['Q1', 'Operations', 'Review']
  },
  {
    id: '3',
    title: 'Digital Transformation',
    type: 'Technology',
    status: 'active',
    progress: 80,
    conversations: 12,
    members: 4,
    startDate: 'Dec 2023',
    dueDate: 'Feb 2024',
    lastActive: 'Yesterday',
    clientId: '1',
    description: 'Digital transformation initiative for modern operations',
    priority: 'High',
    budget: '$80,000',
    tags: ['Digital', 'Transformation', 'Technology']
  }
];

export const mockActivity = [
  {
    id: '1',
    type: 'conversation',
    title: 'New conversation started in GTM Strategy 2024',
    description: 'Discussion about Q2 market positioning',
    user: 'Sarah Chen',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'document',
    title: 'Framework document generated',
    description: 'Market analysis framework completed',
    user: 'GTM Strategist',
    timestamp: '5 hours ago'
  },
  {
    id: '3',
    type: 'project',
    title: 'Operations Review Q1 marked as completed',
    description: 'Final deliverables submitted',
    user: 'Sarah Chen',
    timestamp: 'Yesterday'
  },
  {
    id: '4',
    type: 'team',
    title: 'New team member added to Digital Transformation',
    description: 'Mike Johnson joined as analyst',
    user: 'Sarah Chen',
    timestamp: '2 days ago'
  },
  {
    id: '5',
    type: 'calendar',
    title: 'Board Advisory meeting scheduled',
    description: 'Series B preparation call',
    user: 'John Williams',
    timestamp: '3 days ago'
  }
];

export const mockFiles = [
  {
    id: '1',
    name: 'Market_Analysis_Framework.pdf',
    size: '2.4 MB',
    date: 'Feb 10, 2024',
    client: 'Acme Corp',
    type: 'PDF'
  },
  {
    id: '2',
    name: 'GTM_Strategy_Template.docx',
    size: '156 KB',
    date: 'Feb 9, 2024',
    client: 'TechVentures',
    type: 'DOCX'
  },
  {
    id: '3',
    name: 'Org_Chart.png',
    size: '1.2 MB',
    date: 'Feb 8, 2024',
    client: 'HealthFirst',
    type: 'PNG'
  }
];

export const mockTemplates = [
  {
    id: '1',
    title: 'Go-to-Market Strategy Framework',
    description: 'Comprehensive framework for planning and executing market entry strategies',
    category: 'GTM Strategy',
    rating: 4.8,
    uses: 234,
    author: 'Sarah Chen',
    featured: true,
    previewColor: '#8B5CF6'
  },
  {
    id: '2',
    title: 'Operations Review Template',
    description: 'Structured approach to quarterly operations review and optimization',
    category: 'Operations',
    rating: 4.6,
    uses: 189,
    author: 'Mike Johnson',
    featured: true,
    previewColor: '#F97316'
  },
  {
    id: '3',
    title: 'GTM Strategy Framework',
    description: 'Step-by-step guide for developing go-to-market strategies',
    category: 'GTM Strategy',
    rating: 4.7,
    uses: 156,
    author: 'Sarah Chen',
    featured: false,
    previewColor: '#3B82F6'
  }
];

export const mockTeamMembers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@stratos.com',
    role: 'Owner',
    projects: ['Project Alpha', 'Project Beta', '+1 more'],
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'SC'
  },
  {
    id: '2',
    name: 'John Williams',
    email: 'john@stratos.com',
    role: 'Admin',
    projects: ['Project Alpha', 'Project Beta'],
    status: 'Active',
    lastActive: '2 hours ago',
    avatar: 'JW'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@stratos.com',
    role: 'Member',
    projects: ['Project Gamma'],
    status: 'Active',
    lastActive: '1 day ago',
    avatar: 'MJ'
  }
];

export const mockCalendarEvents = [
  {
    id: '1',
    title: 'GTM Strategy Call',
    time: '2:00 PM',
    client: 'Acme Corporation',
    date: '2024-02-13',
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Operations Review',
    time: '4:00 PM',
    client: 'TechVentures Group',
    date: '2024-02-13',
    type: 'meeting'
  },
  {
    id: '3',
    title: 'Fundraising Prep',
    time: '10:00 AM',
    client: 'HealthFirst Systems',
    date: '2024-02-14',
    type: 'meeting'
  }
];
