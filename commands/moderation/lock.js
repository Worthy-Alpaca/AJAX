
module.exports = {
    name: "lock",
    category: "moderation",
    permission: ["none", "moderator", "admin"],
    description: "Locks a voice channel",
    descriptionlong: "Locks a voice channel at the current member amount if no amount is specified. If the voice channel is not in use the lock will be removed.",
    usage: "<channel>, [amount]",
    run: async (client, message, args, api) => {

        message.delete();
        member = message.member;

        var mID;
        var mID2 = 0;
        var count = false;
        var channel;
        const mRole = args.slice(0);

        const a = mRole.pop();

        //var admin = await getAdmin(message);
        //var moderator = await getMod(message);

        if (api.admin === null) { //###########################
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (api.moderator === null) { //###########################
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id)) { //###########################
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.moderator).id)) { //###########################
                return message.reply("You are not powerful enough to do that.")
                    .then(m => m.delete({ timeout: 5000 }));
            }
        }

        parseInt(a, 10)

        if (Number.isInteger(+a)) {
            mID = a;
            count = true;
        } else {
            mRole.push(a)
        }

        if (!args[0]) {
            if (member.voice.channel) {
                channel = message.guild.channels.cache.find(channel => channel.name === member.voice.channel.name);
            } else {
                return message.reply("You need to tell me what channel to close down")
            }
        } else {
            channel = message.guild.channels.cache.find(channel => channel.name === mRole.join(" "));
        }


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