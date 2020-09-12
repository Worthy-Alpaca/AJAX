const Discord = require("discord.js");
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");
const { apikey_inara } = require("../../src/config.json");
const { promptMessage, pageparser } = require("../../functions/functions.js");

module.exports = {
    name: "edcg",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Returns latest community goal details",
    descriptionlong: "Returns latest community goal details and adds reactions to cycle through them",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        var date = new Date();
        var timestamp = date.getTime();
        var a = true;
        var i = 0;
        const chooseArr = ["◀", "⏹", "▶"];

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
            ]
        };

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
            console.log(i, "before function")
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

            i = await message.channel.send(embed).then(msg => pageparser(message, msg, i, 240000, chooseArr, promptMessage, response.events[0].eventData.length));
        }
    }
}