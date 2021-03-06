const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const prefix = config.prefix;
const client = new Discord.Client();
client.commands = new Discord.Collection();

// read commands
fs.readdir("./commands/", (err, files) => {
  // Error 
  if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0){
      console.log("Couldn't find commands.");
      return;
    }

    console.log('----');
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`);
      return client.commands.set(props.help.name, props);
    });
    console.log('----');
});

// on ready info
client.on("ready", async () => {
  client.user.setActivity(config.status.text, { type: config.status.type });
  
  console.log(`Status type: ${config.status.type}
Status text: ${config.status.text}`);
  console.log(`Logged in as ${client.user.tag}`);
});

// command handler
client.on("message", async message => {
  if (message.author.bot) return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  //Check for prefix
  if (!cmd.startsWith(prefix)) return;
    
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(client,message,args);
});

client.login(process.env['TOKEN']);