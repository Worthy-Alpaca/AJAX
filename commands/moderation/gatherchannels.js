const { gather_channels } = require('../../functions/functions.js');

module.exports = {
    name: "gatherchannels",
    category: "moderation",
    permission: ["null"],
    description: "Get all the channels from all servers",
    run: async (client, message, args, con) => {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("You are not powerful enough to do that");
        }

        return gather_channels(client, con);
        
    }
}