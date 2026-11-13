// ============================================
// routes/coins.js — Fetches live crypto data
// ============================================
// WHY do we have a backend for this?
// The CoinGecko free API rate-limits browsers.
// By fetching from our server instead, we can:
// 1. Cache the data (only call CoinGecko once per minute)
// 2. Never get rate-limited because server IPs get more calls
// 3. Protect any API keys from being exposed in frontend code
// ============================================

const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = express.Router();

// Cache stores the data in memory for 60 seconds.
// So if 100 users refresh the page, we only call
// CoinGecko once, not 100 times.
const cache = new NodeCache({ stdTTL: 60 });

// The CoinGecko base URL
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

// ---- GET /api/coins ----
// Returns the top 20 coins by market cap
router.get("/", async (req, res) => {
  try {
    // Check if we have fresh data cached
    const cachedData = cache.get("top20");
    if (cachedData) {
      // We had cached data — return it instantly, no API call needed
      return res.json({ source: "cache", data: cachedData });
    }

    // No cache — call CoinGecko
    const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 20,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
      // Add API key header only if we have one
      headers: process.env.COINGECKO_API_KEY
        ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
        : {},
    });

    // Save in cache for 60 seconds
    cache.set("top20", response.data);

    res.json({ source: "api", data: response.data });
  } catch (error) {
    console.error("CoinGecko error:", error.message);
    res.status(500).json({
      error: "Failed to fetch coin data",
      message: "CoinGecko API might be rate-limiting us. Try again in 30s.",
    });
  }
});

// ---- GET /api/coins/trending ----
// Returns trending/hot coins from CoinGecko
router.get("/trending", async (req, res) => {
  try {
    const cached = cache.get("trending");
    if (cached) return res.json({ source: "cache", data: cached });

    const response = await axios.get(`${COINGECKO_BASE}/search/trending`);
    cache.set("trending", response.data);

    res.json({ source: "api", data: response.data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trending coins" });
  }
});

// ---- GET /api/coins/:id ----
// Returns detailed data for a single coin
// Example: GET /api/coins/bitcoin
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cacheKey = `coin_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const response = await axios.get(`${COINGECKO_BASE}/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
    });

    cache.set(cacheKey, response.data);
    res.json({ source: "api", data: response.data });
  } catch (error) {
    res.status(404).json({ error: `Coin "${id}" not found` });
  }
});

module.exports = router;
