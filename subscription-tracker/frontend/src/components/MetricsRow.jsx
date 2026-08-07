import React from 'react';
import { Receipt, Globe } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' }
];

export const MetricsRow = ({ metrics, displayCurrency = 'USD', onCurrencyChange }) => {
  if (!metrics) return null;

  const {
    totalMonthlyBurnRate = 0,
    totalAnnualSpend = 0,
    activeCount = 0,
    pausedCount = 0,
    totalSubscriptions = 0,
    pausedMonthlyBurnRate = 0,
    upcomingRenewals = [],
    displayCurrencySymbol = '$'
  } = metrics;

  const urgentRenewal = upcomingRenewals.find((s) => s.daysUntilRenewal <= 3) || upcomingRenewals[0];

  return (
    <div className="hero-ledger-container">
      {/* Hero Banner: Total Monthly Burn Rate */}
      <div className="ledger-hero-card">
        <div className="hero-top-bar">
          <div className="hero-tag">
            <Receipt size={16} />
            <span>PRIMARY RECURRING DRAIN</span>
          </div>

          {/* Global Display Currency Switcher */}
          <div className="currency-switcher-bar">
            <span className="switcher-label font-mono"><Globe size={13} /> DISPLAY CURRENCY:</span>
            <div className="currency-pills-group">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  className={`currency-pill-btn font-mono ${displayCurrency === c.code ? 'active' : ''}`}
                  onClick={() => onCurrencyChange && onCurrencyChange(c.code)}
                >
                  {c.code} {c.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-main-display">
          <div className="hero-number-wrapper">
            <span className="hero-currency">{displayCurrencySymbol}</span>
            <span className="hero-amount font-mono">
              {totalMonthlyBurnRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="hero-period">/ MONTH ({displayCurrency})</span>
          </div>
          <p className="hero-caption">
            Normalized monthly burn rate automatically calculated across terms and server-converted to {displayCurrency}.
          </p>
        </div>
      </div>

      {/* Supporting Ledger Metrics Grid */}
      <div className="ledger-secondary-grid">
        {/* 1. Projected 12-Month Spend */}
        <div className="secondary-ledger-card">
          <div className="card-label">12-Month Projected Spend</div>
          <div className="card-value font-mono">
            {displayCurrencySymbol}{totalAnnualSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="card-subtext">Cumulative annual commitment in {displayCurrency}</div>
        </div>

        {/* 2. Paused Savings Potential */}
        <div className="secondary-ledger-card">
          <div className="card-label">Paused Subscriptions</div>
          <div className="card-value font-mono">
            {displayCurrencySymbol}{pausedMonthlyBurnRate.toFixed(2)} <span className="card-unit">/ mo</span>
          </div>
          <div className="card-subtext">{pausedCount} paused services deferred</div>
        </div>

        {/* 3. Urgent "Renewing Soon" Alert Stamp Card */}
        <div className={`secondary-ledger-card renewal-alert-card ${urgentRenewal?.isUrgent ? 'urgent-glow' : ''}`}>
          <div className="card-header-row">
            <span className="card-label">Next Renewal Alert</span>
            {urgentRenewal?.isUrgent ? (
              <span className="renewing-soon-badge">
                <span className="pulse-dot" />
                RENEWING SOON
              </span>
            ) : (
              <span className="standard-renewal-badge">UPCOMING</span>
            )}
          </div>

          {urgentRenewal ? (
            <div className="renewal-info-body">
              <div className="renewal-service-name">{urgentRenewal.name}</div>
              <div className="renewal-meta font-mono">
                {urgentRenewal.originalCurrencySymbol || '$'}{urgentRenewal.cost} ({urgentRenewal.frequency}) &bull; {urgentRenewal.daysUntilRenewal === 0 ? 'DUE TODAY' : `In ${urgentRenewal.daysUntilRenewal} Days`}
              </div>
            </div>
          ) : (
            <div className="renewal-info-body text-muted font-mono">No active renewals pending</div>
          )}
        </div>
      </div>
    </div>
  );
};
