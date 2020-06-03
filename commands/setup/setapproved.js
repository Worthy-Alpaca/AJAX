const { setapr } = require("../../functions/setupfunctions");

module.exports = {
    name: "setapproved",
    category: "setup",
    description: "Set the approved role",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }
       
        return setapr(message, con);
        
    }
}