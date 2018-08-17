const getDrives = require('./../../lib/getDrives');
const getTemplate = require('./../../lib/getTemplate');
const sTE = require('./../../lib/sTE');
const log = require('./../../lib/log');

function devices() {
	return new Promise((resolve, reject) => {
		Promise.all([getDrives(), getTemplate('devices')])
		.then(([drives, template]) => {
			const allDrives = drives.map(drive => {
				drive.disabled = false;
				if (drive['Label'] === 'System Reserved' || drive['DriveLetter'] === 'C:') {
					drive.disabled = true;
				}
				return drive;
			}).sort(drive => drive.disabled);

			const sortedDrives = drives.map(drive => {
				drive.disabled = false;
				if (!!drive['DriveLetter'] || !!drive['Label']) {
					drive.disabled = true;
				}
				return drive;
			}).sort(drive => drive.disabled);

			resolve({ all: allDrives.map(drive => sTE(template, drive)).join('\n'), sorted: sortedDrives.map(drive => sTE(template, drive)).join('\n') });
		}).catch(err => reject(err));
	});
}

module.exports = devices;
