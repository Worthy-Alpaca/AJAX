const Discord = require("discord.js");

module.exports = {
    name: "role",
    category: "moderation",
    description: "adds/removes roles",
    usage: "<add/remove, id | mention>",
    run: async (client, message, args) => {

        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Sorry pal, you can't do that.");
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
        if (!rMember) return message.reply("Couldn't find that user.");
        let role = message.guild.roles.find(r => r.name === args[2]) || message.guild.roles.find(r => r.id === args[2]);
        if (!role) return message.reply("Specify a role");

        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("I don't have permission to do that. Go fix it!!");

        if (args[0].toLowerCase() === "add") {
            await rMember.addRole(role.id).catch(e => console.log(e.message))
            message.channel.send(`This role, ${role.name}, has been added to ${rMember}.`)
        } else if (args[0].toLowerCase() === "remove") {
            await rMember.removeRole(role.id).catch(e => console.log(e.message))
            message.channel.send(`This role, ${role.name}, has been removed from ${rMember}.`)
        } else if ((args[0] !== "add") || (args[0] !== "remove")) {
            return message.reply("You need to specify what you want me to do.")
        } 


    }
}