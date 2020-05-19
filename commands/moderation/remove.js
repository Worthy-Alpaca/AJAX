const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");
const { getAdmin, getMod } = require("../../functions");

module.exports = {
    name: "remove",
    category: "moderation",
    description: "removes the member",
    usage: "<kick | ban, id | mention, reason>",
    run: async (client, message, args, con) => {
        const logChannel = message.guild.channels.find(c => c.name === "reports") || message.channel;

        if (message.deletable) message.delete();

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        //no functions mentioned
        if (!args[0]) {
            return message.reply("Please tell me what to do.")
                .then(m => m.delete(5000));
        }

        // No args
        if (!args[1]) {
            return message.reply("Please provide a person to kick/ban.")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[2]) {
            return message.reply("Please provide a reason to kick/ban.")
                .then(m => m.delete(5000));
        }

   

        
        

        const toKick = message.mentions.members.first() || message.guild.members.get(args[1]);

        // No member found
        if (!toKick) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete(5000));
        }

        // Can't kick urself
        if (toKick.id === message.author.id) {
            return message.reply("You can't do that to yourself smartboi :rofl:")
                .then(m => m.delete(5000));
        }

        // Check if the user's kickable
        if (!toKick.kickable) {
            return message.reply("I can't kick that person due to role hierarchy, I suppose.")
                .then(m => m.delete(5000));
        }
                
        if (args[0].toLowerCase() === "kick") {

            // No author permissions
            if (!message.member.roles.has(message.guild.roles.find(r => r.name === admin).id)) {
                if (!message.member.roles.has(message.guild.roles.find(r => r.name === moderator).id)) {
                    return message.reply("❌ You do not have permissions to kick members. Please contact a staff member")
                        .then(m => m.delete(5000));
                }
            }
            

            //no bot permission
            if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
                return message.reply("❌ I do not have permissions to kick members. Please contact a staff member")
                    .then(m => m.delete(5000));
            }

            const embed = new RichEmbed()
                .setColor("#ff0000")
                .setThumbnail(toKick.user.displayAvatarURL)
                .setFooter(message.member.displayName, message.author.displayAvatarURL)
                .setTimestamp()
                .setDescription(stripIndents`**- Kicked member:** ${toKick} (${toKick.id})
            **- Kicked by:** ${message.member} (${message.member.id})
            **- Reason:** ${args.slice(2).join(" ")}`);

            const promptEmbed = new RichEmbed()
                .setColor("GREEN")
                .setAuthor(`This verification becomes invalid after 30s.`)
                .setDescription(`Do you want to kick ${toKick}?`)

            // Send the message
            await message.channel.send(promptEmbed).then(async msg => {
                // Await the reactions and the reaction collector
                const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

                // The verification stuffs
                if (emoji === "✅") {
                    msg.delete();

                    toKick.kick(args.slice(1).join(" "))
                        .catch(err => {
                            if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`)
                        });

                    logChannel.send(embed);
                } else if (emoji === "❌") {
                    msg.delete();

                    message.reply(`Kick canceled.`)
                        .then(m => m.delete(5000));
                }
            });
        } else if (args[0].toLowerCase() === "ban") {

            // No author permissions
            if (!message.member.roles.has(message.guild.roles.find(r => r.name === admin).id)) {
                return message.reply("❌ You do not have permissions to ban members. Please contact a staff member")
                    .then(m => m.delete(5000));
            }

            //no bot permissions
            if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
                return message.reply("❌ I do not have permissions to ban members. Please contact a staff member")
                    .then(m => m.delete(5000));
            }

            const embed = new RichEmbed()
                .setColor("#ff0000")
                .setThumbnail(toKick.user.displayAvatarURL)
                .setFooter(message.member.displayName, message.author.displayAvatarURL)
                .setTimestamp()
                .setDescription(stripIndents`**> baned member:** ${toKick} (${toKick.id})
            **> baned by:** ${message.member} (${message.member.id})
            **> Reason:** ${args.slice(2).join(" ")}`);

            const promptEmbed = new RichEmbed()
                .setColor("GREEN")
                .setAuthor(`This verification becomes invalid after 30s.`)
                .setDescription(`Do you want to ban ${toKick}?`)

            // Send the message
            await message.channel.send(promptEmbed).then(async msg => {
                // Await the reactions and the reactioncollector
                const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

                // Verification stuffs
                if (emoji === "✅") {
                    msg.delete();

                    toBan.ban(args.slice(1).join(" "))
                        .catch(err => {
                            if (err) return message.channel.send(`Well.... the ban didn't work out. Here's the error ${err}`)
                        });

                    logChannel.send(embed);
                } else if (emoji === "❌") {
                    msg.delete();

                    message.reply(`ban canceled.`)
                        .then(m => m.delete(5000));
                }
            });
        } else if ((args[0].toLowerCase() !== "kick") || (args[0].toLowerCase() !== "ban")) {
            return message.reply("You did not provide a valid action.")
        } 
    }
};
