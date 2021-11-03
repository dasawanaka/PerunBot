const { MessageEmbed } = require("discord.js");
const malScraper = require("mal-scraper");
const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

class Anime extends Command {
  constructor() {
    super({
      name: "anime",
    });
  }
  data = new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Search for anime ex. anime One Piece")
    .addStringOption((option) =>
      option.setName("anime").setDescription("Anime name").setRequired(true)
    );

  async run(interaction) {
    try {
      const search = interaction.options.getString("anime");
      malScraper
        .getInfoFromName(search)
        .then((data) => {
          const embed = new MessageEmbed()
            .setAuthor(
              `🔍 My Anime List search result for ${search}`,
              interaction.guild.iconURL({ dynamic: true, format: "png" })
            )
            .setImage(data.picture)
            .setColor("RANDOM")
            .addField(":flag_gb: English Title", data.englishTitle)
            .addField(":flag_jp: Japanese Title", data.japaneseTitle)
            .addField(":book: Type", data.type)
            .addField(":1234: Episodes", data.episodes)
            .addField(":star2: Rating", data.rating)
            .addField(":calendar_spiral: Aired", data.aired)
            .addField(":star: Score", data.score)
            .addField(":bar_chart: Score Stats", data.scoreStats)
            .addField(":trophy: Popularity", data.popularity)
            .addField(":link: Link", data.url)
            .setFooter("Requested by " + `${interaction.member.displayName}`)
            .setTimestamp();
           interaction.reply({ embeds: [embed] });
        })
        .catch(
          (err) =>
             interaction.reply({
              embeds: [
                {
                  embed: {
                    color: 16734039,
                    description: "❌ | Please enter a vaild name!",
                  },
                },
              ],
            })
        );
    } catch (err) {
       interaction.reply({
        embeds: [
          {
            embed: {
              color: 16734039,
              description: "❌ | Please enter a vaild name!",
            },
          },
        ],
      });
    }
  }
}

module.exports = Anime;
