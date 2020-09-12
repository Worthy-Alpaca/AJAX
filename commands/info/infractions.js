const Discord = require("discord.js");
const { get_API_call, delete_API_call} = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");
const { kick_limit, ban_limit, version } = require("../../src/config.json");


module.exports = {
    name: "infractions",
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "Tells you how often you have been reported",
    usage: "[clear](only admins), [mention]",

    run: async (client, message, args, api) => {

        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.author;

        //var admin = await getAdmin(message);
        //var moderator = await getMod(message);
        const tblid = Array.from(message.guild.name)
        tblid.forEach(function (item, i) { if (item == " ") tblid[i] = "_"; });
        
        const infractions = await get_API_call(message, 'misc/get', 'misc/infractions', tblid.join(""), rMember.id);
        
        if (!rMember) {
            return message.reply("This member does not exist on this server");
        }

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .setFooter(message.guild.name, client.user.displayAvatarURL())
            .setDescription(`**Current infractions of ${rMember.username}**`)
            .addField(`\u200b`, stripIndents`Currently you have **${infractions}** infractions.
            You will get **kicked at ${kick_limit}** infractions and **banned at ${ban_limit}** infractions`);


        if (args[0] === "clear") {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id)) { //######################
                return message.reply("You can't do that. Please contact a staff member!")
                    .then(m => m.delete({ timeout: 5000 }));
            }

            if (infractions === 0) {
                return message.reply("No infractions to clear");
            } else {
                const payload = JSON.stringify({
                    server: tblid.join(''),
                    value: rMember.id
                })
                const success = await delete_API_call('misc/delete', payload, message.guild, 'misc/infractions');
                
                if (success.success === true) {
                    return message.reply(`Infractions for ${rMember} have been cleared`);
                } else if (success.success === false && success.status === 200) {
                    return message.reply(`No Infractions for ${rMember} found!`);
                } else {
                    return message.reply(`An error occured: ${success.err}`);
                }
            }

        }

        return message.channel.send(embed);

    }

}