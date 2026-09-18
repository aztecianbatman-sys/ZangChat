revoke delete,insert,references,trigger,truncate,update on table public.channels from authenticated;
revoke delete,references,trigger,truncate,update on table public.messages from authenticated;
revoke delete,references,trigger,truncate on table public.profiles from authenticated;
revoke references,trigger,truncate on table public.presence from authenticated;