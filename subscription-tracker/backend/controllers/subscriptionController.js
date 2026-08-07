// Subscription Controller handling HTTP endpoints & integrating calculation & currency engines
import { db } from "../config/db.js";
import { SubscriptionModel } from "../models/Subscription.js";
import { toMonthlyCost, toAnnualCost, calculateMetrics } from "../services/costEngine.js";
import { convertCurrency, getCurrencySymbol } from "../services/currencyEngine.js";
import { enrichWithRenewalInfo } from "../services/dateEngine.js";

/**
 * Enriches raw subscription record with normalized cost metrics & currency conversion.
 * Rule: Normalize to monthly first, then convert currency.
 */
const enrichSubscription = (sub, displayCurrency = "USD") => {
  const targetCurrency = (displayCurrency || "USD").toUpperCase();
  const originalCurrency = (sub.currency || "USD").toUpperCase();

  // 1. Monthly normalization in original currency
  const originalMonthlyCost = toMonthlyCost(sub.cost, sub.frequency);
  const originalAnnualCost = toAnnualCost(sub.cost, sub.frequency);

  // 2. Currency conversion to target display currency
  const convertedMonthlyCost = convertCurrency(originalMonthlyCost, originalCurrency, targetCurrency);
  const convertedAnnualCost = convertCurrency(originalAnnualCost, originalCurrency, targetCurrency);
  const convertedOriginalCost = convertCurrency(sub.cost, originalCurrency, targetCurrency);

  const enriched = enrichWithRenewalInfo(sub);

  return {
    ...enriched,
    currency: originalCurrency,
    originalCurrencySymbol: getCurrencySymbol(originalCurrency),
    displayCurrency: targetCurrency,
    displayCurrencySymbol: getCurrencySymbol(targetCurrency),
    normalizedMonthlyCost: convertedMonthlyCost,
    normalizedAnnualCost: convertedAnnualCost,
    convertedCost: convertedOriginalCost,
    // Original entered amount details for secondary label display
    originalCostFormatted: `${getCurrencySymbol(originalCurrency)}${Number(sub.cost).toFixed(2)}`
  };
};

export const getAllSubscriptions = (req, res) => {
  try {
    let subscriptions = db.getAll();
    const { category, status, search, displayCurrency = "USD" } = req.query;

    if (category) {
      subscriptions = subscriptions.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    if (status) {
      subscriptions = subscriptions.filter((s) => s.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      subscriptions = subscriptions.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }

    const enriched = subscriptions.map((s) => enrichSubscription(s, displayCurrency));
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscriptions", details: error.message });
  }
};

export const getSubscriptionById = (req, res) => {
  try {
    const displayCurrency = req.query.displayCurrency || "USD";
    const sub = db.getById(req.params.id);
    if (!sub) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(enrichSubscription(sub, displayCurrency));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscription", details: error.message });
  }
};

export const createSubscription = (req, res) => {
  try {
    const displayCurrency = req.query.displayCurrency || req.body.currency || "USD";
    const sanitized = SubscriptionModel.create(req.body);
    const created = db.create(sanitized);
    res.status(201).json(enrichSubscription(created, displayCurrency));
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription", details: error.message });
  }
};

export const updateSubscription = (req, res) => {
  try {
    const displayCurrency = req.query.displayCurrency || req.body.currency || "USD";
    const existing = db.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const sanitized = SubscriptionModel.create({
      ...existing,
      ...req.body
    });

    const updated = db.update(req.params.id, sanitized);
    res.json(enrichSubscription(updated, displayCurrency));
  } catch (error) {
    res.status(500).json({ error: "Failed to update subscription", details: error.message });
  }
};

export const toggleSubscriptionStatus = (req, res) => {
  try {
    const displayCurrency = req.query.displayCurrency || "USD";
    const updated = db.toggleStatus(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(enrichSubscription(updated, displayCurrency));
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle subscription status", details: error.message });
  }
};

export const deleteSubscription = (req, res) => {
  try {
    const success = db.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json({ message: "Subscription deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subscription", details: error.message });
  }
};

export const getSubscriptionMetrics = (req, res) => {
  try {
    const displayCurrency = req.query.displayCurrency || "USD";
    const subscriptions = db.getAll();
    const metrics = calculateMetrics(subscriptions, displayCurrency);

    const activeEnriched = subscriptions
      .filter((s) => s.status === "active")
      .map((s) => enrichSubscription(s, displayCurrency))
      .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

    res.json({
      ...metrics,
      displayCurrencySymbol: getCurrencySymbol(displayCurrency),
      upcomingRenewals: activeEnriched.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate metrics", details: error.message });
  }
};
