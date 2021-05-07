const { Long } = require('bson');
const mongoose = require('mongoose');

const levelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    level: Long,
    testServer: Boolean,
    premium: Boolean,
    disabledModules: [{
        type: String
    }]
});

module.exports = mongoose.model('Guild', levelSchema, 'guilds');