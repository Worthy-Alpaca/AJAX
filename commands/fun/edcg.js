const Discord = require("discord.js");
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");
const { apikey_inara } =require("../../src/config.json");
const { combat, exploration, trade, cqc, empire, fedaration } = require("../../assets/elite/ranks.json");
const { promptMessage } = require("../../functions/functions.js");

module.exports = {
    name: "edcg",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Returns latest community goal details",  
    descriptionlong: "Returns latest community goal details and adds reactions to cycle through them",      
    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();
            
        var date = new Date();
        var timestamp = date.getTime();        
        var a = true;
        var i = 0;
        const chooseArr = ["◀", "⏹", "▶"]
        const chooseArrfirst = [chooseArr[1], chooseArr[2]]
        const chooseArrlast = [chooseArr[0], chooseArr[1]]

        const data = { 
        "header": {
            "appName": "Aiax",
            "appVersion": `${version}`,
            "isDeveloped": true,
            "APIkey": apikey_inara,
            "commanderName": "Worthy Alpaca",
            "commanderFrontierID": "3298136"
        },
        "events": [
            {
                "eventName": "getCommunityGoalsRecent",
                "eventTimestamp": timestamp,                
                "eventData": []
            },            
        ] };

        
                
        const response = await fetch('https://inara.cz/inapi/v1/', {
            method: 'POST',           
            body: JSON.stringify(data),
        }).then(function (response) {
            return response.json();
        }) 
        if (response.events[0].eventStatus === 202) {
            return message.reply(`\`${cmdr}\` returned multiple results.`)
        } else if (response.events[0].eventStatus === 204) {
            return message.reply(`\`${cmdr}\` returned no results.`)
        } else if (response.events[0].eventStatus === 400) {
            return message.reply(`Something went wrong :frowning2:`)
        }
        
        while (a && i < response.events[0].eventData.length) {
            const community_goal = response.events[0].eventData[i];

            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .attachFiles([`./assets/elite/communitygoal.png`])
                .setThumbnail(`attachment://communitygoal.png`)
                .setFooter('INARA database', "https://inara.cz/images/logosmall2.png")
                .setURL(community_goal.inaraURL)
                .setTitle(community_goal.communitygoalName)
                .setDescription(`${community_goal.goalDescriptionText}`)
                .addField(`\u200b`, stripIndents`**Statistics**
            System: ${community_goal.starsystemName}
            Station: ${community_goal.stationName}
            Tier: ${community_goal.tierReached}/${community_goal.tierMax}
            Contributions: ${community_goal.contributionsTotal}`, true);


            await message.channel.send(embed).then(async msg => {

                if (i === 0) {
                    var reaction = await promptMessage(msg, message.author, 240000, chooseArrfirst);

                    if (reaction === chooseArr[2]) {
                        msg.delete();
                        i++;
                        return
                    } else if (reaction === chooseArr[1]) {
                        i = response.events[0].eventData.length +1;
                        msg.delete();
                        return
                    }
                } else if (i === response.events[0].eventData.length -1) {
                    var reaction = await promptMessage(msg, message.author, 240000, chooseArrlast);

                    if (reaction === chooseArr[0]) {
                        msg.delete();
                        i--;
                        return
                    } else if (reaction === chooseArr[1]) {
                        i = response.events[0].eventData.length +1;
                        msg.delete();
                        return
                    }
                } else {
                    var reaction = await promptMessage(msg, message.author, 240000, chooseArr);

                    if (reaction === chooseArr[0]) {
                        msg.delete();
                        i--;
                        return
                    } else if (reaction === chooseArr[2]) {
                        msg.delete();
                        i++;
                        return
                    } else if (reaction === chooseArr[1]) {
                        i = response.events[0].eventData.length +1;
                        msg.delete();
                        return
                    }
                }
            })
        }

        
    }
   }