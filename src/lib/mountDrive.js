'use strict';

/* NOTES:
$driveLetter = "Y:"
$deviceID = "\\?\Volume{0d405f63-0000-0000-007e-000000000000}\"

gwmi Win32_Volume | ? { $_.deviceID -eq '\\?\Volume{750aa7c8-140a-11e8-be87-08002756f1fd}\'} | select -expand name

// unmount
Invoke-Expression "& mountvol E: /D"
// mount
Invoke-Expression "& mountvol E: '\\?\\Volume{750aa7c8-140a-11e8-be87-08002756f1fd}\'"

.\mountvol.exe 'E:' '\\?\Volume{750aa7c8-140a-11e8-be87-08002756f1fd}\'
runas.exe /profile /user:<username> <command>
*/

function mountDrive() {
	return new Promise((resolve, reject) => {
		const driveLetter = 'E:';
		const deviceID = '\\\\?\\\\Volume{750aa7c8-140a-11e8-be87-08002756f1fd}\\';

		const spawn = require('child_process').spawn;
		const mount = `Invoke-Expression "& mountvol ${driveLetter} ${deviceID}"`;
		const unMount = `Invoke-Expression "& mountvol ${driveLetter} /D"`;
		const child = spawn('powershell.exe', [unMount]);

		// let stdout, stderr;
		// child.stdout.on('data', data => stdout = data.toString());
		// child.stderr.on('data', data => stderr = data.toString());

		// child.on('exit', () => {
		// 	if (stderr) {
		// 		reject(stderr);
		// 	} else {
		// 		resolve(stdout);
		// 	}
		// });

		child.stdin.end();
	});

}

module.exports = mountDrive;
