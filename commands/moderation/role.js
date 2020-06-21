const Discord  = require("discord.js");
const { getAdmin, getMod } = require("../../functions/functions.js");

module.exports = {
    name: "role",
    category: "moderation",
    permission: ["moderator", "admin"],
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
        
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== admin).id)) {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== moderator).id)) {
                return message.reply("You can't do that. Please contact a staff member!")
                    .then(m => m.delete( {timeout: 5000} ));
            }
        }
        
        if (!args[0]) {
            return message.reply("Please tell me what to do.")
                .then(m => m.delete( {timeout: 5000} ));
        }
        
        if (!args[1]) {
            return message.reply("You need to tag someone.")
                .then(m => m.delete( {timeout: 5000} ));
        }
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);

        if (!args[2]) {
            return message.reply("You need to specify a role.")
                .then(m => m.delete( {timeout: 5000} ));
        }

        
        const mRole = args.slice(1);
        mRole.shift();   
        
        let role = message.mentions.roles.first();

        if (!role) {
            role = message.guild.roles.cache.find(r => r.name === mRole.join(" ")) || message.guild.roles.cache.find(r => r.id === args[2]);
        }
        
        
        if ((args[0] === "add") || (args[0] === "remove")) {
            
        } else {
            return message.reply("You did not provide a valid action.")
                .then(m => m.delete( {timeout: 5000} ));
        }

        if (!role) {
            return message.reply(`\`${mRole}\` does not exist. Maybe check your spelling?`)
        }        

        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("I don't have permission to do that. Go fix it!!");

        

        if (args[0].toLowerCase() === "add") {
            if (rMember.roles.cache.has(role.id)) {
                return message.channel.send(`${rMember} already has this role`)
            }
            await rMember.roles.add(role.id).catch(e => console.log(e.message))
            return message.channel.send(`\`${role.name}\` has been added to ${rMember}.`)
        } else if (args[0].toLowerCase() === "remove") {
            await rMember.roles.remove(role.id).catch(e => console.log(e.message))
            return message.channel.send(`\`${role.name}\` has been removed from ${rMember}.`)
        } else if ((args[0] !== "add") || (args[0] !== "remove")) {
            return message.reply("You did not provide a valid action.")
                .then(m => m.delete( {timeout: 5000} ));
        } 


    }
}