// ============================================
// index.js — React entry point
// ============================================
// This is the very first file React runs.
// It grabs the <div id="root"> from index.html
// and renders our entire App component inside it.
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Find the <div id="root"> in our HTML and mount React there
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // StrictMode helps catch bugs during development.
  // It runs certain checks twice to warn you about problems.
  // It doesn't affect the production build.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
