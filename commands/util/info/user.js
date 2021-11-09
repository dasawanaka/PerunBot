const Command = require("../../../assets/class/Command");
const { MessageEmbed } = require("discord.js");

class User extends Command {
    constructor() {
        super({
            name: "user"
        })
    }

    async run(interaction) {
        const user = interaction.options.getUser('target');

        if (user) {
            await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
        } else {
            await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
        }
    }

}


module.exports = User;

