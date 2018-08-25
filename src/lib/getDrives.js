const powershell = require('./powershell');

/**
 * Gets a JSON object with device information
 *
 * @returns {Promise} A JSON object with DeviceID, letter and name of the device
 */
function getDrives() {
	return new Promise((resolve, reject) => {
		// @TODO: More drive info
		// Get-Disk -Path '\\?\scsi#disk&ven_vbox&prod_harddisk#4&2617aeae&0&000000#{53f56307-b6bf-11d0-94f2-00a0c91efb8b}' | Select FriendlyName, Size | ConvertTo-Json

		const command = 'Get-WmiObject -Class Win32_Volume | Select-Object DeviceID, DriveLetter, Label, Freespace | ConvertTo-Json';

		powershell(command).then(stdout => {
			try {
				let json = JSON.parse(stdout);
				if (json && typeof json === 'object') {
					resolve(json);
				}
			} catch (error) {
				reject(error);
			}
		})
		.catch(stderr => {
			reject(stderr);
		});
	});
}

module.exports = getDrives;
