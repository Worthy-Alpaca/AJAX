//const { status } = require("../../config.json")


module.exports = {
    name: "status",
    
    description: "Changes the status of the bot",
    usage: "<input>",
    run: async (client, message, args) => {
        message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply("YOU DARE COMMAND ME, MORTAL?").then(m => m.delete(5000));

        

        const newstatus = args.slice(0).join(" ")

        client.user.setPresence({
            status: "online",
            game: {
                name: `${newstatus}`,
                type: "WATCHING"
            }
        });

        
    }
}