const Discord  = require("discord.js");
const { getrank, getAdmin, setrank, delrank } = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");



module.exports = {
    name: "rank",
    category: "info",
    description: "Applies the given rank", 
    usage: "<rank>",   

    run: async (client, message, args, con) => {

        if (args < 1) {
            return message.reply("If you give me some thing to work with, I might be able to help you :wink:")
        }

        if (args[0] === "add") {
            var admin = await getAdmin(message, con);
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== admin).id)) {
                return message.reply("You don't have the required permissions to do this.").then(m => m.delete( {timeout: 5000} ));
            }
            rank = message.guild.roles.cache.find(r => r.name === args.slice(1).join(" "))
            if (!rank) {
                return message.reply("This rank doesn't exist").then(m => m.delete( {timeout: 5000} ));
            }
            
            const done = await setrank(message, rank, con);

            if (done) {
                return message.reply("Rank was added successfully").then(m => m.delete( {timeout: 5000} ));
            } else {
                return message.reply("Rank already exists for this server").then(m => m.delete( {timeout: 5000} ));
            }

        } else if (args[0] === "del") {
            var admin = await getAdmin(message, con);
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== admin).id)) {
                return message.reply("You don't have the required permissions to do this.").then(m => m.delete( {timeout: 5000} ));
            }
            rank = message.guild.roles.cache.find(r => r.name === args.slice(1).join(" "))
            if (!rank) {
                return message.reply("This rank doesn't exist").then(m => m.delete( {timeout: 5000} ));
            }

            const done = await delrank(message, rank, con)

            if (done) {
                return message.reply("Rank was deleted successfully").then(m => m.delete( {timeout: 5000} ));
            } else {
                return message.reply("This rank doesn't exist in my database").then(m => m.delete( {timeout: 5000} ));
            }
        } else {
            rank = message.guild.roles.cache.find(r => r.name === args.slice(0).join(" "))
            if (!rank) {
                return message.reply("This rank doesn't exist").then(m => m.delete( {timeout: 5000} ));
            }

            const ranktoadd = await getrank(message, rank, con);
            if (ranktoadd) {
                if (message.member.roles.cache.has(rank.id)) {
                    message.member.roles.remove(rank.id).catch(e => console.log(e.message))
                    message.reply(`\`${rank.name}\` has been taken from you.`)
                } else {
                    message.member.roles.add(rank.id).catch(e => console.log(e.message))
                    message.reply(`\`${rank.name}\` has been added to you.`)
                }
                
            }
        }

        
                 
    }
    
}