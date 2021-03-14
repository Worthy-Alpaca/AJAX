// importing functions
const { delete_API_call } = require('../../../functions/functions');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all role deletions
*/
module.exports = client => {
    client.on('roleDelete', role => {

        const payload = JSON.stringify({
            'role': role,
            'guild': role.guild
        })

        return delete_API_call('role/delete', payload, role.guild, 'role');
    })
}