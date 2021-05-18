const Discord = require('discord.js');
const pagination = require('discord.js-pagination');

module.exports = {
        name: "help",
        alias: [],
        public: true,
        description: "I'm helping you, right?",
        cooldown: 60000,
       async run(client, message, args){
        const utility = new Discord.MessageEmbed()
        .setTitle('Utilities')
        .addField('`$help`','Wait is that a recursion.')
        .addField('`$ping`','Pong! Wait I missed that...')
        .addField('`$profile`','What I have got, money, simps and my lovely popularity.')
        .addField('`$vote`',`Let's check what is right and what is left`)
        .setTimestamp()

        const pages = [
            utility,
        ]
        const emojiList = ["⏪", "⏩"];

        const timeout = '180000';

        pagination(message, pages, emojiList, timeout)
    }
}

