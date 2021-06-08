const EmbedGenerator = require("../../utils/EmbedGenerator");
const ButtonRoles = require("../../database/models/button_roles");
const { RED, GREEN } = require("../../assets/other/colors.json");
const toggleRoleCache = new Map();

module.exports = {
  name: "clickButton",
  description: "BUTONS!!! ZAEBYŚCIE",
  async run(button, client) {
    const { id, guild, channel, clicker, message } = button;
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

      let data = id.split("_");
      let roleId = data[1];
      let guildd = client.guilds.cache.get(guild.id);
      let role = guildd.roles.cache.get(roleId);
      if (!role) {
        return channel
          .send(EmbedGenerator.createSmallEmbed("❌", `Cannot find role`, RED))
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
      if (!btnRole) {
        return channel
          .send(
            EmbedGenerator.createSmallEmbed(
              "❌",
              `Cannot find role in database`,
              RED
            )
          )
          .then((msg) => {
            setTimeout(() => msg.delete(), 5000);
          });
      }
      let user = button.clicker.member;
      if (!user) await button.clicker.fetch();
      user = button.clicker.member;

      const kk = user.id + "_" + guild.id + "_" + roleId;

      if (
        (user.roles.cache.has(roleId) && !toggleRoleCache.has(kk)) ||
        (!user.roles.cache.has(roleId) && toggleRoleCache.has(kk))
      ) {
        await user.roles.remove(role).catch((e) => {
          client.logger.debug(`${e.message} ${e.stack}`)
          return channel
            .send(
              EmbedGenerator.createSmallEmbed(
                "❌",
                `Cannot remove role. My permissions?`,
                RED
              )
            )
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            });
        });
        if(toggleRoleCache.has(kk)) toggleRoleCache.delete(kk);
        else toggleRoleCache.set(kk, true);
      } else {
        let w = await user.roles.add(role).catch(() => {
          console.error;
          return channel
            .send(
              EmbedGenerator.createSmallEmbed(
                "❌",
                `Cannot add role. My permissions?`,
                RED
              )
            )
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            });
        });
        if(toggleRoleCache.has(kk)) toggleRoleCache.delete(kk);
        else toggleRoleCache.set(kk, true);
      }
      button.defer(true);
    } else await button.defer(true);
  },
};
