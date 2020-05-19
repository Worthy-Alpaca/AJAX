module.exports = {
    name: "setmod",
    category: "setup",
    description: "Set the moderator role",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }

        var moderator;
                
        message.channel.send('Please enter the moderator role').then(() => {
            const filter = m => message.author.id === m.author.id;
            
        
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                .then(messages => {
                    moderator = messages.first().content
                    msg = message.channel.send(`You've entered: \`${messages.first().content}\``).then(m => m.delete(5000));
                    con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                        let sql;

                        sql = `UPDATE servers SET moderator = '${moderator}' WHERE id = '${message.guild.id}'`;
                        return con.query(sql);
                    })
                })
                .catch(() => {
                    message.channel.send('You did not provide any input!');
                })
                  
        });
        
        
        

    }
}