// importing functions
const { post_API_call } = require('../../../functions/functions');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all role creations
*/
module.exports = client => {
    client.on('roleCreate', role => {

        const payload = JSON.stringify({
            'role': role,
            'guild': role.guild
        })

        return post_API_call('role/create', payload, role.guild, 'role');
    })
 }