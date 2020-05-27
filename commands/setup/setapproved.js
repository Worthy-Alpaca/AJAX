module.exports = {
    name: "setapproved",
    category: "setup",
    description: "Set the approved role",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }
       
        var approved;
        
        message.channel.send('Please enter the role for approved members').then(() => {
            const filter = m => message.author.id === m.author.id;
            
        
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                .then(messages => {
                    var chnl = Array.from(messages.first().content)
                    
                    if (chnl.includes("@")) {
                        b = chnl.slice(3, chnl.indexOf(">"))
                        var approved = b.join("")
                    } else {
                        var channel2 = message.guild.roles.find(r => r.name === chnl.join(""));                        
                        var approved = channel2.id;                                  
                    }
                    
                    msg = message.channel.send(`You've entered: \`${approved}\``).then(m => m.delete(5000));
                    con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                        let sql;

                        sql = `UPDATE servers SET approved = '${approved}' WHERE id = '${message.guild.id}'`;
                        return con.query(sql);
                    })
                })
                .catch(() => {
                    message.channel.send('You did not provide any input!');
                })
                  
        });
        
        
        

    }
}