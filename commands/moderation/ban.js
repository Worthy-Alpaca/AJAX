const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod, getreportschannel } = require("../../functions/db_queries.js");

module.exports = {
    name: "ban",
    category: "moderation",
    permission: ["admin"],
    description: "Bans the person mentioned",
    usage: "<member>, <reason>",
    run: async (client, message, args, con, api) => {
        //const reports = await getreportschannel(message, con);
        const logChannel = message.guild.channels.cache.find(c => c.id === api.reports) || message.channel;  //###########################

        if (message.deletable) message.delete();

        //var admin = await getAdmin(message, con);
        //var moderator = await getMod(message, con);

        if (api.admin === null) {  //###########################
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (api.moderator === null) {  //###########################
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to ban.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to ban.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[1]);

        // No member found
        if (!toBan) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // person to remove = author
        if (toBan.id === message.author.id) {
            return message.reply("You can't do that to yourself smartboi :rofl:")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // Check if the user's kickable
        if (!toBan.kickable) {
            return message.reply("I can't kick that person due to role hierarchy, I suppose.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // No author permissions
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id)) {
            return message.reply("❌ You do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({ timeout: 5000 }));
        }

        //no bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({ timeout: 5000 }));
        }

        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(stripIndents`**> baned member:** ${toBan} (${toBan.id})
            **> baned by:** ${message.member} (${message.member.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        toBan.ban(args.slice(1).join(" "))
            .catch(err => {
                if (err) return message.channel.send(`Well.... the ban didn't work out. Here's the error ${err}`)
            });

        return logChannel.send(embed);
    }
}