const Discord = require("discord.js");
const dateFormat = require("dateformat");
var webHookConf;
const DefaultLogger = require("js-logger");
const cron = require("node-cron");

module.exports.init = (configFileName, devMode) => {
  const { webHook } = require(`./${configFileName}`);
  DefaultLogger.useDefaults();
  DefaultLogger.devMode = devMode ? devMode : false;
  if (webHook && webHook.id && webHook.token) {
    webHookConf = webHook;
    let webHookClient = new Discord.WebhookClient(webHook.id, webHook.token);
    DefaultLogger.webHook = webHookClient;
  }
  DefaultLogger.logsStack = [];
  DefaultLogger.setHandler(function (messages, context) {
    // Send messages to a custom logging endpoint for analysis.
    // TODO: Add some security? (nah, you worry too much! :P)
    if (DefaultLogger.devMode === false && context.level.value < 3) return;

    let msg = "";
    let i = 0;
    do {
      msg += `${messages[i++]} `;
    } while (messages[i]);
    console.log(`[${context.level.name}] ${msg}`);
    if (DefaultLogger.webHook) {
      let text = `*${dateFormat(Date.now(), "m/d/yyyy, h:MM TT")}*  **[${
        context.level.name
      }]** ${msg}`;
      DefaultLogger.logsStack.push(text);
    }
  });

  DefaultLogger.sendToDcTask = () => {
    cron.schedule("*/5 * * * * *", () => {
      if(DefaultLogger.logsStack.length > 0)
        DefaultLogger.debug(`Cron schedule: check logs to send. Count: ${DefaultLogger.logsStack.length}`)
      let msg = "";
      let line;
      do {
        line = DefaultLogger.logsStack.shift();
        if (line) {
          if (msg.length + line.length + 2 > 2000) {
            DefaultLogger.webHook.send(msg);
            msg = "";
          }
          msg += line + "\n";
        }
      } while (line);
      if(msg && msg.length > 0){
        DefaultLogger.webHook.send(msg);
      }
    });
  };

  DefaultLogger.sendToDcTask();
  return DefaultLogger;
};

module.exports.get = () => {
  return DefaultLogger;
};
