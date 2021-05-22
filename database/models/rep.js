const mongoose = require("mongoose");

const RepSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  rep: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  lastGiveRep: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reputation', RepSchema, 'reputation');