// Subscription Controller handling HTTP endpoints & integrating calculation engines
import { db } from "../config/db.js";
import { SubscriptionModel } from "../models/Subscription.js";
import { toMonthlyCost, toAnnualCost, calculateMetrics } from "../services/costEngine.js";
import { enrichWithRenewalInfo } from "../services/dateEngine.js";

/**
 * Enriches raw subscription record with normalized cost metrics & renewal info
 */
const enrichSubscription = (sub) => {
  const monthlyCost = toMonthlyCost(sub.cost, sub.frequency);
  const annualCost = toAnnualCost(sub.cost, sub.frequency);
  const enriched = enrichWithRenewalInfo(sub);

  return {
    ...enriched,
    normalizedMonthlyCost: Math.round(monthlyCost * 100) / 100,
    normalizedAnnualCost: Math.round(annualCost * 100) / 100
  };
};

export const getAllSubscriptions = (req, res) => {
  try {
    let subscriptions = db.getAll();
    const { category, status, search } = req.query;

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

    const enriched = subscriptions.map(enrichSubscription);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscriptions", details: error.message });
  }
};

export const getSubscriptionById = (req, res) => {
  try {
    const sub = db.getById(req.params.id);
    if (!sub) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(enrichSubscription(sub));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscription", details: error.message });
  }
};

export const createSubscription = (req, res) => {
  try {
    const sanitized = SubscriptionModel.create(req.body);
    const created = db.create(sanitized);
    res.status(201).json(enrichSubscription(created));
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription", details: error.message });
  }
};

export const updateSubscription = (req, res) => {
  try {
    const existing = db.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const sanitized = SubscriptionModel.create({
      ...existing,
      ...req.body
    });

    const updated = db.update(req.params.id, sanitized);
    res.json(enrichSubscription(updated));
  } catch (error) {
    res.status(500).json({ error: "Failed to update subscription", details: error.message });
  }
};

export const toggleSubscriptionStatus = (req, res) => {
  try {
    const updated = db.toggleStatus(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(enrichSubscription(updated));
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
    const subscriptions = db.getAll();
    const metrics = calculateMetrics(subscriptions);
    
    // Also include upcoming renewals sorted by days remaining
    const activeEnriched = subscriptions
      .filter((s) => s.status === "active")
      .map(enrichSubscription)
      .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

    res.json({
      ...metrics,
      upcomingRenewals: activeEnriched.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate metrics", details: error.message });
  }
};
