// ============================================
// components/AlertModal.jsx — Price alert popup
// ============================================
// A modal dialog that lets the user set a price
// alert for a specific coin.
// ============================================

import React, { useState } from "react";
import { formatPrice } from "../utils/formatters";

const AlertModal = ({ coin, onSave, onClose }) => {
  // Local state for the form fields inside this modal
  const [direction, setDirection] = useState("above");
  const [targetPrice, setTargetPrice] = useState("");

  if (!coin) return null;

  const handleSave = () => {
    const price = parseFloat(targetPrice);
    if (!price || isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    // Call the onSave function passed from the parent (App.jsx)
    onSave({ coinId: coin.id, coinSymbol: coin.symbol, coinName: coin.name, direction, targetPrice: price });
    onClose();
  };

  // Overlay (the dark background behind the modal)
  const overlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "var(--bg-card)",
    borderRadius: "var(--radius-lg)",
    padding: "24px",
    width: "300px",
    border: "1px solid var(--border)",
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    background: "var(--bg)",
    color: "var(--text-primary)",
    fontSize: "13px",
    marginBottom: "12px",
    outline: "none",
  };

  return (
    // Clicking the overlay closes the modal
    <div style={overlayStyle} onClick={onClose}>
      {/* stopPropagation prevents clicks inside the modal from closing it */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "4px" }}>
          Set alert — {coin.symbol.toUpperCase()}
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "18px" }}>
          Current price: {formatPrice(coin.current_price)}
        </p>

        {/* Direction selector */}
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          style={{ ...inputStyle }}
        >
          <option value="above">Alert when price goes above $</option>
          <option value="below">Alert when price drops below $</option>
        </select>

        {/* Target price input */}
        <input
          type="number"
          placeholder="Enter target price..."
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          style={inputStyle}
          step="any"
          autoFocus
        />

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "8px", borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text-primary)", fontSize: "13px", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1, padding: "8px", borderRadius: "var(--radius-md)",
              border: "1px solid var(--purple)", background: "var(--purple-light)",
              color: "var(--purple-dark)", fontSize: "13px", cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Set alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
