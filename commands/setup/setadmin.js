const { setadm } = require("../../functions/setupfunctions");

module.exports = {
    name: "setadmin",
    category: "setup",
    permission: ["admin"],
    description: "Set the admin role",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }
        
        return setadm(message, con);
        
    }
}