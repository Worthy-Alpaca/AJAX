
module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 20,

    execute(message) {
        message.channel.send('Pong.')
    }
}


