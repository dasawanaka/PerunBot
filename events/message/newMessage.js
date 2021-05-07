const { arg } = require("mathjs");
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const Discord = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');
const Levels = require("discord-xp");

const expTime = new Map();


module.exports = {
    name: 'newMessage',
    description: 'this is event for new message',
    async run(message, client) {

        if (message.author.bot || message.channel.type === 'dm') {
            return;
        }

        let guildId = message.guild.id;
        let guildSettings = client.guildSettings.get(guildId);
        var prefix;
        if (!guildSettings) {
            guildSettings = await Guild.findOne({ guildID: guildId },
                (err, guild) => {
                    if (err) console.error(err)
                    if (!guild) {
                        const newGuild = new Guild({
                            _id: mongoose.Types.ObjectId(),
                            guildID: message.guild.id,
                            guildName: message.guild.name,
                            prefix: '$',
                            testServer: false,
                            premium: false,
                            disabledModules: ['none']
                        })
                        newGuild.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));

                        client.guildSettings.set(guildId, newGuild);

                        return message.channel.send('This server was not in our database! We have now added and you should be able to use all bot functions.')
                            .then(m => m.delete({ timeout: 5000 }));
                    }
                    return guild;
                })
        }
        prefix = guildSettings.prefix;

        if (!(message.content.startsWith(prefix))) {
            if (expTime.get(message.author.id) === undefinded || Date.now() - expTime.get(message.author.id) > 60000) {
                const randomXp = Math.floor(Math.random() * 9) + 1;
                const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
                if (hasLeveledUp) {
                    const user = await Levels.fetch(message.author.id, message.guild.id);
                    message.channel.send(`Congrats! You leveled up to ${user.level}! Keep it going!`);
                }
                expTime.set(message.author.id, Date.now());
            }
            return;

        }

        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).run(client, message, args);

        } catch (error) {
            console.error(error);
        }



    }
}
