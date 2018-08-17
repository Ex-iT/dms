/**
 * Execute a PowerShell command as a child process
 *
 * @param {String} command The command to execute
 * @returns {Promise} Standard out
 */
function powershell(command) {
	return new Promise((resolve, reject) => {
		const spawn = require('child_process').spawn;
		const child = spawn('powershell.exe', [command]);

		let stdout, stderr;
		child.stdout.on('data', data => stdout = data.toString());
		child.stderr.on('data', data => stderr = data.toString());

		child.on('exit', () => {
			if (stderr) {
				reject(stderr);
			} else {
				resolve(stdout);
			}
		});

		child.stdin.end();
	});
}

module.exports = powershell;
