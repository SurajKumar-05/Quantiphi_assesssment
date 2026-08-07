// Date Intersect Calculator Service
// Handles recurring cycle date calculations, renewal countdowns, and date interval overlap math.

/**
 * Calculates the next billing date for a subscription starting on `startDate`
 * @param {string|Date} startDate - Start date of the subscription
 * @param {string} frequency - "weekly", "monthly", "quarterly", "yearly"
 * @param {Date} referenceDate - Current reference date (defaults to today)
 * @returns {Date} Next billing date
 */
export const calculateNextBillingDate = (startDate, frequency, referenceDate = new Date()) => {
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return new Date();

  const target = new Date(referenceDate);
  target.setHours(0, 0, 0, 0);

  let next = new Date(start);
  next.setHours(0, 0, 0, 0);

  // Advance next date until it is in the future relative to referenceDate
  while (next <= target) {
    switch (frequency) {
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      case "quarterly":
        next.setMonth(next.getMonth() + 3);
        break;
      case "yearly":
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        next.setMonth(next.getMonth() + 1);
        break;
    }
  }

  return next;
};

/**
 * Calculates the number of calendar days between reference date and next billing date
 * @param {Date} nextBillingDate 
 * @param {Date} referenceDate 
 * @returns {number} Days remaining
 */
export const getDaysUntilRenewal = (nextBillingDate, referenceDate = new Date()) => {
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  const next = new Date(nextBillingDate);
  next.setHours(0, 0, 0, 0);

  const diffTime = next.getTime() - ref.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculates date range intersection overlap cost (Proration math)
 * @param {Array} subscriptions - List of active subscription objects
 * @param {string|Date} windowStart - Interval start
 * @param {string|Date} windowEnd - Interval end
 * @returns {number} Total prorated cost across window
 */
export const calculateIntersectCost = (subscriptions = [], windowStart, windowEnd) => {
  const start = new Date(windowStart);
  const end = new Date(windowEnd);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return 0;
  }

  const daysInWindow = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  return subscriptions
    .filter((s) => s.status === "active")
    .reduce((total, sub) => {
      // Convert subscription cost to daily cost
      const subStart = new Date(sub.startDate);
      if (subStart > end) return total; // Sub started after window

      // Calculate intersection window days
      const effectiveStart = subStart > start ? subStart : start;
      const subDays = (end.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24);
      if (subDays <= 0) return total;

      const dailyCost = getDailyCostForSub(sub.cost, sub.frequency);
      return total + (dailyCost * Math.min(subDays, daysInWindow));
    }, 0);
};

const getDailyCostForSub = (cost, frequency) => {
  const amount = Number(cost) || 0;
  switch (frequency) {
    case "weekly": return amount / 7;
    case "monthly": return (amount * 12) / 365;
    case "quarterly": return (amount * 4) / 365;
    case "yearly": return amount / 365;
    default: return (amount * 12) / 365;
  }
};

/**
 * Enriches a subscription object with renewal date calculations
 * @param {Object} subscription 
 * @returns {Object} Enriched subscription
 */
export const enrichWithRenewalInfo = (subscription) => {
  const nextDate = calculateNextBillingDate(subscription.startDate, subscription.frequency);
  const daysRemaining = getDaysUntilRenewal(nextDate);

  return {
    ...subscription,
    nextBillingDate: nextDate.toISOString().split("T")[0],
    daysUntilRenewal: daysRemaining,
    isUrgent: daysRemaining <= 3 && subscription.status === "active"
  };
};
