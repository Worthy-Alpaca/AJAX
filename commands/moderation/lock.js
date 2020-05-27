const { admin } = require("../../config.json");

module.exports = {
    name: "lock",
    category: "moderation",
    description: "Locks a voice channel",
    usage: "<channel>, [amount]",
    run: async (client, message, args, con) => {
        
        message.delete();
        
        var mID;
        var mID2 = 0;
        var count = false;      

        if (!args[0]) {
            return message.reply("You need to tell me what channel to close down")
        }    

        const mRole = args.slice(0);
        const a = mRole.pop()
        
        parseInt(a, 10)
        
        if (Number.isInteger(+a)) {
            mID = a;
            count = true;            
        } else {
            mRole.push(a)            
        }
        
        const channel = message.guild.channels.find(channel => channel.name === mRole.join(" "));

        if (!channel) {
            return message.reply("That channel does not exist")
        }

        if (channel.type !== 'voice') {
            return message.reply("That is not a voice channel")
        }               

        if (count) {            
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