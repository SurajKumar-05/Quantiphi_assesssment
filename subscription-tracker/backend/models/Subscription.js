// Subscription Model Shape Reference and Data Validation Schema

export const VALID_FREQUENCIES = ["weekly", "monthly", "quarterly", "yearly"];
export const VALID_CURRENCIES = ["USD", "EUR", "GBP", "INR"];
export const VALID_CATEGORIES = [
  "Entertainment",
  "Software",
  "Infrastructure",
  "Health",
  "Utilities",
  "Finance",
  "Personal",
  "Other"
];
export const VALID_STATUSES = ["active", "paused"];

export class SubscriptionModel {
  static create(data) {
    return {
      name: data.name?.trim() || "Untitled Subscription",
      cost: parseFloat(data.cost) || 0,
      currency: VALID_CURRENCIES.includes(data.currency?.toUpperCase())
        ? data.currency.toUpperCase()
        : "USD",
      frequency: VALID_FREQUENCIES.includes(data.frequency) ? data.frequency : "monthly",
      category: VALID_CATEGORIES.includes(data.category) ? data.category : "Other",
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      status: VALID_STATUSES.includes(data.status) ? data.status : "active",
      autoRenew: Boolean(data.autoRenew ?? true),
      description: data.description?.trim() || ""
    };
  }

  static validate(data) {
    const errors = [];

    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      errors.push("Subscription name is required");
    }

    if (data.cost === undefined || isNaN(data.cost) || Number(data.cost) < 0) {
      errors.push("Cost must be a positive number or zero");
    }

    if (data.currency && !VALID_CURRENCIES.includes(data.currency.toUpperCase())) {
      errors.push(`Currency must be one of: ${VALID_CURRENCIES.join(", ")}`);
    }

    if (data.frequency && !VALID_FREQUENCIES.includes(data.frequency)) {
      errors.push(`Frequency must be one of: ${VALID_FREQUENCIES.join(", ")}`);
    }

    if (data.category && !VALID_CATEGORIES.includes(data.category)) {
      errors.push(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`);
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    if (data.startDate && isNaN(Date.parse(data.startDate))) {
      errors.push("Start date must be a valid YYYY-MM-DD date");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
