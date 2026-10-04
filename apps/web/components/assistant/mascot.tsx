'use client';
import {useEffect,useState} from 'react';
import {Sparkles,Volume2,VolumeX} from 'lucide-react';

export type MascotMood='idle'|'thinking'|'eating'|'happy'|'surprised'|'confused'|'celebrate';

export function SalesOSMascot({mood='idle',sound=true,onToggleSound,onSpeak,small=false}:{mood?:MascotMood;sound?:boolean;onToggleSound?:()=>void;onSpeak?:()=>void;small?:boolean}){
 const [blink,setBlink]=useState(false);
 useEffect(()=>{const id=window.setInterval(()=>{setBlink(true);window.setTimeout(()=>setBlink(false),140)},4800);return()=>window.clearInterval(id)},[]);
 const size=small?'size-16':'size-28'; const open=mood==='eating'||mood==='surprised'||mood==='thinking';
 const face=mood==='happy'||mood==='celebrate'?'◕‿◕':mood==='confused'?'⊙﹏⊙':mood==='surprised'?'°o°':'•ᴗ•';
 return <div className="select-none">
  <div className={"relative "+size+" rounded-[32%] border-2 border-neutral-950 bg-white shadow-xl dark:border-white dark:bg-neutral-900 "+(mood==='celebrate'?'animate-bounce':'')}>
   <div className={"absolute inset-x-[20%] top-[21%] flex justify-between text-xl transition-all "+(blink?'scale-y-10':'')}><span>•</span><span>•</span></div>
   <div className="absolute inset-x-0 top-[45%] text-center text-xl font-bold">{face}</div>
   <div className={"absolute bottom-[16%] left-1/2 -translate-x-1/2 rounded-full border-2 border-neutral-950 bg-neutral-200 transition-all dark:border-white dark:bg-neutral-700 "+(open?'h-5 w-8':'h-3 w-5')}></div>
   <span className="absolute -end-2 -top-2 rounded-full bg-white px-2 py-1 text-[10px] shadow dark:bg-neutral-800">{mood==='eating'?'😋':mood==='thinking'?'🤔':mood==='celebrate'?'🎉':mood==='surprised'?'😮':mood==='confused'?'😵':'✨'}</span>
  </div>
  <div className="mt-2 flex justify-center gap-1">{onSpeak&&<button onClick={onSpeak} className="rounded-lg border p-1.5" title="Speak"><Volume2 className="size-3.5"/></button>}{onToggleSound&&<button onClick={onToggleSound} className="rounded-lg border p-1.5" title="Sound effects">{sound?<Volume2 className="size-3.5"/>:<VolumeX className="size-3.5" />}</button>}</div>
  <div className="mt-1 text-center text-[10px] text-neutral-400"><Sparkles className="me-1 inline size-3"/>{mood==='eating'?'Feeding…':mood==='thinking'?'Thinking…':mood==='celebrate'?'Nailed it!':mood==='happy'?'Nice!':mood==='confused'?'Let me inspect that…':'Ready'}</div>
 </div>;
}