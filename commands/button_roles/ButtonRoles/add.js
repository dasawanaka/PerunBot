const {MessageEmbed} = require('discord.js');
const Command = require("../../../assets/class/Command");

class AddRolesButton extends Command {
    constructor() {
        super({
            name: "add",
    alias: []
        })
    }
    async run(client, message, args) {
        // if (!message.member.hasPermission("ADMINISTRATOR"))
        //   return message.channel.send("You must have an ADMINISTRATOR permission!");
        var messageReaction
         if (messageReaction.member === any)

          await message.react()

//     const moderatorRole = message.guild.roles.cache.find(role => role.name === "Rządny władzy gówniak")
    
//     const moderatorEmoji = '👍'

//     let embed = new MessageEmbed()
//     .setTitle('ReactionRole')
//     .setDescription('Click Reaction to get a Role');
    
//     let messageEmbed = await message.channel.send(embed);
//     messageEmbed.react('👍');
}

}
module.exports = AddRolesButton;