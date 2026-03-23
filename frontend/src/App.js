import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000";
const CATS = ["Electronics","Furniture","Clothing","Food & Beverages","Tools","Stationery","Others"];
const ALL_CATS = ["All Products", ...CATS];

/* ═══ STYLES ═══════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --c: #ff6b35; --c2: #e85d2a; --cl: #fff3ee; --cm: #ffd6c4;
  --bl: #2563eb; --bll: #eff6ff;
  --gr: #16a34a; --grl: #f0fdf4;
  --rd: #dc2626; --rdl: #fef2f2;
  --yw: #d97706; --ywl: #fffbeb;
  --pu: #7c3aed; --pul: #f5f3ff;
  --g0: #f8fafc; --g1: #f1f5f9; --g2: #e2e8f0; --g3: #cbd5e1;
  --g4: #94a3b8; --g5: #64748b; --g6: #475569; --g7: #334155;
  --g8: #1e293b; --g9: #0f172a; --w: #fff;
  --s1: 0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.04);
  --s2: 0 4px 16px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.04);
  --s3: 0 12px 40px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.06);
  --r: 12px; --rl: 20px;
}

body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--g0); color: var(--g8); min-height: 100vh; -webkit-font-smoothing: antialiased; }
button, input, select { font-family: inherit; cursor: pointer; }
input { cursor: text; }

/* ── TOPBAR ── */
.topbar { background: var(--g9); color: var(--g4); font-size: .75rem; padding: .4rem 0; text-align: center; letter-spacing: .3px; }

/* ── NAVBAR ── */
.navbar { background: var(--w); border-bottom: 1px solid var(--g2); position: sticky; top: 0; z-index: 300; box-shadow: var(--s1); }
.nbi { max-width: 1320px; margin: 0 auto; padding: 0 1.5rem; height: 68px; display: flex; align-items: center; gap: 1.5rem; }
.logo { display: flex; align-items: center; gap: .6rem; cursor: pointer; flex-shrink: 0; }
.logo-ico { width: 38px; height: 38px; background: linear-gradient(135deg,var(--c),#ff9a6c); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(255,107,53,.35); }
.logo-txt { font-family: 'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: var(--g9); letter-spacing: -.5px; }
.logo-txt span { color: var(--c); }
.nsearch { flex: 1; max-width: 460px; display: flex; background: var(--g1); border: 1.5px solid var(--g2); border-radius: 10px; overflow: hidden; transition: border-color .2s, box-shadow .2s; }
.nsearch:focus-within { border-color: var(--c); box-shadow: 0 0 0 3px rgba(255,107,53,.12); background: var(--w); }
.nsearch input { flex: 1; border: none; background: none; outline: none; padding: .65rem 1rem; font-size: .9rem; color: var(--g8); }
.nsearch input::placeholder { color: var(--g4); }
.nsearch button { background: var(--c); border: none; padding: 0 1.1rem; color: #fff; font-size: 1rem; display: flex; align-items: center; transition: background .2s; }
.nsearch button:hover { background: var(--c2); }
.nlinks { display: flex; align-items: center; gap: .2rem; margin-left: auto; }
.nl { display: flex; flex-direction: column; align-items: center; gap: .1rem; padding: .5rem .85rem; border-radius: 8px; border: none; background: none; color: var(--g5); font-size: .78rem; font-weight: 500; transition: all .2s; white-space: nowrap; }
.nl .i { font-size: 1.1rem; }
.nl:hover { background: var(--g1); color: var(--g9); }
.nl.on { color: var(--c); background: var(--cl); }
.nl.out { color: var(--rd) !important; }
.nl.out:hover { background: var(--rdl) !important; }

/* ── CAT BAR ── */
.catbar { background: var(--w); border-bottom: 1px solid var(--g2); box-shadow: var(--s1); }
.cbi { max-width: 1320px; margin: 0 auto; padding: 0 1.5rem; display: flex; overflow-x: auto; }
.cbi::-webkit-scrollbar { display: none; }
.ci { padding: .7rem 1.2rem; font-size: .83rem; font-weight: 600; color: var(--g5); border: none; background: none; border-bottom: 2.5px solid transparent; transition: all .2s; white-space: nowrap; display: flex; align-items: center; gap: .35rem; }
.ci:hover { color: var(--c); }
.ci.on { color: var(--c); border-bottom-color: var(--c); }

/* ── MAIN ── */
.main { max-width: 1320px; margin: 0 auto; padding: 2rem 1.5rem; }

/* ── HERO ── */
.hero { background: linear-gradient(135deg,#fff3ee 0%,#ffecd8 40%,#ffe4d4 100%); border-radius: var(--rl); padding: 2.5rem 3rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; position: relative; overflow: hidden; border: 1px solid var(--cm); }
.hero::before { content:''; position: absolute; right: -60px; top: -60px; width: 280px; height: 280px; background: radial-gradient(circle,rgba(255,107,53,.15) 0%,transparent 70%); border-radius: 50%; }
.hero h1 { font-family: 'Sora',sans-serif; font-size: 2rem; font-weight: 800; color: var(--g9); line-height: 1.2; margin-bottom: .6rem; letter-spacing: -.5px; }
.hero h1 span { color: var(--c); }
.hero p { color: var(--g5); font-size: .95rem; line-height: 1.6; max-width: 400px; }
.hero-acts { display: flex; gap: .75rem; margin-top: 1.5rem; }
.hero-em { font-size: 6rem; line-height: 1; filter: drop-shadow(0 8px 24px rgba(255,107,53,.25)); position: relative; z-index: 1; flex-shrink: 0; }

/* ── STATS ── */
.stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 2rem; }
.sc { background: var(--w); border: 1px solid var(--g2); border-radius: var(--r); padding: 1.4rem; display: flex; align-items: center; gap: 1rem; box-shadow: var(--s1); transition: transform .2s, box-shadow .2s, border-color .2s; }
.sc:hover { transform: translateY(-3px); box-shadow: var(--s2); border-color: var(--cm); }
.sc-ico { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
.sc-val { font-family: 'Sora',sans-serif; font-size: 1.6rem; font-weight: 700; letter-spacing: -.5px; line-height: 1; }
.sc-lbl { color: var(--g5); font-size: .8rem; margin-top: .2rem; font-weight: 500; }

/* ── SEC TITLE ── */
.sec-title { font-family: 'Sora',sans-serif; font-size: 1.15rem; font-weight: 700; color: var(--g9); margin-bottom: 1.2rem; }

/* ── ACTION GRID ── */
.agrid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 2rem; }
.ac { background: var(--w); border: 1.5px solid var(--g2); border-radius: var(--r); padding: 1.5rem; cursor: pointer; transition: all .2s; text-align: left; position: relative; overflow: hidden; }
.ac::after { content:'→'; position: absolute; right: 1.2rem; bottom: 1.2rem; font-size: 1rem; color: var(--g3); transition: all .2s; }
.ac:hover { border-color: var(--c); box-shadow: 0 8px 32px rgba(255,107,53,.12); transform: translateY(-3px); }
.ac:hover::after { color: var(--c); right: 1rem; }
.ac-ico { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; margin-bottom: 1rem; }
.ac h3 { font-size: .95rem; font-weight: 700; color: var(--g8); margin-bottom: .3rem; }
.ac p { font-size: .8rem; color: var(--g5); line-height: 1.4; }

/* ── TABLE ── */
.tbl-wrap { background: var(--w); border: 1px solid var(--g2); border-radius: var(--rl); overflow: hidden; box-shadow: var(--s1); }
.tbl-top { padding: 1.2rem 1.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--g1); background: var(--g0); flex-wrap: wrap; gap: .75rem; }
.tbl-ttl { font-family: 'Sora',sans-serif; font-size: .95rem; font-weight: 700; color: var(--g8); display: flex; align-items: center; gap: .5rem; }
.tbl-cnt { background: var(--cl); color: var(--c); font-size: .72rem; font-weight: 700; padding: .2rem .6rem; border-radius: 20px; }
table { width: 100%; border-collapse: collapse; }
th { padding: .9rem 1.25rem; text-align: left; font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--g5); background: var(--g0); border-bottom: 1px solid var(--g2); }
td { padding: 1rem 1.25rem; font-size: .88rem; border-bottom: 1px solid var(--g1); vertical-align: middle; }
tbody tr { transition: background .15s; }
tbody tr:hover { background: #fffbf9; }
tbody tr:last-child td { border-bottom: none; }
.tid { font-family: monospace; font-size: .8rem; color: var(--g4); background: var(--g1); padding: .2rem .5rem; border-radius: 4px; display: inline-block; }
.tname { font-weight: 600; color: var(--g8); }
.tprice { font-weight: 600; color: var(--c); }
.tcat { display: inline-flex; align-items: center; gap: .3rem; background: var(--pul); color: var(--pu); font-size: .75rem; font-weight: 600; padding: .25rem .65rem; border-radius: 20px; }
.badge { display: inline-flex; align-items: center; gap: .3rem; padding: .3rem .75rem; border-radius: 20px; font-size: .75rem; font-weight: 600; }
.badge::before { content:''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.bg { background: var(--grl); color: var(--gr); }
.by { background: var(--ywl); color: var(--yw); }
.br { background: var(--rdl); color: var(--rd); }

/* ── SEARCH BAR ── */
.sbar { display: flex; align-items: center; gap: .5rem; background: var(--w); border: 1.5px solid var(--g2); border-radius: 10px; padding: .55rem 1rem; min-width: 240px; transition: border-color .2s; }
.sbar:focus-within { border-color: var(--c); }
.sbar input { background: none; border: none; outline: none; font-size: .88rem; color: var(--g8); flex: 1; }
.sbar input::placeholder { color: var(--g4); }

/* ── FORM ── */
.fcard { background: var(--w); border: 1px solid var(--g2); border-radius: var(--rl); padding: 2rem; max-width: 560px; box-shadow: var(--s1); }
.fg { margin-bottom: 1.2rem; }
.fg label { display: block; font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--g6); margin-bottom: .45rem; }
.fi { width: 100%; border: 1.5px solid var(--g2); border-radius: 10px; padding: .85rem 1rem; font-size: .92rem; color: var(--g8); outline: none; background: var(--w); transition: border-color .2s, box-shadow .2s; font-family: inherit; }
.fi:focus { border-color: var(--c); box-shadow: 0 0 0 3px rgba(255,107,53,.1); }
.fi::placeholder { color: var(--g4); }
select.fi { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem; cursor: pointer; }
.frow { display: flex; gap: .6rem; }
.frow .fi { flex: 1; }
.hint { font-size: .76rem; color: var(--g4); margin-top: .35rem; }

/* ── AUTO-FILL BOX ── */
.afbox { background: var(--bll); border: 1px solid #bfdbfe; border-radius: 10px; padding: .9rem 1.1rem; margin-bottom: 1.2rem; display: flex; align-items: center; gap: .75rem; font-size: .87rem; color: var(--bl); }
.afbox strong { font-weight: 700; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--bl); flex-shrink: 0; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }

/* ── BUTTONS ── */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .8rem 1.75rem; border-radius: 10px; border: none; font-size: .9rem; font-weight: 700; transition: all .2s; cursor: pointer; }
.btn-c { background: linear-gradient(135deg,var(--c),#ff8c5a); color: #fff; box-shadow: 0 4px 12px rgba(255,107,53,.3); }
.btn-c:hover { background: linear-gradient(135deg,var(--c2),var(--c)); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,107,53,.4); }
.btn-c:disabled { opacity: .6; cursor: not-allowed; transform: none !important; }
.btn-g { background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; box-shadow: 0 4px 12px rgba(22,163,74,.3); }
.btn-g:hover { transform: translateY(-1px); }
.btn-b { background: linear-gradient(135deg,#3b82f6,var(--bl)); color: #fff; box-shadow: 0 4px 12px rgba(37,99,235,.3); }
.btn-b:hover { transform: translateY(-1px); }
.btn-b:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }
.btn-r { background: linear-gradient(135deg,#ef4444,var(--rd)); color: #fff; box-shadow: 0 4px 12px rgba(220,38,38,.3); }
.btn-r:hover { transform: translateY(-1px); }
.btn-o { background: var(--w); color: var(--g7); border: 1.5px solid var(--g3); }
.btn-o:hover { border-color: var(--g4); background: var(--g0); }
.btn-full { width: 100%; }
.btn-sm { padding: .6rem 1.2rem; font-size: .83rem; }

/* ── ALERTS ── */
.al { padding: .9rem 1.1rem; border-radius: 10px; margin-bottom: 1.25rem; font-size: .87rem; font-weight: 500; display: flex; align-items: center; gap: .5rem; }
.al-s { background: var(--grl); border: 1px solid #bbf7d0; color: var(--gr); }
.al-e { background: var(--rdl); border: 1px solid #fecaca; color: var(--rd); }
.al-w { background: var(--ywl); border: 1px solid #fde68a; color: var(--yw); }

/* ── PAGE HEADER ── */
.phdr { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
.phdr h1 { font-family: 'Sora',sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--g9); letter-spacing: -.4px; }
.phdr p { color: var(--g5); margin-top: .3rem; font-size: .88rem; }

/* ── BREADCRUMB ── */
.bc { display: flex; align-items: center; gap: .4rem; font-size: .8rem; color: var(--g4); margin-bottom: 1.5rem; }
.bc span { color: var(--g6); font-weight: 500; }
.bc .sep { color: var(--g3); }

/* ── EMPTY ── */
.empty { padding: 4rem 2rem; text-align: center; color: var(--g4); }
.empty .ei { font-size: 3rem; margin-bottom: 1rem; opacity: .5; }
.empty p { font-size: .9rem; }

/* ── LOGIN ── */
.lpage { min-height: 100vh; background: linear-gradient(135deg,#fff7f3 0%,#ffeee5 50%,#fff3f0 100%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.lb1 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle,rgba(255,107,53,.12) 0%,transparent 70%); top: -100px; right: -100px; pointer-events: none; }
.lb2 { position: absolute; width: 350px; height: 350px; border-radius: 50%; background: radial-gradient(circle,rgba(37,99,235,.07) 0%,transparent 70%); bottom: -80px; left: -80px; pointer-events: none; }
.lbox { display: flex; width: 900px; min-height: 560px; background: var(--w); border-radius: 24px; box-shadow: var(--s3); overflow: hidden; position: relative; z-index: 1; animation: up .5s ease; }
.ll { flex: 1; background: linear-gradient(145deg,var(--c) 0%,#ff9a6c 60%,#ffb347 100%); padding: 3rem; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; }
.ll::before { content:''; position: absolute; width: 300px; height: 300px; border-radius: 50%; background: rgba(255,255,255,.1); top: -100px; right: -80px; }
.ll::after { content:''; position: absolute; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,.08); bottom: -60px; left: -40px; }
.llc { position: relative; z-index: 1; }
.lem { font-size: 4rem; margin-bottom: 1.5rem; filter: drop-shadow(0 4px 12px rgba(0,0,0,.15)); }
.ll h2 { font-family: 'Sora',sans-serif; font-size: 2rem; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 1rem; }
.ll p { color: rgba(255,255,255,.85); font-size: .95rem; line-height: 1.6; }
.lfi { display: flex; align-items: center; gap: .75rem; color: rgba(255,255,255,.9); font-size: .88rem; font-weight: 500; margin-top: .75rem; }
.lfd { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.6); flex-shrink: 0; }
.lr { flex: 1; padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
.llogo { display: flex; align-items: center; gap: .7rem; margin-bottom: .5rem; }
.llogo-ico { width: 40px; height: 40px; background: linear-gradient(135deg,var(--c),#ff9a6c); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(255,107,53,.3); }
.llogo-name { font-family: 'Sora',sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--g9); }
.llogo-name span { color: var(--c); }
.lr h3 { font-size: 1.3rem; font-weight: 700; color: var(--g8); margin-bottom: .3rem; margin-top: 1.5rem; }
.lsub { color: var(--g5); font-size: .9rem; margin-bottom: 2rem; }
.lhint { background: var(--bll); border: 1px solid #bfdbfe; border-radius: 8px; padding: .75rem 1rem; font-size: .8rem; color: var(--bl); margin-top: 1.25rem; text-align: center; }
.lhint strong { font-weight: 700; }

/* ── TOAST ── */
.toast { position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; padding: 1rem 1.5rem; border-radius: 12px; font-size: .88rem; font-weight: 600; display: flex; align-items: center; gap: .75rem; box-shadow: var(--s3); animation: up .3s ease; max-width: 360px; }
.ts { background: #166534; color: #fff; border: 1px solid #22c55e; }
.te { background: #7f1d1d; color: #fff; border: 1px solid #ef4444; }
.tw { background: #78350f; color: #fff; border: 1px solid #f59e0b; }

/* ── FOOTER ── */
.footer { background: var(--g9); color: var(--g4); text-align: center; padding: 1.25rem; font-size: .8rem; margin-top: 4rem; }
.footer span { color: var(--c); }

/* ── ANIMATIONS ── */
@keyframes up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.pg { animation: up .3s ease; }

/* ── RESPONSIVE ── */
@media(max-width:1024px) { .stats,.agrid { grid-template-columns: repeat(2,1fr); } .lbox { width: 95vw; } }
@media(max-width:700px) { .stats,.agrid { grid-template-columns: 1fr; } .lbox { flex-direction: column; } .ll { padding: 2rem; min-height: 200px; } .nsearch { display: none; } }
`;

/* ═══ HELPERS ═══════════════════════════════════════════════════════════════ */
function StyleTag() {
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "it-css";
    el.innerHTML = STYLES;
    document.head.appendChild(el);
    document.title = "InvenTrack — Inventory Management";
    return () => document.getElementById("it-css")?.remove();
  }, []);
  return null;
}

// Normalize null/empty category
const norm = c => (!c || c.trim() === "") ? "Others" : c.trim();

function Toast({ msg, type, onClose }) {
  useEffect(() => { if (!msg) return; const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [msg]);
  if (!msg) return null;
  return <div className={`toast ${type === "success" ? "ts" : type === "warn" ? "tw" : "te"}`}>{type === "success" ? "✓" : "⚠"} {msg}</div>;
}

/* ═══ NAVBAR ════════════════════════════════════════════════════════════════ */
function Navbar({ page, setPage, onLogout, search, setSearch }) {
  const links = [
    { id:"dashboard", i:"🏠", l:"Home" },
    { id:"add",       i:"➕", l:"Add" },
    { id:"view",      i:"📦", l:"Products" },
    { id:"update",    i:"✏️", l:"Update" },
    { id:"delete",    i:"🗑️", l:"Delete" },
  ];
  return (
    <>
      <div className="topbar">🚀 InvenTrack — Smart Inventory Management Platform</div>
      <nav className="navbar">
        <div className="nbi">
          <div className="logo" onClick={() => setPage("dashboard")}>
            <div className="logo-ico">📦</div>
            <div className="logo-txt">Inven<span>Track</span></div>
          </div>
          <div className="nsearch">
            <input placeholder="Search products…" value={search}
              onChange={e => { setSearch(e.target.value); setPage("view"); }} />
            <button>🔍</button>
          </div>
          <div className="nlinks">
            {links.map(l => (
              <button key={l.id} className={`nl${page === l.id ? " on" : ""}`} onClick={() => setPage(l.id)}>
                <span className="i">{l.i}</span>{l.l}
              </button>
            ))}
            <button className="nl out" onClick={onLogout}><span className="i">⏻</span>Logout</button>
          </div>
        </div>
      </nav>
    </>
  );
}

/* ═══ CATEGORY BAR ══════════════════════════════════════════════════════════ */
function CatBar({ active, setActive, setPage }) {
  const icons = { "All Products":"🏷️","Electronics":"💻","Furniture":"🪑","Clothing":"👕","Food & Beverages":"🍎","Tools":"🔧","Stationery":"✏️","Others":"📦" };
  return (
    <div className="catbar">
      <div className="cbi">
        {ALL_CATS.map(c => (
          <button key={c} className={`ci${active === c ? " on" : ""}`}
            onClick={() => { setActive(c); setPage("view"); }}>
            {icons[c]} {c}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══ LOGIN ═════════════════════════════════════════════════════════════════ */
function Login({ onLogin }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const go = async () => { if (!u || !p) { setErr("Enter username and password"); return; } try { await axios.post(`${API}/login`, { username: u, password: p }); onLogin(); } catch (e) { setErr(e.response?.data?.error || "Invalid credentials"); } };
  return (
    <div className="lpage">
      <StyleTag />
      <div className="lb1" /><div className="lb2" />
      <div className="lbox">
        <div className="ll">
          <div className="llc">
            <div className="lem">📦</div>
            <h2>Smart Inventory Management</h2>
            <p>Track, manage & optimize your inventory in real-time.</p>
            {["Real-time stock tracking","Category-wise management","Low stock alerts","Inventory value insights"].map(f => (
              <div className="lfi" key={f}><div className="lfd" />{f}</div>
            ))}
          </div>
        </div>
        <div className="lr">
          <div className="llogo">
            <div className="llogo-ico">📦</div>
            <div className="llogo-name">Inven<span>Track</span></div>
          </div>
          <h3>Welcome back!</h3>
          <div className="lsub">Sign in to your inventory dashboard</div>
          {err && <div className="al al-e">⚠ {err}</div>}
          <div className="fg"><label>Username</label>
            <input className="fi" placeholder="Enter username" value={u}
              onChange={e => { setU(e.target.value); setErr(""); }} /></div>
          <div className="fg"><label>Password</label>
            <input className="fi" type="password" placeholder="Enter password" value={p}
              onChange={e => { setP(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && go()} /></div>
          <button className="btn btn-c btn-full" onClick={go}>Sign In →</button>
          <div className="lhint">Demo: <strong>admin</strong> / <strong>admin123</strong></div>
        </div>
      </div>
    </div>
  );
}

/* ═══ DASHBOARD ═════════════════════════════════════════════════════════════ */
function Dashboard({ setPage }) {
  const [s, setS] = useState({ total:"—", qty:"—", val:"—", low:"—" });
  useEffect(() => {
    axios.get(`${API}/products`).then(r => {
      const d = r.data;
      setS({ total: d.length, qty: d.reduce((a,p)=>a+ +p.quantity,0), val: "₹"+d.reduce((a,p)=>a+ +p.price* +p.quantity,0).toLocaleString("en-IN"), low: d.filter(p=> +p.quantity<=5).length });
    }).catch(()=>{});
  }, []);
  const cards = [
    { v:s.total, l:"Total Products",  i:"📦", bg:"#fff3ee", c:"#f97316" },
    { v:s.qty,   l:"Units in Stock",   i:"🔢", bg:"#eff6ff", c:"#2563eb" },
    { v:s.val,   l:"Inventory Value",  i:"💰", bg:"#f0fdf4", c:"#16a34a" },
    { v:s.low,   l:"Low Stock Alerts", i:"⚠️", bg:"#fef2f2", c:"#dc2626" },
  ];
  const acts = [
    { id:"add",    i:"➕", l:"Add Product",    d:"Add new item with category",   bg:"#f0fdf4", b:"#bbf7d0" },
    { id:"view",   i:"📋", l:"View Products",  d:"Browse & filter by category",  bg:"#eff6ff", b:"#bfdbfe" },
    { id:"update", i:"✏️", l:"Update Stock",   d:"Auto-fills on ID fetch",       bg:"#fff3ee", b:"#fed7aa" },
    { id:"delete", i:"🗑️", l:"Delete Product", d:"Remove from inventory",        bg:"#fef2f2", b:"#fecaca" },
  ];
  return (
    <div className="pg">
      <div className="hero">
        <div>
          <h1>Manage Your Inventory<br /><span>Smarter & Faster</span></h1>
          <p>Track stock by category, manage products, get real-time insights.</p>
          <div className="hero-acts">
            <button className="btn btn-c btn-sm" onClick={()=>setPage("add")}>➕ Add Product</button>
            <button className="btn btn-o btn-sm" onClick={()=>setPage("view")}>📋 View All</button>
          </div>
        </div>
        <div className="hero-em">📊</div>
      </div>
      <div className="stats">
        {cards.map((c,i) => (
          <div className="sc" key={i}>
            <div className="sc-ico" style={{background:c.bg}}>{c.i}</div>
            <div><div className="sc-val" style={{color:c.c}}>{c.v}</div><div className="sc-lbl">{c.l}</div></div>
          </div>
        ))}
      </div>
      <div className="sec-title">Quick Actions</div>
      <div className="agrid">
        {acts.map(a => (
          <div className="ac" key={a.id} style={{borderColor:a.b}} onClick={()=>setPage(a.id)}>
            <div className="ac-ico" style={{background:a.bg}}>{a.i}</div>
            <h3>{a.l}</h3><p>{a.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ ADD PRODUCT ════════════════════════════════════════════════════════════ */
function AddProduct({ toast }) {
  const [f, setF] = useState({ name:"", quantity:"", price:"", category:"" });
  const [err, setErr] = useState("");
  const set = k => e => setF(p => ({...p, [k]: e.target.value}));

  const submit = () => {
    if (!f.name.trim() || !f.quantity || !f.price || !f.category) {
      setErr("All fields are required — please select a category."); return;
    }
    axios.post(`${API}/addproduct`, f)
      .then(() => {
        toast(`"${f.name}" added to ${f.category}!`, "success");
        setF({ name:"", quantity:"", price:"", category:"" });
        setErr("");
      })
      .catch(e => {
        const msg = e.response?.data?.error || "Failed — is the backend running?";
        toast(msg, "error");
      });
  };

  return (
    <div className="pg">
      <div className="bc">🏠 Home <span className="sep">/</span> <span>Add Product</span></div>
      <div className="phdr"><div><h1>➕ Add Product</h1><p>Add a new item to your inventory</p></div></div>
      <div className="fcard">
        {err && <div className="al al-e">⚠ {err}</div>}
        <div className="fg">
          <label>Product Name</label>
          <input className="fi" placeholder="e.g. Samsung 65″ QLED TV" value={f.name} onChange={set("name")} />
        </div>
        <div className="fg">
          <label>Category</label>
          <select className="fi" value={f.category} onChange={set("category")}>
            <option value="">— Select a category —</option>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="fg">
          <label>Quantity</label>
          <input className="fi" type="number" min="0" placeholder="e.g. 25" value={f.quantity} onChange={set("quantity")} />
        </div>
        <div className="fg">
          <label>Price (₹)</label>
          <input className="fi" type="number" min="0" placeholder="e.g. 85000" value={f.price} onChange={set("price")} />
        </div>
        <button className="btn btn-g btn-full" onClick={submit}>✓ Add to Inventory</button>
      </div>
    </div>
  );
}

/* ═══ VIEW PRODUCTS ══════════════════════════════════════════════════════════ */
function ViewProducts({ search, setSearch, active, setActive }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => { setErr("Could not connect to backend."); setLoading(false); });
  }, []);

  const filtered = products.filter(p => {
    const cat = norm(p.category);
    const matchS = p.name.toLowerCase().includes(search.toLowerCase()) || String(p.id).includes(search);
    const matchC = active === "All Products" || cat === active;
    return matchS && matchC;
  });

  const badge = q => {
    if (+q <= 0)  return <span className="badge br">Out of Stock</span>;
    if (+q <= 5)  return <span className="badge by">Low Stock</span>;
    return <span className="badge bg">In Stock</span>;
  };

  return (
    <div className="pg">
      <div className="bc">🏠 Home <span className="sep">/</span> <span>Products</span></div>
      <div className="phdr">
        <div>
          <h1>📦 {active === "All Products" ? "All Products" : active}</h1>
          <p>Showing {filtered.length} of {products.length} items</p>
        </div>
        <div style={{display:"flex",gap:".75rem",alignItems:"center",flexWrap:"wrap"}}>
          {active !== "All Products" && (
            <button className="btn btn-o btn-sm" onClick={() => setActive("All Products")}>✕ Clear Filter</button>
          )}
          <div className="sbar">🔍&nbsp;
            <input placeholder="Search by name or ID…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>
      {err && <div className="al al-e">⚠ {err}</div>}
      <div className="tbl-wrap">
        <div className="tbl-top">
          <div className="tbl-ttl">Inventory <span className="tbl-cnt">{filtered.length} items</span></div>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Product Name</th><th>Category</th><th>Quantity</th><th>Unit Price</th><th>Total Value</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="7" style={{padding:"3rem",textAlign:"center",color:"#94a3b8"}}>⏳ Loading…</td></tr>}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan="7">
                <div className="empty">
                  <div className="ei">📭</div>
                  <p>
                    {active !== "All Products" && !search && `No products in "${active}" yet — Add some!`}
                    {active !== "All Products" && search && `No results in "${active}" for "${search}"`}
                    {active === "All Products" && search && `No products matching "${search}"`}
                    {active === "All Products" && !search && "No products yet. Add some!"}
                  </p>
                </div>
              </td></tr>
            )}
            {filtered.map(p => (
              <tr key={p.id}>
                <td><span className="tid">#{p.id}</span></td>
                <td className="tname">{p.name}</td>
                <td><span className="tcat">{norm(p.category)}</span></td>
                <td><strong>{p.quantity}</strong> units</td>
                <td className="tprice">₹{(+p.price).toLocaleString("en-IN")}</td>
                <td style={{fontSize:".82rem",color:"#64748b"}}>₹{(+p.price * +p.quantity).toLocaleString("en-IN")}</td>
                <td>{badge(p.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══ UPDATE PRODUCT — auto-fill on fetch ═══════════════════════════════════ */
function UpdateProduct({ toast }) {
  const [id, setId] = useState("");
  const [f, setF] = useState({ name:"", quantity:"", price:"", category:"" });
  const [busy, setBusy] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [err, setErr] = useState("");
  const set = k => e => setF(p => ({...p, [k]: e.target.value}));

  const doFetch = useCallback(() => {
    if (!id) { setErr("Enter a Product ID first."); return; }
    setBusy(true); setFetched(false); setErr("");
    axios.get(`${API}/products/${id}`)
      .then(r => {
        const d = r.data;
        setF({ name: d.name, quantity: String(d.quantity), price: String(d.price), category: norm(d.category) });
        setFetched(true);
      })
      .catch(e => {
        const code = e.response?.status;
        setErr(code === 404 ? `No product found with ID #${id}. Check the Products page for valid IDs.` : "Backend error — make sure server.js is running.");
        setF({ name:"", quantity:"", price:"", category:"" });
        setFetched(false);
      })
      .finally(() => setBusy(false));
  }, [id]);

  const doUpdate = () => {
    if (!id || !f.name.trim() || !f.quantity || !f.price || !f.category) { setErr("All fields are required."); return; }
    axios.put(`${API}/updateproduct/${id}`, f)
      .then(() => {
        toast(`Product #${id} updated successfully!`, "success");
        setId(""); setF({ name:"", quantity:"", price:"", category:"" }); setFetched(false); setErr("");
      })
      .catch(e => {
        const msg = e.response?.data?.error || "Update failed.";
        toast(msg, "error");
      });
  };

  return (
    <div className="pg">
      <div className="bc">🏠 Home <span className="sep">/</span> <span>Update Product</span></div>
      <div className="phdr"><div><h1>✏️ Update Product</h1><p>Enter ID → Fetch → edit fields → Save</p></div></div>
      <div className="fcard">
        {err && <div className="al al-e">⚠ {err}</div>}
        {fetched && (
          <div className="afbox">
            <div className="dot" />
            <div>Found: <strong>{f.name}</strong> — edit the fields below and click Save</div>
          </div>
        )}

        {/* ── ID + FETCH ── */}
        <div className="fg">
          <label>Product ID</label>
          <div className="frow">
            <input className="fi" type="number" min="1" placeholder="e.g. 5"
              value={id}
              onChange={e => { setId(e.target.value); setFetched(false); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && doFetch()} />
            <button className="btn btn-c" style={{width:"auto",padding:"0 1.5rem",flexShrink:0}}
              onClick={doFetch} disabled={!id || busy}>
              {busy ? "⏳" : "🔍 Fetch"}
            </button>
          </div>
          <div className="hint">Press Enter or click Fetch — details will auto-fill below</div>
        </div>

        {/* ── FIELDS ── */}
        <div className="fg">
          <label>Product Name</label>
          <input className="fi" placeholder="Auto-filled after Fetch" value={f.name} onChange={set("name")} />
        </div>
        <div className="fg">
          <label>Category</label>
          <select className="fi" value={f.category} onChange={set("category")}>
            <option value="">— Select category —</option>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="fg">
          <label>Quantity</label>
          <input className="fi" type="number" min="0" placeholder="Auto-filled after Fetch" value={f.quantity} onChange={set("quantity")} />
        </div>
        <div className="fg">
          <label>Price (₹)</label>
          <input className="fi" type="number" min="0" placeholder="Auto-filled after Fetch" value={f.price} onChange={set("price")} />
        </div>

        <button className="btn btn-b btn-full" onClick={doUpdate} disabled={!fetched}>
          {fetched ? "✏️ Save Changes" : "🔍 Fetch a product first to enable Save"}
        </button>
      </div>
    </div>
  );
}

/* ═══ DELETE PRODUCT ═════════════════════════════════════════════════════════ */
function DeleteProduct({ toast }) {
  const [id, setId] = useState(""); const [confirm, setConfirm] = useState(false); const [err, setErr] = useState("");
  const tryDelete = () => {
    if (!id) { setErr("Please enter a Product ID."); return; }
    if (!confirm) { setConfirm(true); return; }
    axios.delete(`${API}/deleteproduct/${id}`)
      .then(() => { toast(`Product #${id} deleted.`, "success"); setId(""); setConfirm(false); setErr(""); })
      .catch(e => { const msg = e.response?.data?.error || "Delete failed."; toast(msg, "error"); });
  };
  return (
    <div className="pg">
      <div className="bc">🏠 Home <span className="sep">/</span> <span>Delete Product</span></div>
      <div className="phdr"><div><h1>🗑️ Delete Product</h1><p>Permanently remove a product from inventory</p></div></div>
      <div className="fcard">
        {err && <div className="al al-e">⚠ {err}</div>}
        <div className="fg">
          <label>Product ID</label>
          <input className="fi" type="number" placeholder="Enter the product ID to delete"
            value={id} onChange={e => { setId(e.target.value); setConfirm(false); setErr(""); }} />
        </div>
        {confirm && <div className="al al-w">⚠️ Permanently delete product <strong>#{id}</strong>? This cannot be undone.</div>}
        <div style={{display:"flex",gap:".75rem"}}>
          <button className="btn btn-r" style={{flex:1}} onClick={tryDelete}>
            {confirm ? "⚠️ Yes, Delete" : "🗑️ Delete Product"}
          </button>
          {confirm && <button className="btn btn-o" style={{flex:1}} onClick={()=>{setConfirm(false);setErr("");}}>Cancel</button>}
        </div>
      </div>
    </div>
  );
}

/* ═══ ROOT APP ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All Products");
  const [tMsg, setTMsg] = useState(""); const [tType, setTType] = useState("success");
  const toast = (m, t="success") => { setTMsg(m); setTType(t); };

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <>
      <StyleTag />
      <Navbar page={page} setPage={setPage}
        onLogout={() => { setLoggedIn(false); setPage("dashboard"); setSearch(""); setActive("All Products"); }}
        search={search} setSearch={setSearch} />
      <CatBar active={active} setActive={setActive} setPage={setPage} />
      <div className="main">
        {page === "dashboard" && <Dashboard setPage={setPage} />}
        {page === "add"       && <AddProduct toast={toast} />}
        {page === "view"      && <ViewProducts search={search} setSearch={setSearch} active={active} setActive={setActive} />}
        {page === "update"    && <UpdateProduct toast={toast} />}
        {page === "delete"    && <DeleteProduct toast={toast} />}
      </div>
      <footer className="footer">© 2025 <span>InvenTrack</span> · React + Node.js + MySQL</footer>
      <Toast msg={tMsg} type={tType} onClose={() => setTMsg("")} />
    </>
  );
}