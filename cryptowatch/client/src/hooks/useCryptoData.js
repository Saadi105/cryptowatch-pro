// ============================================
// hooks/useCryptoData.js — Custom React Hook
// ============================================
// WHY a custom hook?
// Instead of putting all the data-fetching logic
// inside our components (which makes them messy),
// we pull it out into a "hook" — a reusable function
// that any component can use.
//
// This is a core React pattern used in real jobs.
// ============================================

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useCryptoData = () => {
  // State = data that can change and will re-render the UI when it does
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [prevPrices, setPrevPrices] = useState({});

  // fetchCoins — the main data-fetching function
  // useCallback memoizes it so it doesn't re-create on every render
  const fetchCoins = useCallback(async () => {
    try {
      setError(null);

      // Call our own backend (which talks to CoinGecko)
      // The "proxy" in package.json forwards /api/* to localhost:5000
      const response = await axios.get("/api/coins");
      const newCoins = response.data.data;

      // Track previous prices so we can flash color on change
      const newPrevPrices = {};
      newCoins.forEach((coin) => {
        newPrevPrices[coin.id] = coin.current_price;
      });

      setCoins((prev) => {
        // Save old prices before replacing with new data
        const oldPrices = {};
        prev.forEach((c) => (oldPrices[c.id] = c.current_price));
        setPrevPrices(oldPrices);
        return newCoins;
      });

      setLastUpdated(new Date());
    } catch (err) {
      setError("Could not load coin data. Try refreshing.");
      console.error("Fetch error:", err);
    } finally {
      // finally runs whether the request succeeded or failed
      setLoading(false);
    }
  }, []);

  // useEffect runs after the component mounts.
  // The [] at the end means "run once when component mounts".
  useEffect(() => {
    fetchCoins();

    // Set up auto-refresh every 60 seconds
    const interval = setInterval(fetchCoins, 60000);

    // Cleanup: when the component unmounts, stop the interval
    // This prevents memory leaks
    return () => clearInterval(interval);
  }, [fetchCoins]);

  // Return everything the component needs
  return { coins, loading, error, lastUpdated, prevPrices, refetch: fetchCoins };
};

export default useCryptoData;
