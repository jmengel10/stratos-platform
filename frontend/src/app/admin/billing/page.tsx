'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllClientBilling, 
  createClientBilling, 
  updateClientBilling,
  getAllPackages,
  isAdmin,
  type ClientBilling 
} from '@/lib/admin-storage';
import { getAllClients } from '@/lib/storage';
import { 
  Plus, 
  Edit, 
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function AdminBillingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<ClientBilling[]>([]);
  const [clients, setClients] = useState(getAllClients());
  const [packages, setPackages] = useState(getAllPackages());
  const [showModal, setShowModal] = useState(false);
  const [editingBilling, setEditingBilling] = useState<ClientBilling | null>(null);
  const [formData, setFormData] = useState({
    clientId: '',
    packageId: '',
    stripeCustomerId: '',
    stripeSubscriptionId: '',
    status: 'active' as ClientBilling['status'],
    amount: 0,
    billingEmail: '',
    currentPeriodStart: '',
    currentPeriodEnd: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/home');
      return;
    }

    setBilling(getAllClientBilling());
    setClients(getAllClients());
    setPackages(getAllPackages());
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.clientId) newErrors.clientId = 'Client is required';
    if (!formData.packageId) newErrors.packageId = 'Package is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.billingEmail.trim()) newErrors.billingEmail = 'Billing email is required';
    if (!formData.currentPeriodStart) newErrors.currentPeriodStart = 'Period start is required';
    if (!formData.currentPeriodEnd) newErrors.currentPeriodEnd = 'Period end is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const client = clients.find(c => c.id === formData.clientId);
      const pkg = packages.find(p => p.id === formData.packageId);
      
      if (!client || !pkg) {
        alert('Client or package not found');
        return;
      }

      if (editingBilling) {
        updateClientBilling(editingBilling.id, {
          ...formData,
          clientName: client.name,
          packageName: pkg.name
        });
      } else {
        createClientBilling({
          ...formData,
          clientName: client.name,
          packageName: pkg.name
        });
      }
      
      setBilling(getAllClientBilling());
      setShowModal(false);
      setEditingBilling(null);
      setFormData({
        clientId: '',
        packageId: '',
        stripeCustomerId: '',
        stripeSubscriptionId: '',
        status: 'active',
        amount: 0,
        billingEmail: '',
        currentPeriodStart: '',
        currentPeriodEnd: '',
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error saving billing:', error);
    }
  };

  const handleEdit = (billingRecord: ClientBilling) => {
    setEditingBilling(billingRecord);
    setFormData({
      clientId: billingRecord.clientId,
      packageId: billingRecord.packageId,
      stripeCustomerId: billingRecord.stripeCustomerId,
      stripeSubscriptionId: billingRecord.stripeSubscriptionId,
      status: billingRecord.status,
      amount: billingRecord.amount,
      billingEmail: billingRecord.billingEmail,
      currentPeriodStart: billingRecord.currentPeriodStart,
      currentPeriodEnd: billingRecord.currentPeriodEnd,
      notes: billingRecord.notes || ''
    });
    setShowModal(true);
  };

  const getStatusColor = (status: ClientBilling['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'past_due': return 'text-red-600 bg-red-50';
      case 'canceled': return 'text-gray-600 bg-gray-50';
      case 'trialing': return 'text-blue-600 bg-blue-50';
      case 'incomplete': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: ClientBilling['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'past_due': return <AlertCircle className="w-4 h-4" />;
      case 'canceled': return <XCircle className="w-4 h-4" />;
      case 'trialing': return <Clock className="w-4 h-4" />;
      case 'incomplete': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Client Billing</h1>
          <p className="text-gray-text mt-2">Manage client subscriptions and billing</p>
        </div>
        <button
          onClick={() => {
            setEditingBilling(null);
            setFormData({
              clientId: '',
              packageId: '',
              stripeCustomerId: '',
              stripeSubscriptionId: '',
              status: 'active',
              amount: 0,
              billingEmail: '',
              currentPeriodStart: '',
              currentPeriodEnd: '',
              notes: ''
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Billing
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Total Revenue</p>
              <p className="text-2xl font-bold text-navy">
                ${billing.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Active Subscriptions</p>
              <p className="text-2xl font-bold text-navy">
                {billing.filter(b => b.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Past Due</p>
              <p className="text-2xl font-bold text-navy">
                {billing.filter(b => b.status === 'past_due').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Total Clients</p>
              <p className="text-2xl font-bold text-navy">{billing.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Billing Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-gray">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Client</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Package</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Period</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-navy">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {billing.map((billingRecord) => (
                <tr key={billingRecord.id} className="hover:bg-bg-gray transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-navy">{billingRecord.clientName}</p>
                      <p className="text-xs text-gray-text">{billingRecord.billingEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-navy">{billingRecord.packageName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-navy">${billingRecord.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(billingRecord.status)}`}>
                      {getStatusIcon(billingRecord.status)}
                      {billingRecord.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-text">
                      <p>{formatDate(billingRecord.currentPeriodStart)}</p>
                      <p>to {formatDate(billingRecord.currentPeriodEnd)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(billingRecord)}
                      className="p-2 text-gray-text hover:text-primary hover:bg-bg-gray rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {billing.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-text mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-navy mb-2">No billing records</h3>
            <p className="text-gray-text mb-6">Start by adding your first client billing record</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add First Billing Record
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif font-semibold text-navy mb-6">
              {editingBilling ? 'Edit Billing' : 'Add Billing'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Client *
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.clientId ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.industry}
                    </option>
                  ))}
                </select>
                {errors.clientId && <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>}
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Package *
                </label>
                <select
                  value={formData.packageId}
                  onChange={(e) => {
                    const pkg = packages.find(p => p.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      packageId: e.target.value,
                      amount: pkg ? pkg.price : 0
                    });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.packageId ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select a package...</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - ${pkg.price}/{pkg.interval}
                    </option>
                  ))}
                </select>
                {errors.packageId && <p className="text-red-500 text-sm mt-1">{errors.packageId}</p>}
              </div>

              {/* Amount and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.amount ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientBilling['status'] })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="active">Active</option>
                    <option value="past_due">Past Due</option>
                    <option value="canceled">Canceled</option>
                    <option value="trialing">Trialing</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
              </div>

              {/* Billing Email */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Billing Email *
                </label>
                <input
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.billingEmail ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="billing@client.com"
                />
                {errors.billingEmail && <p className="text-red-500 text-sm mt-1">{errors.billingEmail}</p>}
              </div>

              {/* Stripe IDs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Stripe Customer ID
                  </label>
                  <input
                    type="text"
                    value={formData.stripeCustomerId}
                    onChange={(e) => setFormData({ ...formData, stripeCustomerId: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="cus_1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Stripe Subscription ID
                  </label>
                  <input
                    type="text"
                    value={formData.stripeSubscriptionId}
                    onChange={(e) => setFormData({ ...formData, stripeSubscriptionId: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="sub_1234567890"
                  />
                </div>
              </div>

              {/* Period Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Period Start *
                  </label>
                  <input
                    type="date"
                    value={formData.currentPeriodStart}
                    onChange={(e) => setFormData({ ...formData, currentPeriodStart: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.currentPeriodStart ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.currentPeriodStart && <p className="text-red-500 text-sm mt-1">{errors.currentPeriodStart}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Period End *
                  </label>
                  <input
                    type="date"
                    value={formData.currentPeriodEnd}
                    onChange={(e) => setFormData({ ...formData, currentPeriodEnd: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.currentPeriodEnd ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.currentPeriodEnd && <p className="text-red-500 text-sm mt-1">{errors.currentPeriodEnd}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Additional notes..."
                />
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
                  {editingBilling ? 'Update Billing' : 'Add Billing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
