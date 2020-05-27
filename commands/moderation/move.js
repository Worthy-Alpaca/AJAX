const { getAdmin, getMod } = require("../../functions/functions.js");

module.exports = {
    name: "move",
    category: "moderation",
    description: "Moves all members from one channel to the other",
    usage: "<channel1 -> channel2>",
    run: async (client, message, args, con) => {
        message.delete();

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        if (!message.member.roles.has(message.guild.roles.find(r => r.id=== admin).id)) {
            if (!message.member.roles.has(message.guild.roles.find(r => r.id=== moderator).id)) {
                return message.reply("You are not powerfull enough to do that.")
                    .then(m => m.delete(5000));
            }
        }        

        if (!args[0]) {
            return message.reply("You need to tell me what channel to close down")
        }          
        
        if (!args.includes("->")) {
            return message.reply("You need to use the correct syntax please. Example: !move channel1 -> channel2")
        }        

        const arr = args.slice(0);

        var a = arr.indexOf("->")
        var channel1a = args.slice(0, a)
        var channel2a = args.slice(a)
        channel2a.shift();       
        
        const channel1 = message.guild.channels.find(channel => channel.name === channel1a.join(" "));
        const channel2 = message.guild.channels.find(channel => channel.name === channel2a.join(" "));
        
        if (!channel1) {
            return message.reply(`\`${channel1a.join(" ")}\` does not exist`)
        }
        if (!channel2) {
            return message.reply(`\`${channel2a.join(" ")}\` does not exist`)
        }

        if (channel1.type !== 'voice') {
            return message.reply(`\`${channel1a.join(" ")}\` is not a voice channel`)
        } 
        if (channel2.type !== 'voice') {
            return message.reply(`\`${channel2a.join(" ")}\` is not a voice channel`)
        }                

        for (const [memberID, member] of channel1.members) {
            member.setVoiceChannel(channel2)
              .catch(console.error);
        }


    }
}