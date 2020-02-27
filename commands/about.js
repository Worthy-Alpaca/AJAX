// JavaScript source code
module.exports = {
    name: 'about',
    description: 'give information about the bot',
    args: true,

    execute(message, args) {
        if (args[0] === 'bot') {
            return message.channel.send(`This bot is still in it's pre-alpha phase. Please report bugs or ideas to Worthy Alpaca`)
        } else if (args[0] === 'test') {
            return message.channel.send(`This works fine`);
        }
        
    }
}