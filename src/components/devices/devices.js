const getDrives = require('./../../lib/getDrives');
const getTemplate = require('./../../lib/getTemplate');
const sTE = require('./../../lib/sTE');

function devices() {
	return new Promise((resolve, reject) => {
		Promise.all([getDrives(), getTemplate('devices')])
		.then(([drives, template]) => {
			const sortedDrives = drives.map(drive => {
				drive.disabled = false;
				if (drive['Label'] === 'System Reserved' || drive['DriveLetter']) {
					drive.disabled = true;
				}
				drive['Freespace'] = formatSize(drive['Freespace']);
				return Object.assign({}, drive);
			}).sort(drive => drive.disabled);

			resolve({ sorted: sortedDrives.map(drive => sTE(template, drive)).join('\n') });
		}).catch(err => reject(err));
	});
}

function formatSize(size) {
	let formattedSize = size;
	if (size && typeof size === 'number') {
		const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
		formattedSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
	}
	return formattedSize;
}

module.exports = devices;
