'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllPackages, 
  createPackage, 
  updatePackage, 
  deletePackage,
  getAllClientBilling,
  isAdmin,
  type PricingPackage 
} from '@/lib/admin-storage';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  DollarSign,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function AdminPricingPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [billing, setBilling] = useState(getAllClientBilling());
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    interval: 'monthly' as 'monthly' | 'yearly',
    stripePriceId: '',
    features: [''],
    limits: {
      clients: 0,
      projects: 0,
      conversations: 0,
      storage: 0
    },
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/home');
      return;
    }

    setPackages(getAllPackages());
    setBilling(getAllClientBilling());
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Package name is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.stripePriceId.trim()) newErrors.stripePriceId = 'Stripe Price ID is required';
    if (formData.features.every(f => !f.trim())) newErrors.features = 'At least one feature is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const features = formData.features.filter(f => f.trim());
      
      if (editingPackage) {
        updatePackage(editingPackage.id, {
          ...formData,
          features
        });
      } else {
        createPackage({
          ...formData,
          features
        });
      }
      
      setPackages(getAllPackages());
      setShowModal(false);
      setEditingPackage(null);
      setFormData({
        name: '',
        price: 0,
        interval: 'monthly',
        stripePriceId: '',
        features: [''],
        limits: { clients: 0, projects: 0, conversations: 0, storage: 0 },
        isActive: true
      });
      setErrors({});
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleEdit = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      price: pkg.price,
      interval: pkg.interval,
      stripePriceId: pkg.stripePriceId,
      features: pkg.features.length > 0 ? pkg.features : [''],
      limits: pkg.limits,
      isActive: pkg.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (pkg: PricingPackage) => {
    if (confirm(`Are you sure you want to delete "${pkg.name}"? This action cannot be undone.`)) {
      try {
        deletePackage(pkg.id);
        setPackages(getAllPackages());
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Cannot delete package with active clients');
      }
    }
  };

  const getClientCount = (packageId: string) => {
    return billing.filter(b => b.packageId === packageId && b.status === 'active').length;
  };

  const getMonthlyRevenue = (packageId: string) => {
    return billing
      .filter(b => b.packageId === packageId && b.status === 'active')
      .reduce((sum, b) => sum + b.amount, 0);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Pricing Packages</h1>
          <p className="text-gray-text mt-2">Manage pricing packages and features</p>
        </div>
        <button
          onClick={() => {
            setEditingPackage(null);
            setFormData({
              name: '',
              price: 0,
              interval: 'monthly',
              stripePriceId: '',
              features: [''],
              limits: { clients: 0, projects: 0, conversations: 0, storage: 0 },
              isActive: true
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold text-navy">{pkg.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-navy">${pkg.price}</span>
                    <span className="text-sm text-gray-text">/{pkg.interval}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="p-2 text-gray-text hover:text-primary hover:bg-bg-gray rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg)}
                  className="p-2 text-gray-text hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-text" />
                <span className="text-gray-text">{getClientCount(pkg.id)} clients</span>
                <span className="text-gray-text">•</span>
                <DollarSign className="w-4 h-4 text-gray-text" />
                <span className="text-gray-text">${getMonthlyRevenue(pkg.id)}/month</span>
              </div>
              
              <div className="flex items-center gap-2">
                {pkg.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${pkg.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-navy">Features:</h4>
              <ul className="text-sm text-gray-text space-y-1">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
                {pkg.features.length > 3 && (
                  <li className="text-xs text-gray-text">+{pkg.features.length - 3} more</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif font-semibold text-navy mb-6">
              {editingPackage ? 'Edit Package' : 'New Package'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Package Name */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.name ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="e.g., Professional"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Price and Interval */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.price ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Interval *
                  </label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: e.target.value as 'monthly' | 'yearly' })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Stripe Price ID */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Stripe Price ID *
                </label>
                <input
                  type="text"
                  value={formData.stripePriceId}
                  onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.stripePriceId ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="price_1234567890"
                />
                {errors.stripePriceId && <p className="text-red-500 text-sm mt-1">{errors.stripePriceId}</p>}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Features *
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features];
                        newFeatures[index] = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Feature description"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = formData.features.filter((_, i) => i !== index);
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                  className="text-sm text-primary hover:underline"
                >
                  + Add Feature
                </button>
                {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
              </div>

              {/* Limits */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Limits
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-text mb-1">Clients</label>
                    <input
                      type="number"
                      min="-1"
                      value={formData.limits.clients}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        limits: { ...formData.limits, clients: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-text mb-1">Projects</label>
                    <input
                      type="number"
                      min="-1"
                      value={formData.limits.projects}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        limits: { ...formData.limits, projects: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-text mb-1">Conversations</label>
                    <input
                      type="number"
                      min="-1"
                      value={formData.limits.conversations}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        limits: { ...formData.limits, conversations: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-text mb-1">Storage (GB)</label>
                    <input
                      type="number"
                      min="-1"
                      value={formData.limits.storage}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        limits: { ...formData.limits, storage: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                </div>
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
                  Active Package
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
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
