const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
var { prefix } = require("../../src/config.json");
const fetch = require('node-fetch');
const { API_ADDRESS, TOKEN_SECRET} = require('../../token.json');
const jwt = require('jsonwebtoken');

module.exports = {
    name: "showservertest",
    category: "setup",
    permission: ["null"],
    description: "Shows the server setup result using the API",
    run: async (client, message, args, con) => {
        //message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("You are not powerful enough to do that");
        }

        const token = jwt.sign({ _id: message.guild.id }, TOKEN_SECRET);
        console.log(token)
        const response = await fetch(API_ADDRESS + '/discord/showserver', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({
                server_id: message.guild.id
            })
        }).then(function (response) {
            return response.json();
        })
        
        const admin = message.guild.roles.cache.find(r => r.id === response.admin);
        const moderator = message.guild.roles.cache.find(r => r.id === response.moderator);
        const welcomechannel = message.guild.channels.cache.find(c => c.id === response.channel);
        const welcomemessage = response.greeting;
        const servergreeting = response.server_greeting;
        const approvedrole = message.guild.roles.cache.find(r => r.id === response.approved);
        var startcmd = response.startcmd;
        const reportschannel = message.guild.channels.cache.find(c => c.id === response.reports);
        const bolean = response.auto_approved;
        const custom_prefix = response.prefix;

        if (custom_prefix !== null) {
            prefix = custom_prefix;
        }

        if (bolean === "true") {
            startcmd = "Members get role automatically"
        }

        const embed2 = new Discord.MessageEmbed()
            .setColor(message.member.displayHexColor === "#000000" ? "#ffffff" : message.member.displayHexColor)
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .setFooter(message.guild.name)
            .setDescription(stripIndents`**This is what you entered**`)
            .addField(`\u200b`, stripIndents`**Admin role**
            ${admin}`, true)
            .addField(`\u200b`, stripIndents`**Moderator role**
            ${moderator}`, true)
            .addField(`\u200b`, stripIndents`**Welcome channel**
            ${welcomechannel}`, true)
            .addField(`\u200b`, stripIndents`**Welcome message**
            ${welcomemessage}`)
            .addField(`\u200b`, stripIndents`**Servergreeting message**
            ${servergreeting}`)
            .addField(`\u200b`, stripIndents`**Role for approved members**
            ${approvedrole}`, true)
            .addField(`\u200b`, stripIndents`**Command for approving new members**
            \`${startcmd}\``, true)
            .addField(`\u200b`, stripIndents`**Channel for your reports**
            ${reportschannel}`, true)
            .addField(`\u200b`, stripIndents`**Your prefix**
            \`${prefix}\``, true);

        return message.channel.send(embed2).then(m => m.delete({ timeout: 120000 }));

    }
}