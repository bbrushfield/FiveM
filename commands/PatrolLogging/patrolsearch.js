const Discord = require("discord.js");
const mongo = require('../../Utils/mongo')
const LogSchema = require('../../Utils/PatrolLogs')

let IntError87 = ['Internal Error #87','Database failed to log in / identify using findOne']

function unix_get(unix){
    var date = new Date(unix);
    console.log(date)
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
    } else if (seconds.charAt(0) == '0'){
        seconds = `${seconds.charAt(1)}`
    }

    var formatted = hours + ' hours ' + minutes.substr(-2) + ' minutes ' + seconds.substr(-2) + ' seconds';
    return formatted
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
        FinalEmbed.addField(`Patrol #${i+1}`,`Total Patrol Time: ${unix_get(result.Total_Logs[i].TotalTimeOnPatrol)}`)
    }

    message.channel.send(FinalEmbed)
}

module.exports = {
    name: "patrolsearch",
    aliases: ["psearch","ps"],
    category: "PatrolLogging",
    description: "Gets the players total hours ",
    usage: "psearch [User]",
    run: async (client, message, args) => {
        console.log('Started command')
        let user = message.mentions.members.first()
        await mongo().then(async mongoose => {
            if (!user){
                try{
                    const theresult = await LogSchema.findOne({ userId: message.member.id }).exec();
                    if (theresult == null) {
                        ErrorEmbed(message,'You have not created an account!','Please mention someone with an account, or create an account!','If you believe this is wrong, please contact a developer!')
                    }
                    EmbedFinal(message,theresult,message.member.id)
                    console.log(theresult)
                } catch(error) {
                    //Failed to connect / External error occured
                    ErrorEmbed(message,IntError87[0],IntError87[1],error)
                }
            } else{
                try {
                    const theresult = await LogSchema.findOne({ userId: user.id }).exec();
                    if (theresult == null) {
                        ErrorEmbed(message,'User you have mentioned has not created an account!','Please mention someone with an account, or ask them to create one!','If you believe this is wrong, please contact a developer!')
                    }
                    console.log(theresult)
                } catch(error) {
                    //Failed to connect / External error occured
                    ErrorEmbed(message,IntError87[0],IntError87[1],error)
                }
            }
            mongoose.connection.close();
        })
    }
};