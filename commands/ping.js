/**
 * Command: ping
 * Description: pongs
 * */

module.exports = async {
	name: 'ping',
	description: 'pongs',
	execute(message, args, config) {
    // Start of command:
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip).
    const m = await message.channel.send('One second...')
    m.edit('Catch this! :ping_pong: It took ` ' + (m.createdTimestamp - message.createdTimestamp) + ' ms `.')

	},
}
