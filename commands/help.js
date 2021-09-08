const { Discord, MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const prefix = config.prefix;

module.exports.run = async (client, message) => {
  if (message.author.bot) return;
    const helpEmbed = new MessageEmbed()
      .setTitle('Command List')
      .setDescription(`\`${prefix}help\` - shows this embed
\`${prefix}ping\` - returns the bot's ping and latency
\`${prefix}search [limit] <search term>\` - search for something using Google

[optional]
<required>`)
      .setTimestamp();
    return message.channel.send(helpEmbed);
}

module.exports.help = {
  name: "help"
}