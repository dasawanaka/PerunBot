const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

class PING extends Command {
    constructor() {
        super({
            name: "ping",
            alias: [],
            public: true,
            description: "Ping command, return api ping v2"
        })
    }
    data = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping command, return api ping for bot. (not return your client ping) v2")

    async run(interaction) {

        var ping = interaction.client.ws.ping;
        var embed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("🏓 Pong!")
          .addFields(
            { name: "Api Ping", value: `${ping} ms`, inline: true },
          )
          .setTimestamp()
          .setFooter(interaction.client.user.username, interaction.client.user.avatarURL()); 

       await interaction.reply({ embeds: [embed] });
    }

}


module.exports = PING;

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}