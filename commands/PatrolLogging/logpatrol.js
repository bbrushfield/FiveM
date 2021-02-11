// FiveM Patrol Logging System \\
// Made for Backbone Roleplay \\
   // Made by AyeeMod#0001 \\

//Definitions
const Discord = require("discord.js");
const mongo = require('../../Utils/mongo')
const LogSchema = require('../../Utils/PatrolLogs')

//Embed Lists
let autofooter = 'Patrol Logging - Created by AyeeMod#0001 for Backbone Roleplay'
let notes = ['No notes detected!','Please supply notes on the patrol to be added to your record','To give notes, just write after the command, or after "on" or "off"']
let IncArgs = ['Incorrect Arguments!','Please specify if you are logging ON or OFF','To use correct syntax, please do command <ON/OFF> <Notes>']


function ErrorEmbed(message,title,description,text){
    if (title == 'User Account Created!'){
        const accCreated = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(title)
        .setDescription(description)
        .setFooter(autofooter)
        if (text != 0) {
            accCreated.addField('Additional Text',text)
        }
        message.channel.send(accCreated)
    } else {    
        const errembed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle(title)
        .setDescription(description)
        .setFooter(autofooter)
        if (text != 0) {
            errembed.addField('Additional Text',text)
        }
        message.channel.send(errembed)
    }
}

//On conclusion of patrol (patrol off [notes])
function ConcEmbed(message,title,description,text){
    const concembed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(title)
    .setDescription(description)
    .setFooter(autofooter)
    if (text != 0) {
        concembed.addField('Additional Text',text)
    }
    message.channel.send(concembed)
}

function unix_get(unix){
    var date = new Date(unix);

    var hours = date.getHours();
    var minutes = '0' + date.getMinutes();
    var seconds = '0' + date.getSeconds();

    var formatted = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formatted
}


module.exports = {
    name: "log",
    aliases: ["logon","logoff"],
    category: "PatrolLogging",
    description: "Returns player count on Servers. Specify which server you want to view. Default is main server",
    usage: "log [on/off]",
    run: async (client, message, args) => {
        var status_user = false
        if (args[0]) {
            if (args[0].toLowerCase() == "on") {
                console.log("Chosen On")
                status_user = true
                if (!args[1]){ErrorEmbed(message,notes[0],notes[1],notes[2]); return;}
                //Check first if player is already logged on
            } else if (args[0].toLowerCase() == "off") {
                console.log("Chosen off")
                status_user = false
                if (!args[1]){ErrorEmbed(message,notes[0],notes[1],notes[2]); return;}
                //Checks for notes

            } else {
                ErrorEmbed(message,IncArgs[0],IncArgs[1],IncArgs[2]); return;
            }
        } else {
            return message.reply("Please supply either 'On' or 'Off' followed by notes to begin / end a patrol!")
        }
        let userId = message.author.id
        let notesforpush = args.slice(1).join(" ")

            function getDate(){
                var date = new Date();

                var hours = date.getHours();

                var Minutes = '0' + date.getMinutes();
                var seconds = '0' + date.getSeconds();

                var formatted = hours + ':' + Minutes.substr(-2) + ':' + seconds.substr(-2);

                return formatted
            }
            await mongo().then(async mongoose => {
                const theresult = await LogSchema.findOne({ userId: userId }).exec();
                if(theresult !== null){
                    var currentstate = theresult.status
                    //status false means logged off
                    //status true means logged on
                }

                if(currentstate == false){
                    if(status_user == false){
                        //If user is the opposite of the requested function, in this case, wanting to log out when already logged out
                        return ErrorEmbed(message,'You are already logged out!','Please log back in if you wish to start a patrol!','To start a patrol, just do log [on] [Notes]')
                    }
                    //Start variable definitions for LOGGING ON
                    var Total_Time = theresult.Total_Time
                    var Total_Patrols = theresult.Total_Patrols
                    
                    const logon = {
                        author: message.member.user.tag,
                        timestamp: new Date().getTime(),
                        notes_start: notesforpush
                    }

                    //End variable definitions for LOGGING ON
                    try {
                        await LogSchema.findOneAndUpdate({
                            userId
                        }, {
                            userId,
                            Total_Time,
                            Total_Patrols,
                            status: true,
                            $push: {
                                On_Logs: logon,
                            }
                        }, {
                            upsert: true
                        })
                    } finally {
                        mongoose.connection.close()
                    }
                    //Send message to user to confirm logging
                    ConcEmbed(message,'Log on Successful!',`Log Summary:\n Request by: ${message.member.user.tag}\nLog on time:${getDate()}\nNotes Provided: ${logon.notes_start}`,0)
                } else if(currentstate == true){
                    if(status_user == true){
                        //If user is the opposite of the requested function, in this case, wanting to log on when already logged on
                        return ErrorEmbed(message,'You are already logged out!','Please log back in if you wish to start a patrol!','To end a patrol, just do log [off] [Notes]')
                    }
                    //Start variable definitions for logging OFF
                    const logoff = {
                        author: message.member.user.tag,
                        timestamp: new Date().getTime(),
                        notes_end: notesforpush
                    }
                    const logSummary = {
                        TotalTimeOnPatrol: new Date().getTime() - theresult.On_Logs[theresult.Total_Patrols].timestamp,
                    }
                    var Total = new Date().getTime() - theresult.On_Logs[theresult.Total_Patrols].timestamp
                    var Total_Time = theresult.Total_Time + Total

                    var Total_Patrols = theresult.Total_Patrols + 1
                    const currenttot = theresult.Total_Patrols
                    //End variable defintions for logging OFF
                    try {
                        await LogSchema.findOneAndUpdate({
                            userId
                        }, {
                            userId,
                            Total_Time,
                            Total_Patrols,
                            status: false,
                            $push: {
                                Off_Logs: logoff,
                                Total_Logs: logSummary,
                            }
                        }, {
                            upsert: true
                        })
                    const formatted = unix_get(theresult.On_Logs[currenttot].timestamp)
                    ConcEmbed(message,'Log off Successful!',`Log Summary:\n Request by: ${message.member.user.tag}\nLog on time: ${formatted} \nLog off time: ${getDate()}\nNotes Provided at start: ${theresult.On_Logs[currenttot].notes_start}\nNotes provided at end: ${logoff.notes_end}`,0)
                    } finally {
                        mongoose.connection.close()
                    }
                } else {
                    console.log('Error')
                    var Total_Time = 0
                    var Total_Patrols = 0
                    var status = false
                    try {
                        await LogSchema.findOneAndUpdate({
                            userId
                        }, {
                            userId,
                            Total_Time,
                            Total_Patrols,
                            status,
                        }, {
                            upsert: true
                        })
                    ErrorEmbed(message,'User Account Created!','Please re-do your previous command to begin patrol!','This error is constant when someone first logs in!')
                    } finally {
                        mongoose.connection.close()
                    }
                }
            })
    }
};
