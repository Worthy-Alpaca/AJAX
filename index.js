

const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

//create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command);
}

//when the client is ready, run this code
//this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
})


//login to Discord with the bot's token
client.login(token);


