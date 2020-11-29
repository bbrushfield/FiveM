var mysql = require("mysql")
const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "patrolsearch",
    aliases: ["psearch","ps"],
    category: "PatrolLogging",
    description: "Gets the players total hours ",
    usage: "players [SERVER]",
    run: async (client, message, args) => {
        var connection = mysql.createConnection({
            host: '45.87.80.1',
            user: 'u842931608_T_Micro',
            password: 'kf`>!Pz^',
            database: 'u842931608_drivingsimdata'
        })

    }
};