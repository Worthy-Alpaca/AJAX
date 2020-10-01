const { owner } = require("../../src/config.json");
const { gather_channels, gather_roles } = require('../../functions/default_functions');
const { post_API_call, delete_API_call } = require('../../functions/functions');

module.exports = {
    name: "gatherstuff",
    category: "moderation",
    permission: ["null"],
    description: "Gathers all roles and channels from all servers.",
    run: async (client, message, args) => {
        if (message.author.id !== owner)
            return message.reply("You are not powerful enough to command me in such a way!").then(m => m.delete({ timeout: 5000 }));

        const payload = JSON.stringify({
            table: "channels",
            id: '0000000000000000'
        })
        const payload2 = JSON.stringify({
            table: "roles",
            id: '0000000000000000'
        })

        await delete_API_call('commands/delete', payload, payload, 'delete/table');
        await delete_API_call('commands/delete', payload2, payload2, 'delete/table');
        gather_channels(client, post_API_call);
        gather_roles(client, post_API_call);
    }
}