const EmbedGenerator = require("../../utils/EmbedGenerator");
const ButtonRoles = require("../../database/models/button_roles");
const TicketButton = require("../../database/models/ticket");
const { RED, GREEN } = require("../../assets/other/colors.json");
const toggleRoleCache = new Map();

module.exports = {
  name: "clickButton",
  description: "BUTONS!!! ZAEBYŚCIE",
  async run(button, client) {
    const { id, guild, channel, clicker, message } = button;
    client.logger.debug(`Click button with id: ${id}`);
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
          client.logger.debug(`${e.message} ${e.stack}`);
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
        if (toggleRoleCache.has(kk)) toggleRoleCache.delete(kk);
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
        if (toggleRoleCache.has(kk)) toggleRoleCache.delete(kk);
        else toggleRoleCache.set(kk, true);
      }
      button.defer(true);
    } else if (id.startsWith("tit_")) {
      const data = id.split("_");
      const roleId = data[1];
      const categoryName = data[2];
      const channelId = channel.id;
      const messageId = message.id;
      const guildId = guild.id;

      const existTicketButton = await TicketButton.findOne({
        guildID: guildId,
        channelID: channelId,
        messageID: messageId,
        ticketName: categoryName,
        roleID: roleId,
      });
      if (!existTicketButton) {
        client.logger.error(`Somebody click ticket button not existed in db`);
        button.defer(true);
        return;
      }
      let user = button.clicker.member;
      if (!user) await button.clicker.fetch();
      user = button.clicker.member;
      var preparedTicketName = `ticket-${categoryName.toLowerCase()}-${
        user.id
      }`;
      var ticketExist = false;
      var chanList = [];
      //max channels in category error
      if (channel.parent.children.size === 50) {
        channel
          .send(
            EmbedGenerator.createSmallEmbed(
              "❌",
              `Discord limit: max channels in category. Admins must archive old tickets.`,
              RED
            )
          )
          .then((msg) => {
            setTimeout(() => msg.delete(), 10000);
          });
        return button.defer(true);
      }
      //check ticket is exist
      channel.parent.children.map((c) => chanList.push(c));
      for (let c in chanList) {
        console.log(`${chanList[c].name} ? ${preparedTicketName}`);
        if (chanList[c].name === preparedTicketName) {
          ticketExist = true;
        }
      }
      //if ticket exit send message and end event
      if (ticketExist) {
        channel
          .send(
            EmbedGenerator.createSmallEmbed(
              "❌",
              `Only one open ticket per user per category.`,
              RED
            )
          )
          .then((msg) => {
            setTimeout(() => msg.delete(), 2000);
          });
        return button.defer(true);
      }
      const newChannel = await guild.channels.create(
        `ticket-${categoryName}-${user.id}`,
        {
          type: "text",
          parent: channel.parent,
          permissionOverwrites: [
            {
              id: message.guild.roles.everyone,
              deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
            },
            {
              id: user.id,
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
            },
            {
              id: roleId,
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
            },
          ],
        }
      );

      newChannel.send(
        EmbedGenerator.createSmallEmbed(
          ":pushpin:",
          `User: ${user.user.tag} requested a help with: \`\`${categoryName}\`\`. When ticket is done type \`\`$tickets archive\`\``,
          GREEN
        )
      );
      button.defer(true);
    } else await button.defer(true);
  },
};
