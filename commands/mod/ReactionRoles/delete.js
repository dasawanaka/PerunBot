const Command = require("../../../assets/class/Command");
const EmbedGenerator = require("../../../utils/EmbedGenerator");
const { MessageActionRow } = require("discord-buttons");
const { RED, BLUE } = require("../../../assets/other/colors.json");
const UserInput = require("../../../utils/UserInput");

class Delete extends Command {
  constructor() {
    super({
      name: "delete",
      alias: [],
    });
    this.howMany = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      "Type how many reaction roles u want to add. (max 20)"
    );
    this.customEmbed = EmbedGenerator.createSmallEmbed(
      ":pencil:",
      "Create custom embed? Type yes/no or use y/n. \n|||Bot can react only with emotes from this server, in other cases u must add first reactions."
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
    this.message = EmbedGenerator.createSmallEmbed(
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
    //ask about custom embed
    mtd.push(
      await message.channel.send(
        EmbedGenerator.createSmallEmbed(this.customEmbed)
      )
    );
    var makeEmbed = UserInput.getText(message, mtd);
    var embed;
    if (
      makeEmbed &&
      (makeEmbed.toLowerCase() === "y" || makeEmbed.toLowerCase() === "yes")
    ) {
      embed = EmbedGenerator.createUserEmbed(message, mtd);
    }
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
      reactionRoles.push({ role: roleMention, emoji: emoji });
    }
    message.channel.bulkDelete(mtd);
    console.log(reactionRoles)
  }
}
module.exports = Delete;
