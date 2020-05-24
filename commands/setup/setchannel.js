module.exports = {
    name: "setchannel",
    category: "setup",
    description: "Set the greeting channel. If no channel is set I'll use the default one",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }
                        
        message.channel.send('Please enter the greeting channel (please use with a tag, e.g. #channel)').then(() => {
            const filter = m => message.author.id === m.author.id;
            
        
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                .then(messages => {
                    var chnl = Array.from(messages.first().content)

                    if (chnl.includes("#")) {
                        b = chnl.slice(2, chnl.indexOf(">"))
                        var channel = b.join("")
                    } else {
                        var channel2 = message.guild.channels.find(channel => channel.name === chnl.join(""));                        
                        var chnl2 = Array.from(channel2.id);                        
                        c = chnl2.slice(2, chnl2.indexOf(">"))                        
                        var channel = c.join("")                      
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