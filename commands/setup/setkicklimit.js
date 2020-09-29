const { setkicklimit } = require("../../functions/setupfunctions");

module.exports = {
    name: "setkicklimit",
    category: "setup",
    permission: ["admin"],
    description: "Set the admin role",
    run: async (client, message, args) => {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("You are not powerful enough to do that");
        }

        return setkicklimit(message);

    }
}