const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage, getMember } = require("../../functions.js");
const { raid_channel } = require("../../config.json");

module.exports = {
    name: "raid",
    category: "interaction",
    description: "Adds the raid role",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === `${raid_channel}`) || message.channel;

        if (message.deletable) message.delete();

       

        const toKick = getMember(message, args.join(" "));
        let role = message.guild.roles.find(r => r.name === "raid")
        if (!role) return message.reply("This role doesn't exist. Maybe add it??");

        

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`${toKick} is ready for the raid`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to join the raid?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✔", "❌"]);

            // The verification stuffs
            if (emoji === "✔") {
                msg.delete();
                await toKick.addRole(role.id).catch(e => console.log(e.message))
                message.channel.send(`Welcome to the big boy league :grin:`)
                
                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Not ready yet? Maybe next time.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
