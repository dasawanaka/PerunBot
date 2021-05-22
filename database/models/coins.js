const mongoose = require("mongoose");

const CoinsSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  coins: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coins', CoinsSchema, 'coins');