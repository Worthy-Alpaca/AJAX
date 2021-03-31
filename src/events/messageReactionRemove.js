const Discord = require('discord.js');

module.exports = client => {
    client.on('messageReactionRemove', (reaction, user) => {
        const poll = client.polls.get(reaction.message.guild.id)
        if (!poll) return;

        const pollMessage = poll.pollMessage;
        if (pollMessage.id !== reaction.message.id) return;
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('Poll')
            .setAuthor(pollMessage.member.displayName, pollMessage.member.user.displayAvatarURL())
            .setFooter('React below to cast your vote')
            .setDescription(poll.description);

        const total = reaction.message.reactions.cache.first().count + reaction.message.reactions.cache.last().count - 2;
        if (reaction.emoji.name === "✅") {
            poll.count_yes--;
        } else if (reaction.emoji.name === "❌") {
            poll.count_no--;
        } else {
            return reaction.message.reactions.resolve(reaction).users.remove(user);
        }
        let adj_yes = poll.count_yes / total * 100;
        let adj_no = poll.count_no / total * 100;
        embed.addField("Yes", bar(adj_yes, "✅"));
        embed.addField("No", bar(adj_no, "❌"));
        pollMessage.edit(embed);
    });

    function bar(percent, emoji = '') {
        const index = Math.floor(percent / 10);
        let level;
        if (Number.isInteger(+index)) {
            level = emoji.repeat(index) + "🔳".repeat(10 - index);
        } else {
            level = "🔳".repeat(10);
        }
        return level;
    }
}