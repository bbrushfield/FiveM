module.exports = {
    name: "ping",
    aliases: ["pong"],
    category: "General",
    description: "Returns latency and API Ping",
    usage: "ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`pinging...`);
    
        msg.edit(`Pong\n Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ping)}ms`); 
    }
}