const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const PatrolLog = require('../../models/PatrolLogs');
const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

let autofooter = 'Patrol Logging - Created by AyeeMod#0001 for Backbone Roleplay'
let notes = ['No notes detected!','Please supply notes on the patrol to be added to your record','To give notes, just write after the command, or after "on" or "off"']
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

async function newlog(message,status,notesargs){
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
    //Just do const 
    //whatever = log(message,args)
    //whatever.save()
    //.then(result => console.log(result))
    //.catch(err => console.log(err))
}

const uri = "mongodb+srv://BBRP:BBRPManager@bbrp-logging.pc5na.mongodb.net/BBRPLogs?retryWrites=true&w=majority";
const mongoclient = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
mongoclient.connect(err => {
    console.log('Connected to Mongo')
})

async function finding(authorid,currentlog){
    const collection = mongoclient.db("PatrolLogs").collection("BBRPLogs");
    console.log(authorid)
    console.log("yes")
    const data = await collection.findOne({ UserId: authorid });
    console.log('Done')
    if(!data){
        console.log(currentlog)
        console.log("No one!")
        let newMember = new PatrolLog({
            UserId: authorid,
            Log: currentlog,
        })
        console.log(newMember)
        collection.insertOne(newMember)
        console.log("all done")
        //message.channel.send("You are a new user! Log added to database")
    } else {
        console.log(data)
        //Use ReplaceOne or UpdateOne
    }
    //if (data) {
        //console.log(data);
        //console.log("There is data")
        //return;
    //} else {
        //onsole.log('sad')
        //return;
    //}
}

module.exports = {
    name: "log",
    aliases: ["logon","logoff"],
    category: "PatrolLogging",
    description: "Returns player count on Servers. Specify which server you want to view. Default is main server",
    usage: "log [on/off]",
    run: async (client, message, args) => {
        console.log("Mongoose Connected")
        //To check if specified
        if (args[0]) {
            if (args[0].toLowerCase() == "on") {
                console.log("Chosen On")
                if (!args[1]){ErrorEmbed(message,notes[0],notes[1],notes[2]); return;}
                //Check first if player is already logged on
            } else if (args[0].toLowerCase() == "off") {
                console.log("Chosen off")
                if (!args[1]){ErrorEmbed(message,notes[0],notes[1],notes[2]); return;}
                //Checks for notes

            } else {
                //If there is an argument specified, but is not on or off
                let argsnote = args.slice(0).join(" "); // This now becomes an added note
                console.log(`Notes: ${argsnote}`)

            }
        } else {
            return message.reply("Please supply either 'On' or 'Off', or supply notes")
        }
        //mongoose.connect('')
        //await message.delete();
        //To check if user is owner -REMOVE WHEN IN USE
        let userid = message.author.id
        if (message.author.id != '129495170390556672') return;
        let notesforpush = args.slice(0).join(" ")
        const currentlog = newlog(message,'UNK',notesforpush)
        //PatrolLog.findOne({UserId: message.author.id}),async(err, data) =>{
            //console.log('Finding')
            //if(err) console.log(err)
           //if(!data){
               // console.log("No one!")
                //let newMember = new PatrolLog({
                    //UserId: userid,
                    //Log: currentlog
                //})
                //newMember.save()
                //message.channel.send("You are a new user! Log added to database")
            //} else {
                //console.log(data)
            //}
        //}
        //PatrolLog.findOneAndUpdate({
            //userid
        // },{
            // userid,
            //// $push:{
                //Logs: currentlog
            //}
        // },{
        //    upsert: true,
        //})
        const awaitfinding = await finding(message.author.id,currentlog)
        //console.log(awaitfinding)
        console.log('test')
    }
};