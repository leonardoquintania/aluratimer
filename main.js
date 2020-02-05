const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');

const templateGenerator = require('./template')

const data = require('./data');

let tray = null;
let mainWindow = null;

app.on('ready', () => {
  console.log('Aplicação iniciada');
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    alwaysOnTop: true
  });

  let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);
  let menuPrincipal = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menuPrincipal);

  tray = new Tray(__dirname + '/app/img/icon-tray.png');

  // gerando template com o templateGenerator
  let template = templateGenerator.geraTrayTemplate(mainWindow);

  // criando o menu com o template gerado
  let trayMenu = Menu.buildFromTemplate(template);

  tray.setContextMenu(trayMenu);

  //mainWindow.loadURL('https://www.alura.com.br');
  console.log(__dirname)
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  //-- Insere um atalho global
  globalShortcut.register('CmdOrCtrl+Shift+S', () => {
    mainWindow.send('atalho-iniciar-parar');
  });

});

app.on('window-all-closed', () => {
  app.quit();
});

let sobreWindow = null;

ipcMain.on('abrir-janela-sobre', () => {
  if (sobreWindow == null) {
    sobreWindow = new BrowserWindow({
      width: 300,
      height: 220,
      alwaysOnTop: true,
      frame: false
    });
    sobreWindow.on('closed', () => {
      sobreWindow = null;
    });
  }

  sobreWindow.loadURL(`file://${__dirname}/app/sobre.html`);

});

ipcMain.on('fechar-janela-sobre', () => {
  sobreWindow.close();
});

ipcMain.on('curso-parado', (event, curso, tempoEstudado) => {
  console.log(`O curso ${curso} foi estudado por ${tempoEstudado}`);
  data.salvaDados(curso, tempoEstudado);
});

ipcMain.on('curso-adicionado', (event, novoCurso) => {
  // enviando a mainWindow para a função adicionaCursoNoTray
  let novoTemplate = templateGenerator.adicionaCursoNoTray(novoCurso, mainWindow);
  let novoTrayMenu = Menu.buildFromTemplate(novoTemplate);
  tray.setContextMenu(novoTrayMenu);
});