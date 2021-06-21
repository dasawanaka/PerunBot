const Command = require("../../../assets/class/Command");
const EmbedGenerator = require("../../../utils/EmbedGenerator");
const UserInput = require("../../../utils/UserInput");
const { RED, BLUE, GREEN } = require("../../../assets/other/colors.json");
const { MessageButton, MessageActionRow } = require("discord-buttons");
const buttonStyles = ["blurple", "gray", "green", "red"];
const { MessageEmbed } = require("discord.js");
const TicketButton = require("../../../database/models/ticket");

class Init extends Command {
  constructor() {
    super({
      name: "init",
      alias: [],
      userPermissions: ["ADMINISTRATOR"],
    });
    this.createVoiceChannelsEmbed = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      `How many voice channels u want to add? (min:1, max:20)`,
      BLUE
    );
    this.categoryNameEmbed = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      `Please type vc name (max characters:60, type exit to terminate this)`,
      BLUE
    );
    this.invalidValueEmbed = EmbedGenerator.createSmallEmbed(
      ":no_entry:",
      `Invalid or empty value. Try again? (y/n)`,
      RED
    );
    this.terminatedEmbed = EmbedGenerator.createSmallEmbed(
      "💣",
      "Process terminated.",
      RED
    );
    this.rememberInfo = EmbedGenerator.createSmallEmbed(
      ":wrench: ",
      `You must remember about discord limits, max 50 channels per category.`,
      RED
    );
  }
  async run(client, message, args) {
    var tryAgain = false;
    var mtd = [];
    var count = 0;
    const ticketToRoleMap = new Map();
    mtd.push(message);

    mtd.push(await message.channel.send(this.rememberInfo));

    //getting information from the user how many categories he / she wants
    do {
      tryAgain = false;
      mtd.push(await message.channel.send(this.createVoiceChannelsEmbed));
      let input = await UserInput.getNumber(message, mtd);
      if (!input || input === Number.NaN || input <= 0 || input > 20) {
        mtd.push(await message.channel.send(this.invalidValueEmbed));
        let tryInput = await UserInput.getText(message, mtd);
        tryAgain =
          tryInput &&
          (tryInput.toLowerCase() === "yes" || tryInput.toLowerCase() === "y")
            ? true
            : false;
        if (!tryAgain) {
          mtd.push(await message.channel.send(this.terminatedEmbed));
          await this.delay(2000);
          message.channel.bulkDelete(mtd);
          return;
        }
      }
      count = input;
    } while (tryAgain);

    for (var i = 0; i < count; i++) {
      var categoryName = "none";
      var roleMention;
      var buttonStyle;
      var channelMention;
      //getting information about category name
      do {
        tryAgain = false;
        mtd.push(await message.channel.send(this.categoryNameEmbed));
        let input = await UserInput.getText(message, mtd);
        if (input && input === "exit") {
          mtd.push(await message.channel.send(this.terminatedEmbed));
          await this.delay(2000);
          message.channel.bulkDelete(mtd);
          return;
        }
        if (!input || input.length > 40) {
          mtd.push(await message.channel.send(this.invalidValueEmbed));
          let tryInput = await UserInput.getText(message, mtd);
          tryAgain =
            tryInput &&
            (tryInput.toLowerCase() === "yes" || tryInput.toLowerCase() === "y")
              ? true
              : false;
          if (!tryAgain) {
            mtd.push(await message.channel.send(this.terminatedEmbed));
            await this.delay(2000);
            message.channel.bulkDelete(mtd);
            return;
          }
        }
        categoryName = input;
      } while (tryAgain);

      //getting information about role to manage this type of ticket
      do {
        tryAgain = false;
        mtd.push(await message.channel.send(this.roleMentionEmbed));
        let input = await UserInput.getUserRoleMention(message, mtd);
        if (!input) {
          mtd.push(await message.channel.send(this.invalidValueEmbed));
          let tryInput = await UserInput.getText(message, mtd);
          tryAgain =
            tryInput &&
            (tryInput.toLowerCase() === "yes" || tryInput.toLowerCase() === "y")
              ? true
              : false;
          if (!tryAgain) {
            mtd.push(await message.channel.send(this.terminatedEmbed));
            await this.delay(2000);
            message.channel.bulkDelete(mtd);
            return;
          }
        }
        roleMention = input;
      } while (tryAgain);

      //get channel mention
      do {
        tryAgain = false;
        mtd.push(await message.channel.send(this.channelMentionEmbed));
        let input = await UserInput.getUserChannelMention(message, mtd);
        if (!input) {
          mtd.push(await message.channel.send(this.invalidValueEmbed));
          let tryInput = await UserInput.getText(message, mtd);
          tryAgain =
            tryInput &&
            (tryInput.toLowerCase() === "yes" || tryInput.toLowerCase() === "y")
              ? true
              : false;
          if (!tryAgain) {
            mtd.push(await message.channel.send(this.terminatedEmbed));
            await this.delay(2000);
            message.channel.bulkDelete(mtd);
            return;
          }
        }
        channelMention = input;
      } while (tryAgain);
      //getting information about button style
      do {
        tryAgain = false;
        mtd.push(await message.channel.send(this.buttonStyleEmbed));
        let input = await UserInput.getText(message, mtd);
        if (!input || !buttonStyles.includes(input.toLowerCase())) {
          mtd.push(await message.channel.send(this.invalidValueEmbed));
          let tryInput = await UserInput.getText(message, mtd);
          tryAgain =
            tryInput &&
            (tryInput.toLowerCase() === "yes" || tryInput.toLowerCase() === "y")
              ? true
              : false;
          if (!tryAgain) {
            mtd.push(await message.channel.send(this.terminatedEmbed));
            await this.delay(2000);
            message.channel.bulkDelete(mtd);
            return;
          }
        }
        buttonStyle = input.toLowerCase();
      } while (tryAgain);
      //creating a new button and add to list
      const ticketCategoryPreparedName = categoryName.split(' ').join('-').toLowerCase();
      let btn = new MessageButton()
        .setStyle(buttonStyle)
        .setLabel(categoryName)
        .setID(`tit_${roleMention.id}_${ticketCategoryPreparedName}`);

      ticketToRoleMap.set(ticketCategoryPreparedName, `${roleMention.id}_${channelMention.id}`);

      if (buttons.length === 5) {
        let line = new MessageActionRow().addComponents(buttons);
        lines.push(line);
        buttons = [];
      }
      buttons.push(btn);
    }
    let line = new MessageActionRow().addComponents(buttons);
    lines.push(line);
    var embedText;
    do {
      tryAgain = false;
      mtd.push(await message.channel.send(this.embedTextEmbed));
      let input = await UserInput.getText(message, mtd);
      if (input && input === "exit") {
        mtd.push(await message.channel.send(this.terminatedEmbed));
        await this.delay(2000);
        message.channel.bulkDelete(mtd);
        return;
      }
      if (!input || input.length > 600) {
        mtd.push(await message.channel.send(this.invalidValueEmbed));
        let tryInput = await UserInput.getText(message, mtd);
        tryAgain =
          tryInput &&
          (tryInput.toLowerCase() === "yes" || tryInput.toLowerCase() === "y")
            ? true
            : false;
        if (!tryAgain) {
          mtd.push(await message.channel.send(this.terminatedEmbed));
          await this.delay(3000);
          message.channel.bulkDelete(mtd);
          return;
        }
      }
      embedText = input;
    } while (tryAgain);

    message.channel.bulkDelete(mtd);

    const embed = new MessageEmbed().setColor(GREEN).setDescription(embedText);
    const res = { embed: embed, components: lines };
    let msg = await message.channel.send("_ _", res);
    ticketToRoleMap.forEach((val, key) => {
      const splitted = val.split("_");
      let bTicket = new TicketButton({
        guildID: msg.guild.id,
        channelID: msg.channel.id,
        messageID: msg.id,
        ticketName: key,
        roleID: splitted[0],
        archiveChannelID: splitted[1],
      });
      bTicket.save().catch((e) => {
        client.logger.error(`Failed to save data: ${e.message} ${e.stack}`);
        msg.channel.send(
          EmbedGenerator.createSmallEmbed(
            "❌",
            "Cannot save data into db... Try again later...",
            RED
          )
        );
        return false;
      });
    });
  }

  delay = (millis) =>
    new Promise((resolve, reject) => {
      setTimeout((_) => resolve(), millis);
    });
}

module.exports = Init;
