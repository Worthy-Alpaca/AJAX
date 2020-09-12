const Discord = require("discord.js");
const { delete_API_call } = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "delreddit",
    category: "fun",
    permission: ["moderator", "admin"],
    description: "Deletes a subreddit from the database.",
    usage: "<reddit>",
    run: async (client, message, args, api) => {
        if (args < 1) {
            return message.reply("If you give me some thing to work with, I might be able to help you :wink:").then(m => m.delete({ timeout: 5000 }));
        }
        /* var admin = await getAdmin(message);
        var moderator = await getMod(message); */
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id)) { //###########################
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.moderator).id)) { //###########################
                return message.reply("You don't have the required permissions to do this.").then(m => m.delete({ timeout: 5000 }));
            }
        }
        var reddit = args[0];
        if (reddit.startsWith("r/") || reddit.startsWith("https://reddit.com/r/")) {
            a = reddit.split("r/");
            reddit = a[1];
        } 

        const embed = new Discord.MessageEmbed()

        const payload = JSON.stringify({
            guild: message.guild,
            value: reddit
        })

        const done = await delete_API_call('misc/delete', payload, message.guild, 'misc/reddit');

        if (done.success === true) {
            embed.setColor("GREEN").setDescription("✅ Subreddit was deleted successfully.");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        } else if (done.success === false && done.status === 200) {
            embed.setColor("YELLOW").setDescription("❗ This subreddit doesn't exist in my database");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        } else {
            embed.setColor("RED").setDescription(`❗ An error occured: ${done.err}`);
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        }
    }
}