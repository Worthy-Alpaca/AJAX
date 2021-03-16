// importing functions
const { update_API_call } = require('../../../functions/functions');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all guild updates
*/
module.exports = client => {
    client.on('guildUpdate', (oldGuild, newGuild) => {
        if (oldGuild.name === newGuild.name) {
            return;
        }

        const payload = JSON.stringify({
            guild: newGuild,
            field: 'name',
            value: newGuild.name
        })

        return update_API_call('setup', payload, newGuild, 'setup');
    })
}