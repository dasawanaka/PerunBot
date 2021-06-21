const Command = require("../../../assets/class/Command");
const fetchAll = require("discord-fetch-all");
var pdf = require("pdf-creator-node");
var fs = require("fs");
const path = require("path");
const { MessageAttachment } = require("discord.js");
const TicketButton = require("../../../database/models/ticket");

class Archive extends Command {
  constructor() {
    super({
      name: "archive",
      alias: [],
    });
  }
  async run(client, message, args) {
    const channelName = message.channel.name;
    if (!channelName.startsWith("ticket")) return;
    const channelArgs = channelName.split("-");
    const ticketName = channelArgs.slice(1, channelArgs.length-1).join("-");
    const ticketCreatorId = channelArgs[channelArgs.length - 1];

    //get info from database about archive Channels
    const existTicketButton = await TicketButton.findOne({
      guildID: message.guild.id,
      ticketName: ticketName
    });

    const allMessages = await fetchAll.messages(message.channel, {
      reverseArray: true, // Reverse the returned array
      userOnly: true, // Only return messages by users
      botOnly: false, // Only return messages by bots
      pinnedOnly: false, // Only returned pinned messages
    });

    console.log(allMessages.length);
    const messagesToTemplate = [];
    for (let index = 0; index < allMessages.length; index++) {
      const m = allMessages[index];
      var av = m.author.avatarURL({ format: "png", size: 512 });
      if (!av) {
        av = m.author.defaultAvatarURL;
      }
      var messageToPush = {
        author: m.author.tag,
        content: m.content,
        avatar: av,
        date: m.createdAt,
        side: m.author.id === ticketCreatorId ? "right" : "left",
      };
      messagesToTemplate.push(messageToPush);
    }

    //console.log(messagesToTemplate);

    var html = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "5mm",
    };
    const tmpFilePath = path.join(
      __dirname,
      "tmp",
      `${message.channel.name}_${message.id}.pdf`
    );
    var document = {
      html: html,
      data: {
        messages: messagesToTemplate,
        channelName: channelName,
      },
      path: tmpFilePath,
      type: "",
    };
    await pdf
      .create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
    const attachment = new MessageAttachment(
      tmpFilePath,
      path.basename(tmpFilePath)
    );

    if (existTicketButton && existTicketButton.archiveChannelID) {
      var ch = message.guild.channels.cache.get(
        existTicketButton.archiveChannelID
      );
      await ch.send(attachment);
      message.channel.delete();
    } else {
      await message.channel.send(attachment);
      message.channel.setName(channelName.replace("ticket", "🔒closed"));
    }

    fs.unlink(tmpFilePath, (error) => {
      if (error) client.logger.error(error);
    });
  }
}

module.exports = Archive;
