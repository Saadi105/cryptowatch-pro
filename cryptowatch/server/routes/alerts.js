// ============================================
// routes/alerts.js — Price alert CRUD routes
// ============================================

const express = require("express");
const Alert = require("../models/Alert");

const router = express.Router();
const DEFAULT_USER = "default_user";

// ---- GET /api/alerts ----
// Get all alerts for the user
router.get("/", async (req, res) => {
  try {
    // find() returns all matching documents as an array
    const alerts = await Alert.find({ userId: DEFAULT_USER }).sort({
      createdAt: -1, // Newest first
    });

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// ---- POST /api/alerts ----
// Create a new price alert
// Body: { coinId, coinSymbol, coinName, direction, targetPrice }
router.post("/", async (req, res) => {
  const { coinId, coinSymbol, coinName, direction, targetPrice } = req.body;

  // Validate that all required fields are present
  if (!coinId || !coinSymbol || !direction || !targetPrice) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create a new alert document and save it to MongoDB
    const alert = new Alert({
      userId: DEFAULT_USER,
      coinId,
      coinSymbol,
      coinName,
      direction,
      targetPrice: parseFloat(targetPrice),
    });

    await alert.save(); // Save to database

    res.status(201).json({ message: "Alert created", alert });
  } catch (error) {
    res.status(500).json({ error: "Failed to create alert" });
  }
});

// ---- PATCH /api/alerts/:id/trigger ----
// Mark an alert as triggered (fired)
router.patch("/:id/trigger", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { triggered: true },
      { new: true }
    );

    if (!alert) return res.status(404).json({ error: "Alert not found" });

    res.json({ message: "Alert triggered", alert });
  } catch (error) {
    res.status(500).json({ error: "Failed to update alert" });
  }
});

// ---- DELETE /api/alerts/:id ----
// Delete an alert
router.delete("/:id", async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: "Alert deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

module.exports = router;
