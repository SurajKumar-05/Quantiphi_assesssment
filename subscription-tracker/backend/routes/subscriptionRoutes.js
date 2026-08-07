// Express Router for Subscription Endpoints
import express from "express";
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  toggleSubscriptionStatus,
  deleteSubscription,
  getSubscriptionMetrics
} from "../controllers/subscriptionController.js";
import { validateSubscription } from "../middleware/validate.js";

const router = express.Router();

// Metrics endpoint MUST come before :id route
router.get("/metrics", getSubscriptionMetrics);

// Subscription CRUD & Toggle endpoints
router.get("/", getAllSubscriptions);
router.post("/", validateSubscription, createSubscription);
router.get("/:id", getSubscriptionById);
router.put("/:id", validateSubscription, updateSubscription);
router.patch("/:id/toggle", toggleSubscriptionStatus);
router.delete("/:id", deleteSubscription);

export default router;
