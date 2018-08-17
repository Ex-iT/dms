const powershell = require('./powershell');

/**
 * Mount or unmount a device at the specified drive letter
 *
 * @param {String} mountPoint The point to mount the drive on'
 * @param {String} deviceID The device ID to mount, when omitted it will unmount the mountPoint
 * @returns {Promise} Output from the powershell command
 */
function mountDrive(mountPoint = '', deviceID = '') {
	return new Promise((resolve, reject) => {
		const mountCmd = `"& mountvol '${mountPoint}' '${deviceID}'"`;
		const unMountCmd = `"& mountvol \'${mountPoint}\' /D"`;
		const command = 'Invoke-Expression ' + (deviceID ? mountCmd : unMountCmd);

		powershell(command).then(stdout => {
			resolve(stdout);
		})
		.catch(stderr => {
			reject(stderr);
		});
	});

}

module.exports = mountDrive;
