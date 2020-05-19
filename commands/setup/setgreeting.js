module.exports = {
    name: "setgreeting",
    category: "setup",
    description: "Set the server greeting",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }

        var greeting;
                
        message.channel.send('Please enter the server greeting').then(() => {
            const filter = m => message.author.id === m.author.id;
            
        
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                .then(messages => {
                    greeting = messages.first().content
                    msg = message.channel.send(`You've entered: \`${messages.first().content}\``).then(m => m.delete(5000));
                    con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                        let sql;

                        sql = `UPDATE servers SET greeting = '${greeting}' WHERE id = '${message.guild.id}'`;
                        return con.query(sql);
                    })
                })
                .catch(() => {
                    message.channel.send('You did not provide any input!');
                })
                  
        });
        
        
        

    }
}