import {contextBridge,ipcRenderer} from 'electron';
const api={
 auth:{
  signIn:(email:string,password:string)=>ipcRenderer.invoke('auth:sign-in',email,password),
  signUp:(email:string,password:string,username:string)=>ipcRenderer.invoke('auth:sign-up',email,password,username),
  signOut:()=>ipcRenderer.invoke('auth:sign-out'),
  session:()=>ipcRenderer.invoke('auth:session')
 },
 channels:{list:()=>ipcRenderer.invoke('channels:list')},
 messages:{list:(id:string)=>ipcRenderer.invoke('messages:list',id),send:(input:unknown)=>ipcRenderer.invoke('messages:send',input)},
 presence:{list:(id:string)=>ipcRenderer.invoke('presence:list',id),update:(input:unknown)=>ipcRenderer.invoke('presence:update',input)},
 realtime:{
  subscribe:(id:string)=>ipcRenderer.invoke('realtime:subscribe',id),
  unsubscribe:(id:string)=>ipcRenderer.invoke('realtime:unsubscribe',id),
  on:(id:string,listener:(event:unknown)=>void)=>{
   const name='realtime:'+id;
   const handler=(_event:Electron.IpcRendererEvent,payload:unknown)=>listener(payload);
   ipcRenderer.on(name,handler);
   return ()=>ipcRenderer.removeListener(name,handler);
  }
 }
};
contextBridge.exposeInMainWorld('zangchat',api);