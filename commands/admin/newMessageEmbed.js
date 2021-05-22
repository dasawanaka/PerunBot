const {MessageEmbed, MessageCollector} = require('discord.js')

module.exports = {
    name: "newmessageembed",
    alias: [],
    public: true,
    description: "Let's make some weird faces down there",
    usage: "<prefix>newMessageEmbed",
    async run(client, message, args) {
      
      message.channel.send('Type "done" when u enter the phrase/sentence');
      message.channel.send('Type Colour [blue, yellow, red, green] or in html');

      let filter = m => {
        if (m.author.id === message.author.id){
          if(m.content.toLowerCase() === 'done') collector.stop();
          else return true;
        }
        else return false;
      }
      
      let collector = message.channel.createMessageCollector(filter, {maxMatches: 1 });
      collector.on('collect', msg => console.log(msg.content))
      collector.on('end', collected => console.log(collected.size))
      
      if(message.content.toLowerCase() === "stop"){

      }
      
      var colour = await getContent(collector);
      console.log(colour)
      colour = colour[0]
       switch (colour) {  
      case 'blue':
        colour = `#0000cc`
        break;      
      case 'yellow':
        colour = `#ffff00`
        break;      
      case 'red':
        colour = `#cc0000`
        break;
      case 'green':
        colour = `#00ff00`
        break;
      case 'none':
      default:
        if(!colour.startsWith('#'))
          colour = `#ff0066`
      }
      message.channel.send('Set Title');
      collector = message.channel.createMessageCollector(filter, {maxMatches: 1 });
      var title = await getContent(collector)

      message.channel.send('Type description');
      collector = message.channel.createMessageCollector(filter, {maxMatches: 1 });
      var description = await getContent(collector)
      
      message.channel.send('Set Url');
      collector = message.channel.createMessageCollector(filter, {maxMatches: 1 });
      var customURL = await getContent(collector)
      customURL = customURL[0]

      message.channel.send('Author');
      collector = message.channel.createMessageCollector(filter, {maxMatches: 1 });
      var author = await getContent(collector)

      message.channel.send('Set Thumbnail (url)');
      collector = message.channel.createMessageCollector(filter, {maxMatches: 1 });
      var thumbnail = await getContent(collector)
      thumbnail = thumbnail[0]

      message.channel.send('Set Image (url)');
      collector = message.channel.createMessageCollector(filter, {maxMatches: 1 });
      var setImage = await getContent(collector)
      setImage = setImage[0]
     
      message.channel.send('Set footer');
      collector = message.channel.createMessageCollector(filter, {maxMatches: 1 });
      var footer = await getContent(collector)
      
      let embed = new MessageEmbed()
        .setTitle(title)
        .setColor(colour)
        .setDescription(description)
        .setURL(customURL)
        .setAuthor(author, 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        .setThumbnail(thumbnail)
        // .addFields(
            // { name: 'Regular field title', value: 'Some value here' },
            // { name: '\u200B', value: '\u200B' },
            // { name: 'Inline field title', value: 'Some value here', inline: true },
            // { name: 'Inline field title', value: 'Some value here', inline: true },
        // .addField('Inline field title', 'Some value here', true)
        .setImage(setImage)
        .setTimestamp()
        .setFooter(footer);


message.channel.send(embed);
}
}

function getContent(collector){
  // console.log (collector.next)
  return new Promise((resolve, reject) => {
    collector.on('end', collected => resolve(collected.map(m => m.content)))})
}


//const exampleEmbed = new Discord.MessageEmbed()
// .setColor(`${colour}`)
// .setTitle('Some title')
// .setURL('https://discord.js.org/')
// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
// .setDescription('Some description here')
// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
// .addFields(
//     { name: 'Regular field title', value: 'Some value here' },
//     { name: '\u200B', value: '\u200B' },
//     { name: 'Inline field title', value: 'Some value here', inline: true },
//     { name: 'Inline field title', value: 'Some value here', inline: true },
// )
// .addField('Inline field title', 'Some value here', true)
// .setImage('https://i.imgur.com/wSTFkRM.png')
// .setTimestamp()
// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
// channel.send(exampleEmbed);
// }