const Discord = require("discord.js");
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");
const { apikey_inara } = require("../../src/config.json");
const { combat, exploration, trade, cqc, empire, fedaration } = require("../../assets/elite/ranks.json");

module.exports = {
    name: "edcmdr",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Gets CMDR stats from INARA",
    descriptionlong: "Gets your CMDR stats from inara. If you don't provide a name I'll try your discord name.",
    usage: "[Commander name]",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        var cmdr = args.slice(0).join(" ")

        if (!cmdr) {
            cmdr = message.member.displayName
            message.reply("You didn't provide a CMDR name. Looking for your discord name")
        }

        var date = new Date();
        var timestamp = date.getTime();
        ranks = [];

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
                    "eventName": "getCommanderProfile",
                    "eventTimestamp": timestamp,
                    "eventData": {
                        "searchName": `${cmdr}`
                    }
                },
            ]
        };

        //converting rank number to name
        function getrank(rankName, rankValue) {
            if (rankName === "combat") {
                return rnk = combat[rankValue];
            } else if (rankName === "trade") {
                return rnk = trade[rankValue];
            } else if (rankName === "exploration") {
                return rnk = exploration[rankValue];
            } else if (rankName === "cqc") {
                return rnk = cqc[rankValue];
            } else if (rankName === "empire") {
                return rnk = empire[rankValue];
            } else if (rankName === "federation") {
                return rnk = fedaration[rankValue];
            }
        }

        const response = await fetch('https://inara.cz/inapi/v1/', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(function (response) {
            return response.json();
        })
        //console.log(response) 
        if (response.events[0].eventStatus === 202) {
            return message.reply(`\`${cmdr}\` returned multiple results.`)
        } else if (response.events[0].eventStatus === 204) {
            return message.reply(`\`${cmdr}\` returned no results.`)
        } else if (response.events[0].eventStatus === 400) {
            return message.reply(`Something went wrong :frowning2:`)
        }
        const commander = response.events[0].eventData
        const API_ranks = commander.commanderRanksPilot
        const squadron = commander.commanderSquadron
        //console.log(commander)
        API_ranks.forEach(function (rank) {
            ranks.push(getrank(rank.rankName, rank.rankValue))
        })

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter('INARA profile', "https://inara.cz/images/logosmall2.png")
            .setURL(commander.inaraURL)
            .setThumbnail(commander.avatarImageURL)
            .setTitle(commander.commanderName)
            .setDescription(`**Profile**`)
            .addField(`\u200b`, stripIndents`**Ranks**
                    Combat: ${ranks[0]}
                    Trade: ${ranks[1]}
                    Exploration: ${ranks[2]}
                    CQC: ${ranks[3]}`, true)
            .addField(`\u200b`, stripIndents`**Reputation**
                    Empire: ${ranks[4]}
                    Federation: ${ranks[5]}`, true);


        if (typeof squadron == 'undefined') {
            embed.addField(`\u200b`, stripIndents`**Squadron**
            Not part of any INARA squadron`);
        } else {
            embed.addField(`\u200b`, stripIndents`**Squadron**
            [${squadron.squadronName}](${squadron.inaraURL})
            Current rank: ${squadron.squadronMemberRank}
            ${squadron.squadronMembersCount} other Squadron members`);
        }

        return message.channel.send(embed);

    }
}