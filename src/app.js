const { app, session, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const url = require('url');
const development = process.env.NODE_ENV !== 'production';

const iconPath = path.join(__dirname, 'dms.ico');
const title = 'Drive Mount Scheduler';
let tray = null;

function createWindow() {
	// CSP HTTP Header
	// @NOTE: doesn't seem to work, so setting it in the index.html as meta-tag
	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({ responseHeaders: `default-src 'self'; script-src 'unsafe-inline'` });
	});

	let win = new BrowserWindow({
		width: 900,
		height: 280,
		maximizable: false,
		icon: iconPath,
		show: development, // start minimized in prod
		resizable: development
	});

	// Remove toolbar
	win.setMenu(null);

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	if (development) {
		win.webContents.openDevTools();
	}

	tray = new Tray(iconPath);
	var contextMenu = Menu.buildFromTemplate([{
			label: 'Open',
			click: () => {
				win.setSkipTaskbar(false);
				win.show();

				console.log(app.getName());
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
	tray.setToolTip(title);
	tray.setContextMenu(contextMenu);
	tray.on('double-click', () => win.isVisible() ? win.hide() : win.show());

	win.on('closed', () => win = null);
	win.on('minimize', event => {
		event.preventDefault();
		win.setSkipTaskbar(true);
		win.hide();
	});
}

app.setAppUserModelId(title);
app.setName(title);
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

