const Discord = require("discord.js");
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");




module.exports = {
    name: "edsystem",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Displays information about a system",
    usage: "<System>",
    run: async (client, message, args) => {

        if (!args.length) {
            return message.channel.send('You need to supply a search term!');
        }

        const sys = args.slice(0).join("+")
        const system = `https://www.edsm.net/api-system-v1/bodies?sysname=${sys}`
        const stations = `https://www.edsm.net/api-system-v1/stations?sysname=${sys}`
        const factions = `https://www.edsm.net/api-system-v1/factions?sysname=${sys}`
        const sysinfo = `https://www.edsm.net/api-v1/system?sysname=${sys}&showPermit=1&showInformation=1`

        const response1 = await fetch(system).then(function (response) {
            return response.json();
        })

        const response2 = await fetch(stations).then(function (response) {
            return response.json();
        })

        const response3 = await fetch(factions).then(function (response) {
            return response.json();
        })

        const response4 = await fetch(sysinfo).then(function (response) {
            return response.json();
        })

        if (typeof response1.id == 'undefined') {
            return message.reply(`I have never heard of the \`${args.slice(0).join(" ")}\` system. Let me ask around real quick.`)
        } else message.reply("I found something. One second please")

        var station = [];
        var outposts = [];
        var planetary = [];
        var landables = [];
        var nonlandables = [];
        var stars = [];
        var services = [];
        var permit;
        var uninhabitated;
        var thumbnail;

        if (response4.information.allegiance === "Alliance") {
            thumbnail = "Alliance-insignia.png"
        } else if (response4.information.allegiance === "Empire") {
            thumbnail = "Empire-insignia.png"
        } else if (response4.information.allegiance === "Federation") {
            thumbnail = "Federation-insignia.png"
        } else if (response4.information.allegiance === "Independent") {
            thumbnail = "independent-power.png"
        } else {
            thumbnail = "Planet1.png"
        }

        if (typeof response3.controllingFaction == 'undefined') {
            uninhabitated = true;
        }

        if (response4.requirePermit) {
            permit = response4.permitName;
        } else {
            permit = "No permit required"
        }

        response1.bodies.forEach(function (bodies) {
            if (bodies.isLandable) {
                id = bodies.id
                landables.push(id)
            } else {
                if (bodies.type === "Star") {
                    id = bodies.id
                    stars.push(id)
                } else {
                    id = bodies.id
                    nonlandables.push(id)
                }

            }
        })

        response2.stations.forEach(function (stations) {
            if (stations.government === "Workshop (Engineer)") {
                services.push(`Has engineer *${stations.controllingFaction.name}*`)
            }
            if (stations.otherServices.includes("Interstellar Factors Contact")) {
                if (!services.includes("Interstellar Factors Contact")) {
                    services.push("Interstellar Factors Contact")
                }
            }
            if (stations.otherServices.includes("Material Trader")) {
                if (!services.includes("Material Trader")) {
                    services.push("Material Trader")
                }
            }
            if (stations.otherServices.includes("Technology Broker")) {
                if (!services.includes("Technology Broker")) {
                    services.push("Technology Broker")
                }
            }
            if (stations.type === "Orbis Starport") {
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`
                station.push(info)
            } else if (stations.type === "Ocellus Starport") {
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`
                station.push(info)
            } else if (stations.type === "Coriolis Starport") {
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`
                station.push(info)
            } else if (stations.type === "Planetary Port") {
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`
                planetary.push(info)
            } else if (stations.type === "Planetary Outpost") {
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`
                planetary.push(info)
            } else if (stations.type === "Outpost") {
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`
                outposts.push(info)
            }
        })

        if (!services.length) {
            services.push("None")
        }

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setFooter('EDSM Database', 'https://www.edsm.net/img/guilds/1.png?v=1545042798')
            .setTimestamp()
            .attachFiles([`./assets/elite/${thumbnail}`])
            .setThumbnail(`attachment://${thumbnail}`)
            .setTitle(response1.name)
            .setURL(response1.url)
            .setDescription(`**Controlling Faction:** ${response4.information.faction} 
            **Permit:** ${permit}
            **Government:** ${response4.information.government} 
            **State:** ${response4.information.factionState}
            **Allegiance:** ${response4.information.allegiance} 
            **Population:** ${response4.information.population}
            **Noteable services:** ${services.join(", ")}`)
            .addField(`Main Star`, stripIndents` 
            Star Class: ${response1.bodies[0].subType}
            Scoopable: ${response1.bodies[0].isScoopable}`, true)
            .addField(`Stellar Bodies`, stripIndents`
            Stars: ${stars.length}
            Landable Bodies: ${landables.length}
            Nonlandable Bodies: ${nonlandables.length}`, true);


        if (uninhabitated == true) {
            embed.setDescription(`This system is **uninhabitated**`)
        } else {
            embed.addField(`Stations`, stripIndents` 
            Star Ports: ${station.length}                        
            Outposts: ${outposts.length}
            Planetary Ports: ${planetary.length}`, true);
            embed.addField(`Star Ports`, stripIndents`
            - ${station.join('\n- ')}`, true)
            embed.addField(`Planetary Ports`, stripIndents`
            - ${planetary.join('\n- ')}`, true)
            embed.addField(`Outposts`, stripIndents`
            - ${outposts.join('\n- ')}`)
        }

        message.channel.send(embed);


    }
}

