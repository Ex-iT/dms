const STE = require('./lib/STE');
const getLetters = require('./lib/getLetters');

// $driveLetter = "Y:"
// $deviceID = "\\?\Volume{0d405f63-0000-0000-007e-000000000000}\"
// gwmi Win32_Volume | ? { $_.deviceID -eq '\\?\Volume{951ea2d0-0000-0000-0000-805474000000}\'} | select -expand name

(function name(root, doc, win) {

	getLetters().then(letters => {
		const selectElm = doc.getElementById('drive-letter');
		const options = generateDriveOptions(letters);

		selectElm.innerHTML = options;

	}).catch(err => console.log(err));

	function generateDriveOptions(letters) {
		const templElm = doc.getElementById('templ-list-item');
		const options = letters.map(letter => {
			return {
				label: letter + ':',
				value: letter,
				selected: false
			}
		});
		options[0].selected = true;

		return options.map(option => STE(templElm.innerHTML, option)).join('\n');
	}

})(document.getElementById('app'), document, window);
