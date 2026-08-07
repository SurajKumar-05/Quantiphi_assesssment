import React, { useState } from 'react';
import { Activity, Plus, RefreshCw, Layers, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSubscriptions } from './hooks/useSubscriptions';
import { MetricsRow } from './components/MetricsRow';
import { SubscriptionTable } from './components/SubscriptionTable';
import { EntryForm } from './components/EntryForm';

export default function App() {
  const {
    subscriptions,
    metrics,
    loading,
    error,
    togglingIds,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    refreshData,
    toggleStatus,
    addSubscription,
    updateSubscription,
    deleteSubscription
  } = useSubscriptions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const handleOpenAdd = () => {
    setEditingSub(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSub(sub);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingSub) {
      await updateSubscription(editingSub.id, formData);
    } else {
      await addSubscription(formData);
    }
  };

  const handlePromptDelete = (id, name) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(name);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteSubscription(deleteConfirmId);
      setDeleteConfirmId(null);
      setDeleteConfirmName('');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <nav className="navbar glass-card">
        <div className="nav-brand">
          <div className="brand-icon">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="brand-title">SubPulse</h1>
            <p className="brand-subtitle">Cost Uniformity & Subscription Burn Tracker</p>
          </div>
        </div>

        <div className="nav-actions">
          <button className="btn btn-secondary btn-sm" onClick={refreshData} title="Sync backend data">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>New Subscription</span>
          </button>
        </div>
      </nav>

      {/* Backend Error Alert */}
      {error && (
        <div className="alert-banner alert-error" style={{ marginBottom: '20px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row Section */}
      <MetricsRow metrics={metrics} />

      {/* Main Subscriptions Table */}
      <SubscriptionTable
        subscriptions={subscriptions}
        onToggle={toggleStatus}
        onEdit={handleOpenEdit}
        onDelete={handlePromptDelete}
        togglingIds={togglingIds}
        onAddNew={handleOpenAdd}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Add / Edit Subscription Modal */}
      <EntryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSub}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content glass-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: 'var(--rose-glow)' }}>Confirm Deletion</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Are you sure you want to delete <strong>{deleteConfirmName}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ background: 'var(--rose-glow)' }} onClick={handleConfirmDelete}>
                Delete Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
