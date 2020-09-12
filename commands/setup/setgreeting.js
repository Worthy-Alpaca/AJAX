const { setms } = require("../../functions/setupfunctions");

module.exports = {
    name: "setgreeting",
    category: "setup",
    permission: ["admin"],
    description: "Set the server greeting",
    run: async (client, message, args) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }

        return setms(message);
        
    }
}