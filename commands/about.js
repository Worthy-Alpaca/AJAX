// JavaScript source code
module.exports = {
    name: 'about',
    description: 'give information about the bot',
    execute(message, args) {
        message.channel.send(`This bot is still in it's pre - alpha phase.Please report bugs or ideas to Worthy Alpaca`)
    }
}