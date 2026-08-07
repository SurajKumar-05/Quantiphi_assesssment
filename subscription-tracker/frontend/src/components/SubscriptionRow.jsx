import React from 'react';
import { Edit2, Trash2, Calendar, DollarSign, Clock, RefreshCw } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';

const CATEGORY_COLORS = {
  Entertainment: 'category-entertainment',
  Software: 'category-software',
  Infrastructure: 'category-infrastructure',
  Health: 'category-health',
  Utilities: 'category-utilities',
  Finance: 'category-finance',
  Personal: 'category-personal',
  Other: 'category-other'
};

export const SubscriptionRow = ({ subscription, onToggle, onEdit, onDelete, isToggling }) => {
  const {
    id,
    name,
    cost,
    frequency,
    category,
    status,
    normalizedMonthlyCost,
    nextBillingDate,
    daysUntilRenewal,
    description,
    autoRenew
  } = subscription;

  const isPaused = status === 'paused';
  const categoryClass = CATEGORY_COLORS[category] || 'category-other';

  return (
    <tr className={`subscription-table-row ${isPaused ? 'row-paused' : ''}`}>
      {/* Service Name & Details */}
      <td className="col-name">
        <div className="sub-name-cell">
          <div className="sub-avatar">{name.charAt(0).toUpperCase()}</div>
          <div>
            <div className="sub-name-title">{name}</div>
            {description && <div className="sub-description">{description}</div>}
          </div>
        </div>
      </td>

      {/* Category Badge */}
      <td className="col-category">
        <span className={`category-badge ${categoryClass}`}>
          {category}
        </span>
      </td>

      {/* Original Billing Amount & Frequency */}
      <td className="col-cost">
        <div className="cost-cell">
          <span className="cost-amount">${Number(cost).toFixed(2)}</span>
          <span className="cost-frequency">/ {frequency}</span>
        </div>
      </td>

      {/* Normalized Monthly Burn Rate */}
      <td className="col-normalized">
        <div className="normalized-cell">
          <span className={`normalized-badge ${isPaused ? 'badge-muted' : 'badge-burn-subtle'}`}>
            ${normalizedMonthlyCost?.toFixed(2)} / mo
          </span>
        </div>
      </td>

      {/* Next Billing Date & Countdown */}
      <td className="col-renewal">
        <div className="renewal-cell">
          <span className="renewal-date">{nextBillingDate || 'N/A'}</span>
          {!isPaused && daysUntilRenewal !== undefined && (
            <span className={`days-badge ${daysUntilRenewal <= 3 ? 'days-urgent' : 'days-normal'}`}>
              <Clock size={12} />
              {daysUntilRenewal === 0 ? 'Today' : `${daysUntilRenewal}d left`}
            </span>
          )}
        </div>
      </td>

      {/* Status Toggle Switch */}
      <td className="col-status">
        <ToggleSwitch
          id={`toggle-${id}`}
          checked={!isPaused}
          disabled={isToggling}
          onChange={() => onToggle(id)}
          label={`Toggle ${name} status`}
        />
      </td>

      {/* Action Buttons */}
      <td className="col-actions">
        <div className="actions-cell">
          <button
            type="button"
            className="action-btn edit-btn"
            onClick={() => onEdit(subscription)}
            title="Edit subscription"
            aria-label={`Edit ${name}`}
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={() => onDelete(id, name)}
            title="Delete subscription"
            aria-label={`Delete ${name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};
