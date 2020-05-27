const { getadm } = require("../../functions/setupfunctions");

module.exports = {
    name: "setadmin",
    category: "setup",
    description: "Set the admin role",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }
       
        var admin;
        return getadm(message, con);
        
    }
}