const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require('@discordjs/builders');

class IQ extends Command {
    constructor() {
        super({
            name: "iq",
            alias: [],
            public: true,
            description: "Give you random iq number. It really works!"
        })
    }
    data = new SlashCommandBuilder()
        .setName("iq")
        .setDescription("Give you random iq number. It really works!")

    async run(client, message, args) {
        let iq = between(-50, 200);
        let msg = ` your iq is: ${iq}. `;

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
        message.reply(msg);
    }

}


module.exports = IQ;

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}