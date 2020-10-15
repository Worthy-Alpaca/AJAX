const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod, getreportschannel } = require("../../functions/db_queries.js");
const { filter_integer } = require("../../functions/functions.js");

module.exports = {
    name: "role",
    category: "moderation",
    permission: ["moderator", "admin"],
    description: "adds/removes role to all mentioned members",
    descriptionlong: "adds/removes role to all mentioned members depending wether they already have the role",
    usage: "<role> <member> [member] etc.",
    run: async (client, message, args, api) => {

        const logChannel = message.guild.channels.cache.find(c => c.id === api.reports) || message.channel;  //###########################

        if (api.admin === null) { //###########################
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (api.moderator === null) { //###########################
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        if (!args[1]) {
            return message.reply("You need to tag someone.");
        }

        let role = message.mentions.roles.first();

        if (!role) {
            return message.reply("You did not mention a role for me to add");
        }
        //check if role is one of the staff roles
        if (role.id === message.guild.roles.cache.find(r => r.id === api.admin).id || role.id === message.guild.roles.cache.find(r => r.id === api.moderator).id) {
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                return message.reply("You can't do that. Please contact an admin!");
            }
        }

        const toadd_collection = args.slice(1)
        console.log(toadd_collection)
        //loop over all members mentioned and add/remove the role mentioned
        toadd_collection.forEach(async function (person) {

            const mbr = await filter_integer(message, person);

            const toadd = message.guild.members.cache.find(m => m.id === mbr);

            const embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setThumbnail(toadd.user.displayAvatarURL())
                .setTimestamp()
                .setFooter(message.guild.name, message.guild.iconURL)
                .setTitle("**Role added**")
                .setDescription(stripIndents`${role} added to ${toadd} by ${message.member}`);

            if (!toadd) {
                return message.reply(`Couldn't find ${toadd}. Try again`);
            }

            if (toadd.roles.cache.has(role.id)) {
                embed.setDescription(stripIndents`${role} removed from ${toadd} by ${message.member}`);
                logChannel.send(embed)
                toadd.roles.remove(role.id).catch(e => console.log(e.message))
                return message.channel.send(`\`${role.name}\` has been removed from ${toadd}.`);
            } else {
                embed.setDescription(stripIndents`${role} added to ${toadd} by ${message.member}`);
                logChannel.send(embed)
                toadd.roles.add(role.id).catch(e => console.log(e.message))
                return message.channel.send(`\`${role.name}\` has been added to ${toadd}.`);
            }
        })
    }
}