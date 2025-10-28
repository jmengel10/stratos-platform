'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  isAdmin
} from '@/lib/admin-storage';
import { getAllClients, type Client } from '@/lib/storage';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Mail,
  Calendar,
  Shield,
  User
} from 'lucide-react';

// Mock user interface for demo purposes
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string;
  createdAt: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/home');
      return;
    }

    // Convert clients to users for demo purposes
    const clients = getAllClients();
    const mockUsers: User[] = clients.map((client, index) => ({
      id: client.id,
      name: client.name,
      email: `${client.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      role: index === 0 ? 'admin' : 'user', // First client is admin
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: client.createdAt || new Date().toISOString(),
      isActive: true
    }));

    // Add a few more mock users
    mockUsers.push(
      {
        id: 'user_1',
        name: 'Sarah Chen',
        email: 'sarah@stratos.com',
        role: 'admin',
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'user_2',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'user',
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'user_3',
        name: 'Emily Johnson',
        email: 'emily@example.com',
        role: 'user',
        lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: false
      }
    );

    setUsers(mockUsers);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingUser) {
        // Update user
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...formData, lastLogin: user.lastLogin }
            : user
        ));
      } else {
        // Create new user
        const newUser: User = {
          ...formData,
          id: `user_${Date.now()}`,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        setUsers([...users, newUser]);
      }
      
      setShowModal(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        isActive: true
      });
      setErrors({});
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    if (user.role === 'admin') {
      alert('Cannot delete admin users');
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${user.name}"? This action cannot be undone.`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: User['role']) => {
    return role === 'admin' 
      ? 'text-purple-600 bg-purple-50' 
      : 'text-blue-600 bg-blue-50';
  };

  const getRoleIcon = (role: User['role']) => {
    return role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">User Management</h1>
          <p className="text-gray-text mt-2">Manage users and their permissions</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              name: '',
              email: '',
              role: 'user',
              isActive: true
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Total Users</p>
              <p className="text-2xl font-bold text-navy">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Admins</p>
              <p className="text-2xl font-bold text-navy">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Regular Users</p>
              <p className="text-2xl font-bold text-navy">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Active Users</p>
              <p className="text-2xl font-bold text-navy">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-gray">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Created</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-bg-gray transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">{user.name}</p>
                        <p className="text-xs text-gray-text">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-red-600 bg-red-50'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-text">
                      <p>{formatDate(user.lastLogin)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-text">
                      <p>{formatDate(user.createdAt)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-gray-text hover:text-primary hover:bg-bg-gray rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-gray-text hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-text mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-navy mb-2">No users found</h3>
            <p className="text-gray-text mb-6">Start by adding your first user</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add First User
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-serif font-semibold text-navy mb-6">
              {editingUser ? 'Edit User' : 'New User'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.name ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="user@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-navy">
                  Active User
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-border text-navy rounded-lg hover:border-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
