'use strict';

const powershell = require('./powershell');

/**
 * Gets a JSON object with device information
 *
 * @returns {Promise} A JSON object with DeviceID, letter and name of the device
 */
function getDrives() {
	return new Promise((resolve, reject) => {
		const command = 'gwmi Win32_Volume | Select-Object DeviceID, DriveLetter, Label | ConvertTo-Json';

		powershell(command).then(stdout => {
			resolve(JSON.parse(stdout));
		})
		.catch(stderr => {
			reject(stderr);
		});
	});
}

module.exports = getDrives;
