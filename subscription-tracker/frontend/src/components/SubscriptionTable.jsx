import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, ArrowUpDown } from 'lucide-react';
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
      setSortDirection('desc');
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
    <div className="ledger-table-sheet">
      {/* Table Toolbar Header */}
      <div className="ledger-toolbar">
        <div className="toolbar-left-group">
          {/* Search Input */}
          <div className="search-ledger-input font-mono">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search ledger entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="ledger-status-pills">
            <button
              className={`ledger-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              ALL ({subscriptions.length})
            </button>
            <button
              className={`ledger-tab ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              ACTIVE ({subscriptions.filter(s => s.status === 'active').length})
            </button>
            <button
              className={`ledger-tab ${statusFilter === 'paused' ? 'active' : ''}`}
              onClick={() => setStatusFilter('paused')}
            >
              PAUSED ({subscriptions.filter(s => s.status === 'paused').length})
            </button>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAddNew}>
          <Plus size={16} />
          <span>+ Add Entry</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="ledger-category-chips">
        <span className="chips-label font-mono"><Filter size={13} /> CATEGORY:</span>
        <div className="chips-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${selectedCategory === cat ? 'chip-active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Ledger Table */}
      <div className="ledger-scroll-view">
        <table className="ledger-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable-head">
                <span>SERVICE / SUBSCRIPTION</span>
                <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('cost')} className="sortable-head">
                <span>TERMS</span>
                <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('normalizedMonthlyCost')} className="sortable-head">
                <span>MONTHLY BURN</span>
                <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('nextBillingDate')} className="sortable-head">
                <span>NEXT RENEWAL</span>
                <ArrowUpDown size={12} />
              </th>
              <th>STATUS</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length > 0 ? (
              sorted.map((sub, index) => (
                <SubscriptionRow
                  key={sub.id}
                  rowIndex={index}
                  subscription={sub}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isToggling={togglingIds.includes(sub.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-ledger-row">
                  <div className="empty-ledger-notice">
                    <FileText size={32} />
                    <p>No matching ledger records found.</p>
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
