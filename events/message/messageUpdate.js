const { MessageEmbed } = require("discord.js");
const LOGGER = require("../../utils/ModLogger");

module.exports = {
  name: "messageUpdate",
  description: "Edited.",
  async run(newMessage, oldMessage, client) {
    const { content, channel, author, guild, mentions } = newMessage;
    if (

      !author ||
      author.bot ||
          channel.type === "dm"
    ) {
      return;
    }
if (oldMessage.partial) {
     try {
       await oldMessage.fetch();
     } catch (error) {
       client.logger.error(`Something went wrong when fetching the message: ${error.message} ${error.stack}`);
       // Return as `reaction.message.author` may be undefined/null
       return;
     }
   }
   if (newMessage.partial) {
    try {
      await newMessage.fetch();
    } catch (error) {
      client.logger.error(`Something went wrong when fetching the message:  ${error.message} ${error.stack}`);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
    let embed = new MessageEmbed()
    .setColor('#fca00a')
    //.setAuthor(newMessage.author.tag, newMessage.author.avatar)
    .setThumbnail(newMessage.author.displayAvatarURL())
    .setTitle('Message edited')
    .setDescription(`<#${channel.id}> [Go to message](${newMessage.url})`)
    .addFields(
      //{ name: `Channel`, Value: `<#${newMessage.channel.id}> [Go to message](${newMessage.url})` },
      { name: `User`, value: `${newMessage.author.tag}`, inline: true },
      { name: `UserID`, value: `${newMessage.author.id}`, inline: true },
      //{ name: '\u200B', value: '\u200B' },
      { name: 'Before', value: `${oldMessage.content}` },
      { name: 'After', value: `${newMessage.content}` }
    )
    .setTimestamp()
    .setFooter(`${client.user.username} - modlog`, client.user.avatarURL());

    LOGGER.log(guild, embed);
  },
};
