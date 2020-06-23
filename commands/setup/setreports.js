const { setreports } = require("../../functions/setupfunctions");

module.exports = {
    name: "setreports",
    category: "setup",
    permission: ["admin"],
    description: "Set the reports channel",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }

        return setreports(message, con);

    }
}