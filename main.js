const electron = require('electron')
const halcyonApp = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainAppWindow

halcyonApp.on('ready', function () {
  mainAppWindow = new BrowserWindow({
    width: 1200, 
    height: 1000,
    icon: path.join(__dirname, 'app/images/logo.png')
  })

  mainAppWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/pages/main.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  mainAppWindow.webContents.openDevTools();

  mainAppWindow.on('closed', function () {
    mainAppWindow = null
  })
})

halcyonApp.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    halcyonApp.quit()
  }
})


halcyonApp.on('activate', function () {
  if (mainAppWindow === null) {
    createWindow()
  }
})
