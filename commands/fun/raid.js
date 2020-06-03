const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage, getMember } = require("../../functions/functions.js");
const { raid_channel, unfit_raid } = require("../../src/config.json");

module.exports = {
    name: "raid",
    category: "fun",
    description: "Enables you to take part in the raid",
    usage: "<id | mention>",
    run: async (client, message, args, con) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === `${raid_channel}`) || message.channel;

        if (message.deletable) message.delete();

        let unraid = (message.member.roles.cache.find(p => p.name === `${unfit_raid}`)) 
        
        const toKick = message.author;
        let role = message.guild.roles.cache.find(r => r.name === "raid");
        let { cache } = message.guild.roles;
        if (!role) return message.reply("This role doesn't exist. Maybe add it??");

        
        if (unraid) {
            return message.reply("You are unfit for the raid. If you think that is wrong, please contact a staff member nearest to you.")
        }


        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(stripIndents`${toKick} is ready for the raid`);

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to join the raid?`)

        await message.channel.send(promptEmbed).then(async msg => {
                // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✔", "❌"]);    

                // The verification stuffs
            if (emoji === "✔") {
                msg.delete();                
                message.member.roles.add(role.id).catch(e => console.log(e.message))
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
