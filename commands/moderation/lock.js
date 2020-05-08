module.exports = {
    name: "lock",
    category: "moderation",
    description: "Locks a voice channel",
    usage: "<channel>, [amount]",
    run: async (client, message, args) => {
        
        message.delete();
        
        var mID;
        var mID2 = 0;
        var count = false;


        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("You are not powerfull enough to do that.")
                .then(m => m.delete(5000));
        }

        if (!args[0]) {
            return message.reply("You need to tell me what channel to close down")
        }    

        const mRole = args.slice(0);
        const a = mRole.pop()
        //console.log(mRole)
        parseInt(a, 10)
        //console.log(a)

        if (Number.isInteger(+a)) {
            mID = a;
            count = true;
            //console.log(mRole, a)
        } else {
            mRole.push(a)
            //console.log(mRole, "2")
        }

        
        const channel = message.guild.channels.find(channel => channel.name === mRole.join(" "));

        if (!channel) {
            return message.reply("That channel does not exist")
        }

        if (channel.type !== 'voice') {
            return message.reply("That is not a voice channel")
        }
        
        

        if (count) {
            //console.log(mID)
            channel.edit({
                userLimit: mID
            })
        } else {
            for (const [memberID, member] of channel.members) {
                mID2++;
              
            }
            channel.edit({
                userLimit: mID2
            })
        } 

    }
}