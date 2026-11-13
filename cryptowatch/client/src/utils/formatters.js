// ============================================
// utils/formatters.js — Helper functions
// ============================================
// Small utility functions used throughout the app.
// Keeping them in one place avoids repeating code.
// ============================================

// Format a price number nicely
// $45,234.00 for BTC, $0.0004 for very small coins
export const formatPrice = (price) => {
  if (!price && price !== 0) return "—";
  if (price >= 1000) return "$" + Math.round(price).toLocaleString();
  if (price >= 1) return "$" + price.toFixed(2);
  if (price >= 0.01) return "$" + price.toFixed(4);
  return "$" + price.toFixed(6);
};

// Format a large number into a readable format
// 1,200,000,000 → $1.2B
export const formatMarketCap = (num) => {
  if (!num) return "—";
  if (num >= 1e12) return "$" + (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return "$" + (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return "$" + (num / 1e6).toFixed(1) + "M";
  return "$" + num.toLocaleString();
};

// Format a percentage change with a sign
// 4.23 → "+4.23%"   -2.1 → "-2.10%"
export const formatChange = (change) => {
  if (change === null || change === undefined) return "—";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
};

// Get color based on positive/negative value
export const getChangeColor = (change) => {
  if (change > 0) return "var(--green)";
  if (change < 0) return "var(--red)";
  return "var(--text-secondary)";
};

// Calculate the "market mood" (like Fear & Greed index)
// Based on how many coins are rising vs falling
export const calcMarketMood = (coins) => {
  if (!coins.length) return { score: 50, label: "Neutral", color: "#888" };

  const rising = coins.filter(
    (c) => c.price_change_percentage_24h > 0
  ).length;
  const score = Math.round((rising / coins.length) * 100);

  if (score >= 70) return { score, label: "Greedy", color: "var(--green)" };
  if (score >= 50) return { score, label: "Neutral", color: "var(--amber)" };
  if (score >= 30) return { score, label: "Fearful", color: "var(--red)" };
  return { score, label: "Panic", color: "#E24B4A" };
};

// Shorten a long coin name for display
export const shortName = (name) => {
  if (name.length <= 12) return name;
  return name.substring(0, 11) + "…";
};
