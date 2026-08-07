// Main Express Backend Server for Subscription Tracker
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/subscriptions", subscriptionRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "Subscription Tracker API",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡ Subscription Tracker backend running at http://localhost:${PORT}`);
});
