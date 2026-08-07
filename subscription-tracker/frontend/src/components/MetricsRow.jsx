import React from 'react';
import { Flame, Calendar, Layers, PiggyBank, ArrowUpRight, TrendingUp, AlertTriangle } from 'lucide-react';

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

  const nextRenewal = upcomingRenewals[0];

  return (
    <div className="metrics-grid">
      {/* Monthly Burn Rate Card */}
      <div className="metric-card metric-burn">
        <div className="metric-card-header">
          <div className="metric-icon-box icon-flame">
            <Flame size={22} />
          </div>
          <span className="metric-badge badge-burn">Real-time Burn</span>
        </div>
        <div className="metric-body">
          <span className="metric-label">Monthly Burn Rate</span>
          <div className="metric-value-row">
            <span className="metric-currency">$</span>
            <span className="metric-value">{totalMonthlyBurnRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="metric-unit">/ mo</span>
          </div>
          <div className="metric-footer">
            <TrendingUp size={14} className="text-emerald" />
            <span>Normalized across all active billing cycles</span>
          </div>
        </div>
      </div>

      {/* Annual Spend Card */}
      <div className="metric-card metric-annual">
        <div className="metric-card-header">
          <div className="metric-icon-box icon-annual">
            <Calendar size={22} />
          </div>
          <span className="metric-badge badge-blue">12-Mo Horizon</span>
        </div>
        <div className="metric-body">
          <span className="metric-label">Projected Annual Spend</span>
          <div className="metric-value-row">
            <span className="metric-currency">$</span>
            <span className="metric-value">{totalAnnualSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="metric-unit">/ yr</span>
          </div>
          <div className="metric-footer">
            <span>Estimated recurring commitments</span>
          </div>
        </div>
      </div>

      {/* Active Subscriptions & Paused Savings */}
      <div className="metric-card metric-count">
        <div className="metric-card-header">
          <div className="metric-icon-box icon-layers">
            <Layers size={22} />
          </div>
          <span className="metric-badge badge-purple">{activeCount} Active</span>
        </div>
        <div className="metric-body">
          <span className="metric-label">Tracked Subscriptions</span>
          <div className="metric-value-row">
            <span className="metric-value">{totalSubscriptions}</span>
            <span className="metric-unit">total ({pausedCount} paused)</span>
          </div>
          <div className="metric-footer">
            <PiggyBank size={14} className="text-purple" />
            <span>Savings if paused remain off: <strong>${pausedMonthlyBurnRate.toFixed(2)}/mo</strong></span>
          </div>
        </div>
      </div>

      {/* Next Upcoming Renewal */}
      <div className="metric-card metric-renewal">
        <div className="metric-card-header">
          <div className="metric-icon-box icon-alert">
            <AlertTriangle size={22} />
          </div>
          <span className="metric-badge badge-amber">Next Renewal</span>
        </div>
        <div className="metric-body">
          <span className="metric-label">Upcoming Payment</span>
          {nextRenewal ? (
            <>
              <div className="metric-value-row text-amber">
                <span className="metric-value-small">{nextRenewal.name}</span>
              </div>
              <div className="metric-footer">
                <span>
                  <strong>${nextRenewal.cost}</strong> on {nextRenewal.nextBillingDate} ({nextRenewal.daysUntilRenewal}d left)
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="metric-value-row">
                <span className="metric-value-small text-muted">None pending</span>
              </div>
              <div className="metric-footer">
                <span>No active renewals in queue</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
