const Command = require("../../../assets/class/Command");
const EmbedGenerator = require("../../../utils/EmbedGenerator");
const ButtonsGenerator = require("../../../utils/ButtonsGenerator");

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
      console.log(msg.content);
      mte.push(msg);
      collector.stop();
    });
    collector.on("end", (collected) => {
      console.log(collected.size);
    });

    let embed;
    let action = await EmbedGenerator.getContent(collector);
    console.log(action);
    if (action[0].toLowerCase() === "yes" || action[0].toLowerCase() === "y")
      embed = await EmbedGenerator.createUserEmbed(message, mte);

    let buttons = await ButtonsGenerator.createReactionButton(message, mte);

    let res;

    if (embed) res = { embed: embed, buttons: buttons };
    else res = { buttons: buttons };

    mte.forEach((msg) => {
      msg.delete();
    });

    message.channel.send('_ _', res);
  }
}
module.exports = AddRolesButton;
