export interface Database {
 public:{Tables:{
 profiles:{Row:{id:string;username:string;avatar_url:string|null;metadata:Record<string,unknown>};Insert:{id:string;username:string;avatar_url?:string|null;metadata?:Record<string,unknown>};Update:{username?:string;avatar_url?:string|null;metadata?:Record<string,unknown>}},
 channels:{Row:{id:string;name:string;type:'mixed'|'tech'|'gaming'|'casual';created_at:string};Insert:{id?:string;name:string;type:'mixed'|'tech'|'gaming'|'casual';created_at?:string};Update:{name?:string;type?:'mixed'|'tech'|'gaming'|'casual'}},
 messages:{Row:{id:string;channel_id:string;user_id:string;content:string;content_type:'text'|'code'|'lobby'|'media';payload:Record<string,unknown>;created_at:string};Insert:{id?:string;channel_id:string;user_id:string;content:string;content_type?:'text'|'code'|'lobby'|'media';payload?:Record<string,unknown>;created_at?:string};Update:Record<string,never>},
 presence:{Row:{user_id:string;channel_id:string;x_coordinate:number;y_coordinate:number;updated_at:string};Insert:{user_id:string;channel_id:string;x_coordinate?:number;y_coordinate?:number;updated_at?:string};Update:{x_coordinate?:number;y_coordinate?:number;updated_at?:string}}
 }}
}