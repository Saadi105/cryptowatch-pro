// ============================================
// components/CoinTable.jsx — Main data table
// ============================================
// The main interactive table showing all 20 coins
// with sorting, filtering, watchlist, and alert buttons.
// ============================================

import React, { useState } from "react";
import { formatPrice, formatMarketCap, formatChange, getChangeColor } from "../utils/formatters";

const CoinTable = ({ coins, prevPrices, watchlist, alerts, onToggleWatch, onOpenAlert }) => {
  // Local state for sorting
  const [sortKey, setSortKey] = useState("market_cap_rank");
  const [sortDir, setSortDir] = useState(1); // 1 = ascending, -1 = descending

  // Handle clicking a column header to sort
  const handleSort = (key) => {
    if (sortKey === key) {
      // Same column clicked — reverse direction
      setSortDir((d) => d * -1);
    } else {
      // New column — sort ascending
      setSortKey(key);
      setSortDir(1);
    }
  };

  // Sort the coins array based on current sort settings
  const sorted = [...coins].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    return (av > bv ? 1 : -1) * sortDir;
  });

  // Arrow indicator shown next to sorted column header
  const arrow = (key) => {
    if (sortKey !== key) return null;
    return sortDir > 0 ? " ↑" : " ↓";
  };

  // Column header style — highlights the active sort column
  const thStyle = (key) => ({
    fontSize: "10px",
    color: sortKey === key ? "var(--purple)" : "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    padding: "8px 10px",
    borderBottom: "1px solid var(--border)",
    textAlign: key === "market_cap_rank" || key === "name" ? "left" : "right",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    fontWeight: sortKey === key ? "500" : "400",
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr>
            <th style={thStyle("market_cap_rank")} onClick={() => handleSort("market_cap_rank")}>
              # {arrow("market_cap_rank")}
            </th>
            <th style={{ ...thStyle("name"), cursor: "default" }}>Coin</th>
            <th style={thStyle("current_price")} onClick={() => handleSort("current_price")}>
              Price {arrow("current_price")}
            </th>
            <th style={thStyle("price_change_percentage_24h")} onClick={() => handleSort("price_change_percentage_24h")}>
              24h {arrow("price_change_percentage_24h")}
            </th>
            <th style={thStyle("market_cap")} onClick={() => handleSort("market_cap")}>
              Mkt cap {arrow("market_cap")}
            </th>
            <th style={thStyle("total_volume")} onClick={() => handleSort("total_volume")}>
              Volume {arrow("total_volume")}
            </th>
            {/* Non-sortable action columns */}
            <th style={{ ...thStyle(""), cursor: "default", textAlign: "center" }}>Alert</th>
            <th style={{ ...thStyle(""), cursor: "default", textAlign: "center" }}>Watch</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((coin) => {
            const change = coin.price_change_percentage_24h || 0;
            const isUp = change >= 0;
            const isWatched = watchlist.includes(coin.id);
            const hasAlert = alerts.some((a) => a.coinId === coin.id);

            // Detect if price changed from last refresh
            const prevPrice = prevPrices[coin.id];
            let flashClass = "";
            if (prevPrice !== undefined) {
              if (coin.current_price > prevPrice) flashClass = "flash-up";
              else if (coin.current_price < prevPrice) flashClass = "flash-down";
            }

            return (
              <tr
                key={coin.id}
                className={flashClass}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Rank */}
                <td style={{ padding: "10px 10px", color: "var(--text-secondary)", fontSize: "11px" }}>
                  {coin.market_cap_rank}
                </td>

                {/* Coin name + logo */}
                <td style={{ padding: "10px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                      src={coin.image}
                      alt={coin.name}
                      width={18}
                      height={18}
                      style={{ borderRadius: "50%" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "12px" }}>{coin.name}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                        {coin.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: "500" }}>
                  {formatPrice(coin.current_price)}
                </td>

                {/* 24h change badge */}
                <td style={{ padding: "10px 10px", textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: "11px",
                      padding: "2px 7px",
                      borderRadius: "4px",
                      fontWeight: "500",
                      background: isUp ? "var(--green-light)" : "var(--red-light)",
                      color: isUp ? "var(--green-dark)" : "var(--red-dark)",
                    }}
                  >
                    {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                  </span>
                </td>

                {/* Market cap */}
                <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--text-secondary)" }}>
                  {formatMarketCap(coin.market_cap)}
                </td>

                {/* Volume */}
                <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--text-secondary)" }}>
                  {formatMarketCap(coin.total_volume)}
                </td>

                {/* Alert button */}
                <td style={{ padding: "10px 10px", textAlign: "center" }}>
                  <button
                    onClick={() => onOpenAlert(coin)}
                    aria-label={`Set alert for ${coin.name}`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: hasAlert ? "var(--blue)" : "var(--text-secondary)",
                      transition: "color 0.2s",
                    }}
                  >
                    <i className="ti ti-bell" aria-hidden="true" />
                  </button>
                </td>

                {/* Watchlist star button */}
                <td style={{ padding: "10px 10px", textAlign: "center" }}>
                  <button
                    onClick={() => onToggleWatch(coin.id)}
                    aria-label={`${isWatched ? "Unwatch" : "Watch"} ${coin.name}`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: isWatched ? "var(--amber)" : "var(--text-secondary)",
                      transition: "color 0.2s",
                    }}
                  >
                    <i className="ti ti-star" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
