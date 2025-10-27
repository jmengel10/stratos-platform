'use client';
import { useState } from 'react';
import { Download, CreditCard, Calendar, DollarSign } from 'lucide-react';

const INVOICES = [
  {
    id: 'INV-2024-001',
    date: '2024-12-15',
    amount: 299.00,
    status: 'paid',
    description: 'Professional Plan - December 2024',
    downloadUrl: '#'
  },
  {
    id: 'INV-2024-002',
    date: '2024-11-15',
    amount: 299.00,
    status: 'paid',
    description: 'Professional Plan - November 2024',
    downloadUrl: '#'
  },
  {
    id: 'INV-2024-003',
    date: '2024-10-15',
    amount: 299.00,
    status: 'paid',
    description: 'Professional Plan - October 2024',
    downloadUrl: '#'
  },
  {
    id: 'INV-2024-004',
    date: '2024-09-15',
    amount: 99.00,
    status: 'paid',
    description: 'Starter Plan - September 2024',
    downloadUrl: '#'
  },
  {
    id: 'INV-2024-005',
    date: '2024-08-15',
    amount: 99.00,
    status: 'paid',
    description: 'Starter Plan - August 2024',
    downloadUrl: '#'
  }
];

export default function BillingPage() {
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    name: 'Sarah Chen'
  });

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Downloading invoice:', invoiceId);
    // In a real app, this would trigger a download
  };

  const handleUpdatePaymentMethod = () => {
    console.log('Opening payment method update form');
    // In a real app, this would open a Stripe payment method update form
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalSpent = INVOICES.reduce((sum, invoice) => sum + invoice.amount, 0);
  const nextBillingDate = new Date('2025-01-15').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy">Billing History</h1>
        <p className="text-gray-text mt-2">Manage your payment method and view billing history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Total Spent</p>
              <h2 className="text-2xl font-bold text-navy">${totalSpent.toFixed(2)}</h2>
            </div>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Next Billing</p>
              <h2 className="text-2xl font-bold text-navy">{nextBillingDate}</h2>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Payment Method</p>
              <h2 className="text-2xl font-bold text-navy">{paymentMethod.type}</h2>
            </div>
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-semibold text-navy">Payment Method</h2>
          <button
            onClick={handleUpdatePaymentMethod}
            className="px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors"
          >
            Update
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
            {paymentMethod.type.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-navy">
              {paymentMethod.type} ending in {paymentMethod.last4}
            </p>
            <p className="text-sm text-gray-text">
              Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear} • {paymentMethod.name}
            </p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-serif font-semibold text-navy">Billing History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-bg-gray">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-text uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {INVOICES.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-bg-gray">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-text">
                    {formatDate(invoice.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-text">
                    {invoice.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border bg-bg-gray">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-text">
              Showing 1 to {INVOICES.length} of {INVOICES.length} invoices
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-gray-text hover:text-navy transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-primary text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-text hover:text-navy transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
        <p className="text-sm text-blue-700 mb-4">
          If you have questions about your billing or need to dispute a charge, our support team is here to help.
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Contact Support
          </button>
          <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
