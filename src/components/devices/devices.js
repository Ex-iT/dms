'use strict';

const getDrives = require('./../../lib/getDrives');
const getTemplate = require('./../../lib/getTemplate');
const sTE = require('./../../lib/sTE');

function devices() {
	return new Promise((resolve, reject) => {
		Promise.all([getDrives(), getTemplate('devices')])
		.then(([drives, template]) => {
			const sortedDrives = drives.map(drive => {
				drive.disabled = false;
				if (!!drive['DriveLetter'] || !!drive['Label']) {
					drive.disabled = true;
				}
				return drive;
			});
			sortedDrives.sort((a) => a.disabled)
			resolve(sortedDrives.map(drive => sTE(template, drive)).join('\n'));
		}).catch(err => reject(err));
	});
}

module.exports = devices;
