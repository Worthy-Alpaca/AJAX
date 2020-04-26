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
        
        //this works, don't delete it
        fetch(url).then(response => response.json()).then(function(response) {
            
            var landables = [];
            var nonlandables = [];
            var id;
            
            response.bodies.forEach(function(bodies) {
                if (bodies.isLandable) {
                    id = bodies.id
                    landables.push(id)
                } else if (!bodies.isLandable) {
                    id = bodies.id
                    nonlandables.push(id)
                }
            })

            
            const embed = new RichEmbed()
            .setColor('RANDOM')
            .setFooter('EDSM Database')
            .setTimestamp()
            .setURL(response.url)
            .addField('Name', `**${response.name}**` )
            .addField(`\u200b`,  stripIndents`**Main Star** 
            Star Class: ${response.bodies[0].subType}
            Scoopable: ${response.bodies[0].isScoopable}`, true)
            .addField(`\u200b`, stripIndents`**Planetary Bodies**
            Landable Bodies: ${landables.length}
            Nonlandable Bodies: ${nonlandables.length}`, true);
            

            message.channel.send(embed);
           

           
        })

        fetch(url2).then(response => response.json()).then(function(response) {
           
            
            
            var station = [];
            var outposts = [];
            var planetary = [];
            var id;

            response.stations.forEach(function(stations) {
                if (stations.type === "Orbis Starport") {
                    id = stations.id
                    station.push(id)
                } else if (stations.type === "Ocellus Starport") {
                    id = stations.id
                    station.push(id)
                } else if (stations.type === "Coriolis Starport") {
                    id = stations.id
                    station.push(id)
                } else if (stations.type === "Planetary Port") {
                    id = stations.id
                    planetary.push(id)
                } else if (stations.type === "Outpost") {
                    id = stations.id
                    outposts.push(id)
                }
            })

            
            const embed = new RichEmbed()
            .setColor('RANDOM')
            .setFooter('EDSM Database')
            .setTimestamp()
            .setURL(response.url)
            .addField('Name', `**${response.name}**` )
            .addField(`\u200b`,  stripIndents`**Stations** 
            Rotating Stations: ${station.length}
            Outposts: ${outposts.length}
            Planetary Outposts: ${planetary.length}`, true);
            
            

            message.channel.send(embed);
        

        })
    }
   }

