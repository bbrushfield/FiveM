const { EEXIST } = require('constants');
const Discord = require('discord.js');
const { stat } = require('fs');
const SteamAPI = require('steamapi')

module.exports = {
    name: "serverinfo",
    aliases: ["sinfo","info"],
    category: "Fivem",
    description: "Returns player count on Servers. Specify which server you want to view. Default is main server",
    usage: "search <Username>",
    run: async (client, message, args) => {
        const Gamedig = require('gamedig');
        Gamedig.query({
            type: 'fivem',
            host: 'main.bbrp.cloud'
        }).then((state) => {
            console.log(state)
            const mainembed = new Discord.MessageEmbed()
            mainembed.setColor("GREEN")
            mainembed.setTitle("Server Information Window")
            mainembed.setDescription(`Server currently on version ${state.raw.info.version}`)
            mainembed.addField('Ping',`${state.ping}ms`)
            mainembed.addField(`Players`,`${state.raw.clients}`)
            mainembed.addField(`Server Description:`,state.raw.gametype)
            mainembed.setFooter(`Server IP main.bbrp.cloud - FiveM Bot developed by AyeeMod#0001`)
            message.channel.send(mainembed)
        }).catch((error) => {
            const errorembed = new Discord.MessageEmbed()
            errorembed.setColor("RED")
            errorembed.setTitle(`Failed to connect to server`)
            errorembed.setDescription('Server `main.bbrp.cloud` appears to be offline!')
            errorembed.setFooter(`Failed to connect to server - FiveM Bot developed by AyeeMod#0001`)
        })
    }
}