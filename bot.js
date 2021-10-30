var configFileName = "config.json";
var devMode = false;

const { discord_conf } = require(`./config.json`);
const { Collection, Client, Intents } = require('discord.js');
const fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
var align = require('align-text');

client.logger = require("./DefaultLogger").init("config.json", devMode);

client.commands = new Collection();
client.guildSettings = new Collection();
client.tasks = new Collection(); //used to cron jobs
client.dirname = __dirname;

//Load and bind events
client.logger.info('EVENTS');
client.logger.info('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');

require("./utils/loader/loadEvents").load(client);

client.logger.info('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');

//Register scheduling cron tasks
client.logger.info('TASKS');
client.logger.info('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');

//Commands loader is use in ready event - need to have client ID


//handle unhandled rejection error
process.on("unhandledRejection", (error) => {
  console.log(error);
  client.logger.error(
    `Unhandled Rejection: \nMessage: ${error.message}  \nStack: ${error.stack}`
  );
});

client.login(discord_conf.token);
