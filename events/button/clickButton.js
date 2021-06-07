const EmbedGenerator = require("../../utils/EmbedGenerator");
const ButtonRoles = require("../../database/models/button_roles");
const {RED, GREEN} = require("../../assets/other/colors.json");

module.exports = {
  name: "clickButton",
  description: "BUTONS!!! ZAEBYŚCIE",
  async run(button, client) {
    const { id, guild, channel, clicker, message } = button;
    console.log(id);
    if (id === "test") {
      channel.send(
        EmbedGenerator.createSmallEmbed(
          "👍",
          `${button.clicker.user.tag} clicked test button!`,
          GREEN
        )
      );
      button.defer(true);
    } else if (id.startsWith("br_")) {
      console.log("button "+ JSON.stringify(button));
      let data = id.split("_");
      let roleId = data[1];
      let guildd = client.guilds.cache.get(guild.id);
      let role = guildd.roles.cache.get(roleId);
      if (!role) {
        return channel
          .send(
            EmbedGenerator.createSmallEmbed("❌", `Cannot find role`, RED)
          )
          .then((msg) => {
            setTimeout(() => msg.delete(), 5000);
          });
      }
      let btnRole = ButtonRoles.findOne({
        guildID: guild.id,
        channelID: channel.id,
        messageID: message.id,
        roleID: roleId,
      });
      if(!btnRole) {
        return channel
        .send(
          EmbedGenerator.createSmallEmbed("❌", `Cannot find role in database`, RED)
        )
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      }
      let user = await guildd.members.cache.get(clicker.member.id);
      if(button.clicker.member.roles.cache.has(roleId)) {
        user.roles.remove(role).catch(console.error);
      } else {
        user.roles.add(role).catch(console.error);
      }
      button.defer(true);
    } else await button.defer(true);
  },
};
