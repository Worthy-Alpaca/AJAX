const { setautomatic_approved } = require("../../functions/setupfunctions");

module.exports = {
    name: "setautoapproved",
    category: "setup",
    permission: ["admin"],
    description: "Set wether new members get role automatically",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }

        return setautomatic_approved(message, con);

    }
}