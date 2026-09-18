import {BrowserWindow,ipcMain} from 'electron';
import type {RealtimeChannel} from '@supabase/supabase-js';
import {supabase} from './supabase';
import type {AuthResult,SendMessageInput} from '../shared/types';
const channels=new Map<string,RealtimeChannel>();
async function session(){const {data}=await supabase.auth.getSession();if(!data.session)throw new Error('You are signed out.');return data.session;}
function fail(e:unknown):never{throw new Error(e instanceof Error?e.message:String(e));}
export function registerIpc(){
 ipcMain.handle('auth:sign-in',async(_,email:string,password:string):Promise<AuthResult>=>{
  const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error||!data.session||!data.user)fail(error||new Error('Sign in failed.'));
  const {data:p}=await supabase.from('profiles').select('username').eq('id',data.user.id).single();
  return {userId:data.user.id,email:data.user.email??null,accessToken:data.session.access_token,username:p?.username??'user'};
 });
 ipcMain.handle('auth:sign-up',async(_,email:string,password:string,username:string)=>{
  const {data,error}=await supabase.auth.signUp({email,password,options:{data:{username}}});if(error)fail(error);
  if(!data.session||!data.user)return {needsConfirmation:true as const};
  return {userId:data.user.id,email:data.user.email??null,accessToken:data.session.access_token,username};
 });
 ipcMain.handle('auth:sign-out',async()=>{const {error}=await supabase.auth.signOut();if(error)fail(error);});
 ipcMain.handle('auth:session',async()=>{const {data}=await supabase.auth.getSession();if(!data.session)return null;const {data:p}=await supabase.from('profiles').select('username').eq('id',data.session.user.id).single();return {userId:data.session.user.id,email:data.session.user.email??null,accessToken:data.session.access_token,username:p?.username??'user'};});
 ipcMain.handle('channels:list',async()=>{await session();const {data,error}=await supabase.from('channels').select('*').order('created_at');if(error)fail(error);return data??[];});
 ipcMain.handle('messages:list',async(_,id:string)=>{await session();const {data,error}=await supabase.from('messages').select('*, profile:profiles(*)').eq('channel_id',id).order('created_at').limit(100);if(error)fail(error);return data??[];});
 ipcMain.handle('messages:send',async(_,input:SendMessageInput)=>{const s=await session();if(s.user.id!==input.userId)fail(new Error('User mismatch.'));const {data,error}=await supabase.from('messages').insert({channel_id:input.channelId,user_id:input.userId,content:input.content,content_type:input.contentType??'text',payload:input.payload??{}}).select('*, profile:profiles(*)').single();if(error||!data)fail(error||new Error('Message was not created.'));return data;});
 ipcMain.handle('presence:list',async(_,id:string)=>{await session();const {data,error}=await supabase.from('presence').select('*, profile:profiles(*)').eq('channel_id',id);if(error)fail(error);return data??[];});
 ipcMain.handle('presence:update',async(_,input:{userId:string;channelId:string;x:number;y:number})=>{const s=await session();if(s.user.id!==input.userId)fail(new Error('User mismatch.'));const {data,error}=await supabase.from('presence').upsert({user_id:input.userId,channel_id:input.channelId,x_coordinate:Math.max(0,Math.min(100,input.x)),y_coordinate:Math.max(0,Math.min(100,input.y)),updated_at:new Date().toISOString()}).select('*, profile:profiles(*)').single();if(error||!data)fail(error||new Error('Presence update failed.'));return data;});
 ipcMain.handle('realtime:subscribe',async(event,id:string)=>{await session();if(channels.has(id))return;const win=BrowserWindow.fromWebContents(event.sender);if(!win)return;const c=supabase.channel('zangchat:'+id);c.on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:'channel_id=eq.'+id},p=>win.webContents.send('realtime:'+id,{kind:'message',message:p.new}));c.on('postgres_changes',{event:'*',schema:'public',table:'presence',filter:'channel_id=eq.'+id},p=>win.webContents.send('realtime:'+id,{kind:'presence',presence:p.new??p.old,eventType:p.eventType}));c.subscribe();channels.set(id,c);});
 ipcMain.handle('realtime:unsubscribe',async(_,id:string)=>{const c=channels.get(id);if(c){await supabase.removeChannel(c);channels.delete(id);}});
}