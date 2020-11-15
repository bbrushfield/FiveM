const Discord = require("discord.js");

module.exports = {
    name: "uptime",
    aliases: ["ut"],
    category: "General",
    description: "Returns uptime of Bot",
    usage: "ping",
    run: async (client, message, args) => {
        const moment = require("moment");
        require("moment-duration-format");
        const duration = moment.duration(client.uptime).format(" D [day(s)], H [hour(s)], m [minutes], s [seconds]");
        const embed = new Discord.MessageEmbed()
        embed.setTitle("Uptime Window")
        embed.setDescription(`Current uptime: ${duration}`)
        embed.setColor("GREEN")
        embed.setFooter("Uptime Window - FiveM Bot developed by AyeeMod#0001")
        message.channel.send(embed)
        console.log(duration);
    }
}