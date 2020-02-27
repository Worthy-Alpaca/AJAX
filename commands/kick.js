
module.exports = {
    name: 'kick',
    description: 'kick someone from the server',
    guildOnly: true,
    args: true,
    
    execute(message) {
        
            //grab the "first" mentioned user from the message
            //this will return a `User` object, just like `message.author`
            if (!message.mentions.users.size) {
                return message.reply('you need to tag a user in order to kick them!')
            }
            const taggedUser = message.mentions.users.first();

            message.channel.send(`You wanted to kick: ${taggedUser.username}`);
        
    }
}



