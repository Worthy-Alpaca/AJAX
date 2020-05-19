module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.get(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target) 
            target = message.member;
            
        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    promptMessage: async function (message, author, time, validReactions, member) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await message.react(reaction);

        // Only allow reactions from the author, 
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    getAdmin: function(message, con) {
        var admininstrator;  
        
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                admininstrator = rows[0].admin;
                resolve(admininstrator);              
            }); 
        });            
    },
    
    getMod: function(message, con) {
        var moderator;  
        
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                moderator = rows[0].moderator;
                resolve(moderator);              
            }); 
        });            
    },
    
    getChnl: function(member, con) {
        var channel;  
        
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
                channel = rows[0].channel;
                resolve(channel);              
            }); 
        }); 
    },

    getMsg: function(member, con) {
        var msg;

        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
                msg = rows[0].message;
                resolve(msg);
            });
        });
    }

    
};