const { setms } = require("../../functions/setupfunctions");

module.exports = {
    name: "setgreeting",
    category: "setup",
    description: "Set the server greeting",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }

        return setms(message, con);
        
    }
}