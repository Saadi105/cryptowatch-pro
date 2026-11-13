// ============================================
// App.jsx — The root component of our app
// ============================================
// This is the "brain" of the frontend.
// It holds the main state and passes data down
// to child components as props.
//
// Component tree:
// App
// ├── StatCards
// ├── HotCoins
// ├── CoinTable
// └── AlertModal
// ============================================

import React, { useState, useEffect } from "react";
import axios from "axios";
import useCryptoData from "./hooks/useCryptoData";
import StatCards from "./components/StatCards";
import HotCoins from "./components/HotCoins";
import CoinTable from "./components/CoinTable";
import AlertModal from "./components/AlertModal";
import { calcMarketMood } from "./utils/formatters";

const App = () => {
  // ---- DATA STATE ----
  const { coins, loading, error, lastUpdated, prevPrices, refetch } = useCryptoData();

  // ---- UI STATE ----
  const [activeTab, setActiveTab] = useState("all"); // all | up | down | watch
  const [searchQuery, setSearchQuery] = useState("");
  const [alertCoin, setAlertCoin] = useState(null); // coin to set alert for (opens modal)
  const [toast, setToast] = useState(""); // toast notification message

  // ---- FEATURE STATE ----
  // Watchlist and alerts stored in React state.
  // In a full app, these are saved to MongoDB via the backend API.
  const [watchlist, setWatchlist] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Load watchlist from backend on app start
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const res = await axios.get("/api/watchlist");
        setWatchlist(res.data.coins || []);
      } catch (e) {
        // If backend isn't running, start with empty watchlist
        console.log("Backend not available — using local state only");
      }
    };
    loadWatchlist();
  }, []);

  // Show a toast notification for 2 seconds
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // ---- WATCHLIST HANDLERS ----
  const handleToggleWatch = async (coinId) => {
    const isWatched = watchlist.includes(coinId);
    const newList = isWatched
      ? watchlist.filter((id) => id !== coinId)
      : [...watchlist, coinId];

    setWatchlist(newList);
    showToast(isWatched ? "Removed from watchlist" : "Added to watchlist ⭐");

    // Save to backend (optional — works even if backend is offline)
    try {
      await axios.post(`/api/watchlist/${isWatched ? "remove" : "add"}`, { coinId });
    } catch (e) {
      // Fail silently — local state is already updated
    }
  };

  // ---- ALERT HANDLERS ----
  const handleSaveAlert = async (alertData) => {
    const newAlert = { ...alertData, id: Date.now(), triggered: false };
    setAlerts((prev) => [...prev, newAlert]);
    showToast(`Alert set for ${alertData.coinSymbol.toUpperCase()} 🔔`);

    // Save to backend
    try {
      await axios.post("/api/alerts", alertData);
    } catch (e) {
      // Fail silently
    }
  };

  const handleRemoveAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // Check if any alerts have been triggered when coins refresh
  useEffect(() => {
    if (!coins.length) return;
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.triggered) return alert;
        const coin = coins.find((c) => c.id === alert.coinId);
        if (!coin) return alert;
        const fired =
          (alert.direction === "above" && coin.current_price >= alert.targetPrice) ||
          (alert.direction === "below" && coin.current_price <= alert.targetPrice);
        if (fired) {
          showToast(`🚨 ${alert.coinSymbol} ${alert.direction === "above" ? "crossed above" : "dropped below"} $${alert.targetPrice}!`);
          return { ...alert, triggered: true };
        }
        return alert;
      })
    );
  }, [coins]);

  // ---- FILTER COINS for the table ----
  const getFilteredCoins = () => {
    let list = [...coins];
    if (activeTab === "up") list = list.filter((c) => c.price_change_percentage_24h > 0);
    if (activeTab === "down") list = list.filter((c) => c.price_change_percentage_24h < 0);
    if (activeTab === "watch") list = list.filter((c) => watchlist.includes(c.id));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const mood = calcMarketMood(coins);
  const filteredCoins = getFilteredCoins();

  // ---- LOADING STATE ----
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>₿</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading market data...</p>
        </div>
      </div>
    );
  }

  // ---- STYLES ----
  const tabStyle = (t) => ({
    padding: "5px 12px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border)",
    background: activeTab === t ? "var(--bg)" : "transparent",
    color: activeTab === t ? "var(--text-primary)" : "var(--text-secondary)",
    fontWeight: activeTab === t ? "500" : "400",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px 40px" }}>

      {/* ---- HEADER ---- */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-currency-bitcoin" aria-hidden="true" style={{ fontSize: "18px", color: "var(--purple-dark)" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "500" }}>CryptoWatch Pro</h1>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Real-time market tracker</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {lastUpdated && (
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", background: "var(--green-light)", borderRadius: "20px", fontSize: "11px", fontWeight: "500", color: "var(--green-dark)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 1.4s infinite" }} />
            Live
          </div>
        </div>
      </div>

      {/* ---- MARKET MOOD BAR ---- */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
          <i className="ti ti-brain" aria-hidden="true" style={{ fontSize: "13px", verticalAlign: "-1px", marginRight: "4px" }} />
          Market mood
        </span>
        <div style={{ flex: 1, height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${mood.score}%`, background: mood.color, borderRadius: "3px", transition: "width 0.8s ease" }} />
        </div>
        <span style={{ fontSize: "13px", fontWeight: "500", color: mood.color, whiteSpace: "nowrap" }}>
          {mood.label} ({mood.score})
        </span>
      </div>

      {/* ---- STAT CARDS ---- */}
      <StatCards coins={coins} />

      {/* ---- HOT COINS ---- */}
      <HotCoins coins={coins} watchlist={watchlist} onToggleWatch={handleToggleWatch} />

      {/* ---- CONTROLS: tabs + search + refresh ---- */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {[
            { key: "all", label: "All 20" },
            { key: "up", label: "Pumping ▲" },
            { key: "down", label: "Dipping ▼" },
            { key: "watch", label: "⭐ Watchlist" },
          ].map((tab) => (
            <button key={tab.key} style={tabStyle(tab.key)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search coin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: "120px", padding: "6px 10px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg)", color: "var(--text-primary)", fontSize: "12px" }}
        />
        <button
          onClick={refetch}
          style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
        >
          <i className="ti ti-refresh" aria-hidden="true" /> Refresh
        </button>
      </div>

      {/* ---- ERROR MESSAGE ---- */}
      {error && (
        <div style={{ padding: "16px", background: "var(--red-light)", borderRadius: "var(--radius-md)", color: "var(--red-dark)", fontSize: "13px", marginBottom: "12px" }}>
          <i className="ti ti-wifi-off" aria-hidden="true" style={{ marginRight: "6px" }} />
          {error}
        </div>
      )}

      {/* ---- COIN TABLE ---- */}
      {filteredCoins.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)", fontSize: "13px" }}>
          {activeTab === "watch" ? "Star any coin to add it to your watchlist." : "No coins match your search."}
        </div>
      ) : (
        <CoinTable
          coins={filteredCoins}
          prevPrices={prevPrices}
          watchlist={watchlist}
          alerts={alerts}
          onToggleWatch={handleToggleWatch}
          onOpenAlert={(coin) => setAlertCoin(coin)}
        />
      )}

      {/* ---- ALERTS PANEL ---- */}
      {alerts.length > 0 && (
        <div style={{ marginTop: "1.5rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px 16px" }}>
          <p style={{ fontSize: "13px", fontWeight: "500", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="ti ti-bell" aria-hidden="true" /> Price alerts ({alerts.length})
          </p>
          {alerts.map((alert) => (
            <div key={alert.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "12px" }}>
              <span style={{ fontWeight: "500" }}>{alert.coinSymbol.toUpperCase()}</span>
              <span style={{ color: "var(--text-secondary)" }}>{alert.direction} ${alert.targetPrice}</span>
              <span style={{ color: alert.triggered ? "var(--green)" : "var(--text-secondary)", fontSize: "11px" }}>
                {alert.triggered ? "✓ Triggered" : "Watching..."}
              </span>
              <button onClick={() => handleRemoveAlert(alert.id)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "11px" }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---- ALERT MODAL ---- */}
      {alertCoin && (
        <AlertModal coin={alertCoin} onSave={handleSaveAlert} onClose={() => setAlertCoin(null)} />
      )}

      {/* ---- TOAST NOTIFICATION ---- */}
      {toast && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", padding: "10px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "13px", zIndex: 999, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", animation: "slideIn 0.2s ease" }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>
    </div>
  );
};

export default App;
