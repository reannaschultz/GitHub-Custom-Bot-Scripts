const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

// Create a new Discord client instance with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Allows bot to receive guild-related events
        GatewayIntentBits.GuildMessages, // Allows bot to receive messages in guilds
        GatewayIntentBits.MessageContent, // Allows bot to read message content
        GatewayIntentBits.GuildMembers // Allows bot to fetch and manage guild members
    ]
});

const messageLog = new Map(); // Tracks user messages to detect spam
const MESSAGE_LIMIT = 5; // Maximum messages allowed before timeout
const TIME_WINDOW = 5000; // Time window in milliseconds (5 seconds)
const TIMEOUT_DURATION = 10 * 1000; // Timeout duration in milliseconds (10 seconds)

// Event listener for new messages
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore bot messages
    
    const userId = message.author.id;
    const now = Date.now();

    // If user is not in messageLog, add them with an empty array
    if (!messageLog.has(userId)) {
        messageLog.set(userId, []);
    }

    const timestamps = messageLog.get(userId);
    timestamps.push(now); // Add current timestamp to user's message log

    // Remove timestamps older than the defined time window
    while (timestamps.length > 0 && timestamps[0] < now - TIME_WINDOW) {
        timestamps.shift();
    }

    // If user exceeds message limit within time window, apply timeout
    if (timestamps.length >= MESSAGE_LIMIT) {
        try {
            const member = await message.guild.members.fetch(userId); // Fetch member details
            await member.timeout(TIMEOUT_DURATION, 'Spamming messages'); // Apply timeout
            message.channel.send(`${member} has been put in the kennel for spamming messages.`); // Notify the channel
            messageLog.delete(userId); // Reset tracking for this user
        } catch (error) {
            console.error('Failed to timeout user:', error); // Log error if timeout fails
        }
    }
});

// Event listener when bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`); // Log bot's status
});

// Log in the bot using token from environment variables
client.login(process.env.TOKEN);
