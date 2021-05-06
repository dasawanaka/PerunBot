const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'setprefix',
    alias: [],
    public: true,
    description: 'this is set prefix command',
    usage: '<prefix>setPrefix <newPrefix>',
    async run(client, message, args) {

        const guildSettings = await Guild.findOne({
            guildID: message.guild.id
        });

        //console.log('setPrefixDebug');//!message.member.hasPermission("MANAGE_EMOJIS")
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You must have an ADMINISTRATOR permission!');
        if (!args[0]) return message.channel.send('You must provide a **new prefix**!');
        if (args[0].length >= 6) return message.channel.send('Your new prefix must be under \`6\` characters!')


        if (guildSettings) {
            await Guild.findOneAndUpdate({
                guildID: message.guild.id
            }, { $set: { prefix: args[0] } })
                .then(
                    function (result) {
                        console.log(result);
                        message.channel.send(`The new prefix is now **\`${args[0]}\`**`);
                    })
                .catch( function (err) {
                    console.error(err);
                    message.channel.send(`Can not update prefix now, try again later.`);
                });

        } else if (!guildSettings) {
            message.channel.send(`Can not update prefix now, try again later.`);
        }

    }
}