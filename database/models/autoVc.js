const mongoose = require("mongoose");

const AutoVc = new mongoose.Schema({
  guildID: { type: String },
  channelID: { type: String },
  parentID: { type: String },
  maxUsers: { type: Number, default: 2 }
});

module.exports = mongoose.model('AutoVc', AutoVc, 'autoVc');