"use client"

// Adapted directly from the supplied OverprintSwarmTemplate. Festival-only jobs,
// typing, editing frames and ScrollTrigger stages have been removed. The director,
// measured job scheduling and pen/glide pairing still own the mounted hero intro.
import * as React from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Button } from './button'

type Pt = { x: number; y: number }
type Box = Pt & { w: number; h: number }
type Hand = Pt & { el: HTMLElement; g: HTMLElement; t: number; i: number }
type Job = { ready?: number; who?: number }
export function travel(d: number): number { return 0.26 + 0.15 * Math.log2(1 + Math.max(0, d) / 60) }
export function chooseHand(hands: { x: number; y: number; t: number }[], p: Pt, ready: number): number {
 let best = 0, bestT = Infinity
 hands.forEach((h, i) => { const arrive = Math.max(h.t + travel(Math.hypot(p.x-h.x,p.y-h.y)),ready); if(arrive < bestT-1e-6) {best=i; bestT=arrive} })
 return best
}
export function exitPoint(p: Pt,w: number,h: number): Pt {
 const d=[p.x,w-p.x,p.y,h-p.y], m=d.indexOf(Math.min(...d))
 return m===0?{x:-70,y:p.y}:m===1?{x:w+70,y:p.y}:m===2?{x:p.x,y:-70}:{x:p.x,y:h+70}
}
export function crewSize(width: number,full: number) { return Math.min(full,width<420?2:width<720?3:full) }
// Offsets deliberately ignore animated transforms, as in the original template.
function boxOf(el: HTMLElement,stage: HTMLElement): Box {
 let x=0,y=0,n: HTMLElement|null=el
 while(n&&n!==stage) { x+=n.offsetLeft; y+=n.offsetTop; n=n.offsetParent as HTMLElement|null }
 return {x,y,w:el.offsetWidth,h:el.offsetHeight}
}
function director(tl: gsap.core.Timeline,stage: HTMLElement,handEls: HTMLElement[]) {
 const B=(el: HTMLElement)=>boxOf(el,stage), W=stage.offsetWidth,H=stage.offsetHeight
 const hands: Hand[]=handEls.map((el,i)=>({el,g:el.querySelector<HTMLElement>('.ov-hg')!,x:0,y:0,t:0,i}))
 const place=(h: Hand,p: Pt)=>{h.x=p.x;h.y=p.y;gsap.set(h.el,{x:p.x,y:p.y})}
 const click=(h: Hand,at: number)=>{tl.to(h.g,{scale:0.8,duration:0.07,yoyo:true,repeat:1,ease:'power1.out'},at)}
 const glide=(h: Hand,p: Pt,at: number,d: number,ease: string)=>{tl.to(h.el,{x:p.x,y:p.y,duration:d,ease},at);h.x=p.x;h.y=p.y;h.t=at+d}
 const walk=(h: Hand,p: Pt,at: number,dur?: number)=>{ const d=dur??travel(Math.hypot(p.x-h.x,p.y-h.y));glide(h,p,at,d,'power2.inOut');return h.t }
 const begin=(p: Pt,o: Job={})=>{const ready=o.ready??0,h=hands[o.who!==undefined?o.who%hands.length:chooseHand(hands,p,ready)],tr=travel(Math.hypot(p.x-h.x,p.y-h.y));const at=walk(h,p,Math.max(h.t,ready-tr),tr);return {h,at}}
 const fade=(el: Element|Element[],at: number,o: gsap.TweenVars={})=>{const {y=0,...rest}=o;gsap.set(el,{opacity:0,y});tl.to(el,{opacity:1,y:0,duration:0.35,ease:'power2.out',stagger:0.05,...rest},at)}
 const pen=(el: HTMLElement,axis: 'x'|'y',o: Job & {dur?:number;reverse?:boolean}={})=>{
 const b=B(el),start=axis==='x'?{x:o.reverse?b.x+b.w:b.x,y:b.y+b.h/2}:{x:b.x+b.w/2,y:o.reverse?b.y+b.h:b.y},end=axis==='x'?{x:o.reverse?b.x:b.x+b.w,y:start.y}:{x:start.x,y:o.reverse?b.y:b.y+b.h},prop=axis==='x'?'scaleX':'scaleY'
 gsap.set(el,{[prop]:0,transformOrigin:o.reverse?(axis==='x'?'100% 50%':'50% 100%'):axis==='x'?'0% 50%':'50% 0%'})
 const {h,at}=begin(start,o);click(h,at);const d=o.dur??0.3+0.1*Math.log2(1+Math.max(b.w,b.h)/40)
 tl.to(el,{[prop]:1,duration:d,ease:'power1.inOut'},at+0.06);glide(h,end,at+0.06,d,'power1.inOut');h.t+=0.08;return {end:h.t,at:at+0.06,d}
 }
 const drag=(el: HTMLElement,from: Pt,o: Job={})=>{const b=B(el),hold={x:b.x+b.w/2,y:b.y+b.h/2};gsap.set(el,{x:from.x,y:from.y,opacity:0});const {h,at}=begin({x:hold.x+from.x,y:hold.y+from.y},o);click(h,at);tl.to(el,{x:0,y:0,opacity:1,duration:0.6,ease:'power3.inOut'},at+0.1);glide(h,hold,at+0.1,0.6,'power3.inOut');return h.t}
 // Routed version of pen: one linear tween paints each segment and carries its
 // signal point together. Equal x/y easing preserves exact 45-degree routes.
 const route=(path: SVGPathElement,points: Pt[],o: Job={})=>{
 const {h,at}=begin(points[0],o),length=path.getTotalLength();let done=0,t=at+0.06
 gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});click(h,at)
 for(let i=1;i<points.length;i++){const distance=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y),d=distance/440;done+=distance;tl.to(path,{strokeDashoffset:Math.max(0,length-done),duration:d,ease:'none'},t);glide(h,points[i],t,d,'none');t+=d}
 return {h,end:t,points}
 }
 const leave=()=>hands.forEach(h=>{walk(h,exitPoint(h,W,H),h.t+0.15);tl.to(h.el,{opacity:0,duration:0.15},h.t-0.15)})
 return {tl,hands,B,W,H,place,click,walk,glide,begin,fade,pen,drag,route,leave}
}
type Dir=ReturnType<typeof director>
const routes=(w:number,h:number):Pt[][]=> w<720?[
 [{x:0,y:35},{x:70,y:35},{x:96,y:61},{x:175,y:61}],
 [{x:w,y:h-155},{x:w-32,y:h-155},{x:w-64,y:h-123},{x:w-64,y:h-45}],
]:[
 [{x:0,y:42},{x:100,y:42},{x:136,y:78},{x:320,y:78}],
 [{x:w,y:95},{x:w-65,y:95},{x:w-110,y:140},{x:w-110,y:h*.47},{x:w-160,y:h*.47+50},{x:w-160,y:h*.69}],
 [{x:w,y:h-95},{x:w-75,y:h-95},{x:w-140,y:h-160},{x:w-140,y:h-220}],
 [{x:0,y:h-64},{x:75,y:h-64},{x:111,y:h-100},{x:230,y:h-100}],
]
function hero(D:Dir,tl:gsap.core.Timeline,stage:HTMLElement,paths:Pt[][]) {
 D.hands.forEach((h,i)=>D.place(h,{x:i%2?D.W+50:-50,y:D.H*(0.18+0.64*i/Math.max(1,D.hands.length-1))}))
 // Original crop-first hero staging, now small registration marks.
 stage.querySelectorAll<HTMLElement>('.ov-cx').forEach((el,i)=>D.pen(el,'x',{ready:0.15+i*0.04,dur:0.12}))
 stage.querySelectorAll<HTMLElement>('.ov-cy').forEach((el,i)=>D.pen(el,'y',{ready:0.25+i*0.04,dur:0.12}))
 const jobs=[...stage.querySelectorAll<SVGPathElement>('.trace')].slice(0,paths.length).map((el,i)=>D.route(el,paths[i],{ready:0.75+i*0.14}))
 const rule=stage.querySelector<HTMLElement>('.hero-rule')!;D.pen(rule,'x',{ready:1.15,dur:0.5})
 stage.querySelectorAll<HTMLElement>('.detail').forEach((el,i)=>D.drag(el,{x:24,y:24},{ready:1.3+i*0.15}))
 // Pulses follow the same measured vertices on the same director timeline.
 const pulseAt=Math.max(...jobs.map(j=>j.end))+0.1
 jobs.slice(0,3).forEach((job,i)=>{const p=stage.querySelectorAll<HTMLElement>('.pulse')[i];let t=pulseAt+i*0.1;tl.set(p,{x:job.points[0].x,y:job.points[0].y,opacity:1},t);for(let k=1;k<job.points.length;k++){const a=job.points[k-1],b=job.points[k],d=Math.hypot(b.x-a.x,b.y-a.y)/850;tl.to(p,{x:b.x,y:b.y,duration:d,ease:'none'},t);t+=d}tl.to(p,{opacity:0,duration:0.18},t)})
 D.leave()
}
export default function OverprintSwarmTemplate(){
 const rootRef=React.useRef<HTMLElement>(null)
 React.useLayoutEffect(()=>{
 const root=rootRef.current!,stage=root.querySelector<HTMLElement>('.ov-stage')!;let ctx:gsap.Context|undefined;let lastW=stage.offsetWidth,lastH=stage.offsetHeight
 const media=window.matchMedia('(prefers-reduced-motion: reduce)')
 const measure=()=>{const paths=routes(stage.offsetWidth,stage.offsetHeight);stage.querySelectorAll<SVGPathElement>('.trace').forEach((p,i)=>p.setAttribute('d',(paths[i]??[]).map((v,j)=>`${j?'L':'M'}${v.x} ${v.y}`).join(' ')));stage.querySelectorAll<SVGCircleElement>('.via').forEach((c,i)=>{const p=paths[i]?.at(-1);c.style.display=p?'':'none';if(p){c.setAttribute('cx',String(p.x));c.setAttribute('cy',String(p.y))}});return paths}
 const settle=()=>{ctx?.revert();ctx=undefined;measure();stage.dataset.intro='finished'}
 const paths=measure()
 if(!media.matches){ctx=gsap.context(()=>{stage.dataset.intro='playing';const tl=gsap.timeline({defaults:{overwrite:false},onComplete:()=>{stage.dataset.intro='finished'}});const all=[...stage.querySelectorAll<HTMLElement>('.ov-hand')];const n=crewSize(stage.offsetWidth,all.length);gsap.set(all,{opacity:0});gsap.set(all.slice(0,n),{opacity:1});hero(director(tl,stage,all.slice(0,n)),tl,stage,paths);tl.timeScale(Math.max(1,tl.duration()/4.8))},root)}else settle()
 // Responsive geometry updates settle an active intro rather than replay it.
 const resize=()=>{const w=stage.offsetWidth,h=stage.offsetHeight;if(Math.abs(w-lastW)>2||Math.abs(h-lastH)>2){lastW=w;lastH=h;settle()}};const ro=new ResizeObserver(resize);ro.observe(stage);window.addEventListener('resize',resize)
 const change=()=>{if(media.matches)settle()};media.addEventListener('change',change)
 return()=>{ro.disconnect();window.removeEventListener('resize',resize);media.removeEventListener('change',change);ctx?.revert()}
 },[])
 return <section ref={rootRef} className="ov" aria-labelledby="hero-title"><div className="ov-stage">
 <svg className="via-layer" aria-hidden="true">{[0,1,2,3].map(i=><circle key={i} className={`via via-${i}`} r="4"/>)}</svg>
 <div className="hero-polygon" aria-hidden="true"/>
 <svg className="trace-layer" aria-hidden="true">{Array.from({length:4},(_,i)=><path key={i} className={`trace trace-${i}`} />)}</svg>
 <div className="ov-crops" aria-hidden="true">{['tl','tr','bl','br'].map(c=><span key={c} className={`ov-crop ov-crop-${c}`}><i className="ov-cx"/><i className="ov-cy"/></span>)}</div>
 <div className="hero-copy"><p className="eyebrow">University of Florida</p><h1 id="hero-title">Silicon<br/>Club<span className="title-dot">.</span></h1><i className="hero-rule" aria-hidden="true"/><p className="hero-sub">Student Silicon Design Team</p><div className="hero-links"><Button asChild><Link to="/digital">Explore Digital <ArrowUpRight size={17}/></Link></Button><Button asChild className="button-orange"><Link to="/analog">Explore Analog <ArrowUpRight size={17}/></Link></Button><Button asChild className="button-outline"><Link to="/fabrication">Explore Fabrication <ArrowUpRight size={17}/></Link></Button></div></div>
 <div className="detail dot-grid" aria-hidden="true"/><div className="detail chip-art" aria-hidden="true"><span/><span/><span/><span/></div><div className="detail pads" aria-hidden="true"><i/><i/><i/></div>
 <div className="ov-hands" aria-hidden="true">{Array.from({length:4},(_,i)=><div key={i} className="ov-hand"><i className="ov-hg"/></div>)}{Array.from({length:3},(_,i)=><i key={'p'+i} className="pulse"/>)}</div>
 <div className="hero-bottom"><span>UF SILICON / GAINESVILLE, FL</span><span>DESIGN. VERIFY. BUILD.</span></div>
 </div></section>
}
