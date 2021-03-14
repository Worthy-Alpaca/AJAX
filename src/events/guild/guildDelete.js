// importing functions
const { delete_API_call } = require('../../../functions/functions');
// importing config variable
const { owner } = require('../../config.json');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all guild deletions
*/
module.exports = client => {
    client.on("guildDelete", async guild => {
        client.users.fetch(owner, false).then(user => {
            user.send(`I was kicked from ${guild.name}, ${guild.id}`)
        });

        const payload = JSON.stringify({
            'guild': guild
        })

        const success = await delete_API_call('deleteserver', payload, guild, 'guild');

        if (success.success === false) {
            client.users.fetch(owner, false).then(user => {
                user.send(success.err);
            });
        } else {
            client.users.fetch(owner, false).then(user => {
                user.send(`Successfully deleted from database`);
            });
        }
    })
}