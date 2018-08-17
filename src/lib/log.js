
module.exports = function log(message) {
	const elmId = 'output';
	const outputElm = document.getElementById(elmId);

	if (outputElm) {
		let newLine = '\n';
		if (!outputElm.value) {
			newLine = '';
		}
		outputElm.value += `${newLine}${message.toString()}`;
	} else {
		console.error(`No element with id ${elmId} found!`);
	}
};
