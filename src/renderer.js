const Store = require('./lib/store');
const mountDrive = require('./lib/mountDrive');
const log = require('./lib/log');
const isAdmin = require('./lib/isAdmin');

const CronJob = require('cron').CronJob;

const { remote } = require('electron');
const win = remote.getCurrentWindow();

// Components
const mountPoints = require('./components/mountPoints/mountPoints');
const mountPointsAll = require('./components/mountPointsAll/mountPointsAll');
const devices = require('./components/devices/devices');

/* Note:
	Run the application with admin rights
	- runas.exe /noprofile /user:<username> <command>
*/
(function (doc) {
	isAdmin().then(response => {
		if (!response.error && response.isAdmin) {
			addEvents();
			setMountOptions()
				.then(response => {
					if (response.done) {
						const data = Store.get('data');
						if (data.disk && data['drive-letter'] && data['mount-time'] && data['unmount-time']) {
							unMountScheduldedDevice(data)
								.then(response => {
									if (response.succes) {
										setStoredValues(data);
										setTimers(data);
										disableForm(doc.getElementById('form'));
									} else {
										log('[warning] unable to unmount schedulded device');
									}
								});
						} else {
							toggleToolsSection();
							log('[info] No job scheduled');
						}
					} else {
						log('[setMountOptions] unkown error');
					}
				})
				.catch(response => {
					if (response.error) {
						log(`[setMountOptions] error: ${response.description}`);
					} else {
						log('[setMountOptions] unkown error');
					}
				});
		} else {
			noAdmin();
		}
	});

	function unMountScheduldedDevice(data) {
		return new Promise((resolve, reject) => {
			log(`[unMountScheduldedDevice] ${data['drive-letter']}`);
			mountDrive(data['drive-letter']).then(() => {
				log(`[unmounting] done`);
				resolve({ succes: true });
			})
				.catch(() => {
					reject({ succes: false });
				});
		});
	}

	function noAdmin() {
		doc.getElementById('no-admin').classList.add('active');
		doc.getElementById('reload').addEventListener('click', () => win.reload());
		showWinWarning();
	}

	function showWinWarning() {
		win.flashFrame(true);
		win.setSkipTaskbar(false);
		win.show();
	}

	function setMountOptions() {
		return new Promise((resolve, reject) => {
			Promise.all([devices(), mountPoints(), mountPointsAll()])
				.then(([devices, mountPoints, mountPointsAll]) => {
					setSelectOptions(devices.sorted, doc.getElementById('disk'));
					setSelectOptions(mountPointsAll.all, doc.getElementById('drive-letter'));

					setSelectOptions(devices.sorted, doc.getElementById('tools-disk'));
					setSelectOptions(mountPoints.unused, doc.getElementById('tools-drive-letter-mount'));
					setSelectOptions(mountPoints.used, doc.getElementById('tools-drive-letter-unmount'));

					resolve({ done: true });
				})
				.catch(error => {
					reject({ done: false, error: true, description: error });
				})
		});
	}

	function setSelectOptions(options, element) {
		element.innerHTML = options;
		element.disabled = false;
	}

	function setTimers(data) {
		const disk = data['disk'];
		const letter = data['drive-letter'];
		const mountTime = data['mount-time'];
		const unmountTime = data['unmount-time'];

		if (disk && letter && mountTime && unmountTime) {
			setCron(data);
			log(`[timer] set timers - ${JSON.stringify(data)}}`);
		}
	}

	function setCron(data) {
		const mountTimeArr = data['mount-time'].split(':');
		const unmountTimeArr = data['unmount-time'].split(':');

		new CronJob({
			cronTime: `${mountTimeArr[1]} ${mountTimeArr[0]} * * *`,
			onTick: () => {
				mountDrive(data['drive-letter'], data.disk).then(() => {
					log(`[job mounting] ${data['drive-letter']}`);
				});
			},
			onComplete: () => this.stop(),
			start: false
		}).start();

		new CronJob({
			cronTime: `${unmountTimeArr[1]} ${unmountTimeArr[0]} * * *`,
			onTick: () => {
				mountDrive(data['drive-letter']).then(() => {
					log(`[job unmounting] ${data['drive-letter']}`);
				});
			},
			onComplete: () => this.stop(),
			start: false
		}).start();
	}

	function setStoredValues(data) {
		Object.keys(data).forEach(key => {
			const input = doc.getElementById(key);
			if (input) {
				input.value = data[key];
			}
		});
	}

	function disableForm(form, disable = true) {
		form.classList.toggle('disabled', disable);
		form['disk'].disabled = disable;
		form['drive-letter'].disabled = disable;
		form['mount-time'].disabled = disable;
		form['unmount-time'].disabled = disable;
	}

	function toggleToolsSection() {
		const elem = doc.getElementById('tools-section');
		const isExpanded = elem.classList.toggle('expanded');

		const winBounds = win.getBounds();
		win.setSize(winBounds.width, isExpanded ? 690 : 280);
	}

	function addEvents() {
		const form = doc.getElementById('form');
		const editJobBtn = form['edit-job'];
		const toolsForm = doc.getElementById('tools');

		editJobBtn.addEventListener('click', () => disableForm(form, false));

		form.addEventListener('submit', event => {
			event.preventDefault();

			const data = {};
			const form = event.target;
			const formData = new FormData(form);
			for (let value of formData) {
				data[value[0]] = value[1];
			}

			disableForm(form);

			Store.set('data', data);
			setTimers(data);
		});

		// Tools
		doc.getElementById('tools-collapse').addEventListener('click', () => toggleToolsSection());
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
