const Rep = require("../../class/reputation.js");
const Discord = require('discord.js');

module.exports = {
  name: "rep",
  alias: [],
  public: true,
  description: "Give user a reputation point",
  usage: "<prefix>rep <@user>",
  permissions: [],
  cooldown: 6 * 60 * 60 * 1000,
  async run(client, message, args) {

    const user = message.mentions.members.first();
    if(!user) return message.reply('An user was not provided.');
    if(user.id === message.author.id) return message.reply('You cannot give reputation points to yourself.');
    
    const rep = await Rep.appendRep(user.id, message.guild.id, 1);

    let embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle("Added Reputation")
    .addField('User', `${user}`, true)
    .addField('Current points', `${rep.rep}`, true)
    .addField("Added by", `${message.author.tag}`);

    message.channel.send(embed)
  }
};