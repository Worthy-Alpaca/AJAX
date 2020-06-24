const Discord = require("discord.js");
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");

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
            "APIkey": "bckzq90dgzwo444k44g0gss08csoks4w84ogw8k",
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
        
        fetch('https://inara.cz/inapi/v1/', {
            method: 'POST', // or 'PUT'            
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
      
    }
   }