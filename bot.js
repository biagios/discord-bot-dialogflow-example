// Attempt to load discord.js
try {
	// Define discord.js
	var Discord = require('discord.js')
	// Throw an error if node is outdated
	if (process.version.slice(1).split('.')[0] < 12) {
		throw new Error('Node 12.0.0 or higher is required. Please upgrade Node.js on your computer / server.')
	}
} catch (e) {
	// Catch other errors like modules not installed.
	console.error(e.stack)
	console.error('Current Node.js version: ' + process.version)
	console.error('In case you´ve not installed any required module: \nPlease run \'npm install\' and ensure it passes with no errors!')
	process.exit()
}

// #### Creating the client ####


// Define the client.
const client = new Discord.Client({ disableMentions: 'everyone' })
// Define PREFIX, VERSION, TOKEN from the config file.
const { PREFIX, VERSION, TOKEN} = require('./config')




// #### Defining various modules ####

// Define dialogflow from the modules
const askDialog = require('./modules/dialog.js').askDialog
// Define 'util' module, this contains various scripts that are often used.
const Util = require('./modules/util')
// Define 'logger' module, this is used when logging what the bot does.
const Logger = new Util.Logger();
// Degine 'fs' file system module.
const fs = require('fs');
// Imports the Google Cloud client library.
//const {Storage} = require('@google-cloud/storage');
// Instantiates a client.
// If you don't specify credentials when constructing the client, the client library will look for credentials in the environment.
//const storage = new Storage();


// #### Load Commands ####

// Creating a collection for the commands.
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection,
	// with the key as the command name and the value as the exported module.
	client.commands.set(command.name, command);
	// Check if any alias does exist and add if they do add them too.
	if(command.alias) {
		for(const alias of command.alias) {
			client.commands.set(alias, command)
		}
	}
}



// #### Handling client events ####

// Throw warning on warning.
client.on('warn', console.warn)

// Throw error on error.
client.on('error', console.error)

// Throw console logs when the bot is first online.
client.on('ready', async () => {
	// Basic logging
	Logger.info('\nStarting...\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version + '\n')
	Logger.info('\nPal is online! Running on version: ' + VERSION + '\n')
	// Change the bot's presence
	client.user.setPresence({
		status: 'online',
		activity: {
			name: `${PREFIX}help | ${client.guilds.cache.size} servers`,
		},
	}).catch(e => {
		console.error(e)
	})
	// More basic logging
	Logger.info(`Ready to serve on ${client.guilds.cache.size} servers for a total of ${this.totalMembers()} users.`)
})



// Log a warning on disconnection.
client.on('disconnect', () => Logger.info('Disconnected!'))
// Log a warning on reconnection.
client.on('reconnecting', () => Logger.info('Reconnecting...'))



// This event will be triggered when the bot joins a guild.
client.on('guildCreate', guild => {

	// Logging the event
	Logger.info(`Joined server ${guild.name} with ${guild.memberCount} users. Total servers: ${client.guilds.cache.size}`)
	// Updating the presence of the bot with the new server amount
	client.user.setPresence({
		activity: {
			name: `${PREFIX}help | ${client.guilds.cache.size} servers`,
		},
	}).catch(e => {
		console.error(e)
	})
})

// This event will be triggered when the bot is removed from a guild.
client.on('guildDelete', guild => {
	// Logging the event
	Logger.info(`Left a server. Total servers: ${client.guilds.cache.size}`)
	// Updating the presence of the bot with the new server amount
	client.user.setPresence({
		activity: {
			name: `${PREFIX}help | ${client.guilds.cache.size} servers`,
		},
	}).catch(e => {
		console.error(e)
	})
})


/**
 * Returns the total amount of users (including bots) who use the bot. CREDIT: Julian Yaman
 * In order to remove bots it would have to check every user and check if they are a bot I believe.
 * */
exports.totalMembers = () => {
	const totalMembersArray = client.guilds.cache.map(guild => {
		return guild.memberCount
	})
	let total = 0;
	for(let i = 0; i < totalMembersArray.length; i++) {
		total = total + totalMembersArray[i]
	}
	return total
}

/* From here on the actual bot begins. Anything below ill happen when a message is recieved. */
client.on('message', async message => {

	// If author is a bot, ignore.
	if (message.author.bot) return

	// Execute if the bot is mentioned but it is not mentioned with an @everyone.
	if (message.mentions.everyone === false && message.mentions.has(client.user)) {
		// Log the even for debug. This can be disabled!
		Logger.info(`Dialogflow interaction was started.`)
		// Define the query as the content of the message.
		let dialogQuery = message.content
		// Remove the bot tag from the query.
		dialogQuery = dialogQuery.replace("<@!300955174225051650>","")
		// Run dialogflow
		askDialog(message,"pal-bot",dialogQuery)
	}

	// If the message recieved is not a command ignore it.
	if (!message.content.startsWith(PREFIX)) return undefined

	// Define the arguments.
	const args = message.content.split(' ')

	// Define the command.
	let command = message.content.toLowerCase().split(' ')[0]
	command = command.slice(PREFIX.length)

	// Ignore if the command does not exist.
	if (!client.commands.has(command)) return;

	try {
		// Log if the bot was triggered in a DM or Group.
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			Logger.info(`${PREFIX + command} used in a private ${message.channel.type}.`)
		} else{
			// Log if the bot was triggerred anywhere else.
			Logger.info(`${PREFIX + command} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}
		// Execute the command
		client.commands.get(command).execute(message, args, { PREFIX, VERSION });
	}
	// Catch any errors.
	catch (error) {
		// Log the errors.
		console.error(error);
		// Let the user know the execution failed.
		await message.reply('There was an error trying to execute that command!');
	}
})

// Log the bot in.
client.login(TOKEN);

// Catch Promise Errors.
process.on('unhandledRejection', (PromiseRejection) => console.error(`Promise Error -> ${PromiseRejection}`))
