const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require('@discordjs/builders');

class IQ extends Command {
    constructor() {
        super({
            name: "iq"
        })
    }
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription("Give you random iq number. It really works!")

    async run(interaction) {

        let iq = between(-50, 200);
        let msg = `Your iq is: ${iq}. `;

        if (iq < -25) {
            msg += `🥴`;
        }
        else if (iq < 0) {
            msg += `🤫`;
        }
        else if (iq < 25) {
            msg += `😥`
        }
        else if (iq < 50) {
            msg += `😒`
        }
        else if (iq < 100) {
            msg += `🤔`
        }
        else if (iq < 150) {
            msg += `😁`
        }
        else if (iq < 200) {
            msg += `🤓`
        }
        else if (iq === 200) {
            msg += `🥇`
        }

       await interaction.reply(msg);
    }

}


module.exports = IQ;

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}