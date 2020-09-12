const Discord = require("discord.js");
const { get_API_call } = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "rank",
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "Applies the given rank. No mention needed.",
    usage: "<rank>",

    run: async (client, message, args) => {

        if (args < 1) {
            return message.reply("If you give me some thing to work with, I might be able to help you :wink:")
        }

        var rank = message.guild.roles.cache.find(r => r.name === args.slice(0).join(" "))
        if (!rank) {
            return message.reply("This rank doesn't exist").then(m => m.delete({ timeout: 5000 }));
        }

        const ranktoadd = await get_API_call(message, 'misc/get', 'misc/checkrank', rank.id);
        const embed = new Discord.MessageEmbed()
        
        if (ranktoadd === true) {
            if (message.member.roles.cache.has(rank.id)) {
                message.member.roles.remove(rank.id).catch(e => console.log(e.message))
                message.reply(`\`${rank.name}\` has been taken from you.`)
            } else {
                message.member.roles.add(rank.id).catch(e => console.log(e.message))
                message.reply(`\`${rank.name}\` has been added to you.`)
            }
        } else if (ranktoadd.success === false && ranktoadd.status === 200) {
            embed.setColor("YELLOW").setDescription("❗ This rank doesn't belong to !ranks");
            return message.channel.send(embed);
        } else {
            embed.setColor("RED").setDescription(`❗ An error occured: ${ranktoadd.err}`);
            return message.channel.send(embed);
        }
    }
}