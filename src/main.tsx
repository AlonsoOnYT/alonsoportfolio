import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ArrowRight, ArrowUpRight, MousePointer2, Play, X} from 'lucide-react';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const CONTACT = 'mailto:YOUR@email.com';

const projects = [
  {id:'01', title:'ATTENTION ENGINE', cat:'SHORT FORM / REELS', desc:'Talking-head edits built around hooks, pacing, captions and retention.', hook:'01.2s', runtime:'00:28', style:'FAST / CLEAN / DYNAMIC', retention:'92%', tools:'Premiere Pro · After Effects', theme:'lime'},
  {id:'02', title:'SCROLL STOPPER', cat:'ADS / PERFORMANCE', desc:'Direct-response creative with punchy pacing and a clear visual hierarchy.', hook:'00.8s', runtime:'00:23', style:'DIRECT / PUNCHY / UGC', retention:'—', tools:'Premiere Pro · After Effects', theme:'coral'},
  {id:'03', title:'VISUAL SYSTEMS', cat:'MOTION / CREATIVE', desc:'Typography, animated assets and custom motion moments that make footage distinct.', hook:'01.0s', runtime:'00:31', style:'KINETIC / PRECISE / GRAPHIC', retention:'—', tools:'After Effects · Premiere Pro', theme:'violet'}
];

const services = [
  ['01', 'UGC EDITING', 'Creator-first edits that preserve a real voice while giving each beat more pull.', 'ugc'],
  ['02', 'SHORT-FORM', 'Reels, TikToks and Shorts shaped around pace, captions and the next second.', 'short'],
  ['03', 'MOTION GRAPHICS', 'Kinetic type, product callouts, tracking and graphic systems that clarify the message.', 'motion']
];

const workflow = [
  ['BRIEF', 'Lock the goal, audience and the one thing the viewer should remember.'],
  ['SELECTS', 'Find the strongest delivery, reactions and visual proof points.'],
  ['STORY CUT', 'Build a clean, watchable sequence before adding visual treatment.'],
  ['CAPTIONS', 'Create readable hierarchy that makes every beat easy to follow.'],
  ['MOTION', 'Add purposeful movement, callouts and pattern interrupts.'],
  ['DELIVERY', 'Polish the final frame for the platform and hand it over clean.']
];

function useReducedMotion(){
  const [reduced,setReduced] = useState(false);
  useEffect(()=>{const media = matchMedia('(prefers-reduced-motion: reduce)'); const update=()=>setReduced(media.matches); update(); media.addEventListener?.('change',update); return()=>media.removeEventListener?.('change',update)},[]);
  return reduced;
}

function Loader({ready,onReady}:{ready:boolean;onReady:()=>void}){
  const [progress,setProgress] = useState(0);
  useEffect(()=>{let raf=0; const started=performance.now(); const tick=(now:number)=>{const n=Math.min(1,(now-started)/1250); setProgress(Math.round((1-Math.pow(1-n,3))*100)); if(n<1) raf=requestAnimationFrame(tick); else window.setTimeout(onReady,180)}; raf=requestAnimationFrame(tick); return()=>cancelAnimationFrame(raf)},[onReady]);
  return <div className={'loader '+(ready?'isReady':'')} aria-hidden={ready}><div className="loaderCore"><div className="loaderRow"><span>ALONSO / EDIT SUITE</span><b>{String(progress).padStart(3,'0')}%</b></div><div className="loaderRail"><i style={{width:`${progress}%`}}/></div><div className="loaderRow muted"><span>{progress<45?'ASSEMBLING THE CUT':progress<88?'LAYING OUT MOTION':'READY TO PLAY'}</span><span>FRAME {String(Math.floor(progress*24)).padStart(4,'0')}</span></div></div></div>;
}

function Cursor(){
  const ref=useRef<HTMLDivElement>(null); const [label,setLabel]=useState('');
  useEffect(()=>{const move=(event:MouseEvent)=>{if(ref.current) ref.current.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`}; const over=(event:MouseEvent)=>{const target=(event.target as HTMLElement).closest('[data-cursor]') as HTMLElement|null; setLabel(target?.dataset.cursor||'')}; window.addEventListener('mousemove',move); window.addEventListener('mouseover',over); return()=>{window.removeEventListener('mousemove',move);window.removeEventListener('mouseover',over)}},[]);
  return <div ref={ref} className={'cursor '+(label?'active':'')}><span>{label}</span></div>;
}

function Nav(){
  const [open,setOpen]=useState(false); const close=()=>setOpen(false);
  const links=[['#work','WORK'],['#studio','STUDIO'],['#services','SERVICES'],['#contact','CONTACT']];
  return <nav className={open?'menuOpen':''}><div className="navInner"><a onClick={close} href="#top" className="logo" data-cursor="HOME">ALONSO<span>.</span></a><div className="navLinks">{links.map(([href,label])=><a key={href} href={href} data-cursor="GO">{label}</a>)}</div><a href={CONTACT} className="navCta" data-cursor="START">START A PROJECT <ArrowUpRight size={14}/></a><button className="menuButton" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'}><i/><i/></button></div>{open&&<div className="mobileMenu">{links.map(([href,label],index)=><a key={href} href={href} onClick={close}><small>0{index+1}</small>{label}<ArrowUpRight/></a>)}<a className="mobileCta" href={CONTACT}>START A PROJECT <ArrowUpRight/></a></div>}</nav>;
}

function Timeline({compact=false}:{compact?:boolean}){
  const [position,setPosition]=useState(.37); const ref=useRef<HTMLDivElement>(null);
  const scrub=(event:React.PointerEvent<HTMLDivElement>)=>{const box=ref.current?.getBoundingClientRect(); if(!box) return; setPosition(Math.max(0,Math.min(1,(event.clientX-box.left)/box.width)))};
  const seconds=Math.round(position*31);
  return <div ref={ref} className={'timeline '+(compact?'compact':'')} onPointerDown={scrub} onPointerMove={event=>event.buttons===1&&scrub(event)} data-cursor="SCRUB"><div className="timelineTop"><span>SEQUENCE / ALONSO_01</span><span>00:{String(seconds).padStart(2,'0')}:12</span></div><div className="timelineTracks"><span className="trackName">FOOTAGE</span><div className="clipTrack footage"><i/><i/><i/><i/><i/></div><span className="trackName">CAPTIONS</span><div className="clipTrack captions"><i/><i/><i/></div><span className="trackName">MOTION</span><div className="clipTrack motion"><i/><i/><i/><i/></div><b className="playhead" style={{left:`${position*100}%`}}/></div><div className="timelineBottom"><span>1080 × 1920</span><span>SHORT-FORM / UGC / MOTION</span><span>{Math.round(position*100)}%</span></div></div>;
}

function Hero({reduced}:{reduced:boolean}){
  const [point,setPoint]=useState({x:0,y:0}); const hero=useRef<HTMLElement>(null);
  const move=(event:React.MouseEvent<HTMLElement>)=>{if(reduced) return; const box=hero.current?.getBoundingClientRect(); if(!box) return; setPoint({x:(event.clientX-box.left)/box.width-.5,y:(event.clientY-box.top)/box.height-.5})};
  const vars={'--px':`${point.x}`, '--py':`${point.y}`} as React.CSSProperties;
  return <header ref={hero} id="top" className="hero" onMouseMove={move} onMouseLeave={()=>setPoint({x:0,y:0})} style={vars}><div className="heroField"/><div className="heroGrain"/><div className="orb orbOne"/><div className="orb orbTwo"/><div className="heroContent"><div className="heroKicker"><span className="liveDot"/> AVAILABLE FOR SELECT PROJECTS <span>2026</span></div><h1>EDITS THAT<br/><em>MAKE YOU</em><br/><strong>LOOK TWICE.</strong></h1><div className="heroFooter"><p>Alonso is a video editor for UGC, motion graphics and short-form content with a focus on clarity, momentum and the moment that stops the scroll.</p><a href="#work" className="textLink" data-cursor="EXPLORE">VIEW SELECTED WORK <ArrowRight size={17}/></a></div></div><div className="heroObject" aria-hidden="true"><div className="objectBack"/><div className="objectSide"/><div className="objectScreen"><div className="screenTop"><span>REC  /  4K</span><span>00:00:28</span></div><div className="screenWord"><span>MAKE</span><span>IT</span><b>LAND.</b></div><div className="screenUi"><i/><i/><i/><i/><i/></div><div className="screenCaption">YOUR NEXT<br/>FAVORITE<br/>FRAME</div></div><div className="objectTag tagOne">01 / <b>HOOK</b></div><div className="objectTag tagTwo">MOTION / <b>ON</b></div><div className="objectTag tagThree">9:16 / <b>READY</b></div></div><div className="heroIndex">SCROLL TO ENTER <MousePointer2 size={13}/></div><Timeline/></header>;
}

function Marquee(){return <div className="marquee"><div>UGC EDITS <i>✦</i> SHORT-FORM <i>✦</i> MOTION GRAPHICS <i>✦</i> UGC EDITS <i>✦</i> SHORT-FORM <i>✦</i> MOTION GRAPHICS <i>✦</i></div></div>}

function Stats(){return <section className="stats" aria-label="Experience statistics"><div>{[['50+','PROJECTS DELIVERED'],['2+','YEARS EDITING'],['100%','COMMITMENT']].map(([number,label],index)=><article key={label} className="statCard" data-cursor="VIEW"><span>0{index+1}</span><b>{number}</b><small>{label}</small><i/></article>)}</div></section>}

function ProjectArt({project}:{project:typeof projects[number]}){return <div className={'projectArt '+project.theme}><div className="artGrid"/><div className="artFrame"><div className="artLabel">PROJECT / {project.id}</div><div className="artWords">{project.title.split(' ').map(word=><span key={word}>{word}</span>)}</div><div className="artMarker">{project.theme==='lime'?'CAPTION TRACK':project.theme==='coral'?'PATTERN INTERRUPT':'KINETIC TYPE'}</div><div className="artPlayback"><Play size={16} fill="currentColor"/><span>PLAY PREVIEW</span></div></div><div className="artCorner top"/><div className="artCorner bottom"/></div>}

function ProjectModal({project,onClose}:{project:typeof projects[number];onClose:()=>void}){
  useEffect(()=>{document.body.classList.add('modalOpen'); const escape=(event:KeyboardEvent)=>event.key==='Escape'&&onClose(); window.addEventListener('keydown',escape); return()=>{document.body.classList.remove('modalOpen');window.removeEventListener('keydown',escape)}},[onClose]);
  return <div className="modal" role="dialog" aria-modal="true" aria-label={`${project.title} project details`}><button className="modalClose" onClick={onClose} data-cursor="CLOSE"><X size={20}/><span>CLOSE</span></button><div className="modalInner"><div className="modalHeading"><div><p>SELECTED PROJECT / {project.id}</p><h2>{project.title}</h2></div><span>{project.cat}</span></div><div className="modalPreview"><ProjectArt project={project}/></div><div className="modalDetails"><div><small>HOOK</small><b>{project.hook}</b></div><div><small>RUNTIME</small><b>{project.runtime}</b></div><div><small>STYLE</small><b>{project.style}</b></div><div><small>RETENTION</small><b>{project.retention==='—'?'EDITORIAL MODEL':project.retention}</b></div></div><div className="modalDescription"><p>{project.desc}</p><div><small>TOOLS</small><b>{project.tools}</b></div></div></div></div>;
}

function Work({onOpen}:{onOpen:(project:typeof projects[number])=>void}){
  const tilt=(event:React.MouseEvent<HTMLElement>)=>{const card=event.currentTarget; const box=card.getBoundingClientRect(); card.style.setProperty('--rx',`${((event.clientY-box.top)/box.height-.5)*-6}deg`); card.style.setProperty('--ry',`${((event.clientX-box.left)/box.width-.5)*7}deg`)};
  const reset=(event:React.MouseEvent<HTMLElement>)=>{event.currentTarget.style.setProperty('--rx','0deg');event.currentTarget.style.setProperty('--ry','0deg')};
  return <section id="work" className="section work"><div className="sectionHeader reveal"><span>01 / SELECTED WORK</span><h2>BUILT TO<br/><i>HOLD ATTENTION.</i></h2><p>Three directions, one editing principle: earn the next second.</p></div><div className="workGrid">{projects.map((project,index)=><button key={project.id} className={'projectCard reveal card'+index} onClick={()=>onOpen(project)} onMouseMove={tilt} onMouseLeave={reset} data-cursor="OPEN"><ProjectArt project={project}/><span className="projectMeta"><span>{project.id} / {project.cat}</span><ArrowUpRight size={18}/></span><h3>{project.title}</h3><p>{project.desc}</p><span className="projectFooter"><span>HOOK {project.hook}</span><span>RUNTIME {project.runtime}</span></span></button>)}</div></section>;
}

const studioTabs = {
  'UGC EDITING':{caption:'Creator energy stays intact. The structure around it gets sharper.', details:['NATURAL DELIVERY','CLEAR PAYOFF','NATIVE FEEL'], visual:'ugc'},
  'SHORT-FORM':{caption:'A steady sequence of visual reasons to stay through the last beat.', details:['HOOKS','CAPTIONS','RHYTHM'], visual:'short'},
  'MOTION':{caption:'Motion is a design language: it directs the eye before the viewer thinks.', details:['TYPE','TRACKING','CALLOUTS'], visual:'motion'}
};

function Studio(){const [active,setActive]=useState<keyof typeof studioTabs>('UGC EDITING'); const panel=studioTabs[active]; return <section id="studio" className="section studio"><div className="sectionHeader reveal"><span>02 / THE EDIT SUITE</span><h2>THE CUT IS<br/><i>THE CAMERA.</i></h2></div><div className="studioLayout reveal"><div className="studioTabs">{Object.keys(studioTabs).map((tab,index)=><button key={tab} onClick={()=>setActive(tab as keyof typeof studioTabs)} className={active===tab?'selected':''} data-cursor="SELECT"><small>0{index+1}</small>{tab}<ArrowUpRight size={17}/></button>)}</div><div className={'studioStage '+panel.visual}><div className="stageInfo"><span>FOCUS / {active}</span><span>LIVE SYSTEM</span></div><div className="stageVisual">{panel.visual==='ugc'?<div className="creatorCard"><div className="creatorGlow"/><div className="creatorFace"><i/><i/><b/></div><div className="creatorCaption"><span>THIS IS THE</span><strong>ONE THING</strong><span>YOU NEED TO KNOW</span></div><div className="creatorTag">CREATOR POV</div></div>:panel.visual==='short'?<div className="shortField"><span className="shortA">0.8s</span><span className="shortB">HOOK</span><span className="shortC">NEXT</span><div className="shortLine"/></div>:<div className="motionField"><span>MOVE</span><span>WITH</span><b>PURPOSE</b><i/><i/><i/></div>}</div><div className="stageBottom"><p>{panel.caption}</p><div>{panel.details.map(detail=><span key={detail}>{detail}</span>)}</div></div></div></div></section>}

function RetentionCurve(){return <div className="retentionCurve"><div className="curveBars">{[82,68,76,64,70,55,59,48,50,42,44,36].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div><svg viewBox="0 0 900 230" preserveAspectRatio="none"><path d="M0 44 C80 30 105 86 170 77 S250 52 310 102 S395 80 450 117 S540 96 600 139 S690 123 748 165 S830 155 900 190"/><circle cx="170" cy="77" r="5"/><circle cx="450" cy="117" r="5"/><circle cx="748" cy="165" r="5"/></svg><div className="curveLabels"><span>HOOK</span><span>TURN</span><span>PAYOFF</span><span>CTA</span></div></div>}

function Retention(){return <section className="section retention"><div className="retentionIntro reveal"><div><span>03 / VIEWER-FIRST EDITING</span><h2>KEEP THE<br/><i>THUMB MOVING.</i></h2></div><p>Each edit is designed as a visual conversation: make the promise, add proof, then make the next moment impossible to ignore.</p></div><div className="retentionPanel reveal"><RetentionCurve/><div className="retentionSteps">{[['01','HOOK','Say the important thing first.'],['02','TURN','Refresh attention with a visual change.'],['03','PAYOFF','Land the reason the viewer stayed.'],['04','CTA','End with a clear next step.']].map(([n,title,text])=><div key={title}><small>{n}</small><b>{title}</b><span>{text}</span></div>)}</div></div></section>}

function About(){return <section className="section about"><div className="sectionHeader reveal"><span>04 / ABOUT ALONSO</span><h2>EDITOR.<br/><i>STORYTELLER.</i></h2></div><div className="aboutGrid reveal"><div className="aboutVisual"><div className="aboutRing"><span>ALONSO / EDITOR / ALONSO / EDITOR /</span></div><div className="aboutCard"><b>A</b><span>PAKISTAN<br/>WORLDWIDE</span></div></div><div className="aboutCopy"><p>I’m <strong>Alonso</strong>, a video editor focused on UGC, short-form content and motion-driven creative.</p><p>I work at the intersection of <em>story, timing, visual clarity</em> and momentum—so a good idea feels natural in the feed and memorable after it.</p><p>The goal is never to add more. It’s to make every frame work harder.</p><div className="aboutNotes"><span>UGC / CREATOR EDITS</span><span>SHORT-FORM / REELS</span><span>MOTION / GRAPHICS</span></div></div></div></section>}

function Services(){const [active,setActive]=useState(0); return <section id="services" className="section services"><div className="sectionHeader reveal"><span>05 / SERVICES</span><h2>THREE WAYS<br/><i>TO MAKE IT LAND.</i></h2></div><div className="serviceList reveal">{services.map(([number,title,description,type],index)=><button key={title} className={active===index?'active':''} onMouseEnter={()=>setActive(index)} onFocus={()=>setActive(index)} onClick={()=>setActive(index)} data-cursor="VIEW"><small>{number}</small><div><b>{title}</b><span>{description}</span></div><div className={'serviceGlyph '+type}><i/><i/><i/></div><ArrowUpRight/></button>)}</div></section>}

function Process(){const [stage,setStage]=useState(0); const [name,description]=workflow[stage]; return <section className="section process"><div className="sectionHeader reveal"><span>06 / WORKFLOW</span><h2>FROM IDEA<br/><i>TO IMPACT.</i></h2></div><div className="processPanel reveal"><div className="processNav">{workflow.map(([label],index)=><button key={label} onClick={()=>setStage(index)} className={index===stage?'active':''}><small>0{index+1}</small>{label}</button>)}</div><div className="processDisplay"><div className="processGrid"/><div className="processProgress" style={{left:`${stage/(workflow.length-1)*100}%`}}/><span>STEP 0{stage+1} / 06</span><h3>{name}</h3><p>{description}</p><div className="processMeta"><span>9:16 / SOCIAL FIRST</span><span>01:0{stage}:12</span></div></div></div></section>}

function Testimonials(){const quotes=[['The pacing and attention to detail made the content feel like a completely different product.','CREATOR'],['Fast communication, clean edits and every revision actually improved the final video.','BRAND'],['The kind of editor who understands why an edit works, not just how to make it look cool.','FOUNDER']]; const [index,setIndex]=useState(0); const [quote,role]=quotes[index]; return <section className="section testimonials"><div className="sectionHeader reveal"><span>07 / CLIENT REVIEWS</span><h2>TRUSTED<br/><i>BY CREATORS.</i></h2></div><div className="quoteShell reveal"><button aria-label="Previous review" onClick={()=>setIndex((index+quotes.length-1)%quotes.length)}>←</button><div className="quote" key={index}><span>“</span><p>{quote}</p><small>CLIENT / {role}</small></div><button aria-label="Next review" onClick={()=>setIndex((index+1)%quotes.length)}>→</button></div><div className="quoteDots">{quotes.map((_,dot)=><button key={dot} className={dot===index?'active':''} onClick={()=>setIndex(dot)} aria-label={`Show review ${dot+1}`}/>)}</div></section>}

function Contact(){return <section id="contact" className="contact"><div className="contactGlow"/><div className="contactContent"><span className="contactKicker">08 / OPEN FOR SELECT PROJECTS</span><h2>GOT FOOTAGE?<br/><i>LET’S MAKE IT LAND.</i></h2><p>Tell me what you’re making and what you need it to do. I’ll help turn the raw idea into a memorable edit.</p><a href={CONTACT} className="contactButton" data-cursor="START">START A PROJECT <ArrowUpRight/></a><Timeline compact/><div className="socials"><a href="https://instagram.com/_datboii.qasim" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="https://fh-agency.carrd.co" target="_blank" rel="noreferrer">PORTFOLIO ↗</a><span>PAKISTAN / WORLDWIDE</span></div></div></section>}

function App(){
  const reduced=useReducedMotion(); const [loaded,setLoaded]=useState(false); const [activeProject,setActiveProject]=useState<typeof projects[number]|null>(null);
  useEffect(()=>{if(reduced) return; const context=gsap.context(()=>{gsap.utils.toArray<HTMLElement>('.reveal').forEach((element)=>gsap.fromTo(element,{opacity:0,y:34},{opacity:1,y:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 87%',once:true}})); gsap.to('.marquee > div',{xPercent:-21,ease:'none',scrollTrigger:{trigger:'.marquee',start:'top bottom',end:'bottom top',scrub:true}});}); return()=>context.revert()},[reduced]);
  return <><Loader ready={loaded} onReady={()=>setLoaded(true)}/><Cursor/><Nav/><main><Hero reduced={reduced}/><Marquee/><Stats/><Work onOpen={setActiveProject}/><Studio/><Retention/><About/><Services/><Process/><Testimonials/><Contact/></main><footer><span>© 2026 ALONSO</span><span>UGC · MOTION GRAPHICS · SHORT-FORM</span><span>BUILT AROUND THE EDIT</span></footer>{activeProject&&<ProjectModal project={activeProject} onClose={()=>setActiveProject(null)}/>}</>;
}

createRoot(document.getElementById('root')!).render(<App/>);
