const { EEXIST } = require('constants');
const Discord = require('discord.js');
const { stat } = require('fs');
const SteamAPI = require('steamapi')

module.exports = {
    name: "status",
    aliases: ["s","state"],
    category: "Fivem",
    description: "Returns server's current player count and ip",
    usage: "search <Username>",
    run: async (client, message, args) => {
        const Gamedig = require('gamedig');
        Gamedig.query({
            type: 'fivem',
            host: 'main.bbrp.cloud'
        }).then((state) => {
            console.log(state.raw)
            const errembed = new Discord.MessageEmbed()
            errembed.setTitle("Server is currently Online!")
            errembed.setDescription(`Server IP: main.bbrp.cloud\nPlayers: ${state.raw.clients}\nUptime: --`)
            errembed.setColor("GREEN")
            errembed.setFooter("Satus Window - FiveM Bot developed by AyeeMod#0001")
            message.channel.send(errembed)
        }).catch((error) => {
            const errembed = new Discord.MessageEmbed()
            errembed.setTitle("Server is currently Offline!")
            errembed.setDescription(`Server IP: main.bbrp.cloud\nPlayers: --\nUptime: --`)
            errembed.setColor("RED")
            errembed.setFooter("Satus Window - FiveM Bot developed by AyeeMod#0001")
            message.channel.send(errembed)
        })
    }

};