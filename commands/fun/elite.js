const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");



module.exports = {
    name: "elite",
    category: "fun",
    description: "Displays information about a system",
    usage: "<System>",
    run: async (client, message, args) => {

        if (message.deletabe) message.delete();
        
        if (!args.length) {
            return message.channel.send('You need to supply a search term!')
                .then(m => m.delete(5000));
        }
        const sys = args.slice(0).join("+")
        const url = `https://www.edsm.net/api-system-v1/bodies?sysname=${sys}`
        const url2 = `https://www.edsm.net/api-system-v1/stations?sysname=${sys}`
        
        const response1  = await fetch(url).then(function(response) {
            return response.json();
        })

        const response2 = await fetch(url2).then(function(response) {
            return response.json();
        })

        if (typeof response1.id == 'undefined') {
            return message.reply("I don't know about that system. Let me ask around real quick.")
        } else message.reply("I found something. One second please")

             
        var station = [];
        var outposts = [];
        var planetary = [];
        var id2;
        var landables = [];
        var nonlandables = [];
        var id1;

        

        response1.bodies.forEach(function(bodies) {
            if (bodies.isLandable) {
                id = bodies.id
                landables.push(id1)
            } else if (!bodies.isLandable) {
                id = bodies.id
                nonlandables.push(id1)
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
            .addField(`\u200b`,  stripIndents`**Main Star** 
            Star Class: ${response1.bodies[0].subType}
            Scoopable: ${response1.bodies[0].isScoopable}`, true)
            .addField(`\u200b`, stripIndents`**Planetary Bodies**
            Landable Bodies: ${landables.length}
            Nonlandable Bodies: ${nonlandables.length}`, true)
            .addField(`\u200b`,  stripIndents`**Stations** 
            Star Ports: ${station.length}
            Outposts: ${outposts.length}
            Planetary Ports: ${planetary.length}`, true);
            
            

        message.channel.send(embed);

        
    }
   }

