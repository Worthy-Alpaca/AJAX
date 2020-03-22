//const { status } = require("../../config.json")


module.exports = {
    name: "status",
    category: "moderation",
    description: "Changes the status of the bot",
    usage: "<input>",
    run: async (client, message, args) => {
        message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR"))
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