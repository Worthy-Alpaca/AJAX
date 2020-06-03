const { setmd } = require("../../functions/setupfunctions");

module.exports = {
    name: "setmod",
    category: "setup",
    description: "Set the moderator role",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }

        return setmd(message, con);

    }
}