//get config file name from param
var configFileName = "config.json";
var devMode = false;

const { discord_conf } = require(`./${configFileName}`);
const { Collection, Client, Intents } = require('discord.js');
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.logger = require("./DefaultLogger").init(configFileName, devMode);

client.logger.info(`Use config file: ${configFileName}`);

client.commands = new Collection();
client.guildSettings = new Collection();
client.tasks = new Collection(); //used to cron jobs

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


//handle unhandled rejection error
process.on("unhandledRejection", (error) => {
  console.log(error);
  client.logger.error(
    "Unhandled promise rejection: " + error.message + "\n" + error.stack
  );
});

client.login(discord_conf.token);
