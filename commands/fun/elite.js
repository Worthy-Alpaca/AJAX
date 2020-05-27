const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");



module.exports = {
    name: "elite",
    category: "fun",
    description: "Displays information about a system",
    usage: "<System>",
    run: async (client, message, args, con) => {

        message.delete();
        
        if (!args.length) {
            return message.channel.send('You need to supply a search term!')
                .then(m => m.delete(5000));
        }       

        const sys = args.slice(0).join("+")
        const url = `https://www.edsm.net/api-system-v1/bodies?sysname=${sys}`
        const url2 = `https://www.edsm.net/api-system-v1/stations?sysname=${sys}`
        const url3 = `https://www.edsm.net/api-system-v1/factions?sysname=${sys}`
        
        const response1  = await fetch(url).then(function(response) {
            return response.json();
        })

        const response2 = await fetch(url2).then(function(response) {
            return response.json();
        })

        const response3 = await fetch(url3).then(function(response) {
            return response.json();
        })

        if (typeof response1.id == 'undefined') {
            return message.reply(`I have never heard of the \`${args.slice(0).join(" ")}\` system. Let me ask around real quick.`)
        } else message.reply("I found something. One second please")
          
        var station = [];
        var outposts = [];
        var planetary = [];
        var id2;
        var landables = [];
        var nonlandables = [];
        var stars = [];
        var id1;
        var faction;
        var allegiance;
        var government;
        var test;

        if (typeof response3.controllingFaction == 'undefined') {
            faction = "System is not inhabitated"
            test = true;
        } else {
            allegiance = response3.controllingFaction.allegiance
            government = response3.controllingFaction.government
            faction = response3.controllingFaction.name
        }
        
        response1.bodies.forEach(function(bodies) {
            if (bodies.isLandable) {
                id = bodies.id
                landables.push(id1)
            } else if (!bodies.isLandable) {
                if (bodies.type === "Star") {
                    id = bodies.id
                    stars.push(id1)
                } else {
                    id = bodies.id
                    nonlandables.push(id1)  
                }
                
            }
        })

        response2.stations.forEach(function(stations) {
            if (stations.type === "Orbis Starport") {
                id = stations.id
                station.push(id2)
            } else if (stations.type === "Ocellus Starport") {
                id = stations.id
                station.push(id2)
            } else if (stations.type === "Coriolis Starport") {
                id = stations.id
                station.push(id2)
            } else if (stations.type === "Planetary Port"){
                id = stations.id
                planetary.push(id2)
            } else if (stations.type === "Planetary Outpost") {
                id = stations.id
                planetary.push(id2)
            } else if (stations.type === "Outpost") {
                id = stations.id
                outposts.push(id2)
            }
        })
            
        const embed = new RichEmbed()
            .setColor('RANDOM')
            .setFooter('EDSM Database')
            .setTimestamp()
            .setTitle(response1.name)
            .setURL(response1.url)
            .setDescription(`**Controlling Faction:** ${faction}
            **Government:** ${government}
            **Allegiance:** ${allegiance}`)
            .addField(`\u200b`,  stripIndents`**Main Star** 
            Star Class: ${response1.bodies[0].subType}
            Scoopable: ${response1.bodies[0].isScoopable}`, true)
            .addField(`\u200b`, stripIndents`**Stellar Bodies**
            Stars: ${stars.length}
            Landable Bodies: ${landables.length}
            Nonlandable Bodies: ${nonlandables.length}`, true)
               
            
        if (test == true ) {
            embed.setDescription(`This system is **uninhabitated**`)
        } else {
            embed.addField(`\u200b`,  stripIndents`**Stations** 
            Star Ports: ${station.length}
            Outposts: ${outposts.length}
            Planetary Ports: ${planetary.length}`, true);
        }

        message.channel.send(embed);
        
        
    }
   }

