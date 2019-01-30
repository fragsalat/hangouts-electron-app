const {app, BrowserWindow, shell} = require('electron');
const iohook = require('iohook');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, show: false, webPreferences: {
    devTools: true
  }});

  win.once('ready-to-show', () => {
    win.webContents.setZoomFactor(1.3);
    win.show();
  });

  win.loadURL('https://chat.google.com');

  win.webContents.on('dom-ready', function() {
    const script = `document.addEventListener('click', event => {
      if (event.target.tagName === 'A') {
        event.preventDefault();
        window.open(event.target.href);
      }
    });`;
    win.webContents.executeJavaScript(script, false);
  });

  win.webContents.on('new-window', (event, url) => {                                                                    
    event.preventDefault();                                                                                             
    if (url && url !== 'about:blank') {                                                                                 
      shell.openExternal(url);                                                                                          
    }                                                                                                                   
  });
  // Open the DevTools.
  //win.webContents.openDevTools()
  
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

app.disableHardwareAcceleration();
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
  
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
  
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

