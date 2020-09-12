const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { setadm, setmd, setch, setms, setapr, setcmd, setreports, user_ready, setautomatic_approved, setservergreeting, setprefix } = require("../../functions/setupfunctions.js");
const { get_API_call } = require('../../functions/functions');

module.exports = {
    name: "setserver",
    category: "setup",
    permission: ["admin"],
    description: "Set up the entire server",
    run: async (client, message, args) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }     

        //declaring stuff
        const member = message.member;
        const guild = message.member.guild;   
        const delchannel = message.guild.channels.cache.find(channel => channel.name === "bot-setup");       
        var adm2 = false;               
        var md2 = false;
        var ch2 = false;
        var ms2 = false;
        var ms3 = false;
        var apr2 = false;
        var cmd2 = false;
        var rpt2 = false; 
        var prefix2 = false;
        var setimmediatly = false;   
        var bolean = false;    
        
        //setup complete message
        const embed = new Discord.MessageEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setTimestamp()
            .setDescription(stripIndents`You have completed the setup process for this server. :partying_face:
            Hopefully nothing broke :sweat_smile:
            **Important:** For me to work properly you need to put the @AJAX role at the highest possible point in your role list
            If you wish to change any of this in the future, you can use one of the other commands in the \`setup\` category.`)
        
        //starting message
        const embed2 = new Discord.MessageEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setTimestamp()
            .setDescription(`This command allows me to get everything I need to work. 
            To simplify please **always** mention the role or channel i.e. #channel, @role
            **The following is required:**`)
            .addField(`\u200b`, stripIndents`- Administrator role
            - Moderator role 
            - approved member role`, true)
            .addField(`\u200b`, stripIndents`- Welcome channel
            - Welcome message that is to be displayed to the new member
            - Welcome message that is to be displayed to the entire server`, true)
            .addField(`\u200b`, stripIndents`- Command to approve new members
            - channel for your report filings`, true)
            .addField(`\u200b`, stripIndents`All of this can be changed afterwards.
            **Ready?** (y/n)`);
        
        const embed4 = new Discord.MessageEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setTimestamp()
            .setDescription(`Please enter the greeting that is to be displayed to the server.
            This message will be send into the welcome channel that you set earlier`)
            .addField(`**Example**`, stripIndents`<Member>, [Your message here]`);
        
        
        //getting user ready
        const rdy = await user_ready(message, embed2);
        //set admin role  
        if (rdy) {
            while (adm2 === false) {
                adm2 = await setadm(message);
            }            
        }
        //set moderator role
        if (adm2) {
            while (md2 === false) {
                md2 = await setmd(message);
            }            
        }
        //set welcome channel
        if (md2) {
            while (ch2 === false) {
                ch2 = await setch(message);
            }            
        }
        //set welcome message
        if (ch2) {
            while (ms2 === false) {
                ms2 = await setms(message);
            }            
        }
        //set server welcome message
        if (ms2) {
            while (ms3 === false) {
                ms3 = await setservergreeting(message, embed4);
            }            
        }
        //set approved immediatly
        if (ms3){            
            setimmediatly = await setautomatic_approved(message);                     
        }
        if (setimmediatly) {
            //set approved role    
            while (apr2 === false) {
                apr2 = await setapr(message);
            }                 
            //set report channel
            if (apr2) {
                while (prefix2 === false) {
                    prefix2 = await setreports(message);
                }                
            }
            //set prefix
            if (prefix2) {
                while (rpt2 === false) {
                    rpt2 = await setprefix(message);
                }                
            }
        } else {   
            //set approved role  
            while (apr2 === false) {
                apr2 = await setapr(message);
            }                  
            //set approving command
            if (apr2) {
                while (cmd2 === false) {
                    cmd2 = await setcmd(message);
                }               
            }
            //set report channel
            if (cmd2) {
                while (prefix2 === false) {
                    prefix2 = await setreports(message);
                }                
            }
            //set prefix
            if (prefix2) {
                while (rpt2 === false) {
                    rpt2 = await setprefix(message);
                }                
            }
        }

        if (rpt2) {
            const response = await get_API_call(message, "getserver");
            var admin = message.guild.roles.cache.find(r => r.id === response.admin);
            var moderator = message.guild.roles.cache.find(r => r.id === response.moderator);
            var welcomechannel = message.guild.channels.cache.find(c => c.id === response.channel);
            var welcomemessage = response.greeting;
            var servergreeting = response.server_greeting;
            var approvedrole = message.guild.roles.cache.find(r => r.id === response.approved);
            var startcmd = response.startcmd;
            var reportschannel = message.guild.channels.cache.find(c => c.id === response.reports);
            var bolean = response.auto_approved;
            var prefix = response.prefix;
        }

        if (bolean === "true") {
            startcmd = "Members are approved automatically"
        }

        const embed3 = new Discord.MessageEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setTimestamp()
            .setThumbnail(guild.iconURL())
            .setDescription(stripIndents`**This is what you entered**`)
            .addField(`\u200b`, stripIndents`**Admin role**
            ${admin}`, true)
            .addField(`\u200b`, stripIndents`**Moderator role**
            ${moderator}`, true)
            .addField(`\u200b`, stripIndents`**Welcome channel**
            ${welcomechannel}`, true)
            .addField(`\u200b`, stripIndents`**Welcome message**
            ${welcomemessage}`)
            .addField(`\u200b`, stripIndents`**Servergreeting message**
            ${servergreeting}`)
            .addField(`\u200b`, stripIndents`**Role for approved members**
            ${approvedrole}`, true)
            .addField(`\u200b`, stripIndents`**Command for approving new members**
            \`${startcmd}\``, true)
            .addField(`\u200b`, stripIndents`**Channel for your reports**
            ${reportschannel}`, true)
            .addField(`\u200b`, stripIndents`**Your prefix**
            \`${prefix}\``, true);

        if (rpt2) {            
            message.channel.send(embed)
            message.channel.send(embed3)
            setTimeout(() => {
                if (message.guild.channels.cache.find(channel => channel.name === "bot-setup")) {
                    return delchannel.delete();
                } else {
                    return;
                }
                
            }, 60000);
        }
        

    }
}