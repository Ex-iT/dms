'use strict';

/**
 * Gets a JSON object with device information
 *
 * @returns {Promise} A JSON object with DeviceID, letter and name of the device
 */
function getDrives() {
	return new Promise((resolve, reject) => {
		const spawn = require('child_process').spawn;
		const command = 'gwmi Win32_Volume | Select-Object DeviceID, DriveLetter, Label | ConvertTo-Json';
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

module.exports = getDrives;
