const powershell = require('./powershell');

/**
 * Gets a JSON object with device information
 *
 * @returns {Promise} A JSON object with DeviceID, letter and name of the device
 */
function getDrives() {
	return new Promise((resolve, reject) => {
		const command = 'Get-Volume | Select-Object -Property UniqueId, DriveLetter, FileSystemLabel, Size, SizeRemaining | ConvertTo-Json';

		powershell(command).then(stdout => {
			resolve(JSON.parse(stdout));
		})
		.catch(stderr => {
			reject(stderr);
		});
	});
}

module.exports = getDrives;
