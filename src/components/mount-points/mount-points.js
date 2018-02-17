'use strict';

const getLetters = require('./../../lib/getLetters');
const getTemplate = require('./../../lib/getTemplate');
const sTE = require('./../../lib/sTE');

function mountPoints() {
	return new Promise((resolve, reject) => {
		Promise.all([getLetters(), getTemplate('mount-points')])
		.then(([letters, template]) => {
			resolve(_generateDriveOptions(letters, template));
		}).catch(err => reject(err));
	});
}

function _generateDriveOptions(letters, template) {
	const options = letters.map(letter => {
		return {
			label: letter + ':',
			value: letter
		}
	});

	return options.map(option => sTE(template, option)).join('\n');
}

module.exports = mountPoints;
