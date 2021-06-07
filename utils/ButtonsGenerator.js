const EmbedGenerator = require("./EmbedGenerator");
const { MessageButton, MessageActionRow } = require("discord-buttons");
const buttonStyles = ["blurple", "gray", "green", "red"];
const { RED } = require("../assets/other/colors.json");

class ButtonGenerator {
  static async createReactionButton(message, mtd) {
    var buttons = [];
    var buttonRoles = [];
    var lines = [];
    let exit = "n";

    var count;
    while ((!count || count < 0 || count > 20)  && exit === "n") {
      mtd.push(
        await message.channel.send(
          EmbedGenerator.createSmallEmbed(
            ":pencil:",
            "How many buttons u want to create(max: 20, 5 in row), type `exit` to end"
          )
        )
      );

      let collector = this.createCustomCollector(message, mtd);
      count = await this.getContent(collector);
      exit = count[0] === "exit"?"exit":"n";
      count = parseInt(count[0]);
    }
    this.checkEnd(exit, message);

    for (var i = 0; i < count; i++) {
      
      //get style for button
      let style;
      while ((!style || !buttonStyles.includes(style)) && exit === "n") {
        mtd.push(
          await message.channel.send(
            EmbedGenerator.createSmallEmbed(
              ":pencil:",
              `[BTN_${i + 1}] Type button style(one of: ${buttonStyles.join(
                ", "
              )})`
            )
          )
        );
        let collector = this.createCustomCollector(message, mtd);
        style = await this.getContent(collector);
        style = style[0].toLowerCase();
        exit = style === "exit"?"exit":"n" ;
      }
      this.checkEnd(exit, message);

      //get text for button
      let text;
      while ((!text || text.length > 80) && exit === "n") {
        mtd.push(
          await message.channel.send(
            EmbedGenerator.createSmallEmbed(
              ":pencil:",
              `[BTN_${i + 1}] Type button label(**max 80** characters)`
            )
          )
        );
        let collector = this.createCustomCollector(message, mtd);
        text = await this.getContent(collector);
        text = text[0];
        exit = text === "exit"?"exit":"n";
      }
      this.checkEnd(exit, message);

      let role;
      while (!role) {
        mtd.push(
          await message.channel.send(
            EmbedGenerator.createSmallEmbed(
              ":pencil:",
              `[BTN_${
                i + 1
              }] Mention the role that is to be given when clicking the button.`
            )
          )
        );
        let collector = this.createCustomCollector(message, mtd);
        role = await this.getRoleMentions(collector);
        role = role[0];
      }
       //this.checkEnd(exit, message);

      let btn = new MessageButton()
        .setStyle(style)
        .setLabel(text)
        .setID(`br_${role.id}`);

      if (buttons.length === 5) {
        let line = new MessageActionRow().addComponents(buttons);
        lines.push(line);
        buttons = [];
      }
      buttons.push(btn);
      buttonRoles.push(role.id);
    }

    let line = new MessageActionRow().addComponents(buttons);
    lines.push(line);

    return { lines: lines, roles: buttonRoles };
  }

  static checkEnd(exit, message) {
    if (exit === "exit") {
      message.channel.send(
        EmbedGenerator.createSmallEmbed(
          "❌",
          "Process terminated by user...",
          RED
        )
      );
      throw new Error("Process terminated by user...");
    }
  }

  static getContent(collector) {
    return new Promise((resolve, reject) => {
      collector.on("end", (collected) =>
        resolve(collected.map((m) => m.content))
      );
    });
  }

  static getRoleMentions(collector) {
    return new Promise((resolve, reject) => {
      collector.on("end", (collected) =>
        resolve(
          collected.map(
            (m) =>
              m.mentions.roles.first() || m.guild.roles.cache.get(m.content)
          )
        )
      );
    });
  }

  static createCustomCollector(message, messagesToDelete) {
    let filter = (m) => {
      if (m.author.id === message.author.id) {
        if (m.content.toLowerCase() === "done") {
          messagesToDelete.push(m);
          collector.stop();
        } else return true;
      } else return false;
    };
    let collector = message.channel.createMessageCollector(filter, {
      maxMatches: 1,
      time: 30000,
    });
    collector.on("collect", (msg) => {
      messagesToDelete.push(msg);
      collector.stop();
    });
    return collector;
  }
}
module.exports = ButtonGenerator;
