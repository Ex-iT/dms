const Store = require('./lib/store');
const mountDrive = require('./lib/mountDrive');
const log = require('./lib/log');

const { remote } = require('electron');
const win = remote.getCurrentWindow();

// Components
const mountPoints = require('./components/mount-points/mount-points');
const devices = require('./components/devices/devices');

/* Note:
	Run the application with admin rights
	- runas.exe /noprofile /user:<username> <command>
*/
(function (doc) {
	addEvents();
	setMountOptions();

	// console.log(win.getBounds());
	// win.setSize(760, 700);

	// https://crontab.guru/every-5-minutes - */5 * * * *
	var CronJob = require('cron').CronJob;
	new CronJob({
		cronTime: '57 17 * * *',
		onTick: function() {
			const data = Store.get('data');
			mountDrive(data['drive-letter'], data.disk).then(() => {
				log(`[job mounting] ${data['drive-letter']}`);
			});
			this.stop();
		},
		onComplete: () => log('[job mounting] done'),
		start: false
	}).start();

	new CronJob({
		cronTime: '58 17 * * *',
		onTick: function() {
			const data = Store.get('data');
			mountDrive(data['drive-letter']).then(() => {
				log(`[job unmounting] ${data['drive-letter']}`);
			});
			this.stop();
		},
		onComplete: () => log('[job unmounting] done'),
		start: false
	}).start();

	function setMountOptions() {
		Promise.all([devices(), mountPoints()])
		.then(([devices, mountPoints]) => {
			setSelectOptions(devices.sorted, doc.getElementById('disk'));
			setSelectOptions(mountPoints.unused, doc.getElementById('drive-letter'));

			setSelectOptions(devices.all, doc.getElementById('tools-disk'));
			setSelectOptions(mountPoints.unused, doc.getElementById('tools-drive-letter-mount'));
			setSelectOptions(mountPoints.used, doc.getElementById('tools-drive-letter-unmount'));

			setStoredValues(doc);
		});
	}

	function setSelectOptions(options, element) {
		element.innerHTML = options;
		element.disabled = false;
	}

	function setStoredValues(doc) {
		const data = Store.get('data');
		if (data) {
			Object.keys(data).forEach(key => {
				const input = doc.getElementById(key);
				if (input) {
					input.value = data[key];
				}
			});
		}
	}

	function addEvents() {
		const form = doc.getElementById('form');
		const toolsForm = doc.getElementById('tools');

		form.addEventListener('submit', event => {
			event.preventDefault();

			const data = {};
			const formData = new FormData(event.target);
			for (let value of formData) {
				data[value[0]] = value[1];
			}
			Store.set('data', data);
		});

		// Tools
		doc.getElementById('mount').addEventListener('click', () => {
			const device = toolsForm['tools-disk'].value;
			const letter = toolsForm['tools-drive-letter-mount'].value;
			log(`[mounting] ${letter} ${device}`);
			mountDrive(letter, device).then(() => {
				log(`[mounting] done`);
				setMountOptions();
			});
		});
		doc.getElementById('unmount').addEventListener('click', () => {
			const letter = toolsForm['tools-drive-letter-unmount'].value;
			log(`[unmounting] ${letter}`);
			mountDrive(letter).then(() => {
				log(`[unmounting] done`);
				setMountOptions();
			});
		});
		doc.getElementById('clear-output').addEventListener('click', () => {
			toolsForm['output'].value = '';
		});
	}

})(document);
