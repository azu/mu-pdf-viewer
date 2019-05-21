const electron = require("electron");
const app = electron.app;
const shell = electron.shell;
const Menu = electron.Menu;
const path = require("path");
const windowStateKeeper = require('electron-window-state');
const defaultMenu = require('electron-default-menu');
const BrowserWindow = electron.BrowserWindow;
const argv = require('minimist')(process.argv.slice(2));
const qs = require("querystring");
let openedFilePath;
app.once('open-file', function (event, filePath) {
    openedFilePath = filePath;
});
const openURL = (URL) => {
    if (/^https?:/.test(URL)) {
        shell.openExternal(URL, {
            activate: true
        });
    }
};
let mainWindow = null;
app.on('ready', function () {
    const mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: false,
        }
    });
    mainWindow = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
    });
    mainWindow.webContents.on('new-window', function (e) {
        openURL(e.url);
    });
    const openHTML = (filePath) => {
        const query = qs.stringify({
            file: filePath
        });

        if (process.env.APP_URL) {
            mainWindow.loadURL(process.env.APP_URL + "?" + query);
            return;
        }
        mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html?" + query)}`);
    };
    if (argv._ && argv._.length > 0) {
        const filePath = path.resolve(process.cwd(), argv._[0]);
        openHTML(filePath);
    } else if (argv.file) {
        const filePath = path.resolve(process.cwd(), argv.file);
        openHTML(filePath);
    } else if (openedFilePath) {
        openHTML(openedFilePath);
    } else {
        openHTML();
    }
    app.on('open-file', function (event, filePath) {
        event.preventDefault();
        openHTML(filePath);
    });
    if (process.env.NODE_ENV === "development") {
        mainWindow.webContents.openDevTools();
    }
    // Get template for default menu
    const menu = defaultMenu(app, shell);
    // Set top-level application menu, using modified template
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    app.on('window-all-closed', function () {
        app.quit();
    });

});
