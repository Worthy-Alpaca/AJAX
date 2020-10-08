const Discord = require("discord.js");
const { update_API_call } = require("../../functions/functions.js");

module.exports = {
    name: "cocedit",
    category: "moderation",
    permission: ["admin"],
    description: "Edits a !CoC entry. Use the ID tag to identify",
    usage: "<id> <entry>",
    run: async (client, message, args, api) => {

        if (!args[0]) {
            return message.reply("You need to give me a CoC-ID");
        }

        if (!args[1]) {
            return message.reply("You need to give me something to replace the current CoC with");
        }

        const payload = JSON.stringify({
            guildID: message.guild.id,
            id: args[0],
            coc: args.slice(1).join(" ")
        })

        const embed = new Discord.MessageEmbed()

        const done = await update_API_call('misc/update', payload, message.guild, 'misc/coc');

        if (done.success === true) {
            embed.setColor("GREEN").setDescription("✅ CoC was update successfully.");
            return message.channel.send(embed);
        } else if (done.success === false && done.status === 200) {
            embed.setColor("YELLOW").setDescription("❗ This CoC ID doesn't exist for this server");
            return message.channel.send(embed);
        } else {
            embed.setColor("RED").setDescription(`❗ An error occured: ${done.err}`);
            return message.channel.send(embed);
        }
    }

}