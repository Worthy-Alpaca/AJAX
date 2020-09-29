const Discord = require("discord.js");
const { get_API_call, delete_API_call} = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");
var { kick_limit, ban_limit } = require("../../src/config.json");


module.exports = {
    name: "infractions",
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "Tells you how often you have been reported",
    usage: "[mention]",
    run: async (client, message, args, api) => {

        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.author;

        const tblid = Array.from(message.guild.name)
        tblid.forEach(function (item, i) { if (item == " ") tblid[i] = "_"; });
        
        const infractions = await get_API_call(message, 'misc/get', 'misc/infractions', tblid.join(""), rMember.id);
        
        if (!rMember) {
            return message.reply("This member does not exist on this server");
        }

        if (api.ban_limit !== null) {
            ban_limit = api.ban_limit;
        }

        if (api.kick_limit !== null) {
            kick_limit = api.ban_limit;
        }

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .setFooter(message.guild.name, client.user.displayAvatarURL())
            .setDescription(`**Current infractions of ${rMember.username}**`)
            .addField(`\u200b`, stripIndents`Currently you have **${infractions}** infractions.
            You will get **kicked at ${kick_limit}** infractions and **banned at ${ban_limit}** infractions`);

        return message.channel.send(embed);

    }

}