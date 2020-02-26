
//require the discord.js module
//const config = require('./config.json');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

//create a new Discord client
const client = new Discord.Client();

//when the client is ready, run this code
//this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.content === `${prefix}about`) {
        //send back "Pong" to the channel the message was sent in
        message.channel.send(`This bot is still in it's pre-alpha phase. Please report bugs or ideas to Worthy Alpaca`);
    } else if (message.content === `${prefix}server`) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    } else if (message.content === `${prefix}user-info`) {
        message.channel.send(`Your Username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
});

//client.on('message', message => {
//    if (!message.content.startsWith(prefix) || message.author.bot) return ;

//    const args = message.content.slice(prefix.length).split(' ');
//    const command = args.shift().toLowerCase();

//    if (command === 'args-info') {
//        if (!args.length) {
//            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
//        } else if (args[0] === 'foo') {
//            return message.channel.send('bar');
//        }

//        //message.channel.send(`Command name: ${command}\nArguments: ${args}`);
//        message.channel.send(`First argument: ${args[0]}`);
//    }
//})


//login to Discord with the bot's token
client.login(token);


