'use strict';
const electron = require("electron");
const app = electron.app;
const path = require("path");
const windowStateKeeper = require('electron-window-state');
const BrowserWindow = electron.BrowserWindow;
const argv = require('minimist')(process.argv.slice(2));
const qs = require("querystring");
let mainWindow = null;
app.on('ready', function() {
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
    mainWindowState.manage(mainWindow);
    const fixedArgv = {
        _: argv._ ? argv._.map(filePath => path.resolve(process.cwd(), filePath)) : null,
        file: argv.file ? path.resolve(process.cwd(), argv.file) : null
    };
    const query = qs.stringify(fixedArgv);
    mainWindow.loadURL('file://' + __dirname + '/public/index.html?' + query);
    if (process.env.NODE_ENV === "development") {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
