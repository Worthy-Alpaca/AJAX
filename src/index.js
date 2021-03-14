//Import file system
const fs = require("fs");

//.env import
require('dotenv').config();

//Import new Bot instance
const client = require('./client');

/* Create command structure */
const { Collection } = require("discord.js");

client.reply = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

/* ######################################################################### */

//Assign the handler
["command"].forEach(handler => {
  require(`../handler/${handler}`)(client);
});
// channel event
fs.readdirSync('./src/events/channels').forEach(event => {
  require(`./events/channels/${event}`)(client);
});
// guild events
fs.readdirSync('./src/events/guild').forEach(event => {
  require(`./events/guild/${event}`)(client);
});
// role events
fs.readdirSync('./src/events/roles').forEach(event => {
  require(`./events/roles/${event}`)(client);
});
// additional events
fs.readdirSync('./src/events').filter(file => file.endsWith(".js")).forEach(event => {
  require(`./events/${event}`)(client);
});

//Handling API errors
process.on('unhandledRejection', error => {
  console.log('Unhandled promise rejection:', error);
})

//Logging into discord
client.login(process.env.DISCORD_TOKEN);

/* ######################################################################### */
// import express
const express = require('express');
const app = express();
const helmet = require("helmet");

const receive = require('./routes/receive');
// middleware
app.use(helmet());

// routes
app.use('/receive', receive);

const port = process.env.PORT || 1000;
app.listen(port, () => console.log(`listening to port ${port}`));