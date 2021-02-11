const Discord = require('discord.js');
const { stat } = require('fs');
const Gamedig = require('gamedig');
const cron = require('cron');
const JSONstore = require("../../handlers/AOP.json");
const AOP = JSONstore.currentAOP
const message = JSONstore.currentMessage

const embed1 = {
    color: 0x0099ff,
    title: 'AOP Voting',
    url: 'http://backbonerp.com',
    author: {
        name: 'Back Bone Roleplay',
        icon_url: 'https://imgur.com/a/OO525kL',
        url: 'http://docs.backbonerp.com',
    },
    description: 'Please see the option below, and vote for the Area Of Patrol you want',
    fields: [
        {
            name: ':farmer: Sandy Shores',
            value: 'Adventure the Lower parts of Blaine County',
        },
        {
            name: ':sunrise_over_mountains: Paleto Bay',
            value: 'Experience the adventures through the mountains in the beautiful Paleto Bay',
        },
        {
            name: ':cityscape: North Los Santos',
            value: 'Vinewood and Vespucci, fight crime on the border of Blaine County and Los Santos',
        },
        {
            name: ' :city_dusk: South Los Santos',
            value: 'Davis and Mission Row, Experience the views across the water in Southern Los Santos',
        },
    ],
    timestamp: new Date(),
    footer: {
        text: 'Voting closes at 18:00z (13:00 EST)',
        icon_url: 'https://imgur.com/a/OO525kL',
    },
};

var scheduledMessage = new cron.CronJob('0 15 * * * *', function() {
    // Sends the message 
    let channel = yourGuild.channels.get('id');
    channel.send({ embed: embed1 });
        
}, null, true, 'Europe/London');

var checkmessage = new cron.CronJob('0 18 * * * *', function() {
    // Use this to check and add the reactions the message has
}, null, true, 'Europe/London');
