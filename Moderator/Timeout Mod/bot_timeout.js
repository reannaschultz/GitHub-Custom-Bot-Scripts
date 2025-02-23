require('dotenv').config(); // Load environment variables from a .env file to securely store sensitive information

const { Client, GatewayIntentBits } = require('discord.js'); // Import the required classes from discord.js

// Create a new Discord client with the necessary intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildModeration] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`); // Log a message when the bot successfully logs in
});

// Listen for interactions (slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return; // Ignore interactions that are not commands

    if (interaction.commandName === 'timeout') { // Check if the command is "timeout"
        const user = interaction.options.getUser('user'); // Get the user mentioned in the command
        const duration = interaction.options.getInteger('duration'); // Get the duration input (in minutes)

        try {
            const member = await interaction.guild.members.fetch(user.id); // Fetch the guild member object
            await member.timeout(duration * 60 * 1000, 'Automated timeout'); // Apply the timeout (convert minutes to milliseconds)

            await interaction.reply(`${user.tag} has been sent to the kennel for ${duration} minutes. We do not tollerate frequent barking in the lab.`); // Send confirmation message. This is unique to CSL discord.
        } catch (error) {
            console.error(error); // Log errors to the console
            await interaction.reply(`I failed at sending ${user.tag} to the kennel.`); // Inform the user if the timeout fails
        }
    }
});

client.login(process.env.TOKEN); // Log the bot in using the token from the .env file
