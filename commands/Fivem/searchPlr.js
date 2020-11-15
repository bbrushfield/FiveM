const { EEXIST } = require('constants');
const Discord = require('discord.js');
const { stat } = require('fs');
const SteamAPI = require('steamapi')
const SAHParr = ['1K',"2K","3K","4K"]
const BCSOarr = ["1C","2C","3C","4C"]
const FDarr = ["1F","2F","3F","4F"]
function ErrorEmbed(message){
    const errorembed = new Discord.MessageEmbed()
    errorembed.setTitle("Uh Oh! Player Search Failed!")
    errorembed.setColor("RED")
    errorembed.setDescription("Sorry! The player you searched could not be found to be active in the server.\n**PLEASE NOTE:** *You cannot search for a player not currently active on the server!*")
    errorembed.addField("If you believe this is wrong, please retry or contact an Administrator!",`Error: PlrInvalidErr`)
    errorembed.setFooter("Player Search Error Window - FiveM Bot developed by AyeeMod#0001")
    message.channel.send(errorembed)
}

function SearchType(str){
    for (d = 0; d < SAHParr.length; d++) {
        if (str.includes(SAHParr[d])){
            return "SAHP"
        }
    }
    for (e = 0; e < BCSOarr.length; e++) {
        if (str.includes(BCSOarr[e])){
            return "BCSO"
        }
    }
    for (f = 0; f < FDarr.length; f++) {
        if (str.includes(FDarr[f])) {
            return "FD"
        }
    }
    return "CIV"
}

module.exports = {
    name: "search",
    aliases: ["plrinfo","searchplayer"],
    category: "Fivem",
    description: "Returns player count on Servers. Specify which server you want to view. Default is main server",
    usage: "search <Username>",
    run: async (client, message, args) => {
        const Gamedig = require('gamedig');
        Gamedig.query({
            type: 'fivem',
            host: 'main.bbrp.cloud'
        }).then((state) => {
            if (state.raw.players.length === 0){
                console.log("No players")
                const noplrembed = new Discord.MessageEmbed()
                noplrembed.setTitle("There are no Players currently on the server!")
                noplrembed.setDescription("Please try again later, when there may be players on!")
                noplrembed.setColor("RED")
                noplrembed.setFooter("Search Function - FiveM Bot developed by AyeeMod#0001")
                message.channel.send(noplrembed)
            } else if (args.length == 0) {
                const argsembed = new Discord.MessageEmbed()
                argsembed.setTitle("You have not provided any player name!")
                argsembed.setDescription("Please provide a player name. If you do not know the active players, please use the player command")
                argsembed.setColor("RED")
                argsembed.setFooter("Search Function - FiveM Bot developed by AyeeMod#0001")
            }else {
                console.log("Players!")
                for (i = 0; i < state.raw.players.length; i++) {
                    //console.log(state.players[i].name)
                    //console.log(state.raw.players)
                    const stateplayers = state.raw.players[i].name
                    const playersvar = state.raw.players
                    const statelower = state.raw.players[i].name.toLowerCase()
                    if (statelower.includes(args[0].toLowerCase())) {
                        async function asyncCall() {
                            const embed = new Discord.MessageEmbed()
                            embed.setTitle(`Player Information: ${state.raw.players[i].name}`)
                            embed.setColor("RANDOM")
                            embed.setFooter("Active Player Search - FiveM Bot developed by AyeeMod#0001")
                            const playersobj = state.raw.players[i].identifiers
                            //Discord Information Identification
                            for (v = 0; v < playersobj.length; v++) {
                                if (playersobj[v].includes("discord")){ 
                                    const iddisc = playersobj[v].replace("discord:","") //Removes "discord:" from string
                                    const result = await client.users.fetch(iddisc);
                                    embed.addField(`Discord Information`,`Username: ${result.username}#${result.discriminator}\nUser ID: ${result.id}`)
                                } else if (playersobj[v].includes('steam')) {
                                    embed.addField(`Steam Information`,`Steam Account Verified:\n${state.raw.players[i].name}`)
                                }
                            }
                            //For LEO / FD / CIV Identification:
                            const searchtype = SearchType(stateplayers)
                            if (searchtype == "SAHP") {
                                embed.addField("Identification Type",`Type: LEO\nUnit: San Andreas Highway Patrol`)
                            } else if (searchtype == "BCSO") {
                                    embed.addField("Identification Type","Type: LEO\nUnit: Blaine County Sherriff's Office")
                            } else if (searchtype == "FD") {
                                embed.addField("Identification Type","Type: FD\nUnit: Fire Department")
                            } else if (searchtype == "CIV") {
                                embed.addField("Identification Type","Type: CIV/DPS\nIdent: Civillian / Other")
                            };
                        message.channel.send(embed)
                    }
                        asyncCall()
                        return; //NOTE: Keep this return at the bottom of the if statement AT ALL TIMES
                    }

                }
                ErrorEmbed(message)
            }
        });
    }
};