const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { getservers, getserverchannel } = require("../../functions/functions.js");
const { version } = require("../../src/config.json");

module.exports = {
    name: "cross-server",
    category: "moderation",
    permission: ["null"],
    description: "Sends a message to all servers",
    usage: "<message>",
    run: async (client, message, args, con) => {
        message.delete();
        //console.log(client.guilds)
        if (message.author.id !== "595341356432621573")
            return message.reply("You are not powerfull enough to command me in such a way!").then(m => m.delete( {timeout: 5000} ));
            
        const servers = await getservers(message, con);    
        
        if (!args[0]) {
            return message.reply("Maybe also send a message :wink:")
        }
        
        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        if (args[0] === "list") {  
            srvs = [];
    
            client.guilds.cache.forEach(server => {                
                srvs.push(`${server.name} => ${server.id}`)
            })            
            
            const embed = new Discord.MessageEmbed()
                .setTitle("**Servers**")
                .setTimestamp()
                .setDescription(stripIndents`- ${srvs.join('\n- ')}`);

            return message.channel.send(embed)
            
        } else if (servers.includes(args[0])) {
            var srv = client.guilds.cache.get(args[0]);
            if (!srv) {
                return message.reply("No communication established")
            }
            channel = srv.channels.cache.find(channel => channel.id === srv.systemChannelID);
            if (!channel) {
                return message.reply("No communication established")
            }

            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setFooter(`Version: ${version}`)
                .setTimestamp()
                .setTitle("**Greetings**")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(stripIndents`${args.slice(1).join(" ")}
                -Worthy Alpaca`);

            return channel.send(embed)

        } else {
            asyncForEach(servers, async (server) => {
                var srv = client.guilds.cache.get(server);
                const chnl = await getserverchannel(srv, con);
                channel = srv.channels.cache.find(channel => channel.id === chnl);
                if (!channel) {
                    return console.log("There was an error")
                }
                channel.send(args.slice(0).join(" ")).catch();
            })
        }
                

        
               
    }
}