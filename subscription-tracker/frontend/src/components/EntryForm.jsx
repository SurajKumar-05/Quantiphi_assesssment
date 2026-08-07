import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Entertainment',
  'Software',
  'Infrastructure',
  'Health',
  'Utilities',
  'Finance',
  'Personal',
  'Other'
];

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'quarterly', label: 'Quarterly' }
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' }
];

export const EntryForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    currency: 'USD',
    frequency: 'monthly',
    category: 'Software',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    autoRenew: true,
    description: ''
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        cost: initialData.cost || '',
        currency: initialData.currency || 'USD',
        frequency: initialData.frequency || 'monthly',
        category: initialData.category || 'Software',
        startDate: initialData.startDate || new Date().toISOString().split('T')[0],
        status: initialData.status || 'active',
        autoRenew: initialData.autoRenew ?? true,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        cost: '',
        currency: 'USD',
        frequency: 'monthly',
        category: 'Software',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        autoRenew: true,
        description: ''
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const activeCurrencySymbol = CURRENCIES.find((c) => c.code === formData.currency)?.symbol || '$';

  // Live calculation of preview monthly burn in entered currency
  const getMonthlyPreview = () => {
    const amount = parseFloat(formData.cost) || 0;
    switch (formData.frequency) {
      case 'weekly': return ((amount * 52) / 12).toFixed(2);
      case 'monthly': return amount.toFixed(2);
      case 'quarterly': return (amount / 3).toFixed(2);
      case 'yearly': return (amount / 12).toFixed(2);
      default: return amount.toFixed(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please provide a subscription name');
      return;
    }
    if (formData.cost === '' || isNaN(formData.cost) || parseFloat(formData.cost) < 0) {
      setError('Please provide a valid non-negative cost amount');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        cost: parseFloat(formData.cost)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save subscription');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {initialData ? 'Edit Subscription Entry' : 'Add Subscription Entry'}
            </h2>
            <p className="modal-subtitle">
              {initialData ? 'Update recurring terms and original billing currency' : 'Register a new service to audit burn rate'}
            </p>
          </div>
          <button className="ledger-action-btn" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Name */}
          <div className="form-group full-width">
            <label className="form-label">Subscription / Service Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Netflix, AWS, GitHub Copilot"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Cost & Currency Selector */}
          <div className="form-group">
            <label className="form-label">Cost & Currency</label>
            <div className="cost-currency-row">
              <select
                className="form-select currency-selector-input"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <div className="cost-input-wrapper">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input font-mono"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Billing Cycle */}
          <div className="form-group">
            <label className="form-label">Billing Cycle</label>
            <select
              className="form-select"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input font-mono"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          {/* Live Burn Preview Badge */}
          <div className="form-group full-width burn-preview-box">
            <div>
              <span className="burn-preview-label">Original Normalized Monthly Burn</span>
              <div className="burn-preview-value font-mono">
                {activeCurrencySymbol}{getMonthlyPreview()} / mo
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>
              {formData.currency} entered
            </span>
          </div>

          {/* Notes */}
          <div className="form-group full-width">
            <label className="form-label">Description / Notes (Optional)</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="e.g. 4-Screen UHD tier, shared with team"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-actions full-width">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={16} />
              <span>{submitting ? 'Saving...' : (initialData ? 'Update Subscription' : 'Add Subscription')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
