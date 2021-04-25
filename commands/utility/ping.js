module.exports = {
    name: 'ping', 
    alias: ['pp', 'pingpong'],
    public: false,
    description: 'Ping command, return api ping',
    async run(client, message, args) {
        var ping = client.ws.ping;
        var Discord = require('discord.js');
        var embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Api Ping', value: `${ping} ms`, inline: true },
                { name: 'Server name', value: `${message.guild.name}`, inline: true }
            )
            .setTimestamp()
            .setFooter(client.user.username, client.user.avatarURL());
    
        message.channel.send(embed);
    },
    async help(client, message, args) {


    }
}