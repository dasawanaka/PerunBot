const mongoose = require("mongoose");

const TicketButton = new mongoose.Schema({
  guildID: { type: String },
  channelID: { type: String },
  messageID: { type: String },
  ticketName: { type: String },
  roleID: { type: String },
});

module.exports = mongoose.model('TicketButton', TicketButton, 'ticketButton');