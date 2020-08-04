const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { getservers, getserverchannel } = require("../../functions/db_queries.js");
const { version, owner } = require("../../src/config.json");

module.exports = {
    name: "cross-server",
    category: "moderation",
    permission: ["null"],
    description: "Sends a message to all servers",
    usage: "[list|server id], <message>",
    run: async (client, message, args, con) => {
        message.delete();
        //console.log(client.guilds)
        if (message.author.id !== owner)
            return message.reply("You are not powerful enough to command me in such a way!").then(m => m.delete({ timeout: 5000 }));

        const servers = await getservers(message, con);

        if (!args[0]) {
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
                return message.reply("No server with that ID found")
            }
            const chnl = await getserverchannel(srv, con);
            var channel = srv.channels.cache.find(channel => channel.id === chnl);

            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setFooter(`Version: ${version}`)
                .setTimestamp()
                .setTitle("**Greetings**")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(stripIndents`${args.slice(1).join(" ")}
                -Worthy Alpaca`);

            if (!channel) {
                channel = srv.channels.cache.find(channel => channel.id === srv.systemChannelID);
                if (!channel) {
                    return client.users.fetch(srv.owner.id, false).then(user => {
                        return user.send(embed);
                    })
                }
            }
            return channel.send(embed)

        } else {
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setFooter(`Version: ${version}`)
                .setTimestamp()
                .setTitle("**Greetings**")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(stripIndents`${args.slice(0).join(" ")}
                    -Worthy Alpaca`);

            servers.forEach(async function (server) {
                var srv = client.guilds.cache.get(server);
                if (!srv) return message.channel.send(`${server} was not found.`)
                const chnl = await getserverchannel(srv, con)
                var channel = srv.channels.cache.find(channel => channel.id === chnl);
                if (!channel) {
                    channel = srv.channels.cache.find(channel => channel.id === srv.systemChannelID);
                    if (!channel) {
                        return client.users.fetch(srv.owner.id, false).then(user => {
                            return user.send(embed);
                        })
                    }
                }
                return channel.send(embed)
            })
        }
    }
}