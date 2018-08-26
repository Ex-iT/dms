/*
https://www.npmjs.com/package/rcedit

rcedit.exe DMS.exe --set-version-string "FileDescription" "Drive Mount Scheduler"
rcedit.exe DMS.exe --set-version-string "ProductName" "Drive Mount Scheduler"
rcedit.exe DMS.exe --set-version-string "LegalCopyright" "Copyright (C) 2018 - Ex-iT"
*/

const packager = require('electron-packager');
const packageJson = require('./package.json');

const options = {
	'platform': 'win32',
	'arch': 'x64',
	'dir': './',
	'appCopyright': `Copyright (C) ${new Date().getFullYear()} - ${packageJson.author.name}`,
	'appVersion': packageJson.version,
	'icon': './src/icon.ico',
	'name': packageJson.description,
	'ignore': ['./dist', './.git'],
	'out': './dist',
	'overwrite': true,
	// 'asar': true,
	'prune': true,
	'win32metadata': {
		'CompanyName': packageJson.author.name,
		'FileDescription': packageJson.description,
		'OriginalFilename': `${packageJson.description}.exe`,
		'ProductName': packageJson.description,
		'InternalName': packageJson.name,
		'application-manifest': './dms.manifest'
	}
};

packager(options)
	.then(appPaths => {
		console.log(appPaths);
	})
	.catch(error => {
		console.log(error);
	});
