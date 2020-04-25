const Discord = require("discord.js");
const superagent = require("superagent");
const querystring = require('querystring');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const { RichEmbed } = require("discord.js");
const fetch = require('node-fetch');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const url = "https://www.edsm.net/api-v1/system";


module.exports = {
    name: "elite",
    category: "fun",
    description: "Don't use me. I'm not done.",
    usage: "don't use me yet!",
    run: async (client, message, args) => {
        if (message.deletabe) message.delete();
        return message.reply("This is not working yet. Come back at a later time, maybe I'll have it figured out then :grin:")
         
        if (!args.length) {
            return message.channel.send('You need to supply a search term!')
                .then(m => m.delete(5000));
        }
        const cmdr = args.slice(0).join(" ")
        
        /* const response = await fetch('https://inara.cz/inapi/v1/', {
            method: 'POST',
            "headers": {
                "appName": "MyInaraApp",
                "appVersion": "1.01",
                "isDeveloped": true,
                "APIkey": "bckzq90dgzwo444k44g0gss08csoks4w84ogw8k",
                "commanderName": "Worthy Alpaca",
                "commanderFrontierID": "3298136"
            },
            "events": [
                {
                    "systemName": `${cmdr}`
                    
                },
                {
                    "showInformation": 1
                }
            ]
        });
        return response.json()
        .then(data => {
            console.log(data)
        })
        .catch(err => {
            console.log(err);
        }) */

        

        /* const embed = new RichEmbed()
            .setColor('RANDOM')
            .addField('Definition', trim(answer.name, 1024) );
            

        message.channel.send(embed); */
        
        
        
    }
   }

