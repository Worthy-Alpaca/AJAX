const { setch } = require("../../functions/setupfunctions");

module.exports = {
    name: "setchannel",
    category: "setup",
    permission: ["admin"],
    description: "Set the greeting channel. If no channel is set I'll use the default one",
    run: async (client, message, args) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }

        return setch(message);                        
        
    }
}