const { REST, Routes } = require('discord.js'); // Import REST and Routes from discord.js to interact with the Discord API
require('dotenv').config(); // Load environment variables from a .env file

const commands = require('./commands.json'); // Import the list of commands from the commands.json file

// Create a new REST instance and set the bot token for authentication
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering commands...'); // Log the start of the command registration process

        // Send a PUT request to Discord's API to register the commands globally for the bot
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

        console.log('Commands registered!'); // Log success message when commands are registered
    } catch (error) {
        console.error(error); // Catch and log any errors that occur during the process
    }
})();
