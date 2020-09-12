const { setapr } = require("../../functions/setupfunctions");

module.exports = {
    name: "setapproved",
    category: "setup",
    permission: ["admin"],
    description: "Set the approved role",
    run: async (client, message, args) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }
       
        return setapr(message);
        
    }
}