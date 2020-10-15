const functions = require('../../functions/functions');

module.exports = {
    name: "togglegreeting",
    category: "setup",
    permission: ["admin"],
    description: "Toggles if a greeting is sent.",
    run: async (client, message, args, api) => {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("You are not powerful enough to do that");
        }


        if (api.togglegreeting === "false") {
            const payload = JSON.stringify({
                guild: message.guild,
                field: 'togglegreeting',
                value: "true"
            })

            const success = await functions.update_API_call('setup', payload, message.guild, 'setup');

            if (success.success === true) {
                return message.reply("OK, your new members will not receive a welcome message");
            }
        } else if (api.togglegreeting === "true") {
            const payload = JSON.stringify({
                guild: message.guild,
                field: 'togglegreeting',
                value: "false"
            })

            const success = await functions.update_API_call('setup', payload, message.guild, 'setup');

            if (success.success === true) {
                return message.reply("OK, your new members will receive a welcome message");
            }
        }

    }
}