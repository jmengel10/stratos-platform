'use client';

import { 
  Search, 
  Plus, 
  Users, 
  CheckCircle, 
  Mail, 
  Shield,
  Edit,
  Trash2,
  Send,
  X,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockTeamMembers } from '@/lib/mockData';

export default function TeamPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Settings', href: '/settings' },
        { label: 'Team Management' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage your organization members, roles, and permissions</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Invite Members</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Users className="w-8 h-8" />}
          label="Total Members"
          value="10"
        />
        <StatsCard
          icon={<CheckCircle className="w-8 h-8" />}
          label="Active Users"
          value="9"
        />
        <StatsCard
          icon={<Mail className="w-8 h-8" />}
          label="Pending Invitations"
          value="2"
        />
        <StatsCard
          icon={<Shield className="w-8 h-8" />}
          label="Admins"
          value="3"
        />
      </div>

      {/* User Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5] focus:border-transparent"
              />
            </div>
            <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5]">
              <option>All Roles</option>
              <option>Owner</option>
              <option>Admin</option>
              <option>Member</option>
              <option>Client</option>
            </select>
            <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5]">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Projects</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTeamMembers.map((member) => (
                <tr key={member.id} className="border-b border-[#E5E7EB] hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar name={member.name} size="sm" />
                      <div>
                        <p className="font-medium text-navy">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        {member.name === 'Sarah Chen' && (
                          <span className="text-xs text-gray-500">You</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={`role-${member.role.toLowerCase()}` as any}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {member.projects.map((project, index) => (
                        <span key={index}>
                          {project}
                          {index < member.projects.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        member.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm text-gray-600">{member.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{member.lastActive}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Invitations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-navy font-serif mb-4">Pending Invitations</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-navy">alex.thompson@example.com</p>
                <p className="text-sm text-gray-600">Sent 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="role-member">Member</Badge>
              <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                <Send className="w-3 h-3" />
                <span>Resend</span>
              </Button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-navy">maria.rodriguez@example.com</p>
                <p className="text-sm text-gray-600">Sent 5 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="role-viewer">Viewer</Badge>
              <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                <Send className="w-3 h-3" />
                <span>Resend</span>
              </Button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Role Permissions */}
      <div>
        <h3 className="text-lg font-semibold text-navy font-serif mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy">Owner (Full Access)</h4>
              <div className="flex space-x-2">
                <Badge variant="role-owner">Full Access</Badge>
                <Badge variant="active">Your Role</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Full system access and control</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Manage billing and subscription</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Transfer ownership</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Delete organization</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy">Admin (High Access)</h4>
              <Badge variant="role-admin">High Access</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Manage team members</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Create and delete projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Modify all settings</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">View all analytics</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy">Member (Standard Access)</h4>
              <Badge variant="role-member">Standard Access</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Create and edit own projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Collaborate with team</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">View shared project members</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Comment and share</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy">Client (Client Access)</h4>
              <Badge variant="role-client">Client Access</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">View assigned projects only</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Access own client data</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Download reports</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Cannot see other clients</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
