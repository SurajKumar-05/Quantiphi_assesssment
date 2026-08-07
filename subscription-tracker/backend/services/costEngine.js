// Cost Uniformity Engine Service
// Converts and normalizes varying subscription billing frequencies and currencies into unified cost metrics.

import { convertCurrency } from "./currencyEngine.js";

/**
 * Normalizes subscription cost to equivalent monthly cost ($/month)
 * @param {number} cost - Billing cost amount
 * @param {string} frequency - "weekly", "monthly", "quarterly", "yearly"
 * @returns {number} Normalized monthly cost in original currency
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
 * @returns {number} Normalized annual cost in original currency
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
 * Calculates comprehensive metrics breakdown across subscriptions in target display currency
 * Architecture Rule: Normalize to monthly first, then convert currency.
 * @param {Array} subscriptions - List of subscription objects
 * @param {string} displayCurrency - Target currency code ("USD", "EUR", "GBP", "INR")
 * @returns {Object} Calculated cost breakdown & totals in target display currency
 */
export const calculateMetrics = (subscriptions = [], displayCurrency = "USD") => {
  const targetCurrency = (displayCurrency || "USD").toUpperCase();

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const pausedSubs = subscriptions.filter((s) => s.status === "paused");

  // 1. Normalize to monthly first in original currency, then convert to target display currency
  const totalMonthlyBurnRate = activeSubs.reduce((sum, sub) => {
    const monthlyInOriginalCurrency = toMonthlyCost(sub.cost, sub.frequency);
    const convertedMonthly = convertCurrency(monthlyInOriginalCurrency, sub.currency || "USD", targetCurrency);
    return sum + convertedMonthly;
  }, 0);

  // 2. Normalize to annual first in original currency, then convert to target display currency
  const totalAnnualSpend = activeSubs.reduce((sum, sub) => {
    const annualInOriginalCurrency = toAnnualCost(sub.cost, sub.frequency);
    const convertedAnnual = convertCurrency(annualInOriginalCurrency, sub.currency || "USD", targetCurrency);
    return sum + convertedAnnual;
  }, 0);

  // 3. Paused monthly burn rate in target display currency
  const pausedMonthlyBurnRate = pausedSubs.reduce((sum, sub) => {
    const monthlyInOriginalCurrency = toMonthlyCost(sub.cost, sub.frequency);
    const convertedMonthly = convertCurrency(monthlyInOriginalCurrency, sub.currency || "USD", targetCurrency);
    return sum + convertedMonthly;
  }, 0);

  // Category breakdown in target display currency
  const categoryBreakdown = activeSubs.reduce((acc, sub) => {
    const monthlyInOriginal = toMonthlyCost(sub.cost, sub.frequency);
    const convertedMonthly = convertCurrency(monthlyInOriginal, sub.currency || "USD", targetCurrency);

    if (!acc[sub.category]) {
      acc[sub.category] = { count: 0, monthlyCost: 0 };
    }
    acc[sub.category].count += 1;
    acc[sub.category].monthlyCost += convertedMonthly;
    return acc;
  }, {});

  return {
    displayCurrency: targetCurrency,
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
