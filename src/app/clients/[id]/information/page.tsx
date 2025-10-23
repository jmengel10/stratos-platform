'use client';

import { useParams } from 'next/navigation';

import { 
  Calendar, 
  User, 
  Edit, 
  Plus,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  DollarSign,
  Calendar as CalendarIcon,
  Shield,
  FileText,
  Download,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockClients } from '@/lib/mockData';

export default function ClientInformationPage() {
  const params = useParams();
  const clientId = params.id as string;
  
  const client = mockClients.find(c => c.id === clientId) || mockClients[0];

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Clients', href: '/clients' },
        { label: client.name },
        { label: 'Information' }
      ]} />

      {/* Client Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Avatar name={client.name} size="xl" />
          <div>
            <h1 className="text-4xl font-bold text-navy font-serif">{client.name}</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Client since {client.clientSince}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Primary: {client.primaryContact}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Client</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button className="pb-3 text-gray-600 hover:text-navy">
            Overview
          </button>
          <button className="pb-3 border-b-3 border-primary text-navy font-semibold">
            Information
          </button>
          <button className="pb-3 text-gray-600 hover:text-navy">
            Settings
          </button>
        </nav>
      </div>

      {/* Company Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-navy font-serif">Company Details</h3>
          <Button variant="secondary" size="sm" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <p className="text-navy">{client.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <p className="text-navy">{client.industry}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Company Size</label>
              <p className="text-navy">{client.companySize}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Annual Revenue</label>
              <p className="text-navy">{client.annualRevenue}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Founded</label>
              <p className="text-navy">{client.founded}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Website</label>
              <a href={`https://${client.website}`} className="text-primary hover:underline">{client.website}</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Headquarters</label>
              <p className="text-navy">{client.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <p className="text-navy">{client.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Stock Symbol</label>
              <p className="text-navy">{client.stockSymbol}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tax ID</label>
              <p className="text-navy">{client.taxId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Parent Company</label>
              <p className="text-navy">{client.parentCompany}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Employee Count</label>
              <p className="text-navy">{client.employeeCount}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Primary Contacts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-navy font-serif">Primary Contacts</h3>
          <Button variant="secondary" size="sm" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar name="John Williams" size="md" />
              <div className="flex-1">
                <h4 className="font-semibold text-navy">John Williams</h4>
                <p className="text-sm text-gray-600">Chief Financial Officer</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 text-primary" />
                    <a href="mailto:john.williams@acme.com" className="text-primary text-sm">john.williams@acme.com</a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-primary" />
                    <a href="tel:+15551234567" className="text-primary text-sm">+1 (555) 123-4567</a>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="role-admin">Primary Contact</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">Spoke 3 days ago</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar name="Jane Smith" size="md" />
              <div className="flex-1">
                <h4 className="font-semibold text-navy">Jane Smith</h4>
                <p className="text-sm text-gray-600">VP of Strategy</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 text-primary" />
                    <a href="mailto:jane.smith@acme.com" className="text-primary text-sm">jane.smith@acme.com</a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-primary" />
                    <a href="tel:+15551234568" className="text-primary text-sm">+1 (555) 123-4568</a>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="default">Secondary Contact</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">Email 1 week ago</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar name="Michael Roberts" size="md" />
              <div className="flex-1">
                <h4 className="font-semibold text-navy">Michael Roberts</h4>
                <p className="text-sm text-gray-600">Director of Operations</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 text-primary" />
                    <a href="mailto:michael.roberts@acme.com" className="text-primary text-sm">michael.roberts@acme.com</a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-primary" />
                    <a href="tel:+15551234569" className="text-primary text-sm">+1 (555) 123-4569</a>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="default">Secondary Contact</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">Meeting yesterday</p>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      {/* Relationship Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-navy font-serif">Relationship Details</h3>
          <Button variant="secondary" size="sm" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Client Since</label>
              <p className="text-navy">{client.clientSince}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Relationship Status</label>
              <div className="mt-1">
                <Badge variant="active">Active</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Contract Renewal</label>
              <p className="text-navy">{client.contractRenewal}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Billing Contact</label>
              <p className="text-navy">{client.billingContact}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Account Manager</label>
              <div className="flex items-center space-x-2 mt-1">
                <Avatar name="Sarah Chen" size="sm" />
                <span className="text-navy">{client.accountManager}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Contract Value</label>
              <p className="text-navy">{client.contractValue}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Payment Terms</label>
              <p className="text-navy">{client.paymentTerms}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Review Date</label>
              <p className="text-navy">{client.lastReviewDate}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Custom Fields */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-navy font-serif">Custom Fields</h3>
          <Button variant="secondary" size="sm" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Field</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">Investment Focus</span>
            <span className="text-sm text-navy">Healthcare Technology</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">AUM (Assets Under Management)</span>
            <span className="text-sm text-navy">$12B</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">Target Market</span>
            <span className="text-sm text-navy">High Net Worth Individuals</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">Regulatory Status</span>
            <span className="text-sm text-navy">SEC Registered</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">Risk Profile</span>
            <span className="text-sm text-navy">Conservative</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">Geographic Focus</span>
            <span className="text-sm text-navy">North America, Europe</span>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-navy font-serif">Notes</h3>
          <Button variant="primary" size="sm" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar name="Sarah Chen" size="sm" />
                <span className="text-sm font-medium text-navy">Sarah Chen</span>
                <span className="text-xs text-gray-500">• Jan 15, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="w-3 h-3 text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              Client is interested in expanding their digital transformation initiatives. Discussed potential Q2 2024 engagement for operations review.
            </p>
          </div>
          
          <div className="border-l-4 border-gray-200 pl-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar name="Michael Torres" size="sm" />
                <span className="text-sm font-medium text-navy">Michael Torres</span>
                <span className="text-xs text-gray-500">• Dec 20, 2023</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="w-3 h-3 text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              Quarterly business review completed. Client expressed satisfaction with current deliverables and requested proposal for additional strategic consulting services.
            </p>
          </div>
        </div>
      </Card>

      {/* Attached Documents */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-navy font-serif">Attached Documents</h3>
          <Button variant="secondary" size="sm" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Upload</span>
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-navy">NDA_Acme_2022.pdf</p>
                <p className="text-sm text-gray-500">Uploaded Jan 15, 2024 - 245 KB</p>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-navy">Contract_Amendment_2023.pdf</p>
                <p className="text-sm text-gray-500">Uploaded Mar 20, 2023 - 512 KB</p>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-navy">SOW_GTM_Strategy.docx</p>
                <p className="text-sm text-gray-500">Uploaded Jan 10, 2024 - 128 KB</p>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-navy">Client_Presentation_Q4.pdf</p>
                <p className="text-sm text-gray-500">Uploaded Dec 15, 2023 - 1.2 MB</p>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
