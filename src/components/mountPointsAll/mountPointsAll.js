const getLetters = require('./../../lib/getLetters');
const getTemplate = require('./../../lib/getTemplate');
const sTE = require('./../../lib/sTE');

function mountPoints() {
	return new Promise((resolve, reject) => {
		Promise.all([getLetters(), getTemplate('mountPointsAll')])
		.then(([letters, template]) => {
			resolve({ all: _generateDriveOptions(letters.all, template) });
		}).catch(err => reject(err));
	});
}

function _generateDriveOptions(letters, template) {
	const options = letters.map(letter => {
		return {
			label: letter.letter + ':\\',
			value: letter.letter + ':',
			disabled: letter.disabled
		}
	});

	return options.map(option => sTE(template, option)).join('\n');
}

module.exports = mountPoints;
