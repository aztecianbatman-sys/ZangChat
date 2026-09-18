import {useEffect,useRef} from 'react';
import type {Presence} from '../../shared/types';

export function PresenceCanvas({presence}:{presence:Presence[]}) {
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const draw=()=>{
   const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
   if(canvas.width!==r.width*dpr||canvas.height!==r.height*dpr){canvas.width=r.width*dpr;canvas.height=r.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
   ctx.clearRect(0,0,r.width,r.height);ctx.lineWidth=1;ctx.setLineDash([4,6]);ctx.strokeStyle='rgba(148,163,184,.28)';
   for(let i=1;i<presence.length;i++){const a=presence[i-1],b=presence[i];ctx.beginPath();ctx.moveTo(a.x_coordinate*r.width/100,a.y_coordinate*r.height/100);ctx.lineTo(b.x_coordinate*r.width/100,b.y_coordinate*r.height/100);ctx.stroke();}
   return requestAnimationFrame(draw);
  };
  const id=draw();return()=>cancelAnimationFrame(id);
 },[presence]);
 return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true"/>;
}