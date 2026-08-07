import React from 'react';
import { Flame, AlertCircle, ArrowUpRight, ShieldAlert, Receipt, DollarSign } from 'lucide-react';

export const MetricsRow = ({ metrics }) => {
  if (!metrics) return null;

  const {
    totalMonthlyBurnRate = 0,
    totalAnnualSpend = 0,
    activeCount = 0,
    pausedCount = 0,
    totalSubscriptions = 0,
    pausedMonthlyBurnRate = 0,
    upcomingRenewals = []
  } = metrics;

  // Find urgent renewal (<= 3 days) or earliest upcoming
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
          <span className="hero-active-count">
            {activeCount} of {totalSubscriptions} Active Subscriptions
          </span>
        </div>

        <div className="hero-main-display">
          <div className="hero-number-wrapper">
            <span className="hero-currency">$</span>
            <span className="hero-amount font-mono">
              {totalMonthlyBurnRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="hero-period">/ MONTH</span>
          </div>
          <p className="hero-caption">
            Normalized monthly burn rate automatically calculated across weekly, monthly, quarterly, and annual billing terms.
          </p>
        </div>

        <div className="hero-perforated-edge" />
      </div>

      {/* Supporting Ledger Metrics Sidebar / Row */}
      <div className="ledger-secondary-grid">
        {/* 1. Projected 12-Month Spend */}
        <div className="secondary-ledger-card">
          <div className="card-label">12-Month Projected Spend</div>
          <div className="card-value font-mono">
            ${totalAnnualSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="card-subtext">Cumulative annual commitment</div>
        </div>

        {/* 2. Paused Savings Potential */}
        <div className="secondary-ledger-card">
          <div className="card-label">Paused Subscriptions</div>
          <div className="card-value font-mono">
            ${pausedMonthlyBurnRate.toFixed(2)} <span className="card-unit">/ mo</span>
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
                ${urgentRenewal.cost} ({urgentRenewal.frequency}) &bull; {urgentRenewal.daysUntilRenewal === 0 ? 'DUE TODAY' : `In ${urgentRenewal.daysUntilRenewal} Days`}
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
