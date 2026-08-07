import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';

export const SubscriptionRow = ({ subscription, onToggle, onEdit, onDelete, isToggling, rowIndex }) => {
  const {
    id,
    name,
    cost,
    currency = 'USD',
    originalCurrencySymbol = '$',
    displayCurrency = 'USD',
    displayCurrencySymbol = '$',
    frequency,
    category,
    status,
    normalizedMonthlyCost,
    nextBillingDate,
    daysUntilRenewal,
    description
  } = subscription;

  const isPaused = status === 'paused';
  const isUrgentRenewal = daysUntilRenewal <= 3 && !isPaused;

  // Secondary label showing original entered amount & currency
  const isDifferentCurrency = currency !== displayCurrency;
  const originalCostLabel = `${originalCurrencySymbol}${Number(cost).toFixed(2)} ${currency} / ${frequency}`;

  return (
    <tr className={`ledger-row ${isPaused ? 'row-state-paused' : 'row-state-active'} ${rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}`}>
      {/* Index & Name */}
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

      {/* Terms (Shows converted cost in displayCurrency if different + Original entered cost secondary label) */}
      <td className="col-ledger-billed">
        <div className="billed-cell font-mono">
          <span className="billed-amount">
            {originalCurrencySymbol}{Number(cost).toFixed(2)}
          </span>
          <span className="billed-cycle">per {frequency} ({currency})</span>
          {isDifferentCurrency && (
            <span className="original-secondary-label">
              Billed in {currency}
            </span>
          )}
        </div>
      </td>

      {/* Normalized Monthly Burn Rate in target display currency + Secondary original label */}
      <td className="col-ledger-monthly">
        <div className="monthly-cell font-mono">
          <span className={`monthly-rate-pill ${isPaused ? 'rate-paused' : 'rate-active'}`}>
            {displayCurrencySymbol}{normalizedMonthlyCost?.toFixed(2)} <span className="rate-unit">/ mo</span>
          </span>
          {isDifferentCurrency && (
            <span className="original-secondary-label">
              Orig: {originalCostLabel}
            </span>
          )}
        </div>
      </td>

      {/* Next Renewal Date */}
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

      {/* Status Toggle Switch */}
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
