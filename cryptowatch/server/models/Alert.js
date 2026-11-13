// ============================================
// models/Alert.js — Price alert schema
// ============================================

const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "default_user",
    },

    // Which coin this alert is for
    coinId: {
      type: String,
      required: true, // e.g. "bitcoin"
    },

    coinSymbol: {
      type: String,
      required: true, // e.g. "BTC"
    },

    coinName: {
      type: String,
      required: true, // e.g. "Bitcoin"
    },

    // Direction: "above" means alert when price goes above target
    //            "below" means alert when price drops below target
    direction: {
      type: String,
      enum: ["above", "below"], // Only these two values allowed
      required: true,
    },

    // The price the user wants to be alerted at
    targetPrice: {
      type: Number,
      required: true,
    },

    // Has this alert already fired?
    triggered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
