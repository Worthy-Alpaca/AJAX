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
        embed.addField("Yes", `${Math.floor(adj_yes)}%`);
        embed.addField("No", `${Math.floor(adj_no)}%`);

        pollMessage.edit(embed);
        pollMessage.reactions.removeAll();
        client.polls.delete(message.guild.id);

    }
}