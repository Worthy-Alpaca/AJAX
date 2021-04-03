const Discord = require('discord.js');

module.exports = client => {
    client.on('messageReactionAdd', (reaction, user) => {
        const poll = client.polls.get(reaction.message.guild.id)
        if (!poll) return;
        if (user.bot) return;
        
        const pollMessage = poll.pollMessage;
        if (pollMessage.id !== reaction.message.id) return;

        if (!poll.reactions.includes(reaction.emoji.name)) {
            return reaction.message.reactions.resolve(reaction).users.remove(user);
        }

        if (poll.simple) {
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle('Poll')
                .setAuthor(pollMessage.member.displayName, pollMessage.member.user.displayAvatarURL())
                .setFooter('React below to cast your vote')
                .setDescription(poll.description);

            const total = reaction.message.reactions.cache.first().count + reaction.message.reactions.cache.last().count - 2;
            if (reaction.emoji.name === "✅") {
                if (pollMessage.reactions.cache.last().users.cache.find(u => u.id === user.id)) {
                    reaction.message.reactions.resolve("❌").users.remove(user);
                    //console.log(reaction.message.reactions.resolve("✅"))
                    return poll.count_yes++;
                }
                poll.count_yes++;
            } else if (reaction.emoji.name === "❌") {
                if (pollMessage.reactions.cache.first().users.cache.find(u => u.id === user.id)) {
                    reaction.message.reactions.resolve("✅").users.remove(user);
                    //console.log(reaction.message.reactions.resolve("✅"))
                    return poll.count_no++;
                }
                poll.count_no++;
            }
            let adj_yes = poll.count_yes / total * 100;
            let adj_no = poll.count_no / total * 100;
            embed.addField("Yes", bar(adj_yes, "✅"));
            embed.addField("No", bar(adj_no, "❌"));
            return pollMessage.edit(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle('Poll')
                .setAuthor(pollMessage.member.displayName, pollMessage.member.user.displayAvatarURL())
                .setFooter('React below to cast your vote')
                .setDescription(poll.description);
            
            let totalArr = []
            reaction.message.reactions.cache.forEach(reaction => {
                totalArr.push(reaction.count)
            })
            let total = totalArr.reduce((a, b) => a + b, 0) - poll.reactions.length;
            if (!client.counts.get(reaction.emoji.name)) {
                const params = {
                    count: reaction.count -1
                }
                client.counts.set(reaction.emoji.name, params)
            } else {
                client.counts.get(reaction.emoji.name).count++
            }
            poll.reactions.forEach(reaction => {
                let indV;
                if (client.counts.get(reaction)) {
                    indV = client.counts.get(reaction).count;
                } else {
                    indV = 0;
                }
                let percent = indV / total * 100;
                progresBar(embed, percent, reaction);
            })
            return pollMessage.edit(embed);
        }
    });

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
}