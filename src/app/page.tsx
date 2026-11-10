 "use client";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, CalendarDays, Check, ChevronLeft, ChevronRight, CircleHelp,
  ClipboardList, Heart, House, LockKeyhole, Menu, Plus, Settings, Shield,
  Sparkles, BookOpen, Gift, BarChart3, Bell, Droplets, ListChecks, X
} from "lucide-react";
import { supabase, supabaseConfigured } from "@/lib/supabase";

type Task = { id:string; title:string; day:string; detail?:string; done:boolean };
type Rule = { id:number; title:string; category:string; enabled:boolean };
type PeriodLog = { id:string; start:string; end:string; flow:string; symptoms:string; note:string };
const initialRules: Rule[] = [
  {id:1,title:"Always be honest with Daddy",category:"Communication",enabled:true},
  {id:2,title:"Good morning and goodnight messages",category:"Communication",enabled:true},
  {id:3,title:"Keep Daddy updated when going somewhere or becoming unavailable",category:"Communication",enabled:true},
  {id:4,title:"Follow agreed instructions without unnecessary arguing",category:"Protocol",enabled:true},
  {id:5,title:"Ask permission when needed",category:"Protocol",enabled:true},
  {id:6,title:"Never ignore Daddy deliberately",category:"Communication",enabled:true},
  {id:7,title:"Report daily tasks honestly",category:"Routine",enabled:true},
  {id:8,title:"Keep up with hygiene, meals and hydration",category:"Wellbeing",enabled:true},
  {id:9,title:"Cycle updates, only as agreed and comfortable",category:"Personal",enabled:true},
  {id:10,title:"Be honest about intimate activity only to the extent mutually agreed",category:"Personal",enabled:true},
  {id:11,title:"Never fake obedience or pretend to be okay",category:"Communication",enabled:true},
  {id:12,title:"Address problems directly instead of becoming distant",category:"Communication",enabled:true},
  {id:13,title:"Do not share passwords or identifying information",category:"Privacy",enabled:true},
  {id:14,title:"Rules never override health, safety or consent",category:"Safety",enabled:true},
  {id:15,title:"Safeword means immediate stop",category:"Safety",enabled:true},
  {id:16,title:"Use agreed forms of address during roleplay",category:"Protocol",enabled:true},
  {id:17,title:"Communicate at least once daily, or let each other know when unavailable",category:"Communication",enabled:true}
];
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const initialTasks: Task[] = [
  {id:"m1",day:"Monday",title:"Bedroom reset",detail:"Tidy room for 10–15 minutes",done:false},
  {id:"t1",day:"Tuesday",title:"Outfit check",detail:"Optional outfit photo before getting dressed; no intimate images",done:false},
  {id:"w1",day:"Wednesday",title:"Personal care check",detail:"Skincare and nail care",done:false},
  {id:"th1",day:"Thursday",title:"Outfit check",detail:"Optional outfit photo before getting dressed; no intimate images",done:false},
  {id:"f1",day:"Friday",title:"Personal space reset",detail:"Clean and organise desk or belongings",done:false},
  {id:"s1",day:"Saturday",title:"Weekly report",detail:"Reflect on the week, challenges and changes",done:false},
  {id:"su1",day:"Sunday",title:"Shaving & grooming",detail:"Only if wanted and comfortable",done:false}
];
const nav = [
  ["Overview",House],["Weekly roster",CalendarDays],["Rules",BookOpen],["Daily tasks",ListChecks],
  ["Cycle tracker",Droplets],["Personal tracker",Heart],["Consequences",Shield],["Rewards",Gift],
  ["Reports",BarChart3],["Check-ins",Activity],["Boundaries",LockKeyhole]
] as const;

export default function Home() {
  const [section,setSection] = useState("Overview");
  const [role,setRole] = useState<"Dom"|"Sub">("Dom");
  const [tasks,setTasks] = useState<Task[]>(initialTasks);
  const [rules,setRules] = useState<Rule[]>(initialRules);
  const [periods,setPeriods] = useState<PeriodLog[]>([]);
  const [start,setStart] = useState("");
  const [end,setEnd] = useState("");
  const [flow,setFlow] = useState("Medium");
  const [symptoms,setSymptoms] = useState("");
  const [note,setNote] = useState("");
  const [newTask,setNewTask] = useState("");
  const [taskDay,setTaskDay] = useState("Monday");
  const [checkin,setCheckin] = useState("");
  const [journal,setJournal] = useState("");
  const [menu,setMenu] = useState(false);
  const [notice,setNotice] = useState("");
  const completed = tasks.filter(t=>t.done).length;
  const percent = tasks.length ? Math.round(completed/tasks.length*100) : 0;

  useEffect(()=>{
    try {
      const saved=localStorage.getItem("shared-space-v1");
      if(saved){const data=JSON.parse(saved);setTasks(data.tasks??initialTasks);setRules(data.rules??initialRules);setPeriods(data.periods??[]);}
    } catch {}
  },[]);
  useEffect(()=>{
    try { localStorage.setItem("shared-space-v1",JSON.stringify({tasks,rules,periods})); } catch {}
  },[tasks,rules,periods]);

  const today = days[(new Date().getDay()+6)%7];
  const todayTasks = tasks.filter(t=>t.day===today);
  const toggleTask=(id:string)=>setTasks(old=>old.map(t=>t.id===id?{...t,done:!t.done}:t));
  const addTask=()=>{if(!newTask.trim())return;setTasks(old=>[...old,{id:crypto.randomUUID(),title:newTask.trim(),day:taskDay,done:false}]);setNewTask("");setNotice("Task added to the roster.");};
  const addPeriod=()=>{if(!start)return;setPeriods(old=>[{id:crypto.randomUUID(),start,end,flow,symptoms,note},...old]);setStart("");setEnd("");setSymptoms("");setNote("");setNotice("Cycle entry saved on this device.");};
  const heading = section==="Overview" ? "Welcome to your shared space" : section;
  const sharedMode = supabaseConfigured ? "Supabase configured" : "Local demo mode";
  return <main className="shell">
    <aside className={`sidebar ${menu?"open":""}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={19}/></div><div><b>THE SHARED SPACE</b><small>Routines · trust · connection</small></div></div>
      <div className="role-switch"><span>Viewing as</span><div><button className={role==="Dom"?"selected":""} onClick={()=>setRole("Dom")}>Dom</button><button className={role==="Sub"?"selected":""} onClick={()=>setRole("Sub")}>Sub</button></div></div>
      <nav>{nav.map(([label,Icon])=><button key={label} className={section===label?"nav-item active":"nav-item"} onClick={()=>{setSection(label);setMenu(false)}}><Icon size={17}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><div className="privacy-note"><LockKeyhole size={15}/><span>Private space<br/><small>{sharedMode}</small></span></div><button className="nav-item" onClick={()=>setSection("Settings")}><Settings size={17}/>Settings</button></div>
    </aside>
    <section className="main">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMenu(!menu)}><Menu/></button><div className="crumb">Shared space <span>/</span> {section}</div><div className="top-actions"><span className="role-pill">{role} view</span><button className="icon-button" title="Notifications"><Bell size={18}/></button><div className="avatar">{role==="Dom"?"D":"S"}</div></div></header>
      <div className="content">
        <div className="page-heading"><div><p className="eyebrow">YOUR PRIVATE ROUTINE HUB</p><h1>{heading}</h1><p className="subheading">{section==="Overview"?"A shared place for agreed routines, check-ins and personal wellbeing.":"Keep things organised, transparent and adjustable together."}</p></div><span className="date-label">{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</span></div>
        {notice&&<div className="notice" onClick={()=>setNotice("")}>{notice}<X size={15}/></div>}
        {section==="Overview"&&<><div className="hero"><div><span className="hero-kicker">A LITTLE STRUCTURE, A LOT OF TRUST</span><h2>Make room for consistency<br/>and honest communication.</h2><p>Your routines are agreements, not obligations. Health, consent and the safeword always come first.</p><button className="primary" onClick={()=>setSection("Weekly roster")}>View weekly roster <ChevronRight size={16}/></button></div><div className="hero-art"><div className="orb orb1"/><div className="orb orb2"/><Heart size={60}/><Sparkles className="spark s1"/><Sparkles className="spark s2"/></div></div>
          <div className="stats"><Stat label="Tasks completed" value={`${completed}/${tasks.length}`} hint="Across this roster" icon={<Check/>}/><Stat label="Completion" value={`${percent}%`} hint="This week's progress" icon={<BarChart3/>}/><Stat label="Active rules" value={`${rules.filter(r=>r.enabled).length}`} hint="Agreed protocols" icon={<BookOpen/>}/><Stat label="Cycle entries" value={`${periods.length}`} hint="Private health log" icon={<Droplets/>}/></div>
          <div className="columns"><div className="panel"><div className="panel-head"><div><h3>Today's tasks</h3><p>{today} · your daily overview</p></div><button className="text-button" onClick={()=>setSection("Daily tasks")}>See all <ChevronRight size={15}/></button></div>{todayTasks.length?todayTasks.map(t=><TaskRow key={t.id} task={t} onToggle={()=>toggleTask(t.id)}/>):<Empty text="No specific tasks assigned for today."/>}</div><div className="panel"><div className="panel-head"><div><h3>Quick check-in</h3><p>How are things feeling today?</p></div><Heart size={18} className="muted"/></div><textarea value={checkin} onChange={e=>setCheckin(e.target.value)} placeholder="Share a thought, feeling or update..." rows={4}/><button className="primary full" onClick={()=>{setNotice("Check-in saved for this session. Add shared storage before using multiple devices.");setCheckin("");}}>Save check-in</button><p className="micro">Only share what you are comfortable sharing.</p></div></div>
        </>}
        {section==="Weekly roster"&&<div className="panel"><div className="panel-head"><div><h3>Your weekly schedule</h3><p>Based on the supplied weekly planner. Edit tasks as needed.</p></div><span className="tag">7 days</span></div><div className="week-grid">{days.map((d,i)=><div className="day-card" key={d}><div className="day-title"><b>{d}</b><span>{["Warm","Cold","Warm","Cold","Warm","Cold","Warm"][i]}</span></div>{tasks.filter(t=>t.day===d).map(t=><TaskRow key={t.id} task={t} onToggle={()=>toggleTask(t.id)}/>)}{!tasks.some(t=>t.day===d)&&<small className="muted">No assignments</small>}</div>)}</div><div className="add-task"><input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="Add a task to the roster"/><select value={taskDay} onChange={e=>setTaskDay(e.target.value)}>{days.map(d=><option key={d}>{d}</option>)}</select><button className="primary" onClick={addTask}><Plus size={16}/> Add</button></div><p className="micro">Shower preferences are optional and should always be skipped if uncomfortable or unwell.</p></div>}
        {section==="Daily tasks"&&<div className="panel"><div className="panel-head"><div><h3>Daily routine</h3><p>Everyday basics from your planner</p></div></div><div className="routine-list">{["Complete one shower (warm or cold, as comfortable)","Complete the day's assigned task","Morning or evening check-in, as agreed","Share difficulties or changes when comfortable","Be honest about how the day went","Take time to rest when needed"].map((t,i)=><div className="routine" key={i}><Check size={17}/><span>{t}</span></div>)}</div><div className="divider"/><h3>All assignments</h3>{tasks.map(t=><TaskRow key={t.id} task={t} onToggle={()=>toggleTask(t.id)}/>)}</div>}
        {section==="Rules"&&<div className="panel"><div className="panel-head"><div><h3>Rules & protocols</h3><p>Based on the 17 rules in your Word planner. Edit or disable by mutual agreement.</p></div><span className="tag">{rules.filter(r=>r.enabled).length} active</span></div>{rules.map(r=><div className="rule-row" key={r.id}><div className="rule-number">{String(r.id).padStart(2,"0")}</div><div className="rule-copy"><b>{r.title}</b><small>{r.category}</small></div><button className={`toggle ${r.enabled?"on":""}`} aria-label="Toggle rule" onClick={()=>setRules(old=>old.map(x=>x.id===r.id?{...x,enabled:!x.enabled}:x))}><span/></button></div>)}<p className="safety-callout"><Shield size={17}/> Rules never override consent, health, safety or the right to pause.</p></div>}
        {section==="Cycle tracker"&&<div className="columns cycle-layout"><div className="panel"><div className="panel-head"><div><h3>Log a period</h3><p>Personal health information. Sharing is optional.</p></div><Droplets className="muted"/></div><label>Start date<input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label><label>End date (optional)<input type="date" value={end} onChange={e=>setEnd(e.target.value)}/></label><label>Flow<select value={flow} onChange={e=>setFlow(e.target.value)}><option>Light</option><option>Medium</option><option>Heavy</option><option>Spotting</option></select></label><label>Symptoms<textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} placeholder="e.g. cramps, headache, fatigue..." rows={2}/></label><label>Private notes<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Anything else you want to remember..." rows={2}/></label><button className="primary full" onClick={addPeriod}>Save cycle entry</button><p className="micro">This starter version stores entries in this browser only. It does not calculate medical predictions.</p></div><div className="panel"><div className="panel-head"><div><h3>Cycle history</h3><p>Entries you've recorded</p></div></div>{periods.length?periods.map(p=><div className="history-row" key={p.id}><div className="history-dot"/><div><b>{p.start}{p.end?` – ${p.end}`:""}</b><p>{p.flow} flow {p.symptoms?`· ${p.symptoms}`:""}</p>{p.note&&<small>{p.note}</small>}</div></div>):<Empty text="No cycle entries yet. Add one when you want to."/>}<div className="safety-callout"><LockKeyhole size={16}/> Cycle information is sensitive. Keep it private unless the person logging it chooses to share it.</div></div></div>}
        {section==="Personal tracker"&&<div className="panel"><div className="panel-head"><div><h3>Personal & intimate tracker</h3><p>Optional, self-reported records and personal goals.</p></div><Heart className="muted"/></div><div className="safety-callout"><LockKeyhole size={17}/> This section is a planning placeholder. Any future activity log should be opt-in, user-controlled and never require photos, recordings or proof.</div><label>Personal reflection<textarea value={journal} onChange={e=>setJournal(e.target.value)} rows={5} placeholder="Private notes or reflections..."/></label><button className="primary" onClick={()=>{setNotice("Reflection saved for this session only.");setJournal("");}}>Save reflection</button></div>}
        {section==="Consequences"&&<div className="panel"><h3>Agreed consequences</h3><p className="subheading">Keep any consequence pre-agreed, proportionate, safe and reviewable. Either person can pause or renegotiate.</p><Empty text="No consequences configured. Add this module after both people agree on limits and review rules."/></div>}
        {section==="Rewards"&&<div className="panel"><h3>Rewards & positive reinforcement</h3><p className="subheading">Celebrate consistency, effort and honest communication.</p><Empty text="No rewards configured yet."/></div>}
        {section==="Reports"&&<div className="panel"><h3>Weekly report</h3><p className="subheading">A reflection based on your planner.</p>{["How did this week go overall?","Which tasks did I complete?","Was anything missed? If so, why?","What was the best moment of the week?","What felt difficult or uncomfortable?","What would I like to change for next week?"].map(q=><label key={q}>{q}<textarea rows={2} placeholder="Write your reflection..."/></label>)}</div>}
        {section==="Check-ins"&&<div className="panel"><h3>Daily check-ins</h3><p className="subheading">A simple place for morning and evening updates.</p><label>Today's check-in<textarea rows={4} placeholder="How are you doing? Anything to communicate?"/></label><button className="primary" onClick={()=>setNotice("Check-in noted for this session.")}>Save check-in</button></div>}
        {section==="Boundaries"&&<div className="panel"><h3>Boundaries & safety</h3><div className="safety-callout"><Shield size={18}/> Safeword: <b>SMOKE</b> — stop immediately. No explanation is required before stopping.</div><div className="routine-list">{["Either person can pause or end roleplay at any time.","No rule overrides health, consent, sleep, school, work or personal safety.","No required intimate photos, videos or proof.","Agree hard limits, soft limits and aftercare before activities.","A check-in should be possible without punishment or pressure.","Personal health information stays private unless explicitly shared."].map((x,i)=><div className="routine" key={i}><Check size={16}/>{x}</div>)}</div></div>}
        {section==="Settings"&&<div className="panel"><h3>Settings & deployment</h3><p>Current storage mode: <b>{sharedMode}</b></p><p className="subheading">This downloadable starter saves planner, rules and cycle log data in this browser's local storage. It is not yet connected to shared accounts or cloud database storage.</p><div className="safety-callout"><LockKeyhole size={17}/> Do not enter real intimate or health information into this demo. Configure Supabase authentication, database tables and row-level security before using it with real personal data.</div><p className="micro">See README.md and supabase/schema.sql for deployment and database setup.</p></div>}
        <footer>THE SHARED SPACE <span>Built around trust, consent and clear communication.</span></footer>
      </div>
    </section>
  </main>;
}
function Stat({label,value,hint,icon}:{label:string;value:string;hint:string;icon:React.ReactNode}){return <div className="stat-card"><div className="stat-top"><span>{label}</span><i>{icon}</i></div><strong>{value}</strong><small>{hint}</small></div>}
function TaskRow({task,onToggle}:{task:Task;onToggle:()=>void}){return <div className="task-row"><button className={`check ${task.done?"checked":""}`} onClick={onToggle}>{task.done&&<Check size={13}/>}</button><div className="task-copy"><b className={task.done?"done":""}>{task.title}</b>{task.detail&&<small>{task.detail}</small>}</div><span className={task.done?"status complete":"status"}>{task.done?"Done":"To do"}</span></div>}
function Empty({text}:{text:string}){return <div className="empty"><CircleHelp size={20}/><span>{text}</span></div>}