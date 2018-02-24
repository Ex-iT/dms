'use strict';

const Store = require('./lib/store');

const mountDrive = require('./lib/mountDrive');

// Components
const mountPoints = require('./components/mount-points/mount-points');
const devices = require('./components/devices/devices');

/* Note:
	Run the application with admin rights
	- runas.exe /noprofile /user:<username> <command>
*/
(function (doc) {

	// mountDrive('E:', '\\\\?\\Volume{750aa7c8-140a-11e8-be87-08002756f1fd}\\').then(mount => {
	// 	console.log(mount);
	// });

	addEvents(doc);

	Promise.all([devices(), mountPoints()])
	.then(([devicesHTML, mountPointsHTML]) => {
		const selectDisk = doc.getElementById('disk');
		selectDisk.innerHTML = devicesHTML;
		selectDisk.disabled = false;

		const selectDrive = doc.getElementById('drive-letter');
		selectDrive.innerHTML = mountPointsHTML;
		selectDrive.disabled = false;

		setStoredValues(doc);
	});
})(document);

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

function addEvents(doc) {
	const form = doc.getElementById('form');

	form.addEventListener('submit', event => {
		event.preventDefault();

		const data = {};
		const formData = new FormData(event.target);
		for (let value of formData) {
			data[value[0]] = value[1];
		}
		Store.set('data', data);
	});


	// FOR DEBUGGING ONLY!
	doc.getElementById('mount').addEventListener('click', () => {
		const letter = form['drive-letter'].value;
		const device = form['disk'].value;
		mountDrive(letter, device).then(mount => {
			console.log('mount', letter, device);
		});
	});
	doc.getElementById('unmount').addEventListener('click', () => {
		const letter = form['drive-letter'].value;
		mountDrive(letter).then(unmount => {
			console.log('unmount', letter);
		});
	});
}
