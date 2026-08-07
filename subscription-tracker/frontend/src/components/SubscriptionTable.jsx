import React, { useState } from 'react';
import { Search, Filter, Plus, AlertCircle, ArrowUpDown } from 'lucide-react';
import { SubscriptionRow } from './SubscriptionRow';

const CATEGORIES = [
  'All',
  'Entertainment',
  'Software',
  'Infrastructure',
  'Health',
  'Utilities',
  'Finance',
  'Personal',
  'Other'
];

export const SubscriptionTable = ({
  subscriptions = [],
  onToggle,
  onEdit,
  onDelete,
  togglingIds = [],
  onAddNew,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter
}) => {
  const [sortField, setSortField] = useState('normalizedMonthlyCost');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter logic
  const filtered = subscriptions.filter((sub) => {
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.description && sub.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="table-container glass-card">
      {/* Controls Header: Search, Category Pills, Status Tabs */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search subscriptions by name or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="status-tabs">
            <button
              className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({subscriptions.length})
            </button>
            <button
              className={`status-tab ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active ({subscriptions.filter(s => s.status === 'active').length})
            </button>
            <button
              className={`status-tab ${statusFilter === 'paused' ? 'active' : ''}`}
              onClick={() => setStatusFilter('paused')}
            >
              Paused ({subscriptions.filter(s => s.status === 'paused').length})
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={onAddNew}>
            <Plus size={18} />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="category-pills-bar">
        <span className="pills-label"><Filter size={14} /> Filter:</span>
        <div className="pills-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subscription Table */}
      <div className="table-responsive">
        <table className="subscription-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable-th">
                <div className="th-content">
                  <span>Subscription</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('category')} className="sortable-th">
                <div className="th-content">
                  <span>Category</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('cost')} className="sortable-th">
                <div className="th-content">
                  <span>Billed Amount</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('normalizedMonthlyCost')} className="sortable-th">
                <div className="th-content">
                  <span>Monthly Burn Rate</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('nextBillingDate')} className="sortable-th">
                <div className="th-content">
                  <span>Next Renewal</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length > 0 ? (
              sorted.map((sub) => (
                <SubscriptionRow
                  key={sub.id}
                  subscription={sub}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isToggling={togglingIds.includes(sub.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-table-cell">
                  <div className="empty-state">
                    <AlertCircle size={36} className="text-muted" />
                    <h3>No Subscriptions Found</h3>
                    <p>Try adjusting your search criteria or category filter.</p>
                    {(searchQuery || selectedCategory !== 'All' || statusFilter !== 'all') && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                          setStatusFilter('all');
                        }}
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
