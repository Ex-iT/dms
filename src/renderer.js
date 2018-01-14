const getLetters = require('./lib/getLetters');

(function name(appElement) {

	// $driveLetter = "Y:"
	// $deviceID = "\\?\Volume{0d405f63-0000-0000-007e-000000000000}\"
	// gwmi Win32_Volume | ? { $_.deviceID -eq '\\?\Volume{951ea2d0-0000-0000-0000-805474000000}\'} | select -expand name

	getLetters().then(letters => {
		console.log(letters);

		appElement.innerHTML = letters.join(': ');
	}).catch(err => console.log(err));

})(document.getElementById('app'));

