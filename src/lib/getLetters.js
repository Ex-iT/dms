'use strict';

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

			resolve(removeUsedLetters(usedLetters));
		});
	});
}

function removeUsedLetters(usedLetters) {
	const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	for (let i = 0; i < usedLetters.length; i++) {
		letters.splice(letters.indexOf(usedLetters[i]), 1);
	}

	return letters;
}


module.exports = getLetters;
