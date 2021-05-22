const mongoose = require("mongoose");

const MessageCounter = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  messages: { type: Number, default: 0 }
});

module.exports = mongoose.model('MessageCounter', MessageCounter, 'messageCounter');