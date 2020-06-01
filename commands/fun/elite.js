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
        const system = `https://www.edsm.net/api-system-v1/bodies?sysname=${sys}`
        const stations = `https://www.edsm.net/api-system-v1/stations?sysname=${sys}`
        const factions = `https://www.edsm.net/api-system-v1/factions?sysname=${sys}`
        const sysinfo = `https://www.edsm.net/api-v1/system?sysname=${sys}&showPermit=1&showInformation=1`
        

         
        const response1  = await fetch(system).then(function(response) {            
            return response.json();
        })

        const response2 = await fetch(stations).then(function(response) {
            return response.json();
        })

        const response3 = await fetch(factions).then(function(response) {
            return response.json();
        })

        const response4 = await fetch(sysinfo).then(function(response) {            
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
        var permit;
        var uninhabitated;
        var thumbnail;

        if (response4.information.allegiance === "Alliance") {
            thumbnail = "https://edassets.org/static/img/factions/Alliance-insignia.png"
        } else if (response4.information.allegiance === "Empire") {
            thumbnail = "https://edassets.org/static/img/factions/Empire-insignia.png"
        } else if (response4.information.allegiance === "Federation") {
            thumbnail = "https://edassets.org/static/img/factions/Federation-insignia.png"
        } else if (response4.information.allegiance === "Independent") {
            thumbnail = "https://edassets.org/static/img/squadrons/independent-power.png"
        } else {
            thumbnail = "https://edassets.org/static/img/decals/Planet1.png"
        }

        if (typeof response3.controllingFaction == 'undefined') {            
            uninhabitated = true;
        } 

        if (response4.requirePermit) {
            permit = response4.permitName;
        } else {
            permit = "No permit required"
        }
        
        response1.bodies.forEach(function(bodies) {
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

        response2.stations.forEach(function(stations) {
            if (stations.type === "Orbis Starport") {  
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`                                            
                station.push(info)
            } else if (stations.type === "Ocellus Starport") {  
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`              
                station.push(info)
            } else if (stations.type === "Coriolis Starport") {   
                info = `${stations.name}  (${Math.round(stations.distanceToArrival)} ls)`             
                station.push(info)
            } else if (stations.type === "Planetary Port"){  
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
         
        const embed = new RichEmbed()
            .setColor('RANDOM')
            .setFooter('EDSM Database')
            .setTimestamp()
            .setThumbnail(thumbnail)
            .setTitle(response1.name)
            .setURL(response1.url)
            .setDescription(`**Controlling Faction:** ${response4.information.faction} 
            **Permit:** ${permit}
            **Government:** ${response4.information.government} 
            **State:** ${response4.information.factionState}
            **Allegiance:** ${response4.information.allegiance} 
            **Population:** ${response4.information.population}`)
            .addField(`\u200b`,  stripIndents`**Main Star** 
            Star Class: ${response1.bodies[0].subType}
            Scoopable: ${response1.bodies[0].isScoopable}`, true)
            .addField(`\u200b`, stripIndents`**Stellar Bodies**
            Stars: ${stars.length}
            Landable Bodies: ${landables.length}
            Nonlandable Bodies: ${nonlandables.length}`, true);
               
            
        if (uninhabitated == true ) {
            embed.setDescription(`This system is **uninhabitated**`)
        } else {
            embed.addField(`\u200b`,  stripIndents`**Stations** 
            Star Ports: ${station.length}                        
            Outposts: ${outposts.length}
            Planetary Ports: ${planetary.length}`, true);
            embed.addField(`\u200b`, stripIndents`**Star Ports**
            - ${station.join('\n- ')}`, true)            
            embed.addField(`\u200b`, stripIndents`**Planetary Ports**
            - ${planetary.join('\n- ')}`, true)
            embed.addField(`\u200b`, stripIndents`**Outposts**
            - ${outposts.join('\n- ')}`)
            }

        message.channel.send(embed);
        
        
    }
   }

