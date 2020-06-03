const { setcmd } = require("../../functions/setupfunctions");

module.exports = {
    name: "setstartcmd",
    category: "setup",
    description: "Set the approving command",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }

        return setcmd(message, con);
    }
}