const Discord = require('discord.js');
const client = new Discord.Client();

client.login("NjgyMjU1MjA4MTI1OTU2MTI4.XlaVwQ.xyUKbIXF_492CNBsXEyx1MVtgTs")

client.on('ready', () => {
    console.log("The bot is logged in!");
})


client.on('message', message => {
    if (message.author.bot)
        return;

    if (message.content.toLowerCase() === 'hello')
        message.channel.send("Hey!");

});

//test