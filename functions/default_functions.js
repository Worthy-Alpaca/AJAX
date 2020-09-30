const client = require('../src/client');
const { owner } = require('../src/config.json');
const Discord = require('discord.js');
const jwt = require('jsonwebtoken');

module.exports = {
    error_handler: function (error) {
        
        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle('An Error Occured')
            .setDescription(error.code)
            .addField(`\u200b`, `**Type:** ${error.type}
            **Message:** ${error.message}`);
       
        client.users.fetch(owner, false).then(user => {
            return user.send(embed);
        });
    }, 

    sign_token: function (id) {
        return jwt.sign({ _id: id }, process.env.TOKEN_SECRET);
    },

    gather_channels: function (client, post_API_call) {
        client.guilds.cache.forEach(server => {
            server.channels.cache.forEach(channel => {

                if (channel.type === 'dm') {
                    return;
                }

                const payload = JSON.stringify({
                    'channel': channel,
                    'guild': channel.guild
                })

                return post_API_call('channel/create', payload, channel.guild, 'channel');
            })
        })
    },

    gather_roles: function (client, post_API_call) {
        client.guilds.cache.forEach(server => {
            server.roles.cache.forEach(role => {
                const payload = JSON.stringify({
                    'role': role,
                    'guild': role.guild
                })

                return post_API_call('role/create', payload, role.guild, 'role'); 
                
            })
        })
    },
}