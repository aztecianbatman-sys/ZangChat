import {app,BrowserWindow} from 'electron';
import {join} from 'node:path';
import {registerIpc} from './ipc';

function createWindow(){
  const win=new BrowserWindow({
    width:1440,
    height:900,
    minWidth:1100,
    minHeight:680,
    backgroundColor:'#020617',
    title:'ZangChat — ObsidianUI v1',
    webPreferences:{
      preload:join(__dirname,'../preload/preload.js'),
      contextIsolation:true,
      nodeIntegration:false,
      sandbox:true
    }
  });

  win.setMenuBarVisibility(false);

  const rendererUrl=process.env.ELECTRON_RENDERER_URL;
  if(rendererUrl){
    void win.loadURL(rendererUrl);
  }else{
    void win.loadFile(join(__dirname,'../renderer/index.html'));
  }
}

app.whenReady().then(()=>{
  registerIpc();
  createWindow();

  app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length===0)createWindow();
  });
});

app.on('window-all-closed',()=>{
  if(process.platform!=='darwin')app.quit();
});
