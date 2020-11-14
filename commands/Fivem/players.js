const Discord = require('discord.js');
const { stat } = require('fs');


module.exports = {
    name: "players",
    aliases: ["plrs","plr"],
    category: "Fivem",
    description: "Returns player count on Servers. Specify which server you want to view. Default is main server",
    usage: "players [SERVER]",
    run: async (client, message, args) => {
        const Gamedig = require('gamedig');
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
            for (i = 0; i < state.players.length; i++) {
                //console.log(state.players[i].name)
                //console.log(state.raw.players)
                const playersobj = state.raw.players[i].identifiers

                //const currentuser = client.fetchUser(state.raw.players[i].identifiers[5])
                embed.addField(`${state.raw.players[i].name}`,`Server ID: ${state.raw.players[i].id}\nPing: ${state.players[i].ping}ms`,true)
            }
            message.channel.send(embed)
        //}).catch((error) => {
           // console.log("Server is offline");
        });
    }
};