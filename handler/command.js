const { readdirSync } = require("fs");

const ascii = require("ascii-table");

//Import API calls
const { post_API_call, delete_API_call } = require('../functions/functions');

// Create a new Ascii table
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = async (client) => {
    var a = 0;
    const payload = JSON.stringify({
        table: "commands",
        id: '0000000000000000'
    })
    
    await delete_API_call('commands/delete', payload, payload, 'delete/table');
    // Read every commands subfolder
    readdirSync("./commands/").forEach(dir => {
        // Filter for .js command files
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));        
    
        // Loop over the commands, and add all of them to a collection
        // If there's no name found, prevent it from returning an error        
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
    
            if (pull.name && pull.category && pull.description && pull.permission) {

                const payload = JSON.stringify({
                    'command': pull
                })

                const guild = {
                    id: '111111111'
                }
                post_API_call('commands/create', payload, guild, 'command/create');
                client.commands.set(pull.name, pull);
                table.addRow(file, 'operational ✅');
            } else {
                // mandatory headers are: name, category, description, permission
                table.addRow(file, `❌  -> missing a mandatory header`);
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
    run: async (client, message, args) => {
        The code in here to execute
    }
}
 */
