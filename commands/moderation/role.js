const Discord = require("discord.js");

module.exports = {
    name: "role",
    category: "moderation",
    description: "adds/removes roles",
    usage: "<add/remove, id | mention, role>",
    run: async (client, message, args) => {


        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("Please tell me what to do.")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("You need to tag someone.")
                .then(m => m.delete(5000));
        }
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);

        if (!args[2]) {
            return message.reply("You need to specify a role.")
                .then(m => m.delete(5000));
        }
        let role = message.guild.roles.find(r => r.name === args[2]) || message.guild.roles.find(r => r.id === args[2]);

        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("I don't have permission to do that. Go fix it!!");

        if (args[0].toLowerCase() === "add") {
            await rMember.addRole(role.id).catch(e => console.log(e.message))
            message.channel.send(`This role, ${role.name}, has been added to ${rMember}.`)
        } else if (args[0].toLowerCase() === "remove") {
            await rMember.removeRole(role.id).catch(e => console.log(e.message))
            message.channel.send(`This role, ${role.name}, has been removed from ${rMember}.`)
        } else if ((args[0] !== "add") || (args[0] !== "remove")) {
            return message.reply("You did not provide a valid action.")
                .then(m => m.delete(5000));
        } 


    }
}