const Discord = require("discord.js");
const mongo = require('../../Utils/mongo')
const LogSchema = require('../../Utils/PatrolLogs')

let IntError87 = ['Internal Error #87','Database failed to log in / identify using findOne']
let autofooter = 'Patrol Logging - Created by AyeeMod#0001 for Backbone Roleplay'
let weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
let months = ['January','February','March','April','May','June','July','August','September','October','November','December']

function unix_get(unix){
    var date = new Date(unix);
    var hours = date.getUTCHours();

    var minutes = '0' + date.getUTCMinutes();
    if (minutes == '00'){
        minutes = '0'
    } else if (minutes.charAt(0) == '0'){
        minutes = `${minutes.charAt(1)}`
    }
    var seconds = '0' + date.getUTCSeconds();
    if (seconds == '00'){
        seconds = '0'
    } else if (seconds.substr(-2).charAt(0) == '0'){
        seconds = `${seconds.charAt(1)}`
    }

    var formatted = hours + ' hours ' + minutes.substr(-2) + ' minutes ' + seconds.substr(-2) + ' seconds';
    return formatted
}

function unix_date(unix){
    var d = new Date(unix);
    var day = d.getDay()
    for (i=0; i < weekdays.length; i++){
        if (i == day){
            day = weekdays[i]
        }
    }
    
    var dat = d.getDate()
    var Month = d.getMonth()
    for (i=0; i < months.length; i++){
        if (i == Month){
            Month = months[i]
        }
    }
    var Year = d.getFullYear()
    
    var hours = d.getUTCHours();

    var minutes = '0' + d.getUTCMinutes();

    var seconds = '0' + d.getUTCSeconds();
    

    var format = day + ' the ' + dat + ' of ' + Month + ' ' + Year + ' at ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
    return format
}

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

function EmbedFinal(message,result,userid){
    const FinalEmbed = new Discord.MessageEmbed()
    .setTitle(`User Summary for ${message.author.username}`)
    .setColor('RANDOM')
    .setDescription(`User has had a total of ${result.Total_Patrols} Patrols \nTotal Time spent on patrol: ${unix_get(result.Total_Time)}`)
    for (i=0; i < result.Off_Logs.length; i++){
        try{
            FinalEmbed.addField(`Patrol #${i+1}`,`Total Patrol Time: ${unix_get(result.Total_Logs[i].TotalTimeOnPatrol)}`)
        } catch(e){
            console.log(e)
        }
    }

    message.channel.send(FinalEmbed)
}

function EmbedDetail(message,uservar,OnLog,OffLog,TotLog,PatrolNum){
    const Embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle(`Details from ${uservar.user.username}'s Patrol #${PatrolNum+1}`)
    .setAuthor(`Player Lookup`)
    .setDescription(`Total time on for patrol: ${unix_get(TotLog.TotalTimeOnPatrol)}`)
    .addField(`Log On Details:`,`Time: ${unix_date(OnLog.timestamp)}\nNotes: ${OnLog.notes_start}`)
    .addField(`Log Off Details:`,`Time: ${unix_date(OffLog.timestamp)}\nNotes: ${OffLog.notes_end}`)
    .setFooter(autofooter)
    .setTimestamp()
    message.channel.send(Embed)
}

module.exports = {
    name: "patrolsearch",
    aliases: ["psearch","ps"],
    category: "PatrolLogging",
    description: "Gets the players total hours ",
    usage: "psearch [User]",
    run: async (client, message, args) => {
        console.log('Started command')
        if(args[0] == undefined ){
            await mongo().then(async mongoose => {
                try{
                    const exactLookup = await LogSchema.findOne({ userId: message.member.id }).exec();
                    if (exactLookup == null) {
                        ErrorEmbed(message,'You have not created an account!','Please mention someone with an account, or create an account!','If you believe this is wrong, please contact a developer!')
                    }
                    EmbedFinal(message,exactLookup,message.member.id)
                } catch(error) {
                    //Failed to connect / External error occured
                    ErrorEmbed(message,IntError87[0],IntError87[1],error)
                }
                mongoose.connection.close()
            })
            return;
        }

        if(!message.mentions.members.first()){
            //If user has specified a patrol number
            await mongo().then(async mongoose => {
                    try {
                        var indexnumber = parseInt(args[0])
                        indexnumber = indexnumber - 1
                        console.log(indexnumber)
                    } catch(e){
                       console.log(e) 
                    }
                    try{
                        const exactLookup = await LogSchema.findOne({ userId: message.author.id }).exec();
                        if(exactLookup == null){
                            ErrorEmbed(message,'You have not created an account!','Please mention someone with an account, or create an account!','If you believe this is wrong, please contact a developer!')
                        }
                        if (!exactLookup.On_Logs[indexnumber]){
                            ErrorEmbed(message,`There is no record of index ${indexnumber + 1}`,`Please provide a correct index number`,'Use playersearch again to see patrol numbers')
                            return;
                        }
                        try{
                            let exactOn = exactLookup.On_Logs[indexnumber]
                            let exactOff = exactLookup.Off_Logs[indexnumber]
                            let exactTot = exactLookup.Total_Logs[indexnumber]
                            console.log(exactOn)
                            //message,user,OnLog,OffLog,TotLog,PatrolNum
                            EmbedDetail(message,message.member,exactOn,exactOff,exactTot,indexnumber)
                        } catch(e){
                            console.log(e)
                        }
                    } catch(e){
                        console.log(e)
                    }
                mongoose.connection.close()
            })
        } else {
            let user = message.mentions.members.first()
            await mongo().then(async mongoose => {
                if(!args[1]) {
                    try{
                        const exactLookup = await LogSchema.findOne({ userId: user.id }).exec();
                        if (exactLookup == null) {
                            ErrorEmbed(message,'You have not created an account!','Please mention someone with an account, or create an account!','If you believe this is wrong, please contact a developer!')
                            return;
                        }
                        EmbedFinal(message,exactLookup,message.member.id)
                    } catch(error) {
                        //Failed to connect / External error occured
                        ErrorEmbed(message,IntError87[0],IntError87[1],error)
                    }
                } else {
                    await mongo().then(async mongoose => {
                        try {
                            var indexnumber = parseInt(args[1])
                            indexnumber = indexnumber - 1
                            console.log(indexnumber)
                        } catch(e){
                           console.log(e) 
                        }
                        try{
                            const exactLookup = await LogSchema.findOne({ userId: user.id }).exec();
                            if(exactLookup == null){
                                ErrorEmbed(message,'You have not created an account!','Please mention someone with an account, or create an account!','If you believe this is wrong, please contact a developer!')
                            }
                            if (!exactLookup.On_Logs[indexnumber]){
                                ErrorEmbed(message,`There is no record of index ${indexnumber + 1}`,`Please provide a correct index number`,'Use playersearch again to see patrol numbers')
                                return;
                            }
                            try{
                                let exactOn = exactLookup.On_Logs[indexnumber]
                                let exactOff = exactLookup.Off_Logs[indexnumber]
                                let exactTot = exactLookup.Total_Logs[indexnumber]
                                console.log(exactOn)
                                //message,user,OnLog,OffLog,TotLog,PatrolNum
                                EmbedDetail(message,message.member,exactOn,exactOff,exactTot,indexnumber)
                            } catch(e){
                                console.log(e)
                            }
                        } catch(e){
                            console.log(e)
                        }
                    mongoose.connection.close()
                })
                }
                mongoose.connection.close();
            })
        }
    }
};