import React from 'react';
import { Edit2, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';

export const SubscriptionRow = ({ subscription, onToggle, onEdit, onDelete, isToggling, rowIndex }) => {
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
    isUrgent
  } = subscription;

  const isPaused = status === 'paused';
  const isUrgentRenewal = daysUntilRenewal <= 3 && !isPaused;

  return (
    <tr className={`ledger-row ${isPaused ? 'row-state-paused' : 'row-state-active'} ${rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}`}>
      {/* Ledger Line Index & Name */}
      <td className="col-ledger-service">
        <div className="service-cell">
          <span className="ledger-index font-mono">{(rowIndex + 1).toString().padStart(2, '0')}</span>
          <div className="service-details">
            <div className="service-name-row">
              <span className="service-title">{name}</span>
              <span className="category-tag">{category}</span>
            </div>
            {description && <span className="service-notes">{description}</span>}
          </div>
        </div>
      </td>

      {/* Term / Frequency Billed */}
      <td className="col-ledger-billed">
        <div className="billed-cell font-mono">
          <span className="billed-amount">${Number(cost).toFixed(2)}</span>
          <span className="billed-cycle">per {frequency}</span>
        </div>
      </td>

      {/* Normalized Monthly Burn Rate */}
      <td className="col-ledger-monthly">
        <div className="monthly-cell font-mono">
          <span className={`monthly-rate-pill ${isPaused ? 'rate-paused' : 'rate-active'}`}>
            ${normalizedMonthlyCost?.toFixed(2)} <span className="rate-unit">/ mo</span>
          </span>
        </div>
      </td>

      {/* Next Renewal Date & Eye-Catching Alert Badge */}
      <td className="col-ledger-renewal">
        <div className="renewal-cell font-mono">
          <span className="renewal-date-str">{nextBillingDate || 'N/A'}</span>
          {!isPaused && (
            isUrgentRenewal ? (
              <span className="renewing-soon-badge table-alert-badge">
                <span className="pulse-dot" />
                {daysUntilRenewal === 0 ? 'DUE TODAY' : `${daysUntilRenewal}D LEFT`}
              </span>
            ) : (
              <span className="renewal-days-remaining">
                {daysUntilRenewal} days remaining
              </span>
            )
          )}
        </div>
      </td>

      {/* Status Tactile Toggle Switch */}
      <td className="col-ledger-status">
        <ToggleSwitch
          id={`toggle-${id}`}
          checked={!isPaused}
          disabled={isToggling}
          onChange={() => onToggle(id)}
          label={`Toggle ${name} status`}
        />
      </td>

      {/* Action Buttons */}
      <td className="col-ledger-actions">
        <div className="actions-cell">
          <button
            type="button"
            className="ledger-action-btn edit-action"
            onClick={() => onEdit(subscription)}
            title="Edit subscription"
            aria-label={`Edit ${name}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="ledger-action-btn delete-action"
            onClick={() => onDelete(id, name)}
            title="Delete subscription"
            aria-label={`Delete ${name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};
