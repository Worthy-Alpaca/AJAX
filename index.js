const { Client, RichEmbed, Collection } = require("discord.js");
const { prefix, version, status, welcome_channel, DIFF, LIMIT, TIME } = require('./config.json');
const { token } = require('./token.json');
const fs = require("fs");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("./functions.js");
const { answers, replies, asks, help, positive, sassy } = require("./answers.json")



const client = new Client({
    disableEveryone: false
});

client.reply = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");





["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);

});

client.on("ready", () => {

    console.log(`I'm now online, my name is ${client.user.username}`);
    //console.log(client.channels);

    /* client.fetchUser("595341356432621573", false).then(user => {
        user.send(`I'm online`)
    }); */

    client.user.setPresence({
        status: "online",
        game: {
            name: `${status}`,
            type: "WATCHING"
        }
    });
});

const usersMap = new Map();
/* const LIMIT = 5;
const TIME = 7000;
const DIFF = 3000; */

client.on("guildMemberAdd", async member => {
    if (member.bot) return;
    const channel = member.guild.channels.find(channel => channel.name === `${welcome_channel}`);
    if (!channel) return;


    const embed = new RichEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setAuthor(`We have a new member`, member.user.displayAvatarURL)
        .setDescription(stripIndents`Hello ${member} and welcome to the idiotsatlarge discord server. :partying_face:
        We are a clan of friendly people who have fun and work together.
        You have any questions or need help? Just ask ingame or on this server. :grin:
        To keep the clan going, player inactivity fo 30 days will result in discharge.
        If you are away for more than 30 days, just message @jonhhammer or leave a message here on the server.
        If you want to join the raid, use !raid to get the corresponding role.
        Please do not join someone ingame without asking first.`);

    return channel.send(embed);
        
    
});




client.on("message", async message => {

    

    if (message.author.bot) return;
    
    

    if(usersMap.has(message.author.id)) {
        let mutee = message.member;
        const report = message.guild.channels.find(channel => channel.name === "reports");
        const userData = usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let muterole = message.guild.roles.find(r => r.name === "Muted")

        const embed = new RichEmbed() 
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Muted member", mutee.user.displayAvatarURL)
            .setDescription(stripIndents`**> Member: ${mutee} (${mutee.id})
            **> Automated Mute
            **> Muted in: ${message.channel}
            **> Reason: SPAM
            MUTE needs to be manually removed`);

        

        if(!muterole) {
            try{
                muterole = await message.guild.createRole({
                    name: "Muted",
                    color: "#514f48",
                    permissions: []
                })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SEND_TTS_MESSAGES: false,
                    ATTACH_FILES: false,
                    SPEAK: false
                })
            })
            } catch(e) {
            console.log(e.stack);
            }   
        }
        let msgCount = userData.msgCount;
        //console.log(difference);
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
            mutee.addRole(muterole);
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
          //console.log('Removed from map.');
        }, TIME);
        usersMap.set(message.author.id, {
          msgCount: 1,
          lastMessage: message,
          timer: fn
        });
      }

                  

    if (!message.guild) return;
    if (message.content.endsWith("?") || message.content.endsWith("!")) {
      if (message.isMemberMentioned(client.user)) {
        if (message.content.toLowerCase().includes("how") && message.content.toLowerCase().includes("are") && message.content.toLowerCase().includes("you")) {
          return message.channel.send(asks[Math.floor(Math.random() * asks.length)] );
        } else if (message.content.toLowerCase().includes("can" && "you" && "help" && "me")) { 
          return message.reply("I might. Why don't you try out !help? :wink:");
        } else if (message.content.toLowerCase().includes("Skynet" || "terminator") || message.content.toLowerCase().includes("jugdement day")) {
          return message.channel.send(sassy[Math.floor(Math.random() * sassy.length)] );
        } else if (message.content.toLowerCase().includes("usefull") || message.content.toLowerCase().includes("sleep") || message.content.toLowerCase().includes("well")) {
          return message.channel.send(positive[Math.floor(Math.random() * positive.length)]);
        } else {
          return message.channel.send(replies[Math.floor(Math.random() * replies.length)]);  
        } 
      } else if (message.content.toLowerCase().includes(message.content.toLowerCase().includes("can" && "help" && "me"))) {
          return message.channel.send(help[Math.floor(Math.random() * help.length)] );
      }else {
        return message.channel.send(answers[Math.floor(Math.random() * answers.length)]);
      }  
    } else if (message.content.toLowerCase().includes("I" && "will" && "be" && "back")) {
      return message.reply("Oh yeah? Can't wait for that")
    }


    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);

   
    
})



client.login(token);


