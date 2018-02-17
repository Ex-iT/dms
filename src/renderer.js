const Store = require('./lib/store');

const getDrives = require('./lib/getDrives');
const mountDrive = require('./lib/mountDrive');

// Components
const mountPoints = require('./components/mount-points/mount-points');

(function (doc) {

	// getDrives().then(drives => {
	// 	console.log(drives);
	// });
	mountDrive().then(mount => {
		console.log(mount);
	});

	addEvents(doc);

	mountPoints().then(html => {
		const selectElm = doc.getElementById('drive-letter');
		selectElm.innerHTML = html;

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
}
