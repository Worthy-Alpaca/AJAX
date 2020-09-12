const { setcmd } = require("../../functions/setupfunctions");

module.exports = {
    name: "setstartcmd",
    category: "setup",
    permission: ["admin"],
    description: "Set the approving command",
    run: async (client, message, args) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }

        return setcmd(message);
    }
}