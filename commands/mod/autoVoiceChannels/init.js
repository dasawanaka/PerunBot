const Command = require("../../../assets/class/Command");
const EmbedGenerator = require("../../../utils/EmbedGenerator");
const UserInput = require("../../../utils/UserInput");
const { RED, BLUE, GREEN } = require("../../../assets/other/colors.json");
const { MessageEmbed } = require("discord.js");
const AutoVC = require("../../../database/models/autoVc");

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
    this.maxUsersEmbed = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      `How many users can join to vc? (min:2, max:99)`,
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
      var vcName = "none";
      var maxUsers;
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
        vcName = input;
      } while (tryAgain);

      do {
        tryAgain = false;
        mtd.push(await message.channel.send(this.maxUsersEmbed));
        let input = await UserInput.getNumber(message, mtd);
        if (!input || input === Number.NaN || input < 2 || input > 99) {
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
        maxUsers = input;
      } while (tryAgain);

      const channel = await message.guild.channels.create(vcName, {
        type: 'voice',
        parent: message.channel.parent
      });
      const clearParentID = `${channel.parent}`.replace("<#", "").replace(">", "");
      const vc = new AutoVC({
        guildID: message.guild.id,
        channelID: channel.id,
        parentID: clearParentID,
        maxUsers: maxUsers
      }) 

      vc.save().then(() => {client.autoVoiceChannels.add(vc)}).catch(err =>{client.logger.error(err)});
    }

    message.channel.bulkDelete(mtd);
  }

  delay = (millis) =>
    new Promise((resolve, reject) => {
      setTimeout((_) => resolve(), millis);
    });
}

module.exports = Init;
