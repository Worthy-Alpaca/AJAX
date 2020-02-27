

module.exports = {
    name: 'avatar',
    description: 'give the avatar URL',
    aliases: ['icon', 'pfp'],
    args: true,

    execute(message) {

        if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to kick them!')
        }

        const taggedUser = message.mentions.users.first();
        
        return message.channel.send(`${taggedUser.username}'s avatar: <${message.author.displayAvatarURL}>`);
        
    }
}
