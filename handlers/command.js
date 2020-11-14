const { readdirSync } = require("fs");

const ascii = require("ascii-table");
// Sets the table up.
let table = new ascii("Command Load Statuses");
table.setHeading("Command", "Load status");

module.exports = (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
    
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
                // If the code from the file within the commands folder is loaded, it will create a new row with a tick next to the name of the file
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                // If it does not load correctly, it will send this instead of the tick.
                continue;
            }
    
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    
    console.log(table.toString());
}