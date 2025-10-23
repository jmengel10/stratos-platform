import { Calendar, User, Edit, Plus, FolderOpen, MessageSquare, FileText, Clock, MoreVertical, Grid, List } from 'lucide-react';

export async function generateStaticParams() {
  return [
    { id: 'acme-corporation' },
    { id: 'techventures-group' },
    { id: 'healthfirst-systems' },
    { id: 'globaltech-partners' },
    { id: 'medcore-solutions' },
    { id: 'innovateco' },
    { id: 'fintech-dynamics' },
    { id: 'enterprise-solutions' },
    { id: 'nexgen-industries' }
  ];
}

export default function ClientDetailPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-[#6B7280]">
        Home &gt; Clients &gt; Acme Corporation
      </div>

      {/* Client Header */}
      <div className="bg-white border-b border-[#E5E7EB] p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              A
            </div>
          <div>
              <h1 className="text-4xl font-bold text-[#0F172A] font-serif">Acme Corporation</h1>
              <div className="flex items-center space-x-4 mt-2 text-[#6B7280]">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                  <span>Client since March 2022</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                  <span>Primary: John Williams, CFO</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            <span>Edit Client</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#33A7B5] text-white rounded-lg hover:bg-[#33A7B5]/90">
            <Plus className="w-4 h-4" />
              <span>New Proj</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b border-[#E5E7EB]">
        <button className="pb-3 border-b-3 border-[#33A7B5] text-[#0F172A] font-semibold">
            Overview
          </button>
        <button className="pb-3 text-[#6B7280] hover:text-[#0F172A]">
            Information
          </button>
        <button className="pb-3 text-[#6B7280] hover:text-[#0F172A]">
            Settings
          </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Total Projects</p>
              <p className="text-4xl font-bold text-[#0F172A]">6</p>
              <p className="text-sm text-[#6B7280]">2 active</p>
            </div>
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Active Conversations</p>
              <p className="text-4xl font-bold text-[#0F172A]">18</p>
              <p className="text-sm text-[#6B7280]">Last 30 days</p>
            </div>
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Artifacts Generated</p>
              <p className="text-4xl font-bold text-[#0F172A]">43</p>
              <p className="text-sm text-[#6B7280]">Frameworks & decks</p>
            </div>
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Last Engagement</p>
              <p className="text-4xl font-bold text-[#0F172A]">2 days ago</p>
              <p className="text-sm text-[#6B7280]">GTM Strategy call</p>
            </div>
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">Projects</h2>
          <div className="flex items-center space-x-1">
            <button className="p-2 bg-[#33A7B5] text-white rounded-lg">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project Card 1 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#33A7B5] rounded-full flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">GTM Strategy 2024</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 bg-[#33A7B5]/10 text-[#33A7B5] text-xs rounded-full">GTM Strategy</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-1 text-[#6B7280] hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Progress</span>
                <span className="text-sm font-medium text-[#0F172A]">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#33A7B5] h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#6B7280]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>8 conversations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>3 members</span>
                </div>
              </div>
              <p>Started Jan 2024 • Due Mar 2024</p>
              <p>Active 3 hours ago</p>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#33A7B5] rounded-full flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">Operations Review Q1</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Operations</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-blue-600">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-1 text-[#6B7280] hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Progress</span>
                <span className="text-sm font-medium text-[#0F172A]">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#33A7B5] h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#6B7280]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>5 conversations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>2 members</span>
                </div>
              </div>
              <p>Started Feb 2024 • Due Apr 2024</p>
              <p>Active 2 days ago</p>
            </div>
          </div>

          {/* Project Card 3 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#33A7B5] rounded-full flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">Digital Transformation</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">Technology</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-1 text-[#6B7280] hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Progress</span>
                <span className="text-sm font-medium text-[#0F172A]">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#33A7B5] h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#6B7280]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>12 conversations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>4 members</span>
                </div>
              </div>
              <p>Started Dec 2023 • Due Feb 2024</p>
              <p>Active Yesterday</p>
            </div>
          </div>

          {/* Project Card 4 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#33A7B5] rounded-full flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">Board Advisory - Series B</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 bg-[#33A7B5]/10 text-[#33A7B5] text-xs rounded-full">Advisory</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Planning</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-1 text-[#6B7280] hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Progress</span>
                <span className="text-sm font-medium text-[#0F172A]">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#33A7B5] h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#6B7280]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>3 conversations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>2 members</span>
                </div>
              </div>
              <p>Started Mar 2024 • Due Jun 2024</p>
              <p>Active 1 week ago</p>
            </div>
          </div>

          {/* Project Card 5 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#33A7B5] rounded-full flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">M&A Due Diligence</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">M&A</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-1 text-[#6B7280] hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-[#6B7280]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>15 conversations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>5 members</span>
                </div>
              </div>
              <p>Started Nov 2023 • Due Jan 2024</p>
              <p>Active Today</p>
            </div>
          </div>

          {/* Project Card 6 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#33A7B5] rounded-full flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">Strategic Planning 2025</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Strategy</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Planning</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-1 text-[#6B7280] hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Progress</span>
                <span className="text-sm font-medium text-[#0F172A]">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#33A7B5] h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#6B7280]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>4 conversations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>3 members</span>
                </div>
              </div>
              <p>Started Mar 2024 • Due May 2024</p>
              <p>Active 3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Recent Activity</h2>
          <div className="space-y-4">
          {[
            { text: "New conversation started in GTM Strategy 2024", time: "2 hours ago" },
            { text: "Framework document generated", time: "5 hours ago" },
            { text: "Operations Review Q1 marked as completed", time: "Yesterday" },
            { text: "New team member added to Digital Transformation", time: "2 days ago" },
            { text: "Board Advisory meeting scheduled", time: "3 days ago" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#33A7B5] rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#0F172A]">{activity.text}</p>
              </div>
              <div className="text-sm text-[#6B7280]">
                {activity.time}
              </div>
            </div>
            ))}
          </div>
      </div>
    </div>
  );
}
