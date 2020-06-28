const { readdirSync } = require("fs");

const ascii = require("ascii-table");

// Create a new Ascii table
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
    var a = 0;
    // Read every commands subfolder
    readdirSync("./commands/").forEach(dir => {
        // Filter for .js command files
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
        
    
        // Loop over the commands, and add all of them to a collection
        // If there's no name found, prevent it from returning an error,
        // By using a cross in the table.
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
    
            if (pull.name && pull.category && pull.description && pull.permission) {
                client.commands.set(pull.name, pull);
                table.addRow(file, 'operational ✅');
            } else {
                table.addRow(file, `❌  -> missing a neccessary header`);
                a++;
                continue;
            }
    
            // If there's an aliases key, read the aliases.
            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    // Log the table
    console.log(table.toString());
    if (a > 0) {
        console.log(`${a} system(s) are not operational`)
    } else {
        console.log("All systems are operational")
    }
}


 
 /* 
module.exports = {
    name: "Command name",
    aliases: ["array", "of", "aliases"],
    category: "Category name",
    permission: ["none", "moderator", "admin", "null"],
    description: "Command description",
    usage: "[args input]",
    run: async (client, message, args, con) => {
        The code in here to execute
    }
}
 */
