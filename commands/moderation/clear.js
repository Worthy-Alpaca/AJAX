const { getAdmin, getMod } = require("../../functions/db_queries.js");

module.exports = {
    name: "clear",
    category: "moderation",
    permission: ["moderator", "admin"],
    description: "Clears the chat",
    run: async (client, message, args, api) => {
        if (message.deletable) {
            message.delete();
        }

        if (api.admin === null) {  //###########################
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (api.moderator === null) { //###########################
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        // Check if args[0] is a number
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Yeah.... That's not a number? I also can't delete 0 messages by the way.");
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("I can't manage messages. Maybe go fix that?");
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`I deleted \`${deleted.size}\` messages.`)).then(m => m.delete({ timeout: 5000 }))
            .catch(err => message.reply(`Something went wrong... ${err}`));
    }
}
