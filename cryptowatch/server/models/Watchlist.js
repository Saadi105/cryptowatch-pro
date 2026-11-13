// ============================================
// models/Watchlist.js — MongoDB data schema
// ============================================
// A "model" is a blueprint that tells MongoDB
// what shape our data should have.
//
// Think of it like a table in Excel:
// - Schema = the column headers
// - Model = the whole table
// - Document = one row
// ============================================

const mongoose = require("mongoose");

// Define the shape of a watchlist document in MongoDB
const watchlistSchema = new mongoose.Schema(
  {
    // userId identifies whose watchlist this is.
    // For now we use a simple string (e.g. "user_123").
    // Later you can replace this with real auth (JWT tokens).
    userId: {
      type: String,
      required: true,
      default: "default_user", // For demo — one shared watchlist
    },

    // An array of coin IDs the user has starred
    // e.g. ["bitcoin", "ethereum", "solana"]
    coins: {
      type: [String],
      default: [],
    },
  },
  {
    // timestamps: true automatically adds:
    // createdAt — when the document was created
    // updatedAt — when it was last changed
    timestamps: true,
  }
);

// Export the model so our routes can use it
// "Watchlist" becomes the MongoDB collection name (lowercase plural: "watchlists")
module.exports = mongoose.model("Watchlist", watchlistSchema);
