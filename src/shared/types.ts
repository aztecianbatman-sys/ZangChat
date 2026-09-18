export type ChannelType = 'mixed'|'tech'|'gaming'|'casual';
export type ContentType = 'text'|'code'|'lobby'|'media';
export interface Profile { id:string; username:string; avatar_url:string|null; metadata:Record<string,unknown>; }
export interface Channel { id:string; name:string; type:ChannelType; created_at:string; }
export interface Message { id:string; channel_id:string; user_id:string; content:string; content_type:ContentType; payload:Record<string,unknown>; created_at:string; profile?:Profile; }
export interface Presence { user_id:string; channel_id:string; x_coordinate:number; y_coordinate:number; updated_at:string; profile?:Profile; }
export interface SendMessageInput { channelId:string; userId:string; content:string; contentType?:ContentType; payload?:Record<string,unknown>; }
export interface AuthResult { userId:string; email:string|null; accessToken:string; username:string; }
export type RealtimeEvent = {kind:'message';message:Message}|{kind:'presence';presence:Presence;eventType:'INSERT'|'UPDATE'|'DELETE'};
export interface ZangChatAPI {
 auth:{signIn(email:string,password:string):Promise<AuthResult>;signUp(email:string,password:string,username:string):Promise<AuthResult|{needsConfirmation:true}>;signOut():Promise<void>;session():Promise<AuthResult|null>};
 channels:{list():Promise<Channel[]>};
 messages:{list(channelId:string):Promise<Message[]>;send(input:SendMessageInput):Promise<Message>};
 presence:{list(channelId:string):Promise<Presence[]>;update(input:{userId:string;channelId:string;x:number;y:number}):Promise<Presence>};
 realtime:{subscribe(channelId:string):Promise<void>;unsubscribe(channelId:string):Promise<void>;on(channelId:string,listener:(event:RealtimeEvent)=>void):()=>void};
}