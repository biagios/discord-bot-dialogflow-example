/**
 * Command: ping
 * Description: pongs
 * */

module.exports = {
	name: 'ping',
	description: 'pongs',
	execute(message, args, config) {
    message.channel.send('Catch this! :ping_pong:')
	},
}
