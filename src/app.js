const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const development = process.env.NODE_ENV !== 'production';

let win;

function createWindow() {
	win = new BrowserWindow({ width: 1280, height: 800 });

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	if (development) {
		win.webContents.openDevTools();
	}

	win.on('closed', () => {
		win = null
	});
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
});
