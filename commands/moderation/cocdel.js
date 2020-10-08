const Discord = require("discord.js");
const { delete_API_call } = require("../../functions/functions.js");

module.exports = {
    name: "cocdel",
    category: "moderation",
    permission: ["admin"],
    description: "Deletes a !CoC entry. Use the ID tag to identify",
    usage: "<id>",
    run: async (client, message, args, api) => {

        if (!args[0]) {
            return message.reply("You need to give me a CoC-ID");
        }

        const payload = JSON.stringify({
            guildID: message.guild.id,
            id: args[0],
            coc: args.slice(1).join(" ")
        })

        const embed = new Discord.MessageEmbed()

        const done = await delete_API_call('misc/delete', payload, message.guild, 'misc/coc');

        if (done.success === true) {
            embed.setColor("GREEN").setDescription("✅ CoC was deleted successfully.");
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