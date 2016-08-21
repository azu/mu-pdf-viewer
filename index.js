'use strict';
const electron = require("electron");
const app = electron.app;
const windowStateKeeper = require('electron-window-state');
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;
app.on('ready', function() {
    const mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });
    mainWindow = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
    });
    mainWindowState.manage(mainWindow);

    mainWindow.loadURL('file://' + __dirname + '/public/index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
