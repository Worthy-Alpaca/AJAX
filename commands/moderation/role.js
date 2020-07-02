const Discord = require("discord.js");
const { getAdmin, getMod } = require("../../functions/db_queries.js");

module.exports = {
    name: "role",
    category: "moderation",
    permission: ["moderator", "admin"],
    description: "adds/removes role to all mentioned members",
    descriptionlong: "adds/removes role to all mentioned members depending wether they already have the role",
    usage: "<role> <member> [member] etc.",
    run: async (client, message, args, con) => {

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === admin).id)) {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === moderator).id)) {
                return message.reply("You can't do that. Please contact a staff member!")
                    .then(m => m.delete({ timeout: 5000 }));
            }
        }

        if (!args[1]) {
            return message.reply("You need to tag someone.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        let role = message.mentions.roles.first();

        if (!role) {
            return message.reply("You did not mention a role for me to add")
        }
        //check if role is one of the staff roles
        if (role.id === message.guild.roles.cache.find(r => r.id === admin).id || role.id === message.guild.roles.cache.find(r => r.id === moderator).id) {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === admin).id)) {
                return message.reply("You can't do that. Please contact an admin!")
                    .then(m => m.delete({ timeout: 5000 }));    
            }
        }

        const toadd_collection = args.slice(1)
        //loop over all members mentioned and add/remove the role mentioned
        toadd_collection.forEach(function (person) {
            var chnl = Array.from(person)

            if (chnl.includes("@")) {
                b = chnl.slice(3, chnl.indexOf(">"))
                var mbr = b.join("")
            } else {
                var mbr2 = message.guild.roles.cache.find(r => r.name === chnl.join(""));
                var mbr = mbr2.id;
            }

            const toadd = message.guild.members.cache.find(m => m.id === mbr);

            if (!toadd) {
                return message.reply(`Couldn't find ${toadd}. Try again`)
                    .then(m => m.delete({ timeout: 5000 }));
            }

            if (toadd.roles.cache.has(role.id)) {
                toadd.roles.remove(role.id).catch(e => console.log(e.message))
                return message.channel.send(`\`${role.name}\` has been removed from ${toadd}.`)
            } else {
                toadd.roles.add(role.id).catch(e => console.log(e.message))
                return message.channel.send(`\`${role.name}\` has been added to ${toadd}.`)
            }
        })
    }
}