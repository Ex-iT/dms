/**
 * getLetters
 * Get a list of unused drive letters on the current machine
 *
 * @returns {Promise} Array with unused drive letters
 */
function getLetters() {
	const childProcess = require('child_process');
	const command = 'wmic logicaldisk get caption';

	return new Promise((resolve, reject) => {
		childProcess.exec(command, (err, stdout) => {
			if (err) {
				return reject(err);
			}

			let usedLetters = stdout.split(/\r\n/).map(line => line.trim().replace(':', '')).filter(line => line);
			usedLetters.splice(0, 1) // Remove fist item from array
			usedLetters = usedLetters.filter(letter => letter !== 'C')

			const unused = _removeUsedLetters(usedLetters);
			const used = usedLetters;
			resolve({ all: _allLetters(usedLetters), unused, used });
		});
	});
}

function _allLetters(usedLetters) {
	const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	const allLetters = [];
	letters.forEach(letter => {
		allLetters.push({ letter: letter, disabled: usedLetters.indexOf(letter) !== -1 });
	});
	return allLetters;
}

function _removeUsedLetters(usedLetters) {
	const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	return letters.filter(letter => !usedLetters.includes(letter));
}

module.exports = getLetters;
