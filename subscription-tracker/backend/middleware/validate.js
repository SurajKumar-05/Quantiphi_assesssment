// Validation middleware for subscription request payloads
import { SubscriptionModel } from "../models/Subscription.js";

export const validateSubscription = (req, res, next) => {
  const validation = SubscriptionModel.validate(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      error: "Validation Failed",
      details: validation.errors
    });
  }

  next();
};
