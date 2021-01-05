const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  //   win.loadFile('./src/index.html')

  /* 
 * 加载应用----- electron-quick-start中默认的加载入口
 win.loadURL(url.format({
 pathname: path.join(__dirname, 'index.html'),
 protocol: 'file:',
 slashes: true
 }))
 */

  // 加载应用----适用于 react 项目
  win.loadURL('http://localhost:3000/');
  win.webContents.openDevTools(); // 默认打开开发者工具 {mode:'detach'/'right'/'left'/'bottom'}
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 获取数据接口
ipcMain.on('getData', (event, arg) => {
  fs.readFile(
    path.join(__dirname, './src/config.json'),
    'utf8',
    (err, data) => {
      event.sender.send('data-reply', data);
    }
  );
});

ipcMain.on('updateData', (event, arg) => {
  fs.writeFile(
    path.join(__dirname, './src/config.json'),
    JSON.stringify(arg),
    'utf8',
    (err) => {
      event.sender.send('data-reply', arg);
    }
  );
});

try {
  // 热重载
  require('electron-reloader')(module);
} catch (_) {}
