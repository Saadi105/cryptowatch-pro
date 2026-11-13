require("dotenv").config();

const express = require("express");
const cors = require("cors");

const coinRoutes = require("./routes/coins");
const watchlistRoutes = require("./routes/watchlist");
const alertRoutes = require("./routes/alerts");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/coins", coinRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/alerts", alertRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CryptoWatch API is running!", status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});