


module.exports = {
    name: "elite",
    category: "fun",
    description: "Don't use me. I'm not done.",
    usage: "don't use me yet!",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        return message.reply("At this point I don't do anything. Come back at a later time :) ");
    }
   }