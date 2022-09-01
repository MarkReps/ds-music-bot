require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/*
 * Собираем доступные команды с файла commands
 */
client.commands = new Collection();
const commandPath = path.join(__dirname, "commands");

//Собираем все файлы расширения .js
const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));

// регистрирутием команды в свойстве commands
for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

/*
 * Создаем events
 */

const eventsPath = path.join(__dirname, "events");
const eventsFile = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of eventsFile) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => {
            event.execute(...args);
        });
    } else {
        client.on(event.name, (...args) => {
            event.execute(...args);
        });
    }
}

client.login(process.env.TOKEN);
