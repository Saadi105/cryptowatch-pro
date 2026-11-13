// ============================================
// routes/watchlist.js — Watchlist CRUD routes
// ============================================
// CRUD = Create, Read, Update, Delete
// These are the 4 basic operations for any database feature.
// ============================================

const express = require("express");
const Watchlist = require("../models/Watchlist");

const router = express.Router();

// A simple userId for now — in a real app this comes from
// JWT authentication (login system). We'll keep it simple.
const DEFAULT_USER = "default_user";

// ---- GET /api/watchlist ----
// Fetch the user's saved watchlist from MongoDB
router.get("/", async (req, res) => {
  try {
    // findOne = find the first document matching these conditions
    let watchlist = await Watchlist.findOne({ userId: DEFAULT_USER });

    // If no watchlist exists yet, return an empty coins array
    if (!watchlist) {
      return res.json({ coins: [] });
    }

    res.json({ coins: watchlist.coins });
  } catch (error) {
    res.status(500).json({ error: "Failed to load watchlist" });
  }
});

// ---- POST /api/watchlist/add ----
// Add a coin to the watchlist
// Body: { coinId: "bitcoin" }
router.post("/add", async (req, res) => {
  const { coinId } = req.body;

  if (!coinId) {
    return res.status(400).json({ error: "coinId is required" });
  }

  try {
    // findOneAndUpdate — find and update in one step.
    // $addToSet = only add if it doesn't already exist (no duplicates)
    // upsert: true = create the document if it doesn't exist yet
    // new: true = return the updated document (not the old one)
    const watchlist = await Watchlist.findOneAndUpdate(
      { userId: DEFAULT_USER },
      { $addToSet: { coins: coinId } },
      { upsert: true, new: true }
    );

    res.json({ message: `${coinId} added to watchlist`, coins: watchlist.coins });
  } catch (error) {
    res.status(500).json({ error: "Failed to add coin" });
  }
});

// ---- POST /api/watchlist/remove ----
// Remove a coin from the watchlist
// Body: { coinId: "bitcoin" }
router.post("/remove", async (req, res) => {
  const { coinId } = req.body;

  try {
    // $pull = remove a value from an array
    const watchlist = await Watchlist.findOneAndUpdate(
      { userId: DEFAULT_USER },
      { $pull: { coins: coinId } },
      { new: true }
    );

    res.json({ message: `${coinId} removed`, coins: watchlist?.coins || [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove coin" });
  }
});

module.exports = router;
