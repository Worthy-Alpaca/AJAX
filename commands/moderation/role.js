const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");
const { promptMessage } = require("../../functions.js");
const { getAdmin, getMod } = require("../../functions");

module.exports = {
    name: "role",
    category: "moderation",
    description: "adds/removes roles",
    usage: "<add | remove, id | mention, role(case sensitive)>",
    run: async (client, message, args, con) => {

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }
        
        if (!message.member.roles.has(message.guild.roles.find(r => r.name === admin).id)) {
            if (!message.member.roles.has(message.guild.roles.find(r => r.name === moderator).id)) {
                return message.reply("You can't do that. Please contact a staff member!")
                    .then(m => m.delete(5000));
            }
        }
        

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

        

        const mRole = args.slice(1);
        mRole.shift();
        
        

        let role = message.guild.roles.find(r => r.name === mRole.join(" ")) || message.guild.roles.find(r => r.id === args[2]);
        
        if ((args[0] === "add") || (args[0] === "remove")) {
            
        } else {
            return message.reply("You did not provide a valid action.")
                .then(m => m.delete(5000));
        }

        if (!role) {
            return message.reply(`\`${mRole}\` does not exist. Maybe check your spelling?`)
        }

        /* if ((args[0] !== "add") || (args[0] !== "remove")) {
            return message.reply("You did not provide a valid action.")
                .then(m => m.delete(5000));
        }  */

        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("I don't have permission to do that. Go fix it!!");

        

        if (args[0].toLowerCase() === "add") {
            if (rMember.roles.has(role.id)) {
                return message.channel.send(`${rMember} already has this role`)
            }
            await rMember.addRole(role.id).catch(e => console.log(e.message))
            return message.channel.send(`\`${role.name}\` has been added to ${rMember}.`)
        } else if (args[0].toLowerCase() === "remove") {
            await rMember.removeRole(role.id).catch(e => console.log(e.message))
            return message.channel.send(`\`${role.name}\` has been removed from ${rMember}.`)
        } else if ((args[0] !== "add") || (args[0] !== "remove")) {
            return message.reply("You did not provide a valid action.")
                .then(m => m.delete(5000));
        } 


    }
}