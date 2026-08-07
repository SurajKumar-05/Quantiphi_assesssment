// Cost Uniformity Engine Service
// Converts and normalizes varying subscription billing frequencies into unified cost metrics.

/**
 * Normalizes subscription cost to equivalent monthly cost ($/month)
 * @param {number} cost - Billing cost amount
 * @param {string} frequency - "weekly", "monthly", "quarterly", "yearly"
 * @returns {number} Normalized monthly cost
 */
export const toMonthlyCost = (cost, frequency) => {
  const amount = Number(cost) || 0;
  switch (frequency) {
    case "weekly":
      return (amount * 52) / 12;
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "yearly":
      return amount / 12;
    default:
      return amount;
  }
};

/**
 * Normalizes subscription cost to equivalent annual cost ($/year)
 * @param {number} cost - Billing cost amount
 * @param {string} frequency - "weekly", "monthly", "quarterly", "yearly"
 * @returns {number} Normalized annual cost
 */
export const toAnnualCost = (cost, frequency) => {
  const amount = Number(cost) || 0;
  switch (frequency) {
    case "weekly":
      return amount * 52;
    case "monthly":
      return amount * 12;
    case "quarterly":
      return amount * 4;
    case "yearly":
      return amount;
    default:
      return amount * 12;
  }
};

/**
 * Normalizes subscription cost to equivalent daily cost ($/day)
 * @param {number} cost - Billing cost amount
 * @param {string} frequency - "weekly", "monthly", "quarterly", "yearly"
 * @returns {number} Normalized daily cost
 */
export const toDailyCost = (cost, frequency) => {
  const amount = Number(cost) || 0;
  switch (frequency) {
    case "weekly":
      return amount / 7;
    case "monthly":
      return (amount * 12) / 365;
    case "quarterly":
      return (amount * 4) / 365;
    case "yearly":
      return amount / 365;
    default:
      return (amount * 12) / 365;
  }
};

/**
 * Calculates comprehensive metrics breakdown across subscriptions
 * @param {Array} subscriptions - List of subscription objects
 * @returns {Object} Calculated cost breakdown & totals
 */
export const calculateMetrics = (subscriptions = []) => {
  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const pausedSubs = subscriptions.filter((s) => s.status === "paused");

  // Aggregate monthly burn rate for active subscriptions
  const totalMonthlyBurnRate = activeSubs.reduce(
    (sum, sub) => sum + toMonthlyCost(sub.cost, sub.frequency),
    0
  );

  // Aggregate annual spend for active subscriptions
  const totalAnnualSpend = activeSubs.reduce(
    (sum, sub) => sum + toAnnualCost(sub.cost, sub.frequency),
    0
  );

  // Potential monthly savings if currently paused subscriptions were canceled
  const pausedMonthlyBurnRate = pausedSubs.reduce(
    (sum, sub) => sum + toMonthlyCost(sub.cost, sub.frequency),
    0
  );

  // Category breakdown
  const categoryBreakdown = activeSubs.reduce((acc, sub) => {
    const monthlyCost = toMonthlyCost(sub.cost, sub.frequency);
    if (!acc[sub.category]) {
      acc[sub.category] = { count: 0, monthlyCost: 0 };
    }
    acc[sub.category].count += 1;
    acc[sub.category].monthlyCost += monthlyCost;
    return acc;
  }, {});

  // Round values to 2 decimal places
  return {
    totalSubscriptions: subscriptions.length,
    activeCount: activeSubs.length,
    pausedCount: pausedSubs.length,
    totalMonthlyBurnRate: Math.round(totalMonthlyBurnRate * 100) / 100,
    totalAnnualSpend: Math.round(totalAnnualSpend * 100) / 100,
    pausedMonthlyBurnRate: Math.round(pausedMonthlyBurnRate * 100) / 100,
    categoryBreakdown: Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      count: data.count,
      monthlyCost: Math.round(data.monthlyCost * 100) / 100,
      percentage: totalMonthlyBurnRate > 0 
        ? Math.round((data.monthlyCost / totalMonthlyBurnRate) * 1000) / 10
        : 0
    }))
  };
};
