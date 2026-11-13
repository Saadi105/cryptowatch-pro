// ============================================
// components/HotCoins.jsx — Featured coin cards
// ============================================
// Shows BTC, ETH, SOL, BNB, ADA, XRP in cards
// with mini sparkline charts and watch buttons.
// ============================================

import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { formatPrice } from "../utils/formatters";

// Register all Chart.js components (required in v4)
Chart.register(...registerables);

// The 6 coins we feature at the top
const HOT_IDS = ["bitcoin", "ethereum", "solana", "binancecoin", "cardano", "ripple"];

// Colors for each coin's accent dot
const COIN_COLORS = {
  bitcoin: "#EF9F27",
  ethereum: "#7F77DD",
  solana: "#1D9E75",
  binancecoin: "#BA7517",
  cardano: "#378ADD",
  ripple: "#5DCAA5",
};

// ---- SparkLine component ----
// A tiny chart showing the price trend direction
const SparkLine = ({ coinId, isUp }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart before drawing a new one
    // This prevents the "canvas already in use" error
    if (chartRef.current) chartRef.current.destroy();

    // Generate fake trend data just for visual direction
    // In a real app, you'd fetch 7-day price history from CoinGecko
    const points = Array.from({ length: 14 }, (_, i) => {
      const base = 50 + Math.sin(i * 0.6) * 15;
      const trend = isUp ? i * 2 : -i * 2;
      return base + trend + Math.random() * 8;
    });

    const color = isUp ? "#1D9E75" : "#D85A30";
    const bgColor = isUp ? "rgba(29,158,117,0.08)" : "rgba(216,90,48,0.08)";

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: points.map((_, i) => i),
        datasets: [
          {
            data: points,
            borderColor: color,
            borderWidth: 1.5,
            pointRadius: 0,
            fill: true,
            backgroundColor: bgColor,
            tension: 0.4, // Makes the line curved
          },
        ],
      },
      options: {
        responsive: false,
        animation: { duration: 800 },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });

    // Cleanup: destroy chart when component unmounts
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [coinId, isUp]);

  return <canvas ref={canvasRef} width={140} height={36} />;
};

// ---- HotCoins main component ----
const HotCoins = ({ coins, watchlist, onToggleWatch }) => {
  // Filter to only show our 6 featured coins
  const hotCoins = HOT_IDS.map((id) => coins.find((c) => c.id === id)).filter(
    Boolean
  );

  if (!hotCoins.length) return null;

  return (
    <div style={{ marginBottom: "1.2rem" }}>
      {/* Section title */}
      <p
        style={{
          fontSize: "11px",
          fontWeight: "500",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <i className="ti ti-flame" aria-hidden="true" style={{ fontSize: "13px" }} />
        Hot coins — click star to watch
      </p>

      {/* Grid of coin cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
          gap: "10px",
        }}
      >
        {hotCoins.map((coin) => {
          const change = coin.price_change_percentage_24h || 0;
          const isUp = change >= 0;
          const isWatched = watchlist.includes(coin.id);

          return (
            <div
              key={coin.id}
              style={{
                background: isWatched ? "var(--amber-light)" : "var(--bg-card)",
                border: isWatched
                  ? "1px solid var(--amber)"
                  : "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "12px 14px",
                transition: "transform 0.15s, border-color 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {/* Card header: coin name + star button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  {/* Colored dot unique to each coin */}
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: COIN_COLORS[coin.id] || "#888",
                    }}
                  />
                  <span style={{ fontSize: "12px", fontWeight: "500" }}>
                    {coin.symbol.toUpperCase()}
                  </span>
                </div>

                {/* Star/watch button */}
                <button
                  onClick={() => onToggleWatch(coin.id)}
                  aria-label={`${isWatched ? "Unwatch" : "Watch"} ${coin.name}`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: isWatched ? "var(--amber)" : "var(--text-secondary)",
                    padding: "0",
                    lineHeight: "1",
                    transition: "color 0.2s",
                  }}
                >
                  <i className="ti ti-star" aria-hidden="true" />
                </button>
              </div>

              {/* Price */}
              <div style={{ fontSize: "15px", fontWeight: "500", marginBottom: "3px" }}>
                {formatPrice(coin.current_price)}
              </div>

              {/* 24h change */}
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: isUp ? "var(--green)" : "var(--red)",
                  marginBottom: "6px",
                }}
              >
                {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
              </div>

              {/* Mini sparkline chart */}
              <SparkLine coinId={coin.id} isUp={isUp} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotCoins;
