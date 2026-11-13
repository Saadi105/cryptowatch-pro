// ============================================
// components/StatCards.jsx — Summary stat cards
// ============================================
// Shows 4 key stats at the top of the dashboard:
// Top gainer, Top loser, Rising coins, Total market cap
// ============================================

import React from "react";
import { formatPrice, formatMarketCap } from "../utils/formatters";

const StatCards = ({ coins }) => {
  if (!coins.length) return null;

  // Sort to find the biggest gainer and loser
  const sorted = [...coins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  );
  const topGainer = sorted[0];
  const topLoser = sorted[sorted.length - 1];
  const rising = coins.filter((c) => c.price_change_percentage_24h > 0).length;
  const totalMC = coins.reduce((sum, c) => sum + (c.market_cap || 0), 0);

  // Each card is defined as data so we can map() over them
  // This is cleaner than writing 4 separate JSX blocks
  const cards = [
    {
      label: "Top gainer 24h",
      value: `${topGainer.symbol.toUpperCase()} +${topGainer.price_change_percentage_24h.toFixed(2)}%`,
      sub: formatPrice(topGainer.current_price),
      color: "var(--green)",
    },
    {
      label: "Top loser 24h",
      value: `${topLoser.symbol.toUpperCase()} ${topLoser.price_change_percentage_24h.toFixed(2)}%`,
      sub: formatPrice(topLoser.current_price),
      color: "var(--red)",
    },
    {
      label: "Rising / total",
      value: `${rising} / ${coins.length}`,
      sub: "market sentiment",
      color: rising > coins.length / 2 ? "var(--green)" : "var(--red)",
    },
    {
      label: "Total mkt cap",
      value: formatMarketCap(totalMC),
      sub: "top 20 coins",
      color: "var(--text-primary)",
    },
  ];

  const cardStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "14px 16px",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "10px",
        marginBottom: "1.2rem",
      }}
    >
      {cards.map((card) => (
        <div key={card.label} style={cardStyle}>
          <p
            style={{
              fontSize: "10px",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "6px",
            }}
          >
            {card.label}
          </p>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: card.color,
              marginBottom: "3px",
            }}
          >
            {card.value}
          </p>
          <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
