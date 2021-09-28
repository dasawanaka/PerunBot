const Command = require("../../../assets/class/Command");
const EmbedGenerator = require("../../../utils/EmbedGenerator");
const { MessageActionRow } = require("discord-buttons");
const { RED, BLUE } = require("../../../assets/other/colors.json");
const UserInput = require("../../../utils/UserInput");
const URL = require("url").URL;
const ReactionRoles = require("../../../database/models/reaction_roles");

class Add extends Command {
  constructor() {
    super({
      name: "add",
      alias: [],
    });
    this.howMany = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      "Type how many reaction roles u want to add. (max 20)"
    );
    this.info = EmbedGenerator.createSmallEmbed(
      ":wrench: ",
      "Bot can react only with emotes from this server, in other cases u must add first reactions. BOT LIMIT: 100 reaction roles per server.",
      RED
    );
    this.invalidValueEmbed = EmbedGenerator.createSmallEmbed(
      ":no_entry:",
      `Invalid or empty value. Try again? (y/n)`,
      RED
    );
    this.roleMentionEmbed = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      `Mention the role that will be assigned after using the emoji (use @roleName)`,
      BLUE
    );
    this.getEmojiEmbed = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      `Enter an emoji. Emojis doesn't have validator. Please be careful.`,
      BLUE
    );
    this.getLinkToMessageEmbed = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      `Paste message url (RMB -> Copy Message Link)`,
      BLUE
    );
    this.terminatedEmbed = EmbedGenerator.createSmallEmbed(
      "💣",
      "Process terminated.",
      RED
    );
  }

  async run(client, message, args) {
    let mtd = [];
    mtd.push(message);
    var tryAgain;
    const reactionRoles = [];
    mtd.push(await message.channel.send(this.info));
    // count of reaction roles
    var count;
    do {
      tryAgain = false;
      mtd.push(await message.channel.send(this.howMany));
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

    var guildID = message.guild.id;
    //get all reaction roles
    for (let i = 0; i < count; i++) {
      var roleMention;
      // get role
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

      //get emoji from messages
      var emoji;
      do {
        tryAgain = false;
        mtd.push(await message.channel.send(this.getEmojiEmbed));
        let input = await UserInput.getText(message, mtd);
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
        emoji = input;
        if (emoji.lastIndexOf(":") != -1) {
          emoji = emoji.substring(emoji.lastIndexOf(":") + 1, emoji.length - 1);
        }
      } while (tryAgain);
      reactionRoles.push({ role: roleMention.id, emoji: emoji });
    }
    //get link to message
    var msgChannel;
    var msgID;
    do {
      tryAgain = false;
      mtd.push(await message.channel.send(this.getLinkToMessageEmbed));
      let input = await UserInput.getText(message, mtd);
      if (!input || input.length > 85 || !this.isAValidUrl(input)) {
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
      //https://discord.com/channels/406251997180985357/776141883675377664/868428862684549150
      //https://discord.com/channels/{serverID}/{channelID}/{messageID}

      var linkString = input.split("/");

      msgID = linkString[linkString.length - 1];
      msgChannel = linkString[linkString.length - 2];
      console.log("msgID: " + msgID);
      console.log("msgChannel: " + msgChannel);
    } while (tryAgain);

    //send to db and to ReactionRolesManager
    for (const rr in reactionRoles) {
      var rrDb = new ReactionRoles({
        guildID: guildID,
        channelID: msgChannel,
        messageID: msgID,
        emoji: rr.emoji,
        roleID: rr.role,
      });
      var err = false;
      try {
        rrDb.save();
        client.ReactionRoleSystem.addReactionRole(rr);
      } catch (error) {
        err = true;
        message.channel.send(
          EmbedGenerator.createSmallEmbed(
            ":no_entry:",
            "Cannot save data in DB... Try again later.",
            RED
          )
        );
        client.logger.error("Error saving data: " + error);
      }
      if(err) {
        message.channel.bulkDelete(mtd);
        return;
      }
    }

    message.channel.bulkDelete(mtd);
    console.log(reactionRoles);
  }
  isAValidUrl(s) {
    try {
      new URL(s);
      return true;
    } catch (err) {
      return false;
    }
  }
}
module.exports = Add;
