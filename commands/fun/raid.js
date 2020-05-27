const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage, getMember } = require("../../functions/functions.js");
const { raid_channel, unfit_raid } = require("../../src/config.json");

module.exports = {
    name: "raid",
    category: "fun",
    description: "Enables you to take part in the raid",
    usage: "<id | mention>",
    run: async (client, message, args, con) => {
        const logChannel = message.guild.channels.find(c => c.name === `${raid_channel}`) || message.channel;

        if (message.deletable) message.delete();

        let unraid = (message.member.roles.find(p => p.name === `${unfit_raid}`)) 
        
        const toKick = getMember(message, args.join(" "));
        let role = message.guild.roles.find(r => r.name === "raid")
        if (!role) return message.reply("This role doesn't exist. Maybe add it??");

        
        if (unraid) {
            return message.reply("You are unfit for the raid. If you think that is wrong, please contact a staff member nearest to you.")
        }


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
