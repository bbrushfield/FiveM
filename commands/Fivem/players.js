const Discord = require('discord.js');
const { stat } = require('fs');
const Gamedig = require('gamedig');

module.exports = {
    name: "players",
    aliases: ["plrs","plr"],
    category: "Fivem",
    description: "Returns player count on Servers. Specify which server you want to view. Default is main server",
    usage: "players [SERVER]",
    run: async (client, message, args) => {
        Gamedig.query({
            type: 'fivem',
            host: 'main.bbrp.cloud'
        }).then((state) => {
            console.log(state.players);
            const embed = new Discord.MessageEmbed()
            embed.setTitle("BBRP - Player Summary")
            embed.setColor("RANDOM")
            embed.setDescription("Please see below a list of current online players!")
            embed.setFooter("Server Player lookup - FiveM Bot developed by AyeeMod#0001")
            if (state.players.length == 0){
                console.log("No players")
                const noplrembed = new Discord.MessageEmbed()
                noplrembed.setTitle("There are no Players currently on the server!")
                noplrembed.setDescription("Please try again later, when there may be players on!")
                noplrembed.setColor("RED")
                noplrembed.setFooter("Player Function - FiveM Bot developed by AyeeMod#0001")
                message.channel.send(noplrembed)
            } else {
                console.log("Players!")
                for (i = 0; i < state.players.length; i++) {
                    //console.log(state.players[i].name)
                    //console.log(state.raw.players)
                    const playersobj = state.raw.players[i].identifiers

                    //const currentuser = client.fetchUser(state.raw.players[i].identifiers[5])
                    embed.addField(`${state.raw.players[i].name}`,`Server ID: ${state.raw.players[i].id}\nPing: ${state.players[i].ping}ms`,true)
                }
                message.channel.send(embed)
            }
        //}).catch((error) => {
           // console.log("Server is offline");
        });
    }
};