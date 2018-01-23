const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const url = require('url');
const development = process.env.NODE_ENV !== 'production';

const iconPath = path.join(__dirname, 'dms.ico');
const title = 'Drive Mount Scheduler';
let appIcon = null;
let win = null;

function createWindow() {
	win = new BrowserWindow({
		width: 1280, height: 800,
		maximizable: false,
		icon: iconPath,
		// show: false,
		resizable: development });

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	if (development) {
		win.webContents.openDevTools();
	}

	appIcon = new Tray(iconPath);
	var contextMenu = Menu.buildFromTemplate([{
			label: 'Show App',
			click: () => {
				win.setSkipTaskbar(false);
				win.show();
			}
		},
		{
			label: 'Exit',
			click: () => {
				app.isQuiting = true;
				app.quit();
			}
		}
	]);
	appIcon.setToolTip(title);
	appIcon.setContextMenu(contextMenu);

	win.on('closed', () => {
		win = null
	});

	win.on('minimize', event => {
		event.preventDefault();
		win.setSkipTaskbar(true);
		win.hide();
	});
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

