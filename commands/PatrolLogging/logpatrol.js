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

function newlog(message,status,notesargs){
    if (status == "LOGON") {
        const logobj = {
            author: message.member.user.tag,
            timestamp: new Date().getTime(),
            reason: notesargs
        }
        return logobj;
    } else if (status == "LOGOFF") {
        const logobj = {
            author: message.member.user.tag,
            timestamp: new Date().getTime(),
            reason: notesargs
        }
        return logobj;
    } else if (status == "UNK") {
        const logobj = {
            author: message.member.user.tag,
            timestamp: new Date().getTime(),
            reason: notesargs
        }
        return logobj;
    } else {
        ErrorEmbed(message,'Error - Bot End','Please contact a Developer ASAP','Create a ticket by going to #support-ticket')
        return;
    }
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
            return message.reply("Please supply either 'On' or 'Off', or supply notes")
        }
        let userId = message.author.id
        //TEMPORARY! REMOVE WHEN GLOBAL USE
        if (message.author.id != '129495170390556672') return;
        let notesforpush = args.slice(1).join(" ")

            function getDate(timestamp){
                var date = new Date();

                var hours = date.getHours();

                var Minutes = '0' + date.getMinutes();
                var seconds = '0' + date.getSeconds();

                var formatted = hours + ':' + Minutes.substr(-2) + ':' + seconds.substr(-2);

                return formatted
            }
            await mongo().then(async mongoose => {
                const theresult = await LogSchema.findOne({ userId: userId}).exec();
                if(theresult !== null){
                    var currentstate = theresult.status
                    //status false means logged off
                    //status true means logged on
                }

                if(currentstate == false){
                    if(status_user == true){
                        return ErrorEmbed(message,'You are already logged out!','Please log back in if you wish to start a patrol!')
                    }
                    var Total_Patrols = theresult.Total_Patrols + 1
                    var Total_Time = 0
                    const logon = {
                        author: message.member.user.tag,
                        timestamp: new Date().getTime(),
                        notes_start: notesforpush
                    }
                    try {
                        await LogSchema.findOneAndUpdate({
                            userId
                        }, {
                            userId,
                            Total_Time,
                            Total_Patrols,
                            $push: {
                                On_Logs: logon,
                                status: true
                            }
                        }, {
                            upsert: true
                        })
                    } finally {
                        mongoose.connection.close()
                    }
                    console.log('Trying to log on')
                    ConcEmbed(message,'Log on Successful!',`Log Summary:\n Request by: ${message.member.user.tag}\nLog on time: \nLog off time: ${getDate()}\nNotes Provided: ${logon.notes_start}`,0)
                } else if(currentstate == true){
                    if(status_user == false){
                        return ErrorEmbed(message,'You are already logged out!','Please log back in if you wish to start a patrol!')
                    }
                    const logoff = {
                        author: message.member.user.tag,
                        timestamp: new Date().getTime(),
                        notes_end: notesforpush
                    }
                    const logSummary = {
                        TotalTimeOnPatrol: 0,
                    }

                    // Push to logs, ALSO PUSH UPDATED TIME TO MAIN
                    console.log('Trying to log off')
                    console.log('t')

                //Required definitions if no log found
                    var Total_Time = 0
                    var Total_Patrols = 0
                    var status = false;
                    try {
                        await LogSchema.findOneAndUpdate({
                            userId
                        }, {
                            userId,
                            Total_Time,
                            Total_Patrols,
                            $push: {
                                Off_Logs: logoff,
                                Total_Logs: logSummary,
                                status: false,
                            }
                        }, {
                            upsert: true
                        })
                    const currenttot = theresult.Total_Patrols
                    ConcEmbed(message,'Log off Successful!',`Log Summary:\n Request by: ${message.member.user.tag}\nLog on time: ${theresult.On_Logs[currenttot].timestamp} \nLog off time: ${getDate()}\nNotes Provided: ${logoff.notes_end}`,0)
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
                            status,
                            Total_Time,
                            Total_Patrols,
                        }, {
                            upsert: true
                        })
                    ErrorEmbed(message,'You have had an account created!','Please re-do your previous command to begin patrol!')
                    } finally {
                        mongoose.connection.close()
                    }
                }
            })
        console.log('test')
    }
};


function embed(){
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Back Bone Chain Of Command')
        .setAuthor('Back Bone Roleplay')
        .setDescription('Please see below the Chain Of Command')
        .addFields(
            { name: 'Server Director', value: 'C. Orlando, L. Hexwood '},
            { name: 'Executive Staff', value: '⠀'},
            { name: 'Head Of Staff', value: 'M. Lake'},
            { name: 'Head Of Administration', value: 'C. Wolf'},
            { name: 'Head Of Department Transfer', value: 'R. Ceritano'},
            { name: 'Head Of Server Media', value: 'C. Kane'},
            { name: 'Head Of MDT', value: 'H. Strange'},
            { name: 'Head of Development', value: 'X. Henry'},
            { name: 'Staff Team', value: '⠀⠀'},
            { name: 'Trial Staff', value: 'N/A'},
            { name: 'Development Team', value: '(Not In Chain Of Command'},
            { name: 'Head of Development', value: 'X. Henry'},
            { name: 'Script Developer', value: 'J. Johansson'},
            { name: 'Lead Discord Developer', value: 'H. Strange'},
        )
        .setTimestamp()
        .setFooter('Backbone Chain Of Command')
    }