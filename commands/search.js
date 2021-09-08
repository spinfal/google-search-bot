const { Discord, MessageEmbed } = require('discord.js');
const  googleIt = require('google-it')

module.exports.run = async (client, message, args) => {
  const searchLimit = (isNaN(args[0])) ? 10 : parseInt(args.shift());
  if (searchLimit > 30) {
    const errorEmbed = new MessageEmbed()
      .setDescription(`The highest limit you can set is 30.`);
    return message.channel.send(errorEmbed)
  }
  
  let searchTerm = args.join(' ');
  searchTerm = searchTerm.substring(0, 2048); //google's searchbox limit is 2048
  const waitEmbed = new MessageEmbed()
    .setDescription(`Searching for ${searchTerm}...`);
  message.channel.send(waitEmbed).then(m => {
    if (searchTerm.length === 0) {
      const errorEmbed = new MessageEmbed()
        .setDescription(`No search term provided.`);
      return m.edit(errorEmbed);
    }
    let searchResults = [];
  googleIt({'query': searchTerm, 'limit': searchLimit, 'disableConsole': true}).then(results => {
    for (let i = 0; i < results.length; i++) {
      searchResults.push(`[**__${results[i].title}__**](${results[i].link})`);
      searchResults.push(`${results[i].snippet}\n`);
    }
    const resultEmbed = new MessageEmbed()
      .setTitle(`Search results for \`${searchTerm}\``)
      .setDescription(searchResults.join('\n'))
      .setFooter(`Found ${results.length} results | Provided by Google`);
    return m.edit(resultEmbed);
  }).catch(e => {
    const errorEmbed = new MessageEmbed()
      .setDescription(e);
    return m.edit(errorEmbed);
  })
  });
}

module.exports.help = {
  name: "search"
}