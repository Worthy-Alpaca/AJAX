const Discord = require('discord.js');

module.exports = {
    name: "close-poll",
    category: "moderation",
    permission: ["moderator", "admin"],
    description: "Closes the currently running poll",
    usage: "<channel>, <Question>",
    run: async (client, message, args, api) => {
        const poll = client.polls.get(message.guild.id);
        if (!poll) return message.reply(`You have no poll going. You can create one with \`${api.prefix}poll\``);
        
        const pollMessage = poll.pollMessage;
        if (poll.simple) {
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle('Poll [CLOSED]')
                .setAuthor(pollMessage.member.displayName, pollMessage.member.user.displayAvatarURL())
                .setFooter('React below to cast your vote')
                .setDescription(poll.description);

            const total = pollMessage.reactions.cache.first().count + pollMessage.reactions.cache.last().count - 2;

            let adj_yes = poll.count_yes / total * 100;
            let adj_no = poll.count_no / total * 100;
            embed.addField("Yes", bar(adj_yes, "✅"));
            embed.addField("No", bar(adj_no, "❌"));

            pollMessage.edit(embed);
            pollMessage.reactions.removeAll();
            return client.polls.delete(message.guild.id);
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle('Poll [CLOSED]')
                .setAuthor(pollMessage.member.displayName, pollMessage.member.user.displayAvatarURL())
                .setFooter('React below to cast your vote')
                .setDescription(poll.description);

            let totalArr = []
            pollMessage.reactions.cache.forEach(reaction => {
                totalArr.push(reaction.count)
            })
            let total = totalArr.reduce((a, b) => a + b, 0) - poll.reactions.length;

            poll.reactions.forEach(reaction => {
                let indV;
                if (client.counts.get(reaction)) {
                    indV = client.counts.get(reaction).count;
                } else {
                    indV = 0;
                }
                let percent = indV / total * 100;
                progresBar(embed, percent, reaction);
                client.counts.delete(reaction);
            })
            pollMessage.edit(embed);
            return pollMessage.reactions.removeAll();
        }

    }
}

function bar(percent, emoji = '') {
    const index = Math.floor(percent / 10);
    const level = emoji.repeat(index) + "🔳".repeat(10 - index);
    return level;
}

function progresBar(embed, percent, emoji) {
    const index = Math.floor(percent / 10);
    let level;
    if (Number.isInteger(+index)) {
        level = emoji.repeat(index) + "🔳".repeat(10 - index);
    } else {
        level = "🔳".repeat(10);
    }
    embed.addField(emoji, level);
}