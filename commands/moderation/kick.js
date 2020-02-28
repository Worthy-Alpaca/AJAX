

const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "kicks the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "reports") || message.channel;

        if (message.deletable) message.delete();

        //No mention
        if (!args[0]) {
            return message.reply("Please provide a member to kick")
                .then(m => m.delete(5000));
        }

        //no reason
        if (!args[1]) {
            return message.reply("Please provide a reason to kick")
                .then(m => m.delete(5000));
        }

        //no author permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("You do not have permission to kick members. Please contact a staff member")
                .then(m => m.delete(5000));
        }

        //no bot premission
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("You do not have permission to kick members. Please contact a staff member")
                .then(m => m.delete(5000));
        }

        const toKick = message.mentions.members.first || message.guild.members.get(args[0]);

        //no member found
        if (!toKick) {
            return message.reply("Couldn't find that member, try again!")
                .then(m => m.delete(5000));
        }

        //can't kick urself
        if (message.author.id === toKick.id) {
            return message.reply("You can't kick yourself, smartboi ??")
                .then(m => m.delete(5000));
        }

        //kickable check
        if (!toKick.kickable) {
            return message.reply("I can't kick that person. Just because, I suppose. ??")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Kicked member:** ${toKick} (${toKick.id})
            **> Kicked by:** ${message.member} (${message.member.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        const prompEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 45 seconds")
            .setDescription(`Do you want to kick ${toKick}?`);

        await message.channel.send(prompEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 45, ["?", "?"]);

            if (emoji === "?") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... Something went wrong ????`);
                    });

                logChannel.send(embed);

            } else if (emoji === "?") {
                msg.delete();

                message.reply("Kick canceled...")
                    .then(m => m.delete(5000));
            }
        });
    }
}

