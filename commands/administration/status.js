const { owner } = require("../../src/config.json");

module.exports = {
    name: "status",
    category: "administration",
    permission: ["null"],
    description: "Changes the status of the bot",
    usage: "<action> <'game'>",
    run: async (client, message, args) => {
        message.delete();

        if (message.author.id !== owner) {
            return message.reply("YOU DARE COMMAND ME, MORTAL?").then(m => m.delete({ timeout: 5000 }));
        }

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
        } else if (args[0] === "streaming") {
            type = args[0]
            newstatus = args.slice(1).join(" ");
            if (args.length < 2) {
                return message.reply("Maybe add an action.")
            }
        } else if (args[0] === "listening") {
            type = args[0]
            newstatus = args.slice(1).join(" ");
            if (args.length < 2) {
                return message.reply("Maybe add an action.")
            }
        } else if ((args[0] !== "watching") || (args[0] !== "streaming") || (args[0] !== "playing") || (args[0] !== "listening")) {
            return message.reply("You need to tell me what to do. (playing | streaming | watching)");
        }

        client.user.setPresence({
            status: "online",
            activity: {
                name: `${newstatus}`,
                type: `${type.toUpperCase()}`
            }
        });


    }
}