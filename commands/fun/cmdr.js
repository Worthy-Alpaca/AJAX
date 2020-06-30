const Discord = require("discord.js");
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");
const { apikey_inara } =require("../../token.json");

module.exports = {
    name: "cmdr",
    category: "fun",
    permission: ["null"],
    description: "Gets your CMDR stats from inara",
    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();
        return message.reply("This is still in development :grin:")
        const cmdr = args.slice(0).join("+")

        const data = { 
        "header": {
            "appName": "AJAX",
            "appVersion": `${version}`,
            "isDeveloped": true,
            "APIkey": apikey_inara,
            "commanderName": "Worthy Alpaca",
            "commanderFrontierID": "3298136"
        },
        "events": [
            {
                "eventName": "getCommanderProfile",                
                "eventData": {
                    "searchName": `${cmdr}`
                }
            },            
        ] };
        
        const commander = await fetch('https://inara.cz/inapi/v1/', {
            method: 'POST', // or 'PUT'            
            body: JSON.stringify(data),
        }).then(function (response) {
            return response.json();
        })
        
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setFooter('INARA profile')
            .setTitle(commander.eventData.commanderName)
            .setDescription(`**Ranks**`)
            .addField(`\u200b`, stripIndents`Combat: 
            Trade:
            Exploration:
            CQC:`, true)
            .addField(`\u200b`, stripIndents`Empire:
            Federation:`, true);

        return message.channel.send(embed);
      
    }
   }