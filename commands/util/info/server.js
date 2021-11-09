const Command = require("../../../assets/class/Command");
const { MessageEmbed } = require("discord.js");

class Server extends Command {
    constructor() {
        super({
            name: "server"
        })
    }

    async run(interaction) {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    }

}


module.exports = Server;

