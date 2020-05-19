module.exports = {
    name: "setchannel",
    category: "setup",
    description: "Set the greeting channel. If no channel is set I'll use the default one",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }
                        
        message.channel.send('Please enter the greeting channel').then(() => {
            const filter = m => message.author.id === m.author.id;
            
        
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                .then(messages => {
                    var chnl = Array.from(messages.first().content)
                    console.log(chnl)
                    if (chnl.includes("#")) {
                        b = chnl.slice(2, chnl.indexOf(">"))
                        var channel = b.join("")//message.guild.channels.find(channel => channel.id === b.join(""));       
                    } else {
                        var channel = message.guild.channels.find(channel => channel.name === chnl.join(""));
                    }
                    
                    message.channel.send(`You've entered: \`${channel}\``).then(m => m.delete(5000));
                    con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                        let sql;

                        sql = `UPDATE servers SET channel = '${channel}' WHERE id = '${message.guild.id}'`;
                        return con.query(sql);
                    })
                })
                .catch(() => {
                    message.channel.send('You did not provide any input!');
                })
                  
        });
        
        
        

    }
}