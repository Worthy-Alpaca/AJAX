const { Client, RichEmbed, Collection } = require("discord.js");
const { prefix, version, status, welcome_channel, DIFF, LIMIT, TIME, database } = require('./config.json');
const { token, password } = require('../token.json');
const fs = require("fs");
const Discord = require("discord.js")
const { stripIndents } = require("common-tags");
const { promptMessage, getChnl, getMsg, getapproved, getapproved2, getMember, getstartcmd, getreportschannel } = require("../functions/functions.js");
const { answers, replies, asks, help, positive, sassy, robot } = require("./answers.json");
const usersMap = new Map();
const mysql = require("mysql");


const client = new Client({
    disableEveryone: false
});

client.reply = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");





["command"].forEach(handler => {
    require(`../handler/${handler}`)(client);
});

//creating the database connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
  database: database,
  encoding: "utf8mb4_unicode_ci"
});

con.connect(err => {
  if(err) throw err;
  console.log("Connected to Database");
  con.query("CREATE TABLE IF NOT EXISTS servers(id VARCHAR(20) NOT NULL UNIQUE, name TEXT NOT NULL, admin TEXT, moderator TEXT, greeting VARCHAR(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci, channel TEXT, approved TEXT, startcmd TEXT, reports TEXT) CHARACTER SET utf8 COLLATE utf8_unicode_ci;") 
  con.query("CREATE TABLE IF NOT EXISTS ranks(rank_id VARCHAR(20) NOT NULL UNIQUE, id VARCHAR(20) NOT NULL, rank_name TEXT NOT NULL);") 
})

client.on("ready", () => {
    var a = 0;
    console.log(`Logged in as ${client.user.username}`);
    
    client.guilds.cache.forEach(guild => {
      
      con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {
        if(err) throw err;
        let sql;
               
        if (!rows.length) {
          console.log(guild.name, "added")
          sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
          return con.query(sql);
        }

        if(rows[0].id === guild.id) {
          a++;
          return;
        } else {
          console.log("b")
          sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
          con.query(sql);
        }
                
      });
    })

    if(a > 0) console.log("No new servers")

    client.user.setPresence({
        status: "online",
        activity: {
            name: `${status}`,
            type: "LISTENING"
        }
    });
});

//on joining a new server
client.on("guildCreate", guild => {

  client.users.fetch(`595341356432621573`, false).then(user => {
    user.send(`I was added to a new server: ${guild.name}, ${guild.id}`)
  });

  channel = guild.channels.cache.find(channel => channel.id === guild.systemChannelID);

  //checking for systemmessage channel
  if (!channel) {
    guild.members.cache.forEach(member => {
      if (member.hasPermission("ADMINISTRATOR")) {
        client.users.fetch(member.id, false).then(user => {
          user.send(`Hi there, I'm ${client.user.username}. You can run !setserver to set everything up. See !help for all of my commands. Enjoy :grin:`)
        })
      }
    })
  } else {
    channel.send(`Hi there, I'm ${client.user.username}. You can run !setserver to set everything up. See !help for all of my commands. Enjoy :grin:`);
  }

  
  con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {
    if(err) throw err;
    let sql;
    let db;                  
      
    if (!rows.length) {
        console.log(guild.name, "added")
        sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
        return con.query(sql);
    }

    if(rows[0].id === guild.id) {                  
      db = true;
      
      return;
    } else {
      console.log("b")
      sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
      db = true;
      
      con.query(sql);
    }                          
            
  });
})


//welcome message
client.on("guildMemberAdd", async member => {
    var channel;
    var greeting;  
    
    if (member.bot) return; 
    
    //getting welcome channel/message
    chnl = await getChnl(member, con);
    greeting = await getMsg(member, con);
    rl = await getapproved(member, con);

    const role = member.guild.roles.cache.find(r => r.id === rl)
        
    var channel = member.guild.channels.cache.find(channel => channel.id === chnl);     
    
    if (typeof greeting == 'undefined') {
      greeting = "Welcome to this generic server. The owner has not bothered with a custom welcome message so you get this one. :person_shrugging:"
    } else if (greeting === null) {
      greeting = "Welcome to this generic server. The owner has not bothered with a custom welcome message so you get this one. :person_shrugging:"
    }

    if (typeof channel == 'undefined') {
      channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
    } else if (channel === null) {
      channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
    }
    
    const embed = new Discord.MessageEmbed() 
        .setColor("RANDOM")
        .setTimestamp()
        .setAuthor(`Hooray, ${member.displayName} just joined our merry band of misfits`, member.user.displayAvatarURL())
        
    
    client.users.fetch(member.id, false).then(user => {
      user.send(`Welcome to **${member.guild.name}**. ${greeting}`)
    })
    
    return channel.send(embed);
        
});



//message handler
client.on("message", async message => {

    

    if (message.author.bot) return;
    
    
    //automated spam detection and mute
    if(usersMap.has(message.author.id)) {
        let mutee = message.member;
        const reports = await getreportschannel(message, con);
        const report = message.guild.channels.cache.find(channel => channel.id === reports);
        const userData = usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let muterole = message.guild.roles.cache.find(r => r.name === "Muted")

        const embed = new Discord.MessageEmbed() 
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Muted member", mutee.user.displayAvatarURL())
            .setDescription(stripIndents`**> Member: ${mutee} (${mutee.id})
            **> Automated Mute
            **> Muted in: ${message.channel}
            **> Reason: SPAM
            MUTE needs to be manually removed`);

        

        if(!muterole) {
            try{
                muterole = await message.guild.roles.create({
                    data: {
                      name: "Muted",
                      color: "#514f48",
                      permissions: []
                    }
                })
            message.guild.channels.cache.forEach(async (channel, id) => {              
                await channel.overwritePermissions([
                  {
                    id: muterole.id,
                    deny: ['SEND_MESSAGES',
                          'ADD_REACTIONS',
                          'SEND_TTS_MESSAGES',
                          'ATTACH_FILES',
                          'SPEAK']
                  }
                ])
            })
            } catch(e) {
            console.log(e.stack);
            }   
        }
        let msgCount = userData.msgCount;
        
        if(difference > DIFF) {
          clearTimeout(timer);
          console.log('Cleared timeout');
          userData.msgCount = 1;
          userData.lastMessage = message;
          userData.timer = setTimeout(() => {
            usersMap.delete(message.author.id);
            console.log('Removed from RESET.');
          }, TIME);
          usersMap.set(message.author.id, userData);
        }
        else {
          ++msgCount;
          if(parseInt(msgCount) === LIMIT) {
            mutee.roles.add(muterole);
            message.channel.send(`${mutee} You have been muted. Please contact a staff member to get that reversed.`);
            report.send(`@here, someone has been auto-muted.`);
            report.send(embed);
            /* setTimeout(() => {
              mutee.removeRole(muterole);
              message.channel.send('You have been unmuted');
            }, TIME); */
          } else {
            userData.msgCount = msgCount;
            usersMap.set(message.author.id, userData);
          }
        }
      }
      else {
        let fn = setTimeout(() => {
          usersMap.delete(message.author.id);          
        }, TIME);
        usersMap.set(message.author.id, {
          msgCount: 1,
          lastMessage: message,
          timer: fn
        });
      }

                  

    if (!message.guild) return;

    //reply function
    if (message.content.endsWith("?") || message.content.endsWith("?!")) {
      if (message.isMemberMentioned(client.user)) {
        if (message.content.toLowerCase().includes("how") && message.content.toLowerCase().includes("are") && message.content.toLowerCase().includes("you")) {
          return message.channel.send(asks[Math.floor(Math.random() * asks.length)] );
        } else if (message.content.toLowerCase().includes("can" && "you" && "help" && "me")) { 
          return message.reply("I might. Why don't you try out !help? :wink:");
        } else if (message.content.toLowerCase().includes("skynet") || message.content.toLowerCase().includes("jugdement day")) {
          return message.channel.send(sassy[Math.floor(Math.random() * sassy.length)] );
        } else if (message.content.toLowerCase().includes("usefull") || message.content.toLowerCase().includes("sleep") || message.content.toLowerCase().includes("well")) {
          return message.channel.send(positive[Math.floor(Math.random() * positive.length)]);
        } else if (message.content.toLowerCase().includes("robot")){
          return message.channel.send(robot[Math.floor(Math.random() * robot.length)]);
        } else {
          return message.channel.send(replies[Math.floor(Math.random() * replies.length)]);  
        } 
      } else if (message.content.toLowerCase().includes(message.content.toLowerCase().includes("can" && "help" && "me"))) {
          return message.channel.send(help[Math.floor(Math.random() * help.length)] );
      }else {
        return message.channel.send(answers[Math.floor(Math.random() * answers.length)]);
      }  
    } 

    const startcommand = await getstartcmd(message, con);

    if (message.content.startsWith(`${startcommand}`)) {
      
      const member = message.author;
      guild = member.guild;
      rl = await getapproved2(message, con);

      const role = message.guild.roles.cache.find(r => r.id === rl);
      
      message.member.roles.add(role.id).catch(e => console.log(e.message));
    }

    if (!message.content.startsWith(prefix)) return;

    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args, con);

   
    
})



client.login(token);


