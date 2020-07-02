const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { setadm, setmd, setch, setms, setapr, setcmd, setreports, user_ready, setautomatic_approved, setservergreeting, setprefix } = require("../../functions/setupfunctions.js");
const { getAdmin, getMod, getChnl, getMsg, getapproved, getstartcmd, getreportschannel, getautoapproved, getservergreeting, getprefix } = require("../../functions/db_queries.js");


module.exports = {
    name: "setserver",
    category: "setup",
    permission: ["admin"],
    description: "Set up the entire server",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }     

        
        
        
        //declaring stuff
        const member = message.member;
        const guild = message.member.guild;   
        const delchannel = message.guild.channels.cache.find(channel => channel.name === "bot-setup");       
        var adm2;                 
        var md2;
        var ch2;
        var ms2;
        var ms3;
        var apr2;
        var cmd2;
        var rpt2; 
        var prefix2;
        var setimmediatly;   
        var bolean;    
        
        

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
            adm2 = await setadm(message, con);
        }
        //set moderator role
        if (adm2) {
            md2 = await setmd(message, con);
        }
        //set welcome channel
        if (md2) {
            ch2 = await setch(message, con);
        }
        //set welcome message
        if (ch2) {
            ms2 = await setms(message, con);
        }
        //set server welcome message
        if (ms2) {
            ms3 = await setservergreeting(message, con, embed4);
        }
        //set approved immediatly
        if (ms3){
            setimmediatly = await setautomatic_approved(message, con);
        }
        if (setimmediatly) {
            //set approved role            
            apr2 = await setapr(message, con);
            
            if (apr2) {
                prefix2 = await setreports(message, con);
            }
            //set prefix
            if (prefix2) {
                rpt2 = await setprefix(message, con);
            }
        } else {   
            //set approved role            
            apr2 = await setapr(message, con);
                
            //set approving command
            if (apr2) {
                cmd2 = await setcmd(message, con);
            }
            //set report channel
            if (cmd2) {
                prefix2 = await setreports(message, con);
            }  
            //set prefix
            if (prefix2) {
                rpt2 = await setprefix(message, con);
            }
        }
        
        
        if (rpt2) {            
            const admin2 = await getAdmin(message, con);
            const moderator2 = await getMod(message, con);
            const welcomechannel2 = await getChnl(member, con);
            const approvedrole2 = await getapproved(member, con);
            const reportschannel2 = await getreportschannel(message, con);
            bolean = await getautoapproved(member, con);
            admin = message.guild.roles.cache.find(r => r.id === admin2);
            moderator = message.guild.roles.cache.find(r => r.id === moderator2);
            welcomechannel = message.guild.channels.cache.find(c => c.id === welcomechannel2);
            welcomemessage = await getMsg(member, con);
            servergreeting = await getservergreeting(member, con);
            approvedrole = message.guild.roles.cache.find(r => r.id === approvedrole2);
            startcmd = await getstartcmd(message, con);
            prefix = await getprefix(message, con);
            reportschannel = message.guild.channels.cache.find(c => c.id === reportschannel2);
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
            ${startcmd}`, true)
            .addField(`\u200b`, stripIndents`**Channel for your reports**
            ${reportschannel}`, true)
            .addField(`\u200b`, stripIndents`**Your prefix**
            ${prefix}`, true);

        if (rpt2) {            
            message.channel.send(embed)
            message.channel.send(embed3)
            setTimeout(() => {
                delchannel.delete();
            }, 120000);
        }
        

    }
}