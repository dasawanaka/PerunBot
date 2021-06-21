const Command = require("../../../assets/class/Command");
const EmbedGenerator = require("../../../utils/EmbedGenerator");
const ButtonsGenerator = require("../../../utils/ButtonsGenerator");
const ButtonRoles = require("../../../database/models/button_roles");
const { MessageActionRow } = require("discord-buttons");
const {RED} = require("../../../assets/other/colors.json")

class AddRolesButton extends Command {
  constructor() {
    super({
      name: "add",
      alias: [],
    });
  }
  async run(client, message, args) {
    let mte = [];
    mte.push(message);

    let filter = (m) => {
      if (m.author.id === message.author.id) {
        if (m.content.toLowerCase() === "done") {
          collector.stop();
          mte.push(m);
        } else return true;
      } else return false;
    };

    mte.push(
      await message.channel.send(
        EmbedGenerator.createSmallEmbed(
          ":pencil:",
          "Create custom embed? Type yes/no or use y/n"
        )
      )
    );
    let collector = await message.channel.createMessageCollector(filter, {
      maxMatches: 1,
    });
    collector.on("collect", (msg) => {
      mte.push(msg);
      collector.stop();
    });

    let embed;
    let action = await EmbedGenerator.getContent(collector);
    if (action[0].toLowerCase() === "yes" || action[0].toLowerCase() === "y")
      embed = await EmbedGenerator.createUserEmbed(message, mte);

    let buttons_res = await ButtonsGenerator.createReactionButton(message, mte);

    let res;

    if (embed) res = { embed: embed, components: buttons_res.lines };
    else res = { components: buttons_res.lines };

    //i wish is not more than 100 messages xDD
    message.channel.bulkDelete(mte);

    let msg = await message.channel.send("_ _", res);
    buttons_res.roles.forEach((roleId) => {
      let bRole = new ButtonRoles({
        guildID: msg.guild.id,
        channelID: msg.channel.id,
        messageID: msg.id,
        roleID: roleId,
      });
      bRole.save().catch((e) => {

        client.logger.error(`Failed to save data: ${e.message} ${e.stack}`);
        msg.channel.send(
          EmbedGenerator.createSmallEmbed(
            "❌",
            "Cannot save data into db... Try again later..."
            , RED
          )
        );
        return false;
      });
    });
  }
}
module.exports = AddRolesButton;
