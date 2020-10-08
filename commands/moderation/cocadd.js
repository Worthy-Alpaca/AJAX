const Discord = require("discord.js");
const { post_API_call } = require("../../functions/functions.js");

module.exports = {
    name: "cocadd",
    category: "moderation",
    permission: ["admin"],
    description: "Adds a !CoC entry",
    usage: "<coc>",
    run: async (client, message, args, api) => {

        if (!args[0]) {
            return message.reply("Maybe also add something here");
        }

        const payload = JSON.stringify({
            guildID: message.guild.id,
            coc: args.join(" ")
        })

        const embed = new Discord.MessageEmbed()

        const done = await post_API_call('misc/create', payload, message.guild, 'misc/coc');

        if (done.success === true) {
            embed.setColor("GREEN").setDescription("✅ CoC was added successfully.");
            return message.channel.send(embed);
        } else if (done.success === false && done.status === 200) {
            embed.setColor("YELLOW").setDescription("❗ This CoC already exists for this server");
            return message.channel.send(embed);
        } else {
            embed.setColor("RED").setDescription(`❗ An error occured: ${done.err}`);
            return message.channel.send(embed);
        }
    }

}