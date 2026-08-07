import React, { useState, useEffect } from 'react';
import { X, Plus, Save, DollarSign, Calendar, Tag, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

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

export const EntryForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
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

  // Live calculation of preview monthly burn
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
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {initialData ? 'Edit Subscription' : 'Add New Subscription'}
            </h2>
            <p className="modal-subtitle">
              {initialData ? 'Update recurring terms and billing schedule' : 'Register a new service to track burn rate'}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full-width">
            <label className="form-label">Subscription Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Netflix, AWS, GitHub Copilot"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cost ($)</label>
            <div className="input-with-icon">
              <DollarSign size={16} className="input-icon" />
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input icon-padded"
                placeholder="0.00"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                required
              />
            </div>
          </div>

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

          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          {/* Live Burn Rate Calculator Badge */}
          <div className="form-group full-width burn-preview-box">
            <div className="burn-preview-info">
              <span className="burn-preview-label">Normalized Monthly Burn Rate</span>
              <span className="burn-preview-value">${getMonthlyPreview()} / mo</span>
            </div>
            <span className="burn-preview-hint">
              {formData.frequency !== 'monthly' && `Converted from $${formData.cost || 0} ${formData.frequency}`}
            </span>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Description / Notes (Optional)</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="e.g. 4-Screen UHD tier, shared with family"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group full-width checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.autoRenew}
                onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
              />
              <span>Enable Auto-Renew Notifications</span>
            </label>
          </div>

          <div className="modal-actions full-width">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                'Saving...'
              ) : (
                <>
                  <Save size={16} />
                  <span>{initialData ? 'Update Subscription' : 'Add Subscription'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
