//const { admin } = require("../../config.json")
const { getAdmin, getMod } = require("../../functions");


module.exports = {
    name: "status",
    category: "moderation",
    description: "Changes the status of the bot",
    usage: "<action> <'game'>",
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
        
        if (!message.member.roles.has(message.guild.roles.find(r => r.id=== admin).id))
            return message.reply("YOU DARE COMMAND ME, MORTAL?").then(m => m.delete(5000));
       

        let newstatus;
        let type;

        if (args.length < 1) {
            return message.reply("Nothing for me to do?");
        }
    
        if (args[0] === "watching") {
            type = args[0]
            newstatus = args.slice(1).join(" ");
            if (args.length < 2) {
                return message.reply("Maybe add an action.")
            }
        } else if (args[0] === "playing") {
            type = args[0]
            newstatus = args.slice(1).join(" ");
            if (args.length < 2) {
                return message.reply("Maybe add an action.")
            }
        } else if (args [0] === "streaming") {
            type = args[0]
            newstatus = args.slice(1).join(" ");
            if (args.length < 2) {
                return message.reply("Maybe add an action.")
            }
        }  else if ((args[0] !== "watching") || (args[0] !== "streaming") || (args[0] !== "playing")) {
            return message.reply("You need to tell me what to do. (playing | streaming | watching)");
        }

        client.user.setPresence({
            status: "online",
            game: {
                name: `${newstatus}`,
                type: `${type}`
            }
        });

        
    }
}