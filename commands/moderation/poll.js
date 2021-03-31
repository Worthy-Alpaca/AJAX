const { filter_integer } = require('../../functions/functions');
const Discord = require('discord.js');

module.exports = {
    name: "poll",
    category: "moderation",
    permission: ["moderator", "admin"],
    description: "Creates a poll for users to vote in",
    descriptionlong: "Creates a poll for users to vote in. Currently only yes/no questions.",
    usage: "<channel>, <Question>",
    run: async (client, message, args, api) => {
        const poll = client.polls.get(message.guild.id);
        if (poll) return message.reply(`You already have a poll going. You need to close it with \`${api.prefix}close-poll\` before creating a new one!`);
        const channel = message.mentions.channels.first();
        if (!channel) return message.reply("Please tag a channel for the poll to be posted to!");
        if (await filter_integer(message, args[0]) !== channel.id) return message.reply("Please put the channel first!");
        const description = args.slice(1).join(" ");
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('Poll')
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL())
            .setFooter('React below to cast your vote')
            .setDescription(description);
        
        channel.send(embed).then( async message => {
            const validReactions = ["✅", "❌"];
            for (const reaction of validReactions) await message.react(reaction);
            const params = {
                pollMessage: message,
                description: description,
                count_yes: 0,
                count_no: 0
            };
            client.polls.set(message.guild.id, params);
        })
        

    }
}