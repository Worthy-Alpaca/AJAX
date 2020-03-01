const Discord = require("discord.js");

module.exports = {
    name: "removerole",
    category: "moderation",
    description: "removes role from member",
    usage: "<id | mention>",
    run: async (client, message, args) => {

        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Sorry pal, you can't do that.");
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if (!rMember) return message.reply("Couldn't find that user.");
        let role = message.guild.roles.find(r => r.name === args[1]) || message.guild.roles.find(r => r.id === [1])
        if (!role) return message.reply("Specify a role");

        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("I don't have permission to do that. Go fix it!!");

        if (!rMember.roles.has(role.id)) {
            return message.channel.send(`${rMember.displayname}, already has this role`);
        } else {
            await rMember.removeRole(role.id).catch(e => console.log(e.message))
            message.channel.send(`This role, ${role.name}, has been removed from ${rMember}.`)
        }


    }
}