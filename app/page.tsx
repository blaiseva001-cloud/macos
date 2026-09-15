// @ts-nocheck
"use client";
/* ═══════════════════════════════════════════════════════════════════════════════
   WeKO@KOICA — INFINITE PREMIUM EDITION · WIDGETS + PDF VIEWER BUILD
   ─ KOICA Hub icon: /koicahub.webp (Dock · Registry · Spotlight · iOS · Watch)
   ─ Desktop essentials: Clock+WorldClocks · Weather system (rain/thunder/snow/
     night sky) · System monitor (sparklines+storage ring) · Folder+Video stacks ·
     Hub ticker · mini Calendar — pins REMOVED
   ─ Finder: SINGLE-CLICK opens folders/files · folderog.webp folders · macOS docs
   ─ PDFs: /koica.pdf + /koica_brochure.pdf open in-app native PDF viewer
   ─ Wallpapers: 6 photos + 8 animated macOS gradients
   Stack: Next.js App Router · TS · Tailwind · framer-motion · lucide-react
═══════════════════════════════════════════════════════════════════════════════ */
import React, {
  useState, useEffect, useRef, useCallback, useMemo, createContext, useContext,
} from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as L from "lucide-react";

/* ── 0. GLOBAL CSS ───────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap");
:root{--mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
html,body{overflow:hidden;height:100%;width:100%;margin:0;padding:0;overscroll-behavior:none;background:#000;color:#fff}
*{-webkit-font-smoothing:antialiased;box-sizing:border-box}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif}
::selection{background:rgba(0,122,255,.4);color:#fff}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:8px;border:2px solid transparent;background-clip:padding-box}
::-webkit-scrollbar-track{background:transparent}
.jb,.jb *,input,textarea,.selectable,.selectable *{user-select:text!important;-webkit-user-select:text!important}
.chrome,.chrome *,button,button *{user-select:none!important;-webkit-user-select:none!important}
.glass{background:rgba(30,30,35,.65);backdrop-filter:blur(40px) saturate(180%);-webkit-backdrop-filter:blur(40px) saturate(180%);border:1px solid rgba(255,255,255,.08)}
.traffic{width:12px;height:12px;border-radius:9999px;display:grid;place-items:center;border:none;cursor:pointer;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.15);transition:all .15s ease}
.traffic:hover{filter:brightness(1.1)}
.traffic span{opacity:0;font-size:9px;line-height:1;font-weight:800;color:rgba(0,0,0,.6);transition:opacity .15s}
.tl-group:hover .traffic span{opacity:1}
input[type="range"].mac{-webkit-appearance:none;height:4px;border-radius:4px;background:rgba(255,255,255,.2);outline:none}
input[type="range"].mac::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.4);cursor:pointer}
.no-drag-transition{transition:none!important}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.pulse{animation:pulse 2s infinite}
@keyframes wave{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
.wavebar{animation:wave 1.2s ease-in-out infinite;transform-origin:center}
@keyframes shine{0%{transform:translateX(-100%) rotate(30deg)}100%{transform:translateX(100%) rotate(30deg)}}
.shine{position:relative;overflow:hidden}
.shine::after{content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(to right,transparent 0%,rgba(255,255,255,.12) 50%,transparent 100%);transform:rotate(30deg);animation:shine 6s infinite;pointer-events:none}
@keyframes kenburns{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.08) translate(-1.2%,-1.4%)}}
.kenburns{animation:kenburns 26s ease-in-out infinite alternate}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.shimmer{background:linear-gradient(100deg,rgba(255,255,255,0) 40%,rgba(255,255,255,.14) 50%,rgba(255,255,255,0) 60%);background-size:200% 100%;animation:shimmer 2.6s linear infinite}
@keyframes dashdraw{to{stroke-dashoffset:0}}
.mapdraw{stroke-dasharray:1200;stroke-dashoffset:1200;animation:dashdraw 1.4s ease-out forwards}
@keyframes fall{0%{transform:translateY(-12%);opacity:0}12%{opacity:1}100%{transform:translateY(360%);opacity:0}}
.raindrop{animation:fall 1.1s linear infinite}
.snow{animation:fall 6s linear infinite}
@keyframes drift{0%,100%{transform:translateX(-4px)}50%{transform:translateX(6px)}}
.drift{animation:drift 5s ease-in-out infinite}
@keyframes rayspin{to{transform:rotate(360deg)}}
.rayspin{animation:rayspin 18s linear infinite}
@keyframes flash{0%,88%,100%{opacity:0}90%,93%{opacity:.85}}
.flash{animation:flash 5.5s infinite}
@keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.9}}
.twinkle{animation:twinkle 2.6s ease-in-out infinite}
@keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.grad-animate{background-size:180% 180%;animation:gradShift 14s ease infinite}
@keyframes glowpulse{0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,.35)}50%{box-shadow:0 0 0 10px rgba(56,189,248,0)}}
.glowpulse{animation:glowpulse 2.4s ease-out infinite}
.grid-pattern{background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:20px 20px}
.notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:220px;height:32px;background:#000;border-bottom-left-radius:16px;border-bottom-right-radius:16px;z-index:9999;display:flex;align-items:center;justify-content:center;gap:8px}
.win-shadow{box-shadow:0 20px 50px -10px rgba(0,0,0,.5),0 10px 20px -5px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.05)}
.win-shadow-focused{box-shadow:0 30px 80px -10px rgba(0,0,0,.7),0 15px 30px -5px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.1)}
.term-scroll::-webkit-scrollbar{width:6px}
.term-scroll::-webkit-scrollbar-thumb{background:rgba(148,163,184,.25);border-radius:3px}
.widget-scroll::-webkit-scrollbar{width:0}
.doc-gloss{background:linear-gradient(135deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,.08) 42%,rgba(255,255,255,0) 60%)}
`;

/* ── 1. UTILS / SPRINGS / TYPES ──────────────────────────────────────────────── */
const cx = (...c: any[]) => c.filter(Boolean).join(" ");
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const KOICA_VIDEO = "https://hrafnbkqaustrncotdlu.supabase.co/storage/v1/object/public/blai.link/koica.mp4";
const MENU_H = 32;
const SPRING = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.9 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 180, damping: 22, mass: 1.0 };
const SPRING_POP = { type: "spring" as const, stiffness: 520, damping: 22, mass: 0.7 };
const ELASTIC_ICON = { type: "spring" as const, stiffness: 640, damping: 18, mass: 0.6 };

type AppId =
  | "finder" | "safari" | "messages" | "terminal" | "code" | "settings"
  | "photos" | "media" | "hub" | "timeline" | "programs" | "atlas" | "story" | "about"
  | "quicklook" | "pdf" | "trash" | "monitor" | "music" | "calculator" | "calendar" | "notes";

interface Win {
  id: number; app: AppId; title: string;
  x: number; y: number; w: number; h: number; z: number;
  minimized: boolean; maximized: boolean;
  snapped: "left" | "right" | null; prev?: any; props?: any;
}
interface OSApi {
  dark: boolean; setDark: (v: boolean) => void;
  wallpaper: number; setWallpaper: (i: number) => void;
  open: (a: AppId, p?: any) => void; close: (id: number) => void;
  minimize: (id: number) => void; restore: (id: number) => void;
  toggleMax: (id: number) => void; snapWindow: (id: number, s: "left" | "right" | null) => void;
  focus: (id: number) => void; commit: (id: number, b: Partial<Win>) => void;
  notify: (t: string, b: string, icon?: React.ReactNode) => void;
  sleep: () => void; lock: () => void; restart: () => void;
  focusedApp: AppId | null; focusedId: number | null; wins: Win[];
  volume: number; setVolume: (n: number) => void;
  brightness: number; setBrightness: (n: number) => void;
  missionControl: boolean; setMissionControl: (v: boolean) => void;
  notices: any[];
}
const OS = createContext<OSApi>(null as any);
const useOS = () => useContext(OS);

/* ── 2. WALLPAPERS — 6 photos + 8 animated gradients ─────────────────────────── */
const WALLPAPERS: { name: string; img?: string; css: string }[] = [
  { name: "Sequoia Field", img: "/wallpaper01.webp", css: "linear-gradient(180deg,rgba(4,10,10,.18),rgba(3,8,10,.55))" },
  { name: "Sonoma Night", img: "/wallpaper02.webp", css: "linear-gradient(180deg,rgba(10,8,24,.15),rgba(6,5,16,.55))" },
  { name: "Sequoia Tide", img: "/wallpaper03.webp", css: "linear-gradient(180deg,rgba(4,10,24,.15),rgba(3,6,16,.55))" },
  { name: "Ventura Dune", img: "/wallpaper04.webp", css: "linear-gradient(180deg,rgba(24,8,16,.15),rgba(12,4,10,.55))" },
  { name: "KOICA Case", img: "/wallpaper05.webp", css: "linear-gradient(180deg,rgba(8,10,32,.2),rgba(4,5,16,.6))" },
  { name: "KOICA Field", img: "/koica6.webp", css: "linear-gradient(180deg,rgba(6,10,26,.2),rgba(4,6,18,.6))" },
  { name: "Sequoia Flow", css: "radial-gradient(90% 70% at 75% 8%, rgba(56,189,248,.50), transparent 60%), radial-gradient(80% 70% at 15% 85%, rgba(99,102,241,.45), transparent 60%), linear-gradient(165deg,#071022 0%,#0c1b3a 45%,#060b18 100%)" },
  { name: "Sonoma Bloom", css: "radial-gradient(85% 65% at 20% 10%, rgba(244,114,182,.45), transparent 60%), radial-gradient(75% 65% at 85% 80%, rgba(167,139,250,.45), transparent 60%), linear-gradient(150deg,#160b22 0%,#2b1440 50%,#0d0716 100%)" },
  { name: "Ventura Wave", css: "radial-gradient(120% 80% at 50% 110%, rgba(45,212,191,.40), transparent 60%), radial-gradient(90% 60% at 50% -10%, rgba(14,165,233,.35), transparent 60%), linear-gradient(180deg,#04121a 0%,#06202b 55%,#031017 100%)" },
  { name: "Monterey Mist", css: "radial-gradient(100% 80% at 30% 20%, rgba(148,163,184,.32), transparent 60%), radial-gradient(90% 70% at 80% 90%, rgba(59,130,246,.30), transparent 60%), linear-gradient(160deg,#0b0f16 0%,#141b26 50%,#0a0e14 100%)" },
  { name: "Big Sur Sky", css: "radial-gradient(90% 60% at 70% 0%, rgba(251,146,60,.45), transparent 60%), radial-gradient(80% 60% at 20% 100%, rgba(236,72,153,.35), transparent 60%), linear-gradient(170deg,#1c0f1e 0%,#3b1630 45%,#120812 100%)" },
  { name: "Catalina Dusk", css: "radial-gradient(100% 70% at 50% 0%, rgba(129,140,248,.40), transparent 60%), radial-gradient(90% 60% at 50% 100%, rgba(30,64,175,.45), transparent 65%), linear-gradient(180deg,#0a0d20 0%,#131b3d 50%,#070a18 100%)" },
  { name: "Mojave Dune", css: "radial-gradient(90% 60% at 80% 10%, rgba(251,191,36,.32), transparent 60%), radial-gradient(80% 60% at 10% 90%, rgba(180,83,9,.35), transparent 60%), linear-gradient(160deg,#171009 0%,#2b1c10 50%,#120c07 100%)" },
  { name: "High Sierra", css: "radial-gradient(90% 60% at 20% 0%, rgba(52,211,153,.32), transparent 60%), radial-gradient(80% 60% at 90% 90%, rgba(13,148,136,.35), transparent 60%), linear-gradient(165deg,#071510 0%,#0c241b 50%,#06110c 100%)" },
];

/* ── 3. COUNTRY REGISTRY ─────────────────────────────────────────────────────── */
interface Country {
  name: string; topo?: string[]; region: string; city: string;
  office: boolean; core: boolean; lat: number; lng: number; sectors: string[];
  projects: [string, string, string, string, string][];
  ev: [number, number, number, number]; timeline: [number, string][];
  impact: [string, string, number]; story: string;
}
const REG: Country[] = [
  { name: "Rwanda", region: "Africa", city: "Kigali", office: true, core: true, lat: -1.94, lng: 29.87, sectors: ["Agriculture", "Education", "Information Technology"],
    projects: [["Sustainable Agricultural Productivity & Market Linkage (SAPMP)", "Agriculture", "2020-2026", "$10M", "ACTIVE"], ["ICT Education Capacity for Teachers", "Education", "2017-2024", "$7.3M", "COMPLETED"], ["Tax Portal & e-Receipt System", "Information Technology", "2018-2022", "$6.1M", "COMPLETED"]],
    ev: [42, 17, 286, 8], timeline: [[2010, "KOICA office opened in Kigali"], [2017, "Teacher ICT program begins (43,000 trained)"], [2020, "SAPMP market linkage starts"]],
    impact: ["Market reach", "80% of wetland farm produce sold at market", 80], story: "Partnership makes steep hills easier to climb." },
  { name: "Nepal", region: "Asia", city: "Kathmandu", office: true, core: true, lat: 28.39, lng: 84.12, sectors: ["Health", "Education"],
    projects: [["Master's Program in Control of Infectious Disease (CIAT)", "Health", "2017-2024", "$2M", "COMPLETED"]],
    ev: [31, 12, 174, 6], timeline: [[2009, "Office opened in Kathmandu"], [2021, "Alumni draft national health roadmap"]],
    impact: ["Trained experts", "National health roadmap authored by alumni", 100], story: "Training today saves tomorrow." },
  { name: "Ethiopia", region: "Africa", city: "Addis Ababa", office: true, core: true, lat: 9.15, lng: 40.49, sectors: ["Climate", "Agriculture"],
    projects: [["Agricultural Capacity & Irrigation", "Agriculture", "2013-2021", "$17.3M", "COMPLETED"], ["Single Window Trade System", "Information Technology", "2017-2022", "$7.49M", "COMPLETED"]],
    ev: [28, 14, 198, 7], timeline: [[2011, "Office opened in Addis Ababa"], [2022, "Accredited to Green Climate Fund"]],
    impact: ["Trade flows", "Single window cuts customs time", 100], story: "Forests restore, trade flows." },
  { name: "Ghana", region: "Africa", city: "Accra", office: true, core: true, lat: 7.9, lng: -1.0, sectors: ["Health", "Agriculture"],
    projects: [["Comprehensive Primary Healthcare Strengthening", "Health", "2022-2027", "$12.4M", "ACTIVE"], ["Rice Value Chain Enhancement", "Agriculture", "2019-2023", "$8M", "COMPLETED"]],
    ev: [24, 11, 156, 6], timeline: [[2009, "Office opened in Accra"], [2022, "UHC primary healthcare with US & Japan"]],
    impact: ["People reached", "1.04M residents gain better care", 100], story: "The nearest hospital was a day's walk. Not anymore." },
  { name: "Egypt", region: "Africa", city: "Cairo", office: true, core: true, lat: 26.8, lng: 30.8, sectors: ["Education"],
    projects: [["Korea-Egypt Technological College", "Education", "2016-2022", "$5.83M", "COMPLETED"]],
    ev: [19, 9, 121, 5], timeline: [[2007, "Office opened in Cairo"], [2016, "Technological college project"]],
    impact: ["Skills", "Technical workforce for a new economy", 100], story: "Building bridges, not walls." },
  { name: "Senegal", region: "Africa", city: "Dakar", office: true, core: true, lat: 14.5, lng: -14.5, sectors: ["Agriculture"],
    projects: [["Sustainable Rice Value Chain", "Agriculture", "2016-2022", "$8.5M", "COMPLETED"]],
    ev: [14, 8, 96, 4], timeline: [[2010, "Office opened in Dakar"], [2016, "Rice value chain begins"]],
    impact: ["Regional hub", "One office covering five nations", 100], story: "One hub, five nations, one mission." },
  { name: "Tanzania", region: "Africa", city: "Dar es Salaam", office: true, core: true, lat: -6.4, lng: 34.9, sectors: ["Health", "Education"],
    projects: [["KITKIT School Tablet Literacy (CTS)", "Education", "2016-2026", "GRANT", "ACTIVE"], ["Maternal & Child Healthcare Strengthening", "Health", "2019-2023", "$6.3M", "COMPLETED"]],
    ev: [17, 9, 112, 5], timeline: [[2010, "Office opened in Dar es Salaam"], [2019, "KITKIT wins Global Learning XPRIZE"]],
    impact: ["Learning gains", "KITKIT literacy +10%, numeracy +14%", 64], story: "Learning fits in a pocket now." },
  { name: "Uganda", region: "Africa", city: "Kampala", office: true, core: true, lat: 1.4, lng: 32.3, sectors: ["Rural Development"],
    projects: [["Establishment of Sustainable Model Villages (ESMV)", "Rural Development", "2019-2024", "$5.9M", "COMPLETED"]],
    ev: [21, 10, 133, 5], timeline: [[2010, "Office opened in Kampala"], [2015, "First Saemaul model village"]],
    impact: ["Village income", "Household income rising across model villages", 72], story: "Villages planning their own future." },
  { name: "Bangladesh", region: "Asia", city: "Dhaka", office: true, core: true, lat: 23.7, lng: 90.4, sectors: ["Information Technology"],
    projects: [["AI Tech Experts Program", "Information Technology", "2026-2029", "$13M", "ACTIVE"]],
    ev: [16, 8, 104, 5], timeline: [[2010, "Office opened in Dhaka"], [2026, "AI experts grant signed"]],
    impact: ["Future workforce", "AI experts trained 2026-2029", 40], story: "Leapfrogging into the AI era." },
  { name: "Cambodia", region: "Asia", city: "Phnom Penh", office: true, core: true, lat: 11.56, lng: 104.93, sectors: ["Information Technology", "Health"],
    projects: [["IT-based Job Incubation Center (NICC)", "Information Technology", "2019-2024", "$7.91M", "COMPLETED"]],
    ev: [18, 9, 118, 5], timeline: [[1992, "Office opened in Phnom Penh"], [2019, "Startup incubator at Royal University"]],
    impact: ["Founders", "Students become founders at NICC", 85], story: "Students become founders." },
  { name: "Indonesia", region: "Asia", city: "Jakarta", office: true, core: true, lat: -2.5, lng: 118.0, sectors: ["Public Administration"],
    projects: [["Digital Public Administration", "Public Administration", "2020-2025", "$9M", "ACTIVE"]],
    ev: [15, 8, 97, 4], timeline: [[2010, "Office opened in Jakarta"], [2020, "Digital administration program"]],
    impact: ["Islands connected", "Digital services across 17,000 islands", 55], story: "An archipelago, connected." },
  { name: "Lao PDR", topo: ["Laos", "Lao People's Democratic Republic"], region: "Asia", city: "Vientiane", office: true, core: true, lat: 19.9, lng: 102.5, sectors: ["Environment"],
    projects: [["Water Waste & Waste Processing Capacity", "Environment", "2019-2024", "$6.5M", "ACTIVE"]],
    ev: [11, 6, 74, 4], timeline: [[2010, "Office opened in Vientiane"], [2019, "Water & waste program"]],
    impact: ["Clean water", "Waste processing capacity strengthened", 62], story: "Landlocked, not isolated." },
  { name: "Mongolia", region: "Asia", city: "Ulaanbaatar", office: true, core: true, lat: 46.8, lng: 103.8, sectors: ["Public Administration"],
    projects: [["Legal Science Capacity Strengthening", "Public Administration", "2020-2023", "$7M", "COMPLETED"]],
    ev: [10, 6, 69, 3], timeline: [[2010, "Office opened in Ulaanbaatar"], [2020, "Legal science program"]],
    impact: ["Governance", "Transparent governance over mining wealth", 70], story: "Transparency over treasure." },
  { name: "Myanmar", region: "Asia", city: "Yangon", office: true, core: true, lat: 21.9, lng: 96.0, sectors: ["Agriculture", "Environment"],
    projects: [["Afforestation Project", "Environment", "2017-2025", "$6.4M", "ACTIVE"]],
    ev: [13, 7, 85, 4], timeline: [[2010, "Office opened in Yangon"], [2017, "Afforestation begins"]],
    impact: ["Forest cover", "Afforestation progressing nationwide", 58], story: "People-to-people, always." },
  { name: "Pakistan", region: "Asia", city: "Islamabad", office: true, core: true, lat: 30.4, lng: 69.3, sectors: ["Education"],
    projects: [["Rights to Basic Education for Girls", "Education", "2018-2022", "$3.72M", "COMPLETED"]],
    ev: [12, 7, 79, 4], timeline: [[2010, "Office opened in Islamabad"], [2018, "Girls' education project"]],
    impact: ["Girls in school", "Basic education rights expanded", 76], story: "A classroom opens a future." },
  { name: "Philippines", region: "Asia", city: "Manila", office: true, core: true, lat: 12.9, lng: 121.8, sectors: ["Public Administration", "Environment"],
    projects: [["Tax e-Government System", "Public Administration", "2018-2022", "$7.29M", "COMPLETED"]],
    ev: [14, 8, 92, 4], timeline: [[2010, "Office opened in Manila"], [2018, "Tax e-government"]],
    impact: ["Resilience", "Typhoon-resilient public services", 68], story: "Bouncing back, faster." },
  { name: "Vietnam", region: "Asia", city: "Hanoi", office: true, core: true, lat: 21.03, lng: 105.85, sectors: ["Science & Technology", "Environment"],
    projects: [["Vietnam-Korea Institute of Science & Technology (V-KIST)", "Science & Technology", "2014-2023", "$35M", "COMPLETED"], ["Industrial Energy Efficiency Investment", "Environment", "2021-2025", "$6.4M", "ACTIVE"]],
    ev: [22, 11, 148, 6], timeline: [[1991, "Office opened in Hanoi"], [2014, "V-KIST established"], [2021, "Energy efficiency phase 2"]],
    impact: ["Research base", "A research brain for an industrial revolution", 90], story: "A research brain for an industrial revolution." },
  { name: "Kyrgyzstan", region: "Eurasia", city: "Bishkek", office: true, core: true, lat: 41.2, lng: 74.77, sectors: ["Public Safety"],
    projects: [["Firefighting Capacity Strengthening", "Public Safety", "2019-2022", "$7M", "COMPLETED"]],
    ev: [12, 7, 81, 4], timeline: [[2011, "Office opened in Bishkek"], [2019, "Firefighting program"]],
    impact: ["Response time", "Faster response saves homes and lives", 82], story: "Minutes become lives." },
  { name: "Ukraine", region: "Eurasia", city: "Kyiv", office: true, core: true, lat: 48.4, lng: 31.2, sectors: ["Reconstruction"],
    projects: [["Ukraine Peace Solidarity Initiative", "Reconstruction", "2022-2026", "N/A", "ACTIVE"]],
    ev: [15, 9, 102, 5], timeline: [[2022, "Office stays open despite war"], [2022, "Peace Solidarity Initiative launches"]],
    impact: ["Presence", "Office open in Kyiv throughout the war", 100], story: "Development cooperation is faith in peace." },
  { name: "Uzbekistan", region: "Eurasia", city: "Tashkent", office: true, core: true, lat: 41.4, lng: 64.6, sectors: ["Health", "Public Safety"],
    projects: [["Transnational Crime Response (Digital Forensics)", "Public Safety", "2024-2026", "$7M", "ACTIVE"]],
    ev: [13, 8, 87, 4], timeline: [[2011, "Office opened in Tashkent"], [2024, "First accredited digital forensics experts"]],
    impact: ["Specialists", "First internationally accredited digital forensics experts", 100], story: "From treatment tables to forensic labs." },
  { name: "Bolivia", region: "Americas", city: "La Paz", office: true, core: true, lat: -16.3, lng: -64.6, sectors: ["Health", "Agriculture"],
    projects: [["Irrigation Roads & Water Storage Dam", "Agriculture", "2011-2023", "$13.51M", "COMPLETED"]],
    ev: [11, 7, 72, 4], timeline: [[2010, "Office opened in La Paz"], [2021, "SRHR program with UNFPA"]],
    impact: ["Highland health", "Quality of life rising in the highlands", 66], story: "Water climbs to the highlands." },
  { name: "Colombia", region: "Americas", city: "Bogotá", office: true, core: true, lat: 4.6, lng: -74.1, sectors: ["Peace", "Agriculture"],
    projects: [["Refugee Settlement Support", "Peace", "2018-2021", "$5M", "COMPLETED"]],
    ev: [10, 6, 66, 4], timeline: [[2010, "Office opened in Bogotá"], [2016, "Post-conflict rural programs"]],
    impact: ["Peace dividend", "Former conflict zones grow new economies", 70], story: "Peace, planted row by row." },
  { name: "Paraguay", region: "Americas", city: "Asunción", office: true, core: true, lat: -23.4, lng: -58.4, sectors: ["Health"],
    projects: [["MICRORED Primary Healthcare, Limpio", "Health", "2016-2023", "$14.43M", "COMPLETED"]],
    ev: [12, 8, 78, 4], timeline: [[2010, "Office opened in Asunción"], [2016, "MICRORED network — 20 health centers"]],
    impact: ["Primary care", "20 health centers serving Limpio", 88], story: "Care before the hospital queue." },
  { name: "Peru", region: "Americas", city: "Lima", office: true, core: true, lat: -9.2, lng: -75.0, sectors: ["Public Administration"],
    projects: [["e-Government Cooperation", "Public Administration", "2019-2024", "$5M", "COMPLETED"]],
    ev: [9, 5, 58, 3], timeline: [[2010, "Office opened in Lima"], [2019, "e-Government cooperation"]],
    impact: ["Digital state", "Public services reach the Andes", 64], story: "The state, one click closer." },
  { name: "Fiji", region: "Asia", city: "Suva", office: true, core: false, lat: -17.7, lng: 178.1, sectors: ["Energy", "Climate"],
    projects: [["Agrophotovoltaic Program (GCF)", "Energy", "2020-2027", "$8.41M", "ACTIVE"]],
    ev: [9, 6, 57, 3], timeline: [[2015, "Office opened in Suva"], [2020, "GCF solar program on Ovalau"]],
    impact: ["CO₂ cut", "90,000 tCO₂eq reduced per year", 90], story: "An island runs on sun and crops." },
];
const CORE = REG.filter((c) => c.core);
const resolveCountryArg = (args: string[]) => {
  const q = args.join(" ").toLowerCase();
  return REG.find((c) => c.name.toLowerCase() === q) || REG.find((c) => c.name.toLowerCase().startsWith(q));
};

/* ── 4. KOICA DB + HISTORY ───────────────────────────────────────────────────── */
const KOICA = {
  full: "Korea International Cooperation Agency", kr: "한국국제협력단",
  president: "CHANG, Won Sam (14th President)",
  hqCity: "Seongnam (Seoul Capital Area), South Korea", hqLat: 37.4386, hqLng: 127.1378,
  mission: "Contribute to common prosperity of humanity and promotion of world peace through inclusive, co-prosperous development cooperation.",
  values: ["People", "Peace", "Prosperity", "Planet", "Partnership"],
  odaShare: "28.2% of Korea's total ODA", grantShare: "61% of Korea's grant ODA",
  org: { directorships: 5, seniorDirectorships: 3, departments: 24, teams: 37 },
  budget: [[1991, 0.0174], [2000, 0.145], [2010, 0.45], [2020, 0.915], [2022, 1.137], [2024, 1.3], [2026, 1.5322]] as [number, number][],
  sectors: [["Health", 34.9], ["Tech / Environment / Energy", 22.1], ["Public Administration", 9.3], ["Education", 8.4], ["Agriculture / Fisheries", 7.8], ["Emergency Relief", 6.8], ["Others", 10.7]] as [string, number][],
  regions: [["Asia · Pacific", 34.9], ["Africa", 22.1], ["Eurasia · Middle East", 14.1], ["Latin America", 10.7], ["Multilateral", 18.2]] as [string, number][],
  income: [["Least Developed Countries", 34.4], ["Lower Middle-Income", 46.3], ["Upper Middle-Income", 19.3]] as [string, number][],
  goals: [["Promote SDGs", "Target 7th among donors in SDG contribution", L.Target], ["Partnership Finance", "Raise $1.3B development cooperation finance", L.Handshake], ["Ecosystem", "Cultivate 120,000 development professionals", L.Users], ["ESG Management", "Highest standards in public sector ESG index", L.Leaf]] as [string, string, any][],
  programs: [["Country Programs & Projects", "Bilateral hardware + software, 2-5 year country programs"], ["World Friends Korea", "27,000+ volunteers since 1990 across 9 dispatch tracks"], ["CIAT Fellowship", "Policymaker training, master's & doctoral courses"], ["HDP Thematic Program", "Multilateral partnerships in fragile & conflict regions"], ["Development Innovation (DIP)", "CTS / IBS / IPS startup & private-sector solutions"], ["Humanitarian Assistance", "KDRT (INSARAG Heavy, WHO EMT-1), HDP-Nexus, RAPID"], ["Civil Society Partnership", "NGO, university, social-economy co-operation"], ["Global Disease Eradication Fund", "₩1,000 per international flight ticket"]] as [string, string][],
  officeRegions: [["Africa", 16, 16], ["Asia", 16, 16], ["Latin America", 8, 8], ["Eurasia", 5, 5], ["Middle East", 3, 4]] as [string, number, number][],
  reps: [["Paris", "OECD Permanent Delegation"], ["New York", "UN Permanent Mission"], ["Geneva", "UN Geneva Mission"], ["Brussels", "EU Delegation"], ["New Delhi", "India Liaison"]] as [string, string][],
};
const HISTORY: { year: number; era: string; text: string; icon: any; hl?: boolean }[] = [
  { year: 1991, era: "Foundation", text: "KOICA established (April 1). First Korean overseas volunteers dispatched.", icon: L.Flag, hl: true },
  { year: 1995, era: "Foundation", text: "NGO cooperation program initiated.", icon: L.Users },
  { year: 2004, era: "Expansion", text: "Tsunami disaster relief & rehabilitation in South Asia.", icon: L.LifeBuoy },
  { year: 2009, era: "Global", text: "World Friends Korea integrated volunteer brand launched.", icon: L.Globe, hl: true },
  { year: 2013, era: "Global", text: "Government-dispatched volunteers surpass 10,000.", icon: L.Award },
  { year: 2016, era: "Innovation", text: "Elevated to quasi-governmental organization; KMCO launched.", icon: L.Building2, hl: true },
  { year: 2019, era: "Innovation", text: "Country Plans established; ASEAN MOUs; subsidiary Koworks.", icon: L.Map },
  { year: 2020, era: "Resilience", text: "ABC Program for emergency COVID-19 response.", icon: L.ShieldCheck, hl: true },
  { year: 2021, era: "Resilience", text: "30th anniversary · GCF Accredited Entity · $100M to COVAX.", icon: L.Sparkles, hl: true },
  { year: 2022, era: "Resilience", text: "Top-3 in Aid Transparency Index · KDRT WHO EMT Type-1.", icon: L.Eye },
  { year: 2024, era: "Future", text: "HDP Nexus · Youth Initiative · Korea-Africa $10B ODA pledge.", icon: L.Rocket, hl: true },
  { year: 2026, era: "Future", text: "Support budget ₩1.5322 trillion — 28.2% of Korea's ODA.", icon: L.TrendingUp, hl: true },
];

/* ── 5. GEOGRAPHY ────────────────────────────────────────────────────────────── */
const NE_PROJ = (lon: number, lat: number): [number, number] => {
  const l = (lat * Math.PI) / 180, lam = (lon * Math.PI) / 180;
  const l2 = l * l, l4 = l2 * l2, l6 = l4 * l2, l8 = l4 * l4, l10 = l8 * l2, l12 = l10 * l2;
  return [lam * (0.8707 - 0.131979 * l2 - 0.013791 * l4 + 0.003971 * l10 - 0.001529 * l12),
    l * (1.007226 + 0.015085 * l2 - 0.044475 * l6 + 0.028874 * l8 - 0.005916 * l10)];
};
function topoToFeatures(topo: any): any[] {
  try {
    const tr = topo.transform; const sx = tr?.scale[0] ?? 1, sy = tr?.scale[1] ?? 1, dx = tr?.translate[0] ?? 0, dy = tr?.translate[1] ?? 0;
    const arcs = (topo.arcs as number[][][]).map((arc) => { let x = 0, y = 0; return arc.map(([px, py]) => { x += px; y += py; return [x * sx + dx, y * sy + dy]; }); });
    const ring = (idxs: number[]) => { const pts: number[][] = []; for (const ai of idxs) { let a = ai < 0 ? arcs[~ai].slice().reverse() : arcs[ai]; if (pts.length) a = a.slice(1); for (const p of a) pts.push(p); } return pts; };
    const obj = topo.objects.countries || topo.objects[Object.keys(topo.objects)[0]];
    return obj.geometries.map((g: any) => {
      let rings: number[][][] = [];
      if (g.type === "Polygon") rings = g.arcs.map((r: number[]) => ring(r));
      else if (g.type === "MultiPolygon") rings = g.arcs.flatMap((poly: number[][]) => poly.map((r: number[]) => ring(r)));
      return { id: g.id, name: g.properties?.name ?? "", rings };
    }).filter((f: any) => f.rings.length);
  } catch { return []; }
}
let WORLD: Promise<any[] | null> | null = null;
function loadWorld(): Promise<any[] | null> {
  if (WORLD) return WORLD;
  WORLD = fetch("/countries-110m.json").then((r) => { if (!r.ok) throw 0; return r.json(); }).then(topoToFeatures)
    .catch(() => fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json").then((r) => r.json())
      .then((gj) => gj.features.map((f: any) => ({ id: f.id, name: f.properties?.name ?? "", rings: (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates.flat()) })))
      .catch(() => null));
  return WORLD;
}
const norm = (s: string) => s.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
const ALIAS: Record<string, string[]> = {
  "Lao PDR": ["laos", "lao pdr", "lao people's democratic republic"], "Vietnam": ["vietnam", "viet nam"],
  "Tanzania": ["tanzania", "united republic of tanzania"], "South Korea": ["south korea", "republic of korea", "korea"],
};
function matchName(featName: string, c: Country) {
  const n = norm(featName);
  return [norm(c.name), ...(c.topo ?? []).map(norm), ...(ALIAS[c.name] ?? []).map(norm)].includes(n);
}
function buildPaths(feats: any[]) {
  const pts: [number, number][] = [];
  for (let la = -90; la <= 90; la += 5) pts.push(NE_PROJ(-180, la));
  for (let la = 90; la >= -90; la -= 5) pts.push(NE_PROJ(180, la));
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const W = 1000, H = 520;
  const S = Math.min((W - 30) / (x1 - x0), (H - 30) / (y1 - y0));
  const ox = W / 2 - (S * (x0 + x1)) / 2, oy = H / 2 + (S * (y0 + y1)) / 2;
  const P = (lng: number, lat: number): [number, number] => { const q = NE_PROJ(lng, lat); return [ox + S * q[0], oy - S * q[1]]; };
  const list = feats.map((f) => {
    let d = ""; let b0 = 1e9, b1 = 1e9, b2 = -1e9, b3 = -1e9;
    for (const ring of f.rings) {
      d += "M";
      ring.forEach((pt: number[], j: number) => {
        const [X, Y] = P(pt[0], pt[1]);
        if (X < b0) b0 = X; if (X > b2) b2 = X; if (Y < b1) b1 = Y; if (Y > b3) b3 = Y;
        d += (j ? "L" : "") + X.toFixed(1) + "," + Y.toFixed(1);
      });
      d += "Z";
    }
    return { name: f.name, d, bbox: [b0, b1, b2, b3] };
  });
  return { list, P };
}

/* ── 6. VIRTUAL FILESYSTEM (incl. real public PDFs) ──────────────────────────── */
interface FSItem { name: string; kind: "folder" | "file"; ext?: string; size?: string; bytes?: number; mtime?: number; content?: string }
const PUBLIC_PDFS = new Set(["koica.pdf", "koica_brochure.pdf"]);
const FS: Record<string, FSItem[]> = {
  "~": [
    { name: "cases", kind: "folder", mtime: Date.now() - 3600e3 }, { name: "projects", kind: "folder", mtime: Date.now() - 86400e3 * 3 },
    { name: "Movies", kind: "folder", mtime: Date.now() - 86400e3 * 4 }, { name: "Documents", kind: "folder", mtime: Date.now() - 86400e3 },
    { name: "Pictures", kind: "folder", mtime: Date.now() - 86400e3 * 2 },
    { name: "contact.md", kind: "file", ext: "MD", size: "1 KB", bytes: 1024, content: "# WeKO\nDigital Detective\nweko@koica-case.dev" },
  ],
  "~/Movies": [{ name: "koica_promo.mp4", kind: "file", ext: "MP4", size: "stream", bytes: 0 }, { name: "demo_reel.mp4", kind: "file", ext: "MP4", size: "84 MB", bytes: 88080384 }],
  "~/Pictures": [
    { name: "koica.webp", kind: "file", ext: "WEBP", size: "175 KB" }, { name: "koica1.webp", kind: "file", ext: "WEBP", size: "174 KB" },
    { name: "koica2.webp", kind: "file", ext: "WEBP", size: "124 KB" }, { name: "koica3.webp", kind: "file", ext: "WEBP", size: "233 KB" },
    { name: "koica4.webp", kind: "file", ext: "WEBP", size: "230 KB" }, { name: "koica5.webp", kind: "file", ext: "WEBP", size: "217 KB" },
    { name: "koica6.webp", kind: "file", ext: "WEBP", size: "180 KB" },
  ],
  "~/Documents": [
    { name: "koica.pdf", kind: "file", ext: "PDF", size: "3.4 MB", bytes: 3565158, content: "KOICA Organization Introduction (official)" },
    { name: "koica_brochure.pdf", kind: "file", ext: "PDF", size: "18.2 MB", bytes: 19084001, content: "KOICA Brochure 2025 (official)" },
    { name: "Executive_Brief.pdf", kind: "file", ext: "PDF", size: "2.4 MB", bytes: 2516582 },
    { name: "budget_2026.xlsx", kind: "file", ext: "XLSX", size: "220 KB", bytes: 225280 },
    { name: "field_notes.txt", kind: "file", ext: "TXT", size: "12 KB", bytes: 12288, content: "KOICA 2026: ₩1.5322T budget.\n28.2% of Korea ODA · 61% grant share.\n48 countries · 49 offices · 5 rep posts.\nRwanda market reach 80% · Ghana 1.04M reached." },
    { name: "case_summary.json", kind: "file", ext: "JSON", size: "8 KB", bytes: 8192, content: '{\n  "case": "WEKO-08",\n  "country": "Rwanda",\n  "status": "ACTIVE"\n}' },
  ],
  "~/cases": [{ name: "WEKO-08", kind: "folder", mtime: Date.now() - 3600e3 }],
  "~/cases/WEKO-08": [
    { name: "case.json", kind: "file", ext: "JSON", size: "8 KB", content: '{\n  "case": "WEKO-08",\n  "country": "Rwanda",\n  "status": "ACTIVE"\n}' },
    { name: "evidence", kind: "folder" }, { name: "reports", kind: "folder" },
  ],
  "~/cases/WEKO-08/evidence": [
    { name: "IMG-001_classroom.jpg", kind: "file", ext: "IMG", size: "3.2 MB" }, { name: "IMG-002_clinic.jpg", kind: "file", ext: "IMG", size: "2.8 MB" },
    { name: "IMG-003_market.jpg", kind: "file", ext: "IMG", size: "3.6 MB" }, { name: "SAT-before_after.tif", kind: "file", ext: "SAT", size: "44 MB" },
  ],
  "~/cases/WEKO-08/reports": [
    { name: "annual_report_2024.pdf", kind: "file", ext: "PDF", size: "6.2 MB" }, { name: "field_survey.pdf", kind: "file", ext: "PDF", size: "1.9 MB" },
  ],
  "~/projects": [
    { name: "education_rwanda.case", kind: "file", ext: "CASE", size: "4 KB" }, { name: "health_nepal.case", kind: "file", ext: "CASE", size: "4 KB" },
    { name: "climate_ethiopia.case", kind: "file", ext: "CASE", size: "4 KB" },
  ],
};
const resolveVPath = (cwd: string, raw: string): string => {
  let p = raw.trim(); if (!p) return cwd;
  if (p === "~") return "~";
  let base: string;
  if (p.startsWith("~/")) base = p; else if (p.startsWith("/")) base = "~" + p; else base = cwd === "~" ? "~/" + p : cwd + "/" + p;
  const out: string[] = [];
  for (const part of base.split("/").filter(Boolean)) {
    if (part === "~" || part === ".") continue;
    if (part === "..") { if (out.length) out.pop(); continue; }
    out.push(part);
  }
  return out.length ? "~/" + out.join("/") : "~";
};
const fsSplit = (path: string) => { const ix = path.lastIndexOf("/"); return ix <= 1 ? { parent: "~", name: path.slice(ix + 1) } : { parent: path.slice(0, ix), name: path.slice(ix + 1) }; };
const fsGetItem = (fs: Record<string, FSItem[]>, path: string): FSItem | undefined => { if (path === "~") return { name: "~", kind: "folder" }; const { parent, name } = fsSplit(path); return fs[parent]?.find((i) => i.name === name); };
const fsIsDir = (fs: Record<string, FSItem[]>, path: string): boolean => path === "~" ? true : Array.isArray(fs[path]);
const fsExists = (fs: Record<string, FSItem[]>, path: string): boolean => path === "~" ? true : !!(fs[path] || fsGetItem(fs, path));
const fsMkdir = (fs: Record<string, FSItem[]>, path: string, parents: boolean): { ok: boolean; err?: string } => {
  if (path === "~") return { ok: true };
  const { parent, name } = fsSplit(path); if (!parent || !name) return { ok: false, err: "EINVAL" };
  if (!fs[parent]) { if (!parents) return { ok: false, err: "ENOENT" }; const r = fsMkdir(fs, parent, true); if (!r.ok) return r; }
  if (fs[parent].some((i) => i.name === name)) return { ok: false, err: "EEXIST" };
  fs[parent].push({ name, kind: "folder", mtime: Date.now() }); fs[path] = []; return { ok: true };
};
const fsTouch = (fs: Record<string, FSItem[]>, path: string) => { const { parent, name } = fsSplit(path); if (!fs[parent]) return; const ex = fs[parent].find((i) => i.name === name); if (ex) { ex.mtime = Date.now(); return; } fs[parent].push({ name, kind: "file", ext: name.split(".").pop()?.toUpperCase() ?? "TXT", size: "0 B", bytes: 0, mtime: Date.now(), content: "" }); };
const fsWrite = (fs: Record<string, FSItem[]>, path: string, content: string, append: boolean) => {
  const { parent, name } = fsSplit(path); if (!fs[parent]) return;
  const ex = fs[parent].find((i) => i.name === name);
  if (ex) { ex.content = append ? (ex.content ?? "") + content : content; ex.bytes = ex.content.length; }
  else fs[parent].push({ name, kind: "file", ext: name.split(".").pop()?.toUpperCase() ?? "TXT", size: `${content.length} B`, bytes: content.length, mtime: Date.now(), content });
};
const fsRemove = (fs: Record<string, FSItem[]>, path: string, recursive: boolean): { ok: boolean; err?: string } => {
  const { parent, name } = fsSplit(path); const dir = fs[parent]; if (!dir) return { ok: false, err: "ENOENT" };
  const ix = dir.findIndex((i) => i.name === name); if (ix < 0) return { ok: false, err: "ENOENT" };
  const item = dir[ix];
  if (item.kind === "folder") { const sub = fs[path] ?? []; if (sub.length && !recursive) return { ok: false, err: "ENOTEMPTY" }; if (recursive) { for (const k of Object.keys(fs)) if (k === path || k.startsWith(path + "/")) delete fs[k]; } else delete fs[path]; }
  dir.splice(ix, 1); return { ok: true };
};
const tokenize = (input: string): string[] => {
  const out: string[] = []; let cur = ""; let i = 0; let inS = false; let inD = false;
  while (i < input.length) {
    const c = input[i];
    if (inS) { if (c === "'") inS = false; else cur += c; i++; continue; }
    if (inD) { if (c === '"') inD = false; else if (c === "\\" && i + 1 < input.length) { cur += input[i + 1]; i += 2; continue; } else cur += c; i++; continue; }
    if (c === "'") { inS = true; i++; continue; }
    if (c === '"') { inD = true; i++; continue; }
    if (c === "\\" && i + 1 < input.length) { cur += input[i + 1]; i += 2; continue; }
    if (/\s/.test(c)) { if (cur) { out.push(cur); cur = ""; } i++; continue; }
    cur += c; i++;
  }
  if (cur) out.push(cur); return out;
};
type ChainOp = "&&" | "||" | ";" | null;
const splitChain = (input: string): { op: ChainOp; text: string }[] => {
  const out: { op: ChainOp; text: string }[] = []; let cur = ""; let i = 0; let inS = false; let inD = false; let pending: ChainOp = null;
  const flush = () => { if (cur.trim()) out.push({ op: pending, text: cur.trim() }); cur = ""; };
  while (i < input.length) {
    const c = input[i];
    if (inS) { cur += c; if (c === "'") inS = false; i++; continue; }
    if (inD) { cur += c; if (c === '"') inD = false; i++; continue; }
    if (c === "'") { inS = true; cur += c; i++; continue; }
    if (c === '"') { inD = true; cur += c; i++; continue; }
    if (c === "\\" && i + 1 < input.length) { cur += c + input[i + 1]; i += 2; continue; }
    if (c === "&" && input[i + 1] === "&") { flush(); pending = "&&"; i += 2; continue; }
    if (c === "|" && input[i + 1] === "|") { flush(); pending = "||"; i += 2; continue; }
    if (c === ";") { flush(); pending = ";"; i++; continue; }
    cur += c; i++;
  }
  flush(); return out;
};
const splitRedirect = (text: string): { text: string; redirect?: { file: string; append: boolean } } => {
  let i = 0; let inS = false; let inD = false;
  while (i < text.length) {
    const c = text[i];
    if (inS) { if (c === "'") inS = false; i++; continue; }
    if (inD) { if (c === '"') inD = false; i++; continue; }
    if (c === "'") { inS = true; i++; continue; }
    if (c === '"') { inD = true; i++; continue; }
    if (c === ">") {
      const append = text[i + 1] === ">";
      const before = text.slice(0, i).trim(); const toks = tokenize(text.slice(i + (append ? 2 : 1)).trim());
      if (!toks.length) return { text: before };
      return { text: before, redirect: { file: toks[0], append } };
    }
    i++;
  }
  return { text };
};
const expandEnv = (s: string, env: Record<string, string>) => s.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, n) => env[n] ?? "");

/* ── 7. ICONOGRAPHY — folderog.webp + macOS doc icons ────────────────────────── */
function FolderIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return <img src="/folderog.webp" alt="" draggable={false} className={cx("object-contain select-none drop-shadow-[0_3px_6px_rgba(0,0,0,.35)]", className)} style={{ width: size, height: size }} />;
}
const IMG_EXTS = ["IMG", "JPG", "JPEG", "PNG", "GIF", "WEBP", "TIF", "TIFF", "HEIC", "SAT"];
const DOC_MAP: Record<string, { g: string; I: any }> = {
  JSON: { g: "from-amber-400 via-yellow-500 to-amber-600", I: L.Braces },
  XLSX: { g: "from-emerald-400 via-green-500 to-emerald-600", I: L.Table }, XLS: { g: "from-emerald-400 via-green-500 to-emerald-600", I: L.Table }, CSV: { g: "from-emerald-400 via-green-500 to-emerald-600", I: L.Table },
  PDF: { g: "from-red-400 via-rose-500 to-red-600", I: L.FileText },
  DOC: { g: "from-blue-400 via-blue-500 to-blue-600", I: L.FileText }, DOCX: { g: "from-blue-400 via-blue-500 to-blue-600", I: L.FileText },
  TXT: { g: "from-slate-400 via-slate-500 to-slate-600", I: L.AlignLeft },
  MD: { g: "from-sky-400 via-sky-500 to-sky-600", I: L.Hash },
  WEBP: { g: "from-fuchsia-400 via-purple-500 to-fuchsia-600", I: L.Image }, IMG: { g: "from-fuchsia-400 via-purple-500 to-fuchsia-600", I: L.Image }, JPG: { g: "from-fuchsia-400 via-purple-500 to-fuchsia-600", I: L.Image }, SAT: { g: "from-indigo-400 via-violet-500 to-indigo-600", I: L.Image },
  MP4: { g: "from-violet-400 via-purple-500 to-indigo-600", I: L.Film }, MOV: { g: "from-violet-400 via-purple-500 to-indigo-600", I: L.Film },
  MP3: { g: "from-pink-400 via-rose-500 to-pink-600", I: L.Music }, WAV: { g: "from-pink-400 via-rose-500 to-pink-600", I: L.Music },
  ZIP: { g: "from-orange-400 via-amber-500 to-orange-600", I: L.Archive },
  CASE: { g: "from-orange-500 via-red-500 to-rose-600", I: L.FolderSearch },
  JS: { g: "from-cyan-400 via-sky-500 to-cyan-600", I: L.Code }, CSS: { g: "from-cyan-400 via-sky-500 to-cyan-600", I: L.Code }, HTML: { g: "from-cyan-400 via-sky-500 to-cyan-600", I: L.Code },
  "": { g: "from-zinc-400 via-zinc-500 to-zinc-600", I: L.FileText },
};
function DocIcon({ ext, size = 48 }: { ext?: string; size?: number }) {
  const E = (ext ?? "").toUpperCase();
  const isImg = IMG_EXTS.includes(E);
  const cfg = DOC_MAP[E] ?? DOC_MAP[""];
  const Glyph = cfg.I;
  const w = size, h = size * 1.24;
  return (
    <div className="relative select-none" style={{ width: w, height: h }} aria-label={E || "file"}>
      <div className="absolute inset-0" style={{ clipPath: "polygon(0% 0%, 70% 0%, 100% 28%, 100% 100%, 0% 100%)", background: "linear-gradient(180deg,#ffffff 0%,#f4f4f5 55%,#d4d4d8 100%)", boxShadow: "0 6px 16px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.95)" }} />
      <div className="absolute top-0 right-0" style={{ width: "30%", height: "28%", clipPath: "polygon(0 0, 100% 100%, 0 100%)", background: "linear-gradient(225deg,#fafafa 0%,#a1a1aa 90%)", borderBottomLeftRadius: 4, boxShadow: "-1px 1px 2px rgba(0,0,0,.25)" }} />
      <div className="absolute inset-0 doc-gloss pointer-events-none" style={{ clipPath: "polygon(0% 0%, 70% 0%, 100% 28%, 100% 100%, 0% 100%)", opacity: 0.5 }} />
      {isImg ? (
        <div className="absolute inset-x-[12%] top-[30%] h-[42%] overflow-hidden rounded-[12%] shadow-md ring-1 ring-black/10">
          <div className={cx("h-full w-full bg-gradient-to-br", cfg.g)} />
          <L.Image className="absolute inset-0 m-auto text-white/90" style={{ width: w * 0.3, height: w * 0.3 }} />
        </div>
      ) : (
        <div className={cx("absolute inset-x-[16%] top-[30%] grid h-[40%] place-items-center rounded-[22%] bg-gradient-to-b shadow-md ring-1 ring-white/30", cfg.g)}>
          <Glyph className="text-white" style={{ width: w * 0.3, height: w * 0.3 }} strokeWidth={2.2} />
        </div>
      )}
      <span className="absolute inset-x-0 bottom-[5%] text-center font-extrabold tracking-wider text-zinc-500" style={{ fontSize: Math.max(7, w * 0.15) }}>{E || "FILE"}</span>
    </div>
  );
}
const ItemIcon = ({ item, size = 48 }: { item: FSItem; size?: number }) => item.kind === "folder" ? <FolderIcon size={size} /> : <DocIcon ext={item.ext} size={size} />;

/* ── 8. BOOT / LOCK ──────────────────────────────────────────────────────────── */
function BootScreen({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0); const [logs, setLogs] = useState<string[]>([]);
  const bootLogs = ["Initializing kernel... Darwin 24.0.0", "Loading KOICA Infinite Premium shell...", "Mounting virtual filesystem... OK", "Decoding Natural Earth geography... OK", "Loading country registry... OK", "Verifying 49 overseas offices... OK", "Uplink to Seongnam HQ... ₩1.5322T synced", "PDF viewer + widget engine armed", "System ready. Welcome, Detective."];
  useEffect(() => {
    let i = 0;
    const li = setInterval(() => { if (i < bootLogs.length) { setLogs((s) => [...s, bootLogs[i]]); i++; } }, 190);
    const pi = setInterval(() => setP((v) => { if (v >= 100) { clearInterval(pi); clearInterval(li); setTimeout(onDone, 600); return 100; } return v + Math.random() * 8 + 2; }), 120);
    return () => { clearInterval(pi); clearInterval(li); };
  }, [onDone]);
  return (
    <motion.div exit={{ opacity: 0, transition: { duration: 0.8 } }} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
      <motion.img src="/appleicon.webp" alt="" draggable={false} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SPRING_SOFT} className="mb-8 h-24 w-24 object-contain drop-shadow-[0_0_45px_rgba(255,255,255,.3)]" />
      <div className="h-[4px] w-64 overflow-hidden rounded-full bg-zinc-800 mb-8"><motion.div className="h-full rounded-full bg-white" animate={{ width: `${Math.min(100, p)}%` }} /></div>
      <div className="w-full max-w-md space-y-0.5 px-4">{logs.map((l, i) => <motion.p key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="jb text-center text-[10px] text-zinc-500">{l}</motion.p>)}</div>
      <p className="jb absolute bottom-8 text-[10px] tracking-widest text-zinc-700">KOICA INFINITE PREMIUM · WEKO BUILD ∞ · SECURE BOOT</p>
    </motion.div>
  );
}
function LockScreen({ unlock }: { unlock: () => void }) {
  const [pw, setPw] = useState(""); const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -100 }} transition={SPRING_SOFT}
      className="fixed inset-0 z-[9997] flex flex-col items-center justify-center backdrop-blur-3xl" style={{ background: "rgba(10,10,18,.75)" }}>
      <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SPRING_POP} className="text-5xl sm:text-7xl md:text-8xl font-bold text-white tracking-tight tabular-nums">{time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })}</motion.p>
      <p className="text-base sm:text-xl text-zinc-300 mt-2">{time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      <motion.div whileHover={{ scale: 1.06, rotate: 2 }} className="grid size-24 md:size-28 place-items-center rounded-full bg-gradient-to-b from-sky-400 to-indigo-600 shadow-2xl mt-8 mb-4 ring-4 ring-white/10 glowpulse"><L.Fingerprint className="size-12 md:size-14 text-white" /></motion.div>
      <p className="text-2xl font-semibold text-white">WeKO</p>
      <form onSubmit={(e) => { e.preventDefault(); unlock(); }} className="mt-6 flex items-center gap-2">
        <input autoFocus type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter Password" className="w-56 md:w-64 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm text-white placeholder-zinc-400 outline-none backdrop-blur focus:border-white/50" />
        <motion.button whileTap={{ scale: 0.9 }} type="submit" className="grid size-11 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"><L.ChevronRight className="size-5" /></motion.button>
      </form>
      <p className="mt-4 text-[11px] text-zinc-500">hint: any password unlocks a public case file</p>
    </motion.div>
  );
}

/* ── 9. SHELL CORE ───────────────────────────────────────────────────────────── */
const HOME_DISPLAY = "/Users/weko";
const SHELL_USER = "weko";
const cloneFS = (src: Record<string, FSItem[]>) => { const o: Record<string, FSItem[]> = {}; for (const k of Object.keys(src)) o[k] = src[k].map((i) => ({ ...i })); return o; };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtLsDate = (ts: number) => { const d = new Date(ts); return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, " ")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
const absolutize = (p: string) => p === "~" ? HOME_DISPLAY : p.startsWith("~/") ? HOME_DISPLAY + p.slice(1) : p;
interface ShellState { fs: Record<string, FSItem[]>; cwd: string; env: Record<string, string>; aliases: Record<string, string>; history: string[] }
type WriteFn = (s: string, cls?: string) => void;
const MANPAGES: Record<string, string> = {
  ls: "NAME\n  ls — list directory contents\nSYNOPSIS\n  ls [-la] [file ...]",
  cd: "NAME\n  cd — change the shell working directory\nSYNOPSIS\n  cd [directory]",
  open: "NAME\n  open — open a file in its app (PDF viewer, Quick Look)\nSYNOPSIS\n  open <file>",
  country: "NAME\n  country — open a country dossier\nSYNOPSIS\n  country <name>",
  map: "NAME\n  map — interactive world map\nSYNOPSIS\n  map",
};

/* ── 10. BREAKPOINTS ─────────────────────────────────────────────────────────── */
type Bp = "watch" | "mobile" | "tablet" | "desktop" | "wide";
function useBreakpoint(): { bp: Bp; w: number; h: number } {
  const [s, setS] = useState<{ bp: Bp; w: number; h: number }>(() => ({ bp: "desktop", w: 1440, h: 900 }));
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth, h = window.innerHeight; let bp: Bp = "desktop";
      if (w < 340 || (w < 420 && h / w > 1.4)) bp = "watch";
      else if (w < 640) bp = "mobile";
      else if (w < 1024) bp = "tablet";
      else if (w >= 1920) bp = "wide";
      setS({ bp, w, h });
    };
    calc();
    window.addEventListener("resize", calc); window.addEventListener("orientationchange", calc);
    return () => { window.removeEventListener("resize", calc); window.removeEventListener("orientationchange", calc); };
  }, []);
  return s;
}

/* ── 11. MENU BAR / CONTROL CENTER ───────────────────────────────────────────── */
function useClock() { const [n, setN] = useState(new Date()); useEffect(() => { const t = setInterval(() => setN(new Date()), 10000); return () => clearInterval(t); }, []); return n; }
function MenuList({ items, onClose }: { items: any[]; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={SPRING_SOFT} className="mt-1 w-64 rounded-xl glass p-1 shadow-2xl chrome">
      {items.map((it, i) => it.label === "-" ? <div key={i} className="mx-2 my-1 h-px bg-white/10" /> : (
        <motion.button key={i} whileTap={{ scale: 0.97 }} disabled={it.disabled} onClick={() => { it.run?.(); onClose(); }}
          className={cx("flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left text-[13px]", it.disabled ? "cursor-default text-zinc-500" : "text-zinc-100 hover:bg-sky-600", it.danger && "text-red-400 hover:bg-red-600 hover:text-white")}>
          {it.icon && <span className="size-4 text-zinc-400">{it.icon}</span>}<span className="flex-1">{it.label}</span>{it.kbd && <span className="text-[11px] text-zinc-500">{it.kbd}</span>}
        </motion.button>))}
    </motion.div>
  );
}
function ControlCenter({ onClose }: { onClose: () => void }) {
  const os = useOS();
  return (
    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={SPRING_SOFT}
      className="absolute right-3 top-10 w-[92vw] max-w-80 rounded-2xl glass p-4 shadow-2xl z-[950] chrome" onClick={(e) => e.stopPropagation()}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="col-span-2 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-3">
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => os.notify("Wi-Fi", "Connected to Cupertino-5G")} className="flex items-center gap-2 text-left text-[12px]"><span className="grid size-8 place-items-center rounded-full bg-sky-500"><L.Wifi className="size-4 text-white" /></span><span><b>Wi-Fi</b><br /><span className="text-zinc-400">Cupertino-5G</span></span></motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => os.notify("Bluetooth", "AirPods Pro connected")} className="flex items-center gap-2 text-left text-[12px]"><span className="grid size-8 place-items-center rounded-full bg-sky-500"><L.Bluetooth className="size-4 text-white" /></span><span><b>Bluetooth</b><br /><span className="text-zinc-400">AirPods Pro</span></span></motion.button>
        </div>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => os.setDark(!os.dark)} className="flex flex-col items-start justify-between rounded-xl bg-white/5 p-3 text-[12px] hover:bg-white/10"><span className="flex items-center gap-2">{os.dark ? <L.Moon className="size-4 text-indigo-300" /> : <L.Sun className="size-4 text-amber-300" />} Appearance</span><span className="font-semibold mt-2">{os.dark ? "Dark" : "Light"}</span></motion.button>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => os.setMissionControl(true)} className="flex flex-col items-start justify-between rounded-xl bg-white/5 p-3 text-[12px] hover:bg-white/10"><span className="flex items-center gap-2"><L.LayoutGrid className="size-4 text-purple-300" /> Mission Control</span><span className="font-semibold mt-2">Exposé</span></motion.button>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl bg-white/5 p-3"><p className="mb-2 flex items-center gap-1.5 text-[12px] text-zinc-300"><L.Monitor className="size-3.5" /> Display {os.brightness}%</p><input type="range" min={20} max={100} value={os.brightness} onChange={(e) => os.setBrightness(+e.target.value)} className="mac w-full" /></div>
        <div className="rounded-xl bg-white/5 p-3"><p className="mb-2 flex items-center gap-1.5 text-[12px] text-zinc-300"><L.Volume2 className="size-3.5" /> Sound {os.volume}%</p><input type="range" min={0} max={100} value={os.volume} onChange={(e) => os.setVolume(+e.target.value)} className="mac w-full" /></div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => os.setWallpaper((os.wallpaper + 1) % WALLPAPERS.length)} className="flex items-center gap-2 text-[11px] text-zinc-400 hover:text-white"><L.Palette className="size-3.5" /> Wallpaper</button>
        <button onClick={onClose} className="text-[11px] text-zinc-500 hover:text-white">Close</button>
      </div>
    </motion.div>
  );
}
function MenuBar({ openSpotlight, openApp }: { openSpotlight: () => void; openApp: (a: AppId, p?: any) => void }) {
  const os = useOS(); const now = useClock();
  const [menu, setMenu] = useState<string | null>(null); const [cc, setCC] = useState(false);
  const appName = os.focusedApp ? APPS[os.focusedApp]?.name ?? "Finder" : "Finder";
  const fid = () => os.focusedId;
  const menus: Record<string, any[]> = {
    apple: [{ label: "About This Mac", run: () => openApp("about"), icon: <L.Info className="size-4" /> }, { label: "-" }, { label: "System Settings...", run: () => openApp("settings"), icon: <L.Settings className="size-4" /> }, { label: "-" }, { label: "Sleep", run: os.sleep, icon: <L.Moon className="size-4" /> }, { label: "Restart...", run: os.restart, icon: <L.RotateCw className="size-4" /> }, { label: "Lock Screen", kbd: "⌃Q", run: os.lock, icon: <L.Lock className="size-4" /> }],
    file: [{ label: "New Finder Window", kbd: "⌘N", run: () => openApp("finder") }, { label: "Open koica.pdf", run: () => openApp("pdf", { src: "/koica.pdf", title: "koica.pdf" }) }, { label: "Close Window", kbd: "⌘W", run: () => { const f = fid(); if (f) os.close(f); } }],
    edit: [{ label: "Undo", kbd: "⌘Z", disabled: true }, { label: "Redo", kbd: "⇧Z", disabled: true }, { label: "-" }, { label: "Select All", kbd: "⌘A", run: () => document.execCommand?.("selectAll") }],
    view: [{ label: "Mission Control", kbd: "⌃↑", run: () => os.setMissionControl(true), icon: <L.LayoutGrid className="size-4" /> }, { label: "-" }, { label: "Toggle Dark Mode", run: () => os.setDark(!os.dark), icon: <L.Moon className="size-4" /> }],
    go: [{ label: "Home", run: () => openApp("finder", { path: "~" }) }, { label: "Documents", run: () => openApp("finder", { path: "~/Documents" }) }, { label: "Movies", run: () => openApp("finder", { path: "~/Movies" }) }, { label: "Pictures", run: () => openApp("finder", { path: "~/Pictures" }) }, { label: "-" }, { label: "Case File", run: () => openApp("finder", { path: "~/cases/WEKO-08" }) }, { label: "Projects", run: () => openApp("finder", { path: "~/projects" }) }],
    window: [{ label: "Minimize", kbd: "⌘M", run: () => { const f = fid(); if (f) os.minimize(f); } }, { label: "Zoom", run: () => { const f = fid(); if (f) os.toggleMax(f); } }, { label: "-" }, { label: "Snap Left", run: () => { const f = fid(); if (f) os.snapWindow(f, "left"); } }, { label: "Snap Right", run: () => { const f = fid(); if (f) os.snapWindow(f, "right"); } }],
    help: [{ label: "KOICA Hub", run: () => openApp("hub"), icon: <L.Sparkles className="size-4" /> }, { label: "Terminal Help", run: () => openApp("terminal", { initialCmd: "help" }), icon: <L.BookOpen className="size-4" /> }, { label: "Detective Manual", run: () => openApp("terminal", { initialCmd: "man ls" }), icon: <L.BookOpen className="size-4" /> }],
  };
  const toggle = (m: string) => { setCC(false); setMenu((c) => (c === m ? null : m)); };
  return (<>
    <motion.nav initial={{ y: -32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING_SOFT}
      className={cx("chrome relative z-[900] flex h-8 items-center justify-between px-4 text-[13px] font-medium backdrop-blur-2xl", os.dark ? "bg-black/40 text-zinc-100" : "bg-white/60 text-zinc-800")}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggle("apple")} className={cx("rounded px-1 hover:bg-white/10", menu === "apple" && "bg-white/15")}>
            <img src="/appleicon.webp" alt="Apple" draggable={false} className={cx("h-[18px] w-[18px] object-contain drop-shadow-sm", !os.dark && "brightness-0")} />
          </motion.button>
          {menu === "apple" && <div className="absolute left-0"><MenuList items={menus.apple} onClose={() => setMenu(null)} /></div>}
        </div>
        <span className="font-bold">{appName}</span>
        {["file", "edit", "view", "go", "window", "help"].map((m) => (
          <div key={m} className="relative hidden md:block">
            <button onClick={() => toggle(m)} onMouseEnter={() => menu && setMenu(m)} className={cx("rounded px-2 py-0.5 capitalize hover:bg-white/10", menu === m && "bg-white/15")}>{m}</button>
            {menu === m && <div className="absolute left-0"><MenuList items={menus[m]} onClose={() => setMenu(null)} /></div>}
          </div>))}
      </div>
      <div className="flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setMenu(null); setCC(!cc); }} className="flex items-center gap-1 rounded px-1 hover:bg-white/10"><L.BatteryFull className="size-4" /><L.Wifi className="size-4" /><L.Settings2 className="size-4" /></motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={openSpotlight} className="rounded px-1 hover:bg-white/10"><L.Search className="size-4" /></motion.button>
        <span className="tabular-nums">{now.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
      </div>
    </motion.nav>
    <AnimatePresence>{cc && <ControlCenter onClose={() => setCC(false)} />}</AnimatePresence>
    {(menu || cc) && <div className="fixed inset-0 z-[899]" onClick={() => { setMenu(null); setCC(false); }} />}
  </>);
}

/* ── 12. NOTIFICATIONS / SPOTLIGHT ───────────────────────────────────────────── */
function Notifications({ notices }: { notices: any[] }) {
  return (
    <div className="pointer-events-none fixed right-3 top-10 z-[950] flex w-[88vw] sm:w-80 max-w-sm flex-col gap-2">
      <AnimatePresence>{notices.map((n) => (
        <motion.div key={n.id} initial={{ opacity: 0, x: 60, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 80, scale: 0.9 }} transition={SPRING_POP}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl glass p-4 shadow-2xl chrome">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-b from-sky-400 to-indigo-600 text-white shadow-lg">{n.icon ?? <L.Bell className="size-5" />}</div>
          <div><p className="text-[13px] font-semibold text-zinc-100">{n.t}</p><p className="text-[12px] text-zinc-400 mt-0.5">{n.b}</p></div>
        </motion.div>))}</AnimatePresence>
    </div>
  );
}
function Spotlight({ onClose }: { onClose: () => void }) {
  const os = useOS(); const [q, setQ] = useState(""); const term = q.toLowerCase();
  const openFile = (i: FSItem, dir: string) => {
    const E = i.ext?.toUpperCase();
    if (i.kind === "folder") return os.open("finder", { path: resolveVPath(dir, i.name) });
    if (E === "PDF") return os.open("pdf", { src: "/" + i.name, title: i.name });
    return os.open("quicklook", { item: i, dir });
  };
  const results = useMemo(() => {
    if (!term) return [];
    const apps = Object.keys(APPS).filter((a) => APPS[a as AppId].name.toLowerCase().includes(term))
      .map((a) => ({ icon: React.createElement(APPS[a as AppId].Icon, null), label: APPS[a as AppId].name, sub: "Application", run: () => os.open(a as AppId) }));
    const cmds = ["status", "map", "countries", "offices", "sectors", "programs", "history", "org", "budget", "country Rwanda", "projects Rwanda", "impact Rwanda", "trace Rwanda", "search agriculture", "live", "help", "open koica.pdf", "open koica_brochure.pdf", "cd", "pwd", "ls", "cat", "tree", "whoami", "neofetch"]
      .filter((c) => c.includes(term)).map((c) => ({ icon: <L.Terminal className="size-5 text-emerald-400" />, label: c, sub: "Terminal command", run: () => os.open("terminal", { initialCmd: c }) }));
    const files: any[] = [];
    Object.entries(FS).forEach(([dir, items]) => items.filter((i) => i.name.toLowerCase().includes(term)).forEach((i) =>
      files.push({ icon: <ItemIcon item={i} size={26} />, label: i.name, sub: dir, run: () => openFile(i, dir) })));
    return [...apps, ...cmds, ...files].slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, os]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[960] flex items-start justify-center bg-black/40 pt-[12vh] sm:pt-[20vh] backdrop-blur-sm">
      <motion.div initial={{ scale: 0.94, y: -14, filter: "blur(6px)" }} animate={{ scale: 1, y: 0, filter: "blur(0px)" }} exit={{ scale: 0.96, opacity: 0 }} transition={SPRING_POP}
        onClick={(e) => e.stopPropagation()} className="w-[92vw] max-w-[680px] overflow-hidden rounded-2xl glass shadow-2xl chrome">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
          <L.Search className="size-5 sm:size-6 text-zinc-400" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && results[0]) { results[0].run(); onClose(); } if (e.key === "Escape") onClose(); }}
            placeholder="Spotlight — apps, files, PDFs, commands…" className="flex-1 bg-transparent text-lg sm:text-2xl text-zinc-100 outline-none placeholder:text-zinc-500 font-light" />
          <span className="hidden sm:inline rounded bg-white/10 px-2 py-1 text-[10px] text-zinc-400 font-mono">ESC</span>
        </div>
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((r, i) => (
              <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => { r.run(); onClose(); }}
                className={cx("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left", i === 0 ? "bg-sky-600/80" : "hover:bg-white/10")}>
                <div className="size-8 flex items-center justify-center">{r.icon}</div>
                <span className="flex-1 text-[14px] sm:text-[15px] text-zinc-100 truncate">{r.label}</span>
                <span className="hidden sm:inline text-[11px] text-zinc-400">{r.sub}</span>
              </motion.button>))}
          </div>)}
        {q && results.length === 0 && <p className="p-8 text-center text-sm text-zinc-500">No results in this jurisdiction.</p>}
      </motion.div>
    </motion.div>
  );
}

/* ── 13. WINDOW FRAME / DOCK / MISSION CONTROL ───────────────────────────────── */
function WindowFrame({ win }: { win: Win }) {
  const os = useOS(); const focused = os.focusedId === win.id; const ref = useRef<HTMLDivElement>(null);
  const View = APPS[win.app].view;
  const startDrag = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-traffic]")) return;
    os.focus(win.id);
    if (win.maximized || win.snapped) os.snapWindow(win.id, null);
    const el = ref.current!; const sx = e.clientX - win.x, sy = e.clientY - win.y; el.classList.add("no-drag-transition");
    const mv = (ev: PointerEvent) => { el.style.left = `${ev.clientX - sx}px`; el.style.top = `${Math.max(MENU_H, ev.clientY - sy)}px`; };
    const up = (ev: PointerEvent) => { el.classList.remove("no-drag-transition"); os.commit(win.id, { x: ev.clientX - sx, y: Math.max(MENU_H, ev.clientY - sy) }); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  };
  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation(); os.focus(win.id);
    const el = ref.current!; const sx = e.clientX, sy = e.clientY, sw = win.w, sh = win.h; el.classList.add("no-drag-transition");
    const mv = (ev: PointerEvent) => { el.style.width = `${Math.max(340, sw + ev.clientX - sx)}px`; el.style.height = `${Math.max(240, sh + ev.clientY - sy)}px`; };
    const up = (ev: PointerEvent) => { el.classList.remove("no-drag-transition"); os.commit(win.id, { w: Math.max(340, sw + ev.clientX - sx), h: Math.max(240, sh + ev.clientY - sy) }); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  };
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: win.minimized ? 0 : 1, scale: win.minimized ? 0.1 : 1, y: win.minimized ? 600 : 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }} transition={SPRING_POP}
      onPointerDown={() => os.focus(win.id)}
      className={cx("absolute overflow-hidden rounded-xl border transition-shadow duration-300",
        os.dark ? "border-white/10 bg-zinc-900/95" : "border-black/10 bg-zinc-100/95",
        focused ? "win-shadow-focused" : "win-shadow",
        win.snapped === "left" && "left-0 top-8 w-1/2 h-[calc(100vh-32px)]",
        win.snapped === "right" && "right-0 top-8 w-1/2 h-[calc(100vh-32px)]",
        win.maximized && "left-0 top-8 w-full h-[calc(100vh-32px)]")}
      style={!win.snapped && !win.maximized ? { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z } : { zIndex: win.z }}>
      <div onPointerDown={startDrag} onDoubleClick={() => os.toggleMax(win.id)}
        className={cx("chrome tl-group flex h-9 shrink-0 items-center px-3 backdrop-blur-xl", os.dark ? "border-b border-white/5 bg-zinc-800/80" : "border-b border-black/5 bg-zinc-200/80")}>
        <div data-traffic className="flex gap-2">
          <button title="Close" onClick={() => os.close(win.id)} className="traffic bg-[#FF5F57] hover:brightness-110"><span>✕</span></button>
          <button title="Minimize" onClick={() => os.minimize(win.id)} className="traffic bg-[#FEBC2E] hover:brightness-110"><span>−</span></button>
          <button title="Zoom" onClick={() => os.toggleMax(win.id)} className="traffic bg-[#28C840] hover:brightness-110"><span>+</span></button>
        </div>
        <p className={cx("pointer-events-none absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold truncate max-w-[50%]", focused ? (os.dark ? "text-zinc-200" : "text-zinc-700") : "text-zinc-500")}>{win.title}</p>
      </div>
      <div className="h-[calc(100%-2.25rem)] overflow-hidden bg-zinc-950"><View winId={win.id} {...(win.props ?? {})} /></div>
      {!win.maximized && !win.snapped && <div onPointerDown={startResize} className="absolute bottom-0 right-0 z-10 h-4 w-4 cursor-nwse-resize" />}
    </motion.div>
  );
}
function DockIcon({ app, mouseX }: { app: { id: AppId }; mouseX: any }) {
  const os = useOS(); const ref = useRef<HTMLButtonElement>(null);
  const [bounce, setBounce] = useState(0); const [ctxM, setCtxM] = useState(false);
  const win = os.wins.find((w) => w.app === app.id); const running = !!win; const IconComp = APPS[app.id].Icon;
  const dist = useTransform(mouseX, (v: number) => { const b = ref.current?.getBoundingClientRect(); return b ? v - b.x - b.width / 2 : Infinity; });
  const size = useTransform(dist, [-140, 0, 140], [44, 76, 44]); const spring = useSpring(size, { stiffness: 380, damping: 26 });
  const launch = () => { if (win?.minimized) { os.restore(win.id); return; } if (win) { os.focus(win.id); return; } setBounce((b) => b + 1); os.open(app.id); };
  return (
    <div className="relative flex flex-col items-center chrome">
      <AnimatePresence>{ctxM && (
        <motion.div initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={SPRING_POP} className="absolute bottom-full mb-3 w-44 rounded-xl glass p-1 shadow-2xl">
          <button onClick={() => { launch(); setCtxM(false); }} className="w-full rounded-md px-3 py-1.5 text-left text-[13px] text-zinc-100 hover:bg-sky-600">{running ? "Show Window" : "Open"}</button>
          {running && <button onClick={() => { os.close(win!.id); setCtxM(false); }} className="w-full rounded-md px-3 py-1.5 text-left text-[13px] text-red-400 hover:bg-red-600 hover:text-white">Quit</button>}
        </motion.div>)}
      </AnimatePresence>
      {ctxM && <div className="fixed inset-0" onClick={() => setCtxM(false)} />}
      <motion.button ref={ref} style={{ width: spring, height: spring }} whileTap={{ scale: 0.85 }}
        animate={bounce ? { y: [0, -26, 0, -12, 0] } : { y: 0 }} transition={{ y: { duration: 0.6, ease: "easeOut", times: [0, 0.35, 0.6, 0.8, 1] } }}
        onClick={launch} onContextMenu={(e) => { e.preventDefault(); setCtxM(true); }} className="group relative grid place-items-center">
        <span className="pointer-events-none absolute -top-8 rounded-md bg-black/80 px-2 py-0.5 text-[12px] text-white opacity-0 backdrop-blur group-hover:opacity-100 whitespace-nowrap">{APPS[app.id].name}</span>
        <div className="grid h-full w-full place-items-center"><IconComp /></div>
        <span className={cx("absolute -bottom-1.5 size-1 rounded-full bg-zinc-200 transition-opacity", running ? "opacity-100" : "opacity-0")} />
      </motion.button>
    </div>
  );
}
function Dock() {
  const mouseX = useMotionValue(Infinity);
  const ids: AppId[] = ["finder", "safari", "terminal", "hub", "atlas", "media", "photos", "messages", "settings", "monitor"];
  return (
    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ ...SPRING, bounce: 0.4, delay: 0.15 }}
      onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(Infinity)}
      className="chrome absolute bottom-2 left-1/2 z-[800] flex -translate-x-1/2 items-end gap-1.5 sm:gap-2 rounded-2xl glass px-2 sm:px-3 py-1.5 sm:py-2 shadow-[0_24px_70px_rgba(0,0,0,.55)] max-w-[96vw] overflow-x-auto">
      {ids.map((id) => <DockIcon key={id} app={{ id }} mouseX={mouseX} />)}
      <div className="mx-1 h-10 w-px self-center bg-white/20" />
      <DockIcon app={{ id: "trash" }} mouseX={mouseX} />
    </motion.div>
  );
}
function MissionControl() {
  const os = useOS();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING_SOFT}
      className="fixed inset-0 z-[980] bg-black/60 backdrop-blur-xl flex flex-col" onClick={() => os.setMissionControl(false)}>
      <div className="flex-1 flex items-center justify-center gap-6 sm:gap-8 p-4 sm:p-8 flex-wrap" onClick={(e) => e.stopPropagation()}>
        {os.wins.filter((w) => !w.minimized).map((w) => (
          <motion.div key={w.id} className="relative group cursor-pointer" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SPRING_POP}
            onClick={() => { os.focus(w.id); os.setMissionControl(false); }}>
            <div className="w-48 sm:w-64 h-32 sm:h-40 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-zinc-900">
              <div className="h-6 bg-zinc-800 flex items-center px-2 gap-1"><div className="size-2 rounded-full bg-red-500" /><div className="size-2 rounded-full bg-yellow-500" /><div className="size-2 rounded-full bg-green-500" /></div>
              <div className="p-2 text-[10px] text-zinc-400 truncate">{w.title}</div>
            </div>
            <p className="text-center text-sm text-white mt-2 group-hover:text-sky-400">{APPS[w.app].name}</p>
          </motion.div>))}
        {os.wins.filter((w) => !w.minimized).length === 0 && <p className="text-zinc-500 text-lg">No open windows</p>}
      </div>
    </motion.div>
  );
}

/* ── 14. TERMINAL MAPS ───────────────────────────────────────────────────────── */
function TermWorldMap({ onOpen, inputRef }: { onOpen: (n: string) => void; inputRef: React.RefObject<HTMLInputElement> }) {
  const [geo, setGeo] = useState<any>(null); const [err, setErr] = useState(false);
  const [sel, setSel] = useState(0); const [hover, setHover] = useState<any>(null);
  useEffect(() => { loadWorld().then((f) => { if (!f) { setErr(true); return; } setGeo(buildPaths(f)); }).catch(() => setErr(true)); }, []);
  const selCountry = CORE[sel];
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (s + 1) % CORE.length); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s - 1 + CORE.length) % CORE.length); }
    else if (e.key === "Enter") { e.preventDefault(); onOpen(selCountry.name); }
    else if (e.key === "Escape") { e.preventDefault(); inputRef.current?.focus(); }
  };
  return (
    <div tabIndex={0} onKeyDown={onKeyDown} onClick={(e) => (e.currentTarget as HTMLDivElement).focus()}
      className="mt-2 rounded-lg border border-cyan-500/20 bg-[#04080d] outline-none focus:border-cyan-400/50 cursor-default">
      <div className="flex flex-col sm:flex-row">
        <div className="relative flex-1 min-w-0">
          {!geo && !err && <div className="h-[220px] sm:h-[280px] flex items-center justify-center"><p className="jb text-[11px] text-zinc-500 pulse">Loading geographic registry…</p></div>}
          {err && <div className="h-[220px] sm:h-[280px] flex items-center justify-center"><p className="jb text-[11px] text-red-400">geography unavailable offline</p></div>}
          {geo && (
            <svg viewBox="0 0 1000 520" className="w-full h-[220px] sm:h-[280px] block">
              {geo.list.map((sh: any, i: number) => {
                const c = REG.find((r) => matchName(sh.name, r)); const isSel = c && c.name === selCountry.name;
                return <path key={i} d={sh.d} vectorEffect="non-scaling-stroke" className={i < 40 ? "mapdraw" : undefined}
                  style={{ fill: isSel ? "rgba(56,189,248,.45)" : c ? (c.core ? "rgba(56,189,248,.18)" : "rgba(56,189,248,.08)") : "rgba(30,41,59,.6)", stroke: isSel ? "#7dd3fc" : c ? "rgba(125,211,252,.5)" : "rgba(71,85,105,.5)", strokeWidth: isSel ? 1.4 : 0.6, cursor: c ? "pointer" : "default" }}
                  onMouseEnter={() => c && setHover(c.name)} onMouseLeave={() => setHover(null)}
                  onClick={() => { if (c) { const ix = CORE.findIndex((x) => x.name === c.name); if (ix >= 0) setSel(ix); } }}
                  onDoubleClick={() => c && onOpen(c.name)} />;
              })}
              {REG.filter((c) => c.office).map((c) => { const [x, y] = geo.P(c.lng, c.lat); const isSel = c.name === selCountry.name; return (
                <g key={c.name} className="cursor-pointer" onClick={() => { const ix = CORE.findIndex((x2) => x2.name === c.name); if (ix >= 0) setSel(ix); }} onDoubleClick={() => onOpen(c.name)}>
                  {isSel && <circle cx={x} cy={y} r={9} fill="none" stroke="#fbbf24" strokeWidth={1.2} className="pulse" />}
                  <circle cx={x} cy={y} r={c.core ? 2.6 : 1.8} fill={c.core ? "#fbbf24" : "#38bdf8"} />
                </g>); })}
              {(() => { const [x, y] = geo.P(KOICA.hqLng, KOICA.hqLat); return (
                <g><circle cx={x} cy={y} r={3.4} fill="#f472b6" /><circle cx={x} cy={y} r={7} fill="none" stroke="#f472b6" strokeWidth={1} className="pulse" />
                  <text x={x + 9} y={y + 3} fill="#f9a8d4" fontSize={11} className="jb">HQ Seongnam — South Korea</text></g>); })()}
            </svg>)}
          {hover && <div className="absolute left-2 top-2 jb text-[10px] text-sky-300 bg-black/60 px-2 py-0.5 rounded">{hover}</div>}
        </div>
        <div className="w-full sm:w-[190px] shrink-0 sm:border-l border-t sm:border-t-0 border-cyan-500/15 p-3 jb text-[10.5px] leading-4 grid grid-cols-2 sm:grid-cols-1 gap-x-3">
          <p className="col-span-2 sm:col-span-1 text-zinc-100 text-[12px] font-bold">{selCountry.name.toUpperCase()}</p>
          <div className="col-span-2 sm:col-span-1 h-px bg-cyan-500/15 my-2" />
          <p><span className="text-zinc-500">Office</span> <span className="text-sky-300">{selCountry.city}</span></p>
          <p><span className="text-zinc-500">Partner</span> <span className="text-emerald-400">{selCountry.core ? "YES — core" : "office"}</span></p>
          <p><span className="text-zinc-500">Region</span> <span className="text-zinc-300">{selCountry.region}</span></p>
          <p><span className="text-zinc-500">Projects</span> <span className="text-amber-300">{selCountry.projects.length}</span></p>
          <p><span className="text-zinc-500">Status</span> <span className="text-emerald-400">● ACTIVE</span></p>
          <p className="col-span-2 sm:col-span-1 text-zinc-500 mt-2">↑↓←→ select · Enter dossier</p>
        </div>
      </div>
    </div>
  );
}
function TermCountryMap({ c }: { c: Country }) {
  const [geo, setGeo] = useState<any>(null); const [err, setErr] = useState(false);
  useEffect(() => { loadWorld().then((f) => { if (!f) { setErr(true); return; } setGeo(buildPaths(f)); }).catch(() => setErr(true)); }, []);
  if (err) return <p className="jb text-[11px] text-red-400 mt-2">geography unavailable — try: map</p>;
  if (!geo) return <p className="jb text-[11px] text-zinc-500 mt-2 pulse">Loading {c.name} geographic boundary…</p>;
  const feat = geo.list.find((sh: any) => matchName(sh.name, c));
  if (!feat) return <p className="jb text-[11px] text-amber-300 mt-2">boundary not found for {c.name} — try: map</p>;
  const [b0, b1, b2, b3] = feat.bbox; const w = b2 - b0, h = b3 - b1; const pad = 0.45;
  const vb = `${b0 - w * pad} ${b1 - h * pad} ${w * (1 + 2 * pad)} ${h * (1 + 2 * pad)}`;
  const [ox, oy] = geo.P(c.lng, c.lat); const fs = Math.max(w, h) * 0.075;
  return (
    <div className="mt-2 rounded-lg border border-sky-500/20 bg-[#04080d]">
      <svg viewBox={vb} className="w-full h-[200px] sm:h-[260px] block">
        <path d={feat.d} vectorEffect="non-scaling-stroke" className="mapdraw" style={{ fill: "rgba(56,189,248,.30)", stroke: "#7dd3fc", strokeWidth: 1.4 }} />
        <circle cx={ox} cy={oy} r={Math.max(w, h) * 0.02} fill="#fbbf24" />
        <circle cx={ox} cy={oy} r={Math.max(w, h) * 0.05} fill="none" stroke="#fbbf24" strokeWidth={1} className="pulse" />
        <text x={ox + Math.max(w, h) * 0.06} y={oy + fs * 0.35} fill="#fde68a" fontSize={fs} className="jb">{c.city} — KOICA office</text>
      </svg>
    </div>
  );
}

/* ── 15. TERMINAL PRIMITIVES ─────────────────────────────────────────────────── */
type TOut = { k: "t"; s: string; c?: string } | { k: "jsx"; node: React.ReactNode } | { k: "bar"; label: string; c?: string; s?: string } | { k: "rule" } | { k: "next"; cmds: string[] };
const RULE = "────────────────────────────────────────────────────────";
function BarLine({ label, pct, color }: { label: string; pct: number; color?: string }) {
  const [p, setP] = useState(0);
  useEffect(() => { const t = setInterval(() => setP((x) => (x >= pct ? pct : x + 2)), 24); return () => clearInterval(t); }, [pct]);
  const cells = 30, f = Math.round((p / 100) * cells);
  return (<p className="jb text-[12px]"><span className="text-zinc-300">{label.padEnd(22, " ")}</span><span className={color ?? "text-sky-300"}>{"█".repeat(f)}</span><span className="text-zinc-700">{"░".repeat(cells - f)}</span> <span className="text-zinc-400">{Math.round(p)}%</span></p>);
}
function OutLine({ o, onCmd }: { o: TOut; onCmd: (c: string) => void }) {
  if (o.k === "rule") return <p className="jb text-[11px] text-zinc-600">{RULE}</p>;
  if (o.k === "bar") return <BarLine label={o.label} pct={o.c ? +o.c : 100} color={o.s} />;
  if (o.k === "next") return (<div className="mt-1 mb-1"><p className="jb text-[11px] text-zinc-500">NEXT</p>{o.cmds.map((c, i) => <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={() => onCmd(c)} className="block jb text-[12px] text-cyan-300 hover:text-cyan-100 hover:underline">{c}</motion.button>)}</div>);
  if (o.k === "jsx") return <div>{o.node}</div>;
  return <p className={cx("jb whitespace-pre-wrap text-[12px] leading-[1.5]", o.c ?? "text-zinc-200")}>{o.s}</p>;
}

/* ── 16. TERMINAL APP ────────────────────────────────────────────────────────── */
function TerminalApp({ initialCmd, winId }: { initialCmd?: string; winId: number }) {
  const os = useOS();
  const [lines, setLines] = useState<TOut[]>([]); const [val, setVal] = useState(""); const [cwd, setCwd] = useState("~"); const [histIdx, setHistIdx] = useState(-1);
  const fs = useRef<Record<string, FSItem[]>>(cloneFS(FS));
  const env = useRef<Record<string, string>>({ HOME: HOME_DISPLAY, USER: SHELL_USER, SHELL: "/bin/zsh", PWD: HOME_DISPLAY, TERM: "xterm-256color", PATH: "/usr/local/bin:/usr/bin:/bin" });
  const aliases = useRef<Record<string, string>>({ ll: "ls -la", la: "ls -a" });
  const hist = useRef<string[]>([]); const liveOn = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null); const inpRef = useRef<HTMLInputElement>(null);
  const runRef = useRef<(s: string) => void>(() => {});
  const print = useCallback((o: TOut) => setLines((l) => [...l, o]), []);
  const printT = useCallback((s: string, c?: string) => print({ k: "t", s, c }), [print]);
  const updateLast = useCallback((o: TOut) => setLines((l) => { const c = [...l]; if (c.length) c[c.length - 1] = o; else c.push(o); return c; }), []);
  const aDots = useCallback(async (msg: string, ms = 420) => { printT(`${msg} •`, "text-zinc-500"); for (let i = 2; i <= 3; i++) { await wait(ms / 3); updateLast({ k: "t", s: `${msg} ${"•".repeat(i)}`, c: "text-zinc-500" }); } }, [printT, updateLast]);
  const aSpin = useCallback(async (msg: string, ms = 480) => { const fr = ["◐", "", "◑", ""]; printT(`${fr[0]} ${msg}`, "text-zinc-500"); for (let i = 1; i < 4; i++) { await wait(ms / 4); updateLast({ k: "t", s: `${fr[i]} ${msg}`, c: "text-zinc-500" }); } }, [printT, updateLast]);
  const head = useCallback((t: string) => { printT(t, "text-zinc-100 font-bold"); print({ k: "rule" }); }, [print, printT]);
  const next = useCallback((cmds: string[]) => { print({ k: "rule" }); print({ k: "next", cmds }); }, [print]);
  const kv = useCallback((k: string, v: string, vc = "text-zinc-100") => print({ k: "jsx", node: (<p className="jb text-[12px] leading-[1.5]"><span className="text-zinc-500">{k.padEnd(22, " ")}</span><span className={vc}>{v}</span></p>) }), [print]);
  const echoPrompt = useCallback((raw: string) => print({ k: "jsx", node: (<div className="jb text-[12px] leading-[1.55] mt-2"><div><span className="text-zinc-500">─ </span><span className="text-emerald-400">weko@koica</span> <span className="text-sky-300">{cwd}</span></div><div className="flex"><span className="text-zinc-500">└─ </span><span className="text-zinc-400 mr-1">%</span> <span className="text-zinc-100">{raw}</span></div></div>) }), [cwd, print]);
  const fmtLong = useCallback((i: FSItem) => `${i.kind === "folder" ? "drwxr-xr-x" : "-rw-r--r--"}  1 weko  staff  ${String(i.bytes ?? 160).padStart(6, " ")} ${fmtLsDate(i.mtime ?? Date.now())} ${i.name}`, []);

  const UNIX = useMemo<Record<string, (a: string[], w: WriteFn, e: WriteFn, st: ShellState) => void>>(() => ({
    pwd: (_a, w, _e, st) => w(absolutize(st.cwd)),
    cd: (a, w, e, st) => { const t = a[0] ?? "~"; const p = resolveVPath(st.cwd, t); if (!fsExists(fs.current, p)) { e(`cd: no such file or directory: ${t}`); return; } if (!fsIsDir(fs.current, p)) { e(`cd: not a directory: ${t}`); return; } st.cwd = p; env.current.PWD = absolutize(p); },
    ls: (a, w, e, st) => {
      let long = false, all = false; const paths: string[] = [];
      for (const t of a) { if (t.startsWith("-")) { for (const ch of t.slice(1)) { if (ch === "l") long = true; if (ch === "a") all = true; } } else paths.push(t); }
      const p = resolveVPath(st.cwd, paths[0] ?? ".");
      if (!fsExists(fs.current, p)) { e(`ls: ${paths[0] ?? "."}: No such file or directory`); return; }
      const it = fsGetItem(fs.current, p);
      if (it && it.kind === "file") { w(long ? fmtLong(it) : it.name); return; }
      const dir = fs.current[p] ?? [];
      const entries = all ? [{ name: ".", kind: "folder" } as FSItem, { name: "..", kind: "folder" } as FSItem, ...dir] : dir;
      if (long) entries.forEach((x) => w(fmtLong(x)));
      else w(entries.map((x) => x.name + (x.kind === "folder" ? "/" : "")).join("   "));
    },
    mkdir: (a, w, e, st) => { for (const t of a.filter((x) => !x.startsWith("-"))) { const r = fsMkdir(fs.current, resolveVPath(st.cwd, t), a.includes("-p")); if (!r.ok) e(`mkdir: ${t}: ${r.err}`); } },
    touch: (a, w, e, st) => { for (const t of a) fsTouch(fs.current, resolveVPath(st.cwd, t)); },
    rm: (a, w, e, st) => { const rec = a.some((x) => x.includes("r")); for (const t of a.filter((x) => !x.startsWith("-"))) { const r = fsRemove(fs.current, resolveVPath(st.cwd, t), rec); if (!r.ok && !a.includes("-f")) e(`rm: ${t}: ${r.err}`); } },
    cat: (a, w, e, st) => { for (const t of a) { const it = fsGetItem(fs.current, resolveVPath(st.cwd, t)); if (!it) { e(`cat: ${t}: No such file or directory`); continue; } if (it.kind === "folder") { e(`cat: ${t}: Is a directory`); continue; } (it.content ?? "").split("\n").forEach((l) => w(l)); } },
    find: (a, w, _e, st) => { const walk = (p: string) => { w(absolutize(p)); const d = fs.current[p]; if (d) for (const it of d) walk(p === "~" ? "~/" + it.name : p + "/" + it.name); }; walk(resolveVPath(st.cwd, a[0] ?? ".")); },
    grep: (a, w, e, st) => { if (a.length < 2) { e("usage: grep pattern file"); return; } const re = new RegExp(a[0], "i"); for (const t of a.slice(1)) { const it = fsGetItem(fs.current, resolveVPath(st.cwd, t)); (it?.content ?? "").split("\n").forEach((l) => { if (re.test(l)) w(l); }); } },
    tree: (a, w, _e, st) => { const p = resolveVPath(st.cwd, a[0] ?? "."); w(a[0] ?? "."); const rec = (path: string, pre: string) => { const d = fs.current[path] ?? []; d.forEach((it, i) => { const last = i === d.length - 1; w(pre + (last ? "└── " : "├── ") + it.name); if (it.kind === "folder") rec(path === "~" ? "~/" + it.name : path + "/" + it.name, pre + (last ? "    " : "│   ")); }); }; rec(p, ""); },
    open: (a, w, e, st) => {
      const name = a[0]; if (!name) { e("usage: open <file>"); return; }
      const it = fsGetItem(fs.current, resolveVPath(st.cwd, name));
      if (!it) { e(`open: ${name}: No such file or directory`); return; }
      const E = it.ext?.toUpperCase();
      if (E === "PDF" && PUBLIC_PDFS.has(it.name)) { os.open("pdf", { src: "/" + it.name, title: it.name }); w(`opening ${it.name} in PDF viewer…`); return; }
      if (E === "PDF") { w(`${it.name}: sealed document — viewer preview unavailable offline`); return; }
      if (IMG_EXTS.includes(E ?? "")) { os.open("quicklook", { item: it, dir: st.cwd }); w(`opening ${it.name}…`); return; }
      if (E === "MP4") { os.open("media"); w("opening Media…"); return; }
      e(`open: no handler for ${name}`);
    },
    echo: (a, w, _e, st) => w(expandEnv(a.join(" "), st.env)),
    which: (a, w) => a.forEach((n) => w(`/usr/bin/${n}`)),
    whoami: (_a, w) => w(SHELL_USER),
    hostname: (_a, w) => w("MacBook-Pro.local"),
    date: (_a, w) => w(new Date().toString()),
    uname: (a, w) => w(a.includes("-a") ? "Darwin MacBook-Pro.local 24.0.0 RELEASE_ARM64_T6000 arm64" : "Darwin"),
    env: (_a, w, _e, st) => Object.entries(st.env).forEach(([k, v]) => w(`${k}=${v}`)),
    history: (_a, w, _e, st) => st.history.slice().reverse().forEach((h, i) => w(`${String(i + 1).padStart(4, " ")}  ${h}`)),
    alias: (a, w, _e, st) => { if (!a.length) Object.entries(st.aliases).forEach(([k, v]) => w(`alias ${k}='${v}'`)); else { const m = a.join(" ").match(/^([^=]+)=(.*)$/); if (m) st.aliases[m[1].trim()] = m[2].replace(/^['"]|['"]$/g, ""); } },
    clear: () => setLines([]),
    exit: () => os.close(winId),
    man: (a, w) => w(a[0] && MANPAGES[a[0]] ? MANPAGES[a[0]] : `No manual entry for ${a[0] ?? "?"}`),
    neofetch: (_a, w) => ["weko@MacBook-Pro", "─────────────────────────", "OS: macOS Sequoia 15.2 arm64", "Host: MacBook Pro (M4 Max)", "Shell: zsh 5.9", "Terminal: WeKO Infinite Console ∞", "CPU: Apple M4 Max (16) @ 4.5GHz", "Memory: 42Gi / 128Gi"].forEach((l) => w(l)),
    help: (a, w) => { ["WEKO INFINITE CONSOLE", "  UNIX: cd ls cat mkdir touch rm find grep tree echo which whoami date uname env history alias clear man neofetch open exit", "  KOICA: status about map countries offices sectors regions programs org budget goals history", "  CASE:  country <n> projects <n> evidence <n> sources <n> impact <n> timeline <n> compare <a> <b> trace <n> network <n> search <q> live", "  PDF:   open koica.pdf · open koica_brochure.pdf", "  EXAMPLES: country Rwanda · budget · history · search agriculture"].forEach((l) => w(l)); },
  }), [fmtLong, os, winId]);

  const INVESTIGATION = useMemo<Record<string, (a: string[]) => Promise<void>>>(() => ({
    status: async () => {
      await aDots("loading case index"); await aDots("loading country registry"); await aDots("syncing Seongnam HQ");
      printT(""); head("KOICA INVESTIGATION CONSOLE — INFINITE EDITION");
      kv("SYSTEM", "ONLINE", "text-emerald-400"); kv("CASE", "WEKO-08", "text-cyan-300");
      kv("BUDGET 2026", "₩1.5322 TRILLION", "text-amber-300"); kv("ODA SHARE", KOICA.odaShare, "text-sky-300");
      kv("GRANT SHARE", KOICA.grantShare, "text-sky-300"); kv("COUNTRIES", `${CORE.length} CORE PARTNERS`, "text-zinc-100");
      kv("OFFICES", "48 COUNTRIES · 49 OFFICES", "text-sky-300"); kv("PDF LIBRARY", "koica.pdf · koica_brochure.pdf", "text-amber-300");
      kv("LAST SYNC", new Date().toLocaleTimeString("en-GB"), "text-zinc-300");
      print({ k: "rule" }); printT("READY FOR INVESTIGATION", "text-zinc-100");
      next(["map", "countries", "country Rwanda", "org", "history"]);
    },
    about: async () => { head("WEKO INFINITE INVESTIGATION CONSOLE"); printT("A command-line exploration of KOICA's", "text-zinc-300"); printT("global development cooperation.", "text-zinc-300"); kv("VERSION", "∞ (Infinite Premium)", "text-cyan-300"); kv("GEOGRAPHY", "NATURAL EARTH 110m", "text-sky-300"); next(["status", "map"]); },
    map: async () => { await aSpin("Loading geographic registry"); head("KOICA GLOBAL PRESENCE"); print({ k: "jsx", node: <TermWorldMap inputRef={inpRef} onOpen={(n) => runRef.current(`country ${n}`)} /> }); next(["countries", "offices", "country Rwanda"]); },
    countries: async () => {
      await aDots("reading partner registry"); head("KOICA PARTNER COUNTRIES");
      ["Asia", "Africa", "Eurasia", "Americas"].forEach((r) => {
        const list = CORE.filter((c) => c.region === r);
        printT(`${r.toUpperCase().padEnd(28, " ")}${list.length}`, "text-zinc-100 font-bold");
        printT("────────────────────────────────", "text-zinc-600");
        list.forEach((c) => printT(c.name, "text-zinc-300")); printT("");
      });
      print({ k: "rule" }); printT(`TOTAL                         ${CORE.length} CORE PARTNERS`, "text-zinc-100");
      next(["offices", "country Rwanda", "country Nepal"]);
    },
    offices: async () => {
      await aDots("reading office registry"); head("KOICA OVERSEAS OFFICES");
      printT("REGION              COUNTRIES    OFFICES", "text-zinc-500");
      KOICA.officeRegions.forEach(([r, c, o]) => printT(`${r.padEnd(20, " ")}${String(c).padStart(5, " ")}${String(o).padStart(11, " ")}`, "text-zinc-300"));
      print({ k: "rule" }); printT("TOTAL                   48         49 (+1 branch)", "text-zinc-100");
      printT(""); printT("REPRESENTATIVE POSTS", "text-zinc-100 font-bold");
      KOICA.reps.forEach(([city, role]) => printT(`  ${city.padEnd(12, " ")}${role}`, "text-sky-300"));
      next(["countries", "map"]);
    },
    partners: async () => INVESTIGATION.countries([]),
    sectors: async () => { await aDots("reading sector allocation"); head("KOICA PRIORITY SECTORS (2026)"); KOICA.sectors.forEach(([n, p]) => print({ k: "bar", label: n.slice(0, 21), c: String(p), s: "text-sky-300" })); next(["regions", "programs"]); },
    regions: async () => { head("KOICA REGIONAL ALLOCATION"); KOICA.regions.forEach(([n, p]) => print({ k: "bar", label: n.slice(0, 21), c: String(p), s: "text-emerald-300" })); printT(""); KOICA.income.forEach(([n, p]) => print({ k: "bar", label: n.slice(0, 21), c: String(p), s: "text-amber-300" })); next(["sectors"]); },
    programs: async () => { await aDots("reading program modalities"); head("KOICA PROGRAM MODALITIES"); KOICA.programs.forEach(([n, d], i) => { printT(`${String(i + 1).padStart(2, "0")}  ${n}`, "text-zinc-100 font-bold"); printT(`    ${d}`, "text-zinc-400"); printT(""); }); next(["country Rwanda", "sectors"]); },
    org: async () => { head("KOICA ORGANIZATION"); kv("PRESIDENT", KOICA.president, "text-amber-300"); kv("ESTABLISHED", "April 1, 1991", "text-zinc-100"); kv("HQ", "Seongnam, South Korea", "text-sky-300"); kv("DIRECTORATES", `${KOICA.org.directorships} executive · ${KOICA.org.seniorDirectorships} senior`, "text-zinc-100"); kv("DEPARTMENTS", String(KOICA.org.departments), "text-zinc-100"); kv("TEAMS", String(KOICA.org.teams), "text-zinc-100"); printT(""); printT("MISSION", "text-zinc-100 font-bold"); printT(KOICA.mission, "text-fuchsia-300"); next(["budget", "goals"]); },
    budget: async () => { await aDots("reading budget ledger"); head("KOICA SUPPORT BUDGET (KRW trillion)"); KOICA.budget.forEach(([y, v]) => print({ k: "bar", label: String(y), c: String((v / 1.5322) * 100), s: "text-amber-300" })); print({ k: "rule" }); printT("₩17.4B (1991) → ₩1.5322T (2026) — an 88× expansion.", "text-zinc-300"); next(["org", "sectors"]); },
    goals: async () => { head("KOICA STRATEGIC GOALS (2022-2026)"); KOICA.goals.forEach(([n, d]) => { printT(`◆ ${n}`, "text-zinc-100 font-bold"); printT(`  ${d}`, "text-zinc-400"); printT(""); }); next(["org"]); },
    history: async () => { await aDots("reading historical archive"); head("KOICA HISTORY 1991 → 2026"); for (const h of HISTORY) { printT(`${h.year}  [${h.era}]`, h.hl ? "text-amber-300 font-bold" : "text-sky-300"); printT(`  • ${h.text}`, "text-zinc-300"); await wait(110); } print({ k: "rule" }); printT("35 YEARS OF LEAVING NO ONE BEHIND", "text-emerald-300"); next(["org", "budget"]); },
    country: async (a) => {
      if (a[0] === "map") { const c = resolveCountryArg(a.slice(1)); if (!c) { printT(`country not found: ${a.slice(1).join(" ")}`, "text-red-400"); return; } await aSpin(`Loading ${c.name} boundary`); head(`${c.name.toUpperCase()} / GEOGRAPHY`); print({ k: "jsx", node: <TermCountryMap c={c} /> }); next([`projects ${c.name}`]); return; }
      const c = resolveCountryArg(a);
      if (!c) { printT(`country not found: ${a.join(" ") || "(none)"}`, "text-red-400"); printT("try: countries", "text-zinc-500"); return; }
      printT(`Country found — ${c.name}`, "text-zinc-300"); printT(`Office found — ${c.city}`, "text-zinc-300"); await wait(200);
      printT(""); head(c.name.toUpperCase()); print({ k: "jsx", node: <TermCountryMap c={c} /> });
      printT(""); printT("PARTNERSHIP", "text-zinc-100 font-bold");
      kv("Office", c.city, "text-sky-300"); kv("Core partner", c.core ? "YES" : "NO — office country", c.core ? "text-emerald-400" : "text-amber-300");
      kv("Region", c.region, "text-zinc-100"); kv("Projects", String(c.projects.length), "text-amber-300"); kv("Evidence", `${c.ev[2]} references`, "text-amber-300");
      printT(""); c.sectors.forEach((s, i) => print({ k: "bar", label: s.slice(0, 21), c: String(90 - i * 18), s: "text-sky-300" }));
      printT(""); printT(`"${c.story}"`, "text-fuchsia-300");
      next([`projects ${c.name}`, `impact ${c.name}`, `timeline ${c.name}`, `evidence ${c.name}`]);
    },
    projects: async (a) => { const c = resolveCountryArg(a); if (!c) { printT("usage: projects <country>", "text-red-400"); return; } await aDots(`reading project index — ${c.name}`); head(`${c.name.toUpperCase()} / PROJECTS`); c.projects.forEach((p, i) => { printT(`${String(i + 1).padStart(2, "0")}  ${p[1].toUpperCase()}`, "text-zinc-100 font-bold"); printT(`    ${p[0]}`, "text-zinc-300"); printT(`    STATUS     ${p[4] === "ACTIVE" ? "● ACTIVE" : "● COMPLETED"}   PERIOD  ${p[2]}`, p[4] === "ACTIVE" ? "text-emerald-400" : "text-zinc-500"); printT(`    VALUE      ${p[3]}`, "text-amber-300"); printT(""); }); print({ k: "rule" }); printT(`${c.projects.length} PROJECTS FOUND`, "text-zinc-100"); next([`impact ${c.name}`, `evidence ${c.name}`]); },
    evidence: async (a) => { const c = resolveCountryArg(a); if (!c) { printT("usage: evidence <country>", "text-red-400"); return; } await aSpin(`indexing evidence — ${c.name}`); head(`EVIDENCE INDEX / ${c.name.toUpperCase()}`); kv("IMAGES", String(c.ev[0]), "text-amber-300"); kv("REPORTS", String(c.ev[1]), "text-amber-300"); kv("REFERENCES", String(c.ev[2]), "text-cyan-300"); kv("PARTNER RECORDS", String(c.ev[3]), "text-zinc-100"); kv("CONFIDENCE", "● HIGH", "text-emerald-400"); next([`sources ${c.name}`, `impact ${c.name}`]); },
    sources: async (a) => { const c = resolveCountryArg(a); if (!c) { printT("usage: sources <country>", "text-red-400"); return; } head(`SOURCES / ${c.name.toUpperCase()}`); [["KOICA registry", "VERIFIED"], ["Partner government gazette", "VERIFIED"], ["UN data", "VERIFIED"], ["World Bank indicators", "VERIFIED"], ["Field survey (WeKO)", "REVIEW"]].forEach(([s, st]) => printT(`  ${s.padEnd(32, " ")}${st === "VERIFIED" ? "● VERIFIED" : "● REVIEW"}`, st === "VERIFIED" ? "text-emerald-400" : "text-amber-300")); next([`evidence ${c.name}`]); },
    impact: async (a) => { const c = resolveCountryArg(a); if (!c) { printT("usage: impact <country>", "text-red-400"); return; } printT("Tracing project → beneficiaries → outcomes…", "text-zinc-500"); await wait(400); printT(""); head(`${c.name.toUpperCase()} / IMPACT TRACE`); ["INVESTMENT", "PROJECT", "BENEFICIARIES", "OUTCOME", "COMMUNITY"].forEach((s, i, arr) => { printT(`   ${s}`, "text-zinc-100"); if (i < arr.length - 1) { printT("       │", "text-zinc-600"); printT("       ▼", "text-zinc-600"); } }); printT(""); print({ k: "bar", label: c.impact[0], c: String(c.impact[2]), s: "text-emerald-400" }); printT(c.impact[1], "text-zinc-300"); print({ k: "rule" }); printT("● IMPACT EVIDENCE CONNECTED", "text-emerald-400"); next([`trace ${c.name}`, `compare ${c.name} Nepal`]); },
    timeline: async (a) => { const c = resolveCountryArg(a); if (!c) { printT("usage: timeline <country>", "text-red-400"); return; } head(`${c.name.toUpperCase()} / DEVELOPMENT TIMELINE`); for (const [y, e] of c.timeline) { printT(String(y), "text-amber-300"); printT(` │  ● ${e}`, "text-zinc-300"); await wait(160); } print({ k: "rule" }); printT("TIMELINE COMPLETE", "text-zinc-100"); next([`impact ${c.name}`]); },
    compare: async (a) => { const mid = Math.max(1, Math.floor(a.length / 2)); const c1 = resolveCountryArg(a.slice(0, mid)) ?? CORE[0]; const c2 = resolveCountryArg(a.slice(mid)) ?? CORE[1]; await aDots(`aligning ${c1.name} and ${c2.name}`); head("COUNTRY COMPARISON"); printT(`${"".padEnd(25, " ")}${c1.name.toUpperCase().padEnd(18, " ")}${c2.name.toUpperCase()}`, "text-zinc-100 font-bold"); print({ k: "rule" }); const row = (k: string, v1: string, v2: string, c = "text-zinc-300") => printT(`${k.padEnd(25, " ")}${v1.padEnd(18, " ")}${v2}`, c); row("REGION", c1.region, c2.region); row("OFFICE", c1.city, c2.city); row("PROJECTS", String(c1.projects.length), String(c2.projects.length)); row("EVIDENCE", String(c1.ev[2]), String(c2.ev[2])); row("STATUS", "● ACTIVE", "● ACTIVE", "text-emerald-400"); next([`trace ${c1.name}`, "live"]); },
    trace: async (a) => { const c = resolveCountryArg(a); if (!c) { printT("usage: trace <country>", "text-red-400"); return; } await aSpin(`tracing network — ${c.name}`); head(`TRACE / ${c.name.toUpperCase()}`); printT("KOICA", "text-zinc-100 font-bold"); printT("  │", "text-zinc-600"); printT(`  ├── ${c.city} Office`, "text-sky-300"); c.sectors.forEach((s, i) => { const last = i === c.sectors.length - 1; printT(`  ${last ? "└" : "├"}── ${s}`, "text-zinc-300"); printT(`  ${last ? " " : "│"}      └── beneficiaries`, "text-emerald-400"); }); printT(""); printT("              ↓", "text-zinc-600"); printT("           IMPACT", "text-emerald-400 font-bold"); print({ k: "rule" }); printT(`● 1 COUNTRY  ● 1 OFFICE  ● ${c.sectors.length} SECTORS  ● ${c.projects.length} PROJECTS`, "text-zinc-300"); next([`impact ${c.name}`, `network ${c.name}`]); },
    network: async (a) => { const c = resolveCountryArg(a); if (!c) { printT("usage: network <country>", "text-red-400"); return; } head(`NETWORK / ${c.name.toUpperCase()}`); printT("HQ Seongnam — South Korea", "text-pink-300"); printT(`  └── ${c.city} Office (${c.name})`, "text-sky-300"); REG.filter((x) => x.region === c.region && x.name !== c.name).slice(0, 5).forEach((x) => printT(`        ├── ${x.name} — ${x.city}`, "text-zinc-400")); next([`trace ${c.name}`, "map"]); },
    search: async (a) => { const q = a.join(" ").toLowerCase(); if (!q) { printT("usage: search <term>", "text-red-400"); return; } await aDots("searching indexes"); head(`SEARCH: ${q}`); let n = 0; REG.forEach((c) => { const hits = c.projects.filter((p) => (p[0] + p[1]).toLowerCase().includes(q)); const sec = c.sectors.filter((s) => s.toLowerCase().includes(q)); if (hits.length || sec.length || c.name.toLowerCase().includes(q)) { printT(c.name.toUpperCase(), "text-zinc-100 font-bold"); hits.forEach((p) => printT(`  ${p[0]}`, "text-zinc-400")); if (!hits.length) printT(`  sector match: ${sec.join(", ") || q}`, "text-zinc-400"); printT(""); n++; } }); print({ k: "rule" }); printT(`${n} COUNTRIES MATCHED`, "text-zinc-100"); next(["country Rwanda", "sectors"]); },
    live: async () => { liveOn.current = true; head("CONNECTING TO ACTIVITY FEED"); const ev: [string, string, string][] = [["RWANDA", "Agriculture market reach increased", "text-emerald-400"], ["NEPAL", "Health program milestone detected", "text-emerald-400"], ["GHANA", "1.04M residents reached with primary care", "text-emerald-400"], ["VIETNAM", "V-KIST publication indexed", "text-emerald-400"], ["FIJI", "Agrophotovoltaic output above forecast", "text-emerald-400"], ["UZBEKISTAN", "Digital forensics experts certified", "text-emerald-400"], ["UKRAINE", "Reconstruction coordination logged", "text-amber-300"]]; for (const [c, m, col] of ev) { if (!liveOn.current) break; printT(`${new Date().toLocaleTimeString("en-GB")}  ● ${c}\n  ${m}`, col); await wait(620); } print({ k: "rule" }); printT("LIVE FEED  ● CONNECTED   (type q then Enter to detach)", "text-emerald-400"); },
  }), [print, printT, head, next, kv, aDots, aSpin]);

  const execOne = useCallback(async (text: string, state: ShellState): Promise<number> => {
    const { text: cmdText, redirect } = splitRedirect(text);
    const tokens = tokenize(cmdText); if (!tokens.length) return 0;
    let cmd = tokens[0]; let args = tokens.slice(1);
    if (state.aliases[cmd]) { const ex = tokenize(state.aliases[cmd]); cmd = ex[0]; args = [...ex.slice(1), ...args]; }
    args = args.map((a) => expandEnv(a, state.env));
    let captured = "";
    const w: WriteFn = redirect ? (s) => { captured += s + "\n"; } : (s, cls) => print({ k: "t", s, c: cls ?? "text-zinc-200" });
    const e: WriteFn = (s) => print({ k: "t", s, c: "text-red-400" });
    const unixFn = UNIX[cmd];
    if (unixFn) unixFn(args, w, e, state);
    else { const inv = INVESTIGATION[cmd]; if (inv) await inv(args); else { e(`zsh: command not found: ${cmd}`); return 127; } }
    if (redirect) fsWrite(fs.current, resolveVPath(state.cwd, redirect.file), captured, redirect.append);
    return 0;
  }, [UNIX, INVESTIGATION, print]);

  const run = useCallback(async (raw: string) => {
    const trimmed = raw.trim(); if (!trimmed) return;
    if (liveOn.current && trimmed === "q") { liveOn.current = false; printT("feed detached.", "text-zinc-500"); return; }
    hist.current.unshift(trimmed); setHistIdx(-1); echoPrompt(trimmed);
    const state: ShellState = { fs: fs.current, cwd, env: env.current, aliases: aliases.current, history: hist.current };
    const segments = splitChain(trimmed); let last = 0;
    for (const seg of segments) {
      if (seg.op === "&&" && last !== 0) continue;
      if (seg.op === "||" && last === 0) continue;
      last = await execOne(seg.text, state);
      if (state.cwd !== cwd) setCwd(state.cwd);
    }
  }, [cwd, execOne, echoPrompt, printT]);
  useEffect(() => { runRef.current = run; }, [run]);
  useEffect(() => {
    (async () => {
      print({ k: "jsx", node: (<div className="jb text-[12px] leading-[1.5] text-zinc-400"><p>Last login: {new Date().toDateString()} on ttys000</p></div>) });
      if (initialCmd) { await wait(200); await run(initialCmd); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { const el = boxRef.current; if (el) el.scrollTop = el.scrollHeight; }, [lines]);
  const complete = useCallback(() => {
    const parts = val.split(/\s+/); const last = parts[parts.length - 1];
    if (parts.length === 1) { const hit = [...Object.keys(UNIX), ...Object.keys(INVESTIGATION)].sort().find((c) => c.startsWith(last) && c !== last); if (hit) setVal(hit + " "); }
  }, [val, UNIX, INVESTIGATION]);
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { const v = val; setVal(""); run(v); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(hist.current.length - 1, histIdx + 1); setHistIdx(i); setVal(hist.current[i] ?? ""); }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(-1, histIdx - 1); setHistIdx(i); setVal(i === -1 ? "" : hist.current[i]); }
    else if (e.key === "Tab") { e.preventDefault(); complete(); }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
    else if (e.key === "c" && e.ctrlKey) { e.preventDefault(); printT("^C", "text-zinc-500"); setVal(""); }
  };
  return (
    <div ref={boxRef} onClick={() => inpRef.current?.focus()} className="term-scroll h-full overflow-y-auto bg-[#05070c] p-3 sm:p-4 cursor-text">
      {lines.map((o, i) => <OutLine key={i} o={o} onCmd={(c) => run(c)} />)}
      <div className="jb text-[12px] leading-[1.55] mt-2">
        <div><span className="text-zinc-500">─ </span><span className="text-emerald-400">weko@koica</span> <span className="text-sky-300">{cwd}</span></div>
        <div className="flex"><span className="text-zinc-500">└─ </span><span className="text-zinc-400 mr-1">%</span>
          <input ref={inpRef} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onKey} autoFocus spellCheck={false}
            className="ml-1 flex-1 bg-transparent text-zinc-100 outline-none align-bottom" style={{ caretColor: "#67e8f9" }} /></div>
      </div>
    </div>
  );
}

/* ── 17. FINDER — SINGLE-CLICK · folderog sidebar · doc icons ────────────────── */
function FinderApp({ path: initialPath }: { path?: string }) {
  const os = useOS();
  const [path, setPath] = useState(initialPath && FS[initialPath] ? initialPath : "~/Documents");
  const [stack, setStack] = useState<string[]>([]); const [fwd, setFwd] = useState<string[]>([]);
  const [q, setQ] = useState(""); const [view, setView] = useState<"grid" | "list">("grid");
  const items = (FS[path] ?? []).filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));
  const nav = (p: string) => { setStack((s) => [...s, path]); setFwd([]); setPath(p); };
  const back = () => setStack((s) => { if (!s.length) return s; setFwd((f) => [...f, path]); const n = [...s]; setPath(n.pop()!); return n; });
  const fwdNav = () => setFwd((f) => { if (!f.length) return f; setStack((s) => [...s, path]); const n = [...f]; setPath(n.pop()!); return n; });
  const openItem = (i: FSItem) => {
    if (i.kind === "folder") { nav(resolveVPath(path, i.name)); return; }
    const E = i.ext?.toUpperCase();
    if (E === "PDF") { os.open("pdf", { src: "/" + i.name, title: i.name }); return; }
    os.open("quicklook", { item: i, dir: path });
  };
  const SIDEBAR: [string, string][] = [["Home", "~"], ["Documents", "~/Documents"], ["Movies", "~/Movies"], ["Pictures", "~/Pictures"], ["Case File", "~/cases/WEKO-08"], ["Projects", "~/projects"]];
  return (
    <div className="flex h-full">
      <div className="hidden md:flex w-48 shrink-0 flex-col gap-0.5 overflow-y-auto p-2.5 border-r border-white/5 bg-zinc-900/70 chrome">
        <p className="px-2 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Favorites</p>
        {SIDEBAR.map(([label, p]) => (
          <motion.button key={label} whileTap={{ scale: 0.97 }} onClick={() => nav(p)}
            className={cx("relative flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors", path === p ? "text-white" : "text-zinc-300 hover:bg-white/5")}>
            {path === p && <motion.span layoutId="sidepill" transition={SPRING_POP} className="absolute inset-0 rounded-lg bg-white/12 ring-1 ring-white/10 shimmer" />}
            <motion.span whileHover={{ scale: 1.15, rotate: -3 }} transition={ELASTIC_ICON} className="relative"><FolderIcon size={18} /></motion.span>
            <span className="relative font-medium">{label}</span>
          </motion.button>))}
        <div className="mt-3 px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tags</div>
        {[["Active case", "bg-emerald-400"], ["Review", "bg-amber-400"], ["Archive", "bg-zinc-400"]].map(([t, c]) => (
          <div key={t} className="flex items-center gap-2.5 px-2 py-1 text-[12px] text-zinc-400"><span className={cx("size-2.5 rounded-full", c)} />{t}</div>))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2 bg-zinc-800/60 chrome">
          <motion.button whileTap={{ scale: 0.85 }} onClick={back} disabled={!stack.length} className="rounded p-1 text-zinc-300 hover:bg-white/10 disabled:opacity-30"><L.ArrowLeft className="size-4" /></motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={fwdNav} disabled={!fwd.length} className="rounded p-1 text-zinc-300 hover:bg-white/10 disabled:opacity-30"><L.ArrowRight className="size-4" /></motion.button>
          <div className="ml-1 flex items-center gap-1.5 min-w-0"><FolderIcon size={16} /><p className="text-[13px] font-semibold text-zinc-200 truncate">{path.split("/").pop() || "Home"}</p></div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1"><L.Search className="size-3.5 text-zinc-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-20 sm:w-28 bg-transparent text-[12px] text-zinc-200 outline-none" /></div>
            <div className="flex overflow-hidden rounded-md bg-white/5">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setView("grid")} className={cx("px-2 py-1", view === "grid" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-zinc-200")}><L.LayoutGrid className="size-3.5" /></motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setView("list")} className={cx("px-2 py-1", view === "list" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-zinc-200")}><L.List className="size-3.5" /></motion.button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <AnimatePresence mode="popLayout">
            {view === "grid" ? (
              <motion.div key="grid" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={SPRING_SOFT}
                className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-3 sm:gap-4 content-start">
                {items.map((i, ix) => (
                  <motion.button key={i.name} layout initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ ...SPRING_POP, delay: ix * 0.03 }}
                    whileHover={{ y: -6, scale: 1.05, rotate: i.kind === "folder" ? -1.5 : 1 }} whileTap={{ scale: 0.93 }}
                    onClick={() => openItem(i)}
                    className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 hover:bg-white/5 ring-sky-400/40 hover:ring-1 transition">
                    {i.kind === "folder" ? <FolderIcon size={54} className="drop-shadow-[0_8px_14px_rgba(0,0,0,.45)]" /> : <DocIcon ext={i.ext} size={46} />}
                    <p className="max-w-full truncate text-[12px] text-zinc-200">{i.name}</p>
                    <p className="text-[10px] text-zinc-500">{i.size ?? (i.mtime ? fmtLsDate(i.mtime) : "")}</p>
                  </motion.button>))}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={SPRING_SOFT} className="flex flex-col">
                <div className="grid grid-cols-[1fr_90px_110px] gap-2 border-b border-white/5 px-2 pb-1.5 text-[11px] font-semibold text-zinc-500 chrome"><span>Name</span><span>Size</span><span>Modified</span></div>
                {items.map((i, ix) => (
                  <motion.button key={i.name} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING_SOFT, delay: ix * 0.02 }}
                    whileTap={{ scale: 0.99 }} onClick={() => openItem(i)}
                    className="grid grid-cols-[1fr_90px_110px] gap-2 items-center rounded-lg px-2 py-1.5 text-left hover:bg-white/5">
                    <span className="flex items-center gap-2.5 min-w-0">{i.kind === "folder" ? <FolderIcon size={20} /> : <DocIcon ext={i.ext} size={18} />}<span className="truncate text-[12.5px] text-zinc-200">{i.name}</span></span>
                    <span className="text-[11px] text-zinc-500">{i.size ?? "—"}</span>
                    <span className="text-[11px] text-zinc-500">{i.mtime ? fmtLsDate(i.mtime) : "—"}</span>
                  </motion.button>))}
              </motion.div>
            )}
          </AnimatePresence>
          {items.length === 0 && <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-600"><FolderIcon size={64} className="opacity-40" /><p className="text-sm">Folder is empty</p></div>}
        </div>
        <div className="flex items-center justify-between border-t border-white/5 px-3 py-1.5 text-[11px] text-zinc-500 chrome">
          <span>{items.length} item{items.length === 1 ? "" : "s"} · single-click opens</span>
          <span className="flex items-center gap-1.5"><FolderIcon size={12} /> {path}</span>
        </div>
      </div>
    </div>
  );
}

/* ── 18. PDF VIEWER APP ──────────────────────────────────────────────────────── */
function PdfApp({ src, title }: { src: string; title: string }) {
  const os = useOS();
  const name = (src ?? "/koica.pdf").split("/").pop() ?? "koica.pdf";
  const isPublic = PUBLIC_PDFS.has(name);
  return (
    <div className="flex h-full flex-col bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-800/80 px-3 py-2 chrome">
        <DocIcon ext="PDF" size={18} />
        <p className="text-[12px] font-semibold text-zinc-200 truncate">{title ?? name}</p>
        <span className={cx("ml-1 rounded-full px-2 py-0.5 text-[9px] font-bold", isPublic ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300")}>{isPublic ? "LIVE DOC" : "SEALED"}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <a href={src} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] text-zinc-200 hover:bg-white/20"><L.ExternalLink className="size-3" /> New Tab</a>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => os.notify("PDF", `${name} saved to Downloads`)} className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] text-zinc-200 hover:bg-white/20"><L.Download className="size-3" /> Save</motion.button>
        </div>
      </div>
      {isPublic ? (
        <motion.iframe key={src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          src={src} title={name} className="flex-1 w-full bg-white" />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={ELASTIC_ICON}><DocIcon ext="PDF" size={110} /></motion.div>
          <p className="text-sm font-bold text-zinc-200">{name}</p>
          <p className="max-w-sm text-[12px] text-zinc-500">This document is sealed in the case archive. Live rendering is available for <span className="text-zinc-300">koica.pdf</span> and <span className="text-zinc-300">koica_brochure.pdf</span>.</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => os.open("pdf", { src: "/koica_brochure.pdf", title: "koica_brochure.pdf" })}
            className="rounded-full bg-sky-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-sky-500">Open KOICA Brochure instead</motion.button>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-white/5 px-4 py-1.5 text-[10px] text-zinc-500 chrome">
        <span className="truncate">public/{name}</span>
        <span className="flex items-center gap-1 text-emerald-400"><L.CheckCircle2 className="size-3" /> source verified</span>
      </div>
    </div>
  );
}

/* ── 19. QUICK LOOK ──────────────────────────────────────────────────────────── */
function QuickLookApp({ item, dir }: { item: FSItem; dir: string }) {
  const os = useOS();
  const E = item.ext?.toUpperCase();
  const isVideo = E === "MP4" || E === "MOV";
  const isImg = E === "WEBP" || IMG_EXTS.includes(E ?? "");
  if (E === "PDF") return <PdfApp src={"/" + item.name} title={item.name} />;
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-zinc-950">
        <motion.div initial={{ scale: 0.9, opacity: 0, filter: "blur(8px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} transition={SPRING_POP} className="flex flex-col items-center gap-4">
          {isVideo ? <video src={item.name.includes("koica") ? KOICA_VIDEO : undefined} controls className="max-h-[60vh] max-w-full rounded-lg" /> :
            isImg ? <img src={item.name.endsWith(".webp") ? `/${item.name}` : "/image.webp"} alt={item.name} className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl" /> :
              <div className="flex flex-col items-center gap-4">
                <DocIcon ext={item.ext} size={110} />
                <div className="jb selectable max-w-lg rounded-lg bg-black/40 p-5 text-sm text-zinc-400">
                  <p className="mb-2 font-bold text-zinc-200">{item.name}</p>
                  <p className="whitespace-pre-wrap">{item.content ?? "(no preview available for this file type)"}</p>
                </div>
              </div>}
        </motion.div>
      </div>
      <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[11px] text-zinc-500 chrome">
        <span className="truncate">{dir}/{item.name}</span>
        <span className="flex items-center gap-2 shrink-0">
          {E === "PDF" && <button onClick={() => os.open("pdf", { src: "/" + item.name, title: item.name })} className="text-sky-400 hover:text-sky-300">Open in PDF viewer</button>}
          <span className="flex items-center gap-1 text-emerald-400"><L.CheckCircle2 className="size-3" /> verified</span>
        </span>
      </div>
    </div>
  );
}

/* ── 20. PHOTOS / MEDIA ──────────────────────────────────────────────────────── */
function PhotosApp() {
  const os = useOS();
  const shots = ["/koica.webp", "/koica1.webp", "/koica2.webp", "/koica3.webp", "/koica4.webp", "/koica5.webp", "/koica6.webp"];
  return (
    <div className="h-full overflow-y-auto p-4 bg-zinc-950">
      <p className="mb-3 text-[13px] font-semibold text-zinc-200 chrome">KOICA Field Gallery · local assets</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {shots.map((s, i) => (
          <motion.button key={s} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...SPRING_POP, delay: i * 0.05 }}
            whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.96 }}
            onClick={() => os.open("quicklook", { item: { name: s.split("/").pop()!, kind: "file", ext: "WEBP", size: "—" }, dir: "~/Pictures" })}
            className="relative h-24 sm:h-28 overflow-hidden rounded-xl ring-1 ring-white/10 chrome">
            <img src={s} alt={s} className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 py-1 text-left text-[10px] font-semibold text-white truncate">{s.split("/").pop()}</span>
          </motion.button>))}
      </div>
    </div>
  );
}
function MediaApp() {
  const vid = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false); const [t, setT] = useState(0); const [dur, setDur] = useState(0); const [vol, setVol] = useState(0.8);
  const toggle = () => { const v = vid.current; if (!v) return; if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); } };
  return (
    <div className="flex h-full flex-col bg-black">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-zinc-900 chrome">
        <L.Film className="size-4 text-pink-400" /><p className="text-[12px] font-semibold text-zinc-200 truncate">KOICA Promo — official video</p>
        <a href={KOICA_VIDEO} target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] text-zinc-200 hover:bg-white/20 whitespace-nowrap"><L.Download className="size-3" /> Save</a>
      </div>
      <div className="relative flex-1 bg-black flex items-center justify-center">
        <video ref={vid} src={KOICA_VIDEO} controls={false} className="max-h-full max-w-full" onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onEnded={() => setPlaying(false)} />
        <AnimatePresence>{!playing && (
          <motion.button initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={SPRING_POP}
            onClick={toggle} className="absolute grid size-16 place-items-center rounded-full bg-white/15 backdrop-blur hover:bg-white/25"><L.Play className="size-7 text-white ml-1" fill="white" /></motion.button>)}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 bg-zinc-900 border-t border-white/10 chrome">
        <motion.button whileTap={{ scale: 0.85 }} onClick={toggle} className="text-zinc-200 hover:text-white">{playing ? <L.Pause className="size-4" /> : <L.Play className="size-4" />}</motion.button>
        <input type="range" min={0} max={dur || 100} step={0.1} value={t} onChange={(e) => { const v = vid.current; if (v) v.currentTime = +e.target.value; }} className="mac flex-1" />
        <span className="jb text-[10px] text-zinc-400 whitespace-nowrap">{Math.floor(t / 60)}:{String(Math.floor(t % 60)).padStart(2, "0")} / {Math.floor(dur / 60)}:{String(Math.floor(dur % 60)).padStart(2, "0")}</span>
        <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => { setVol(+e.target.value); if (vid.current) vid.current.volume = +e.target.value; }} className="mac hidden sm:block w-20" />
      </div>
    </div>
  );
}

/* ── 21. ATLAS / SAFARI / MESSAGES / CODE / SETTINGS / UTILS ─────────────────── */
function AtlasApp() {
  const [geo, setGeo] = useState<any>(null); const [hover, setHover] = useState<any>(null); const [sel, setSel] = useState<Country | null>(null);
  useEffect(() => { loadWorld().then((f) => f && setGeo(buildPaths(f))); }, []);
  return (
    <div className="flex h-full flex-col bg-[#020408]">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-cyan-500/15 bg-[#0a0f1c] px-4 chrome">
        <p className="jb text-[10px] tracking-[0.25em] text-cyan-300 truncate">✦ OMNISCIENT ATLAS</p>
        <p className="jb text-[10px] text-[#5a7a9a] hidden sm:block">{CORE.length} core · 49 offices · 5 representative posts</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="relative min-w-0 flex-1 grid-pattern min-h-[200px]">
          {!geo && <div className="absolute inset-0 flex items-center justify-center"><p className="jb text-[11px] text-zinc-500 pulse">INITIALIZING SATELLITE UPLINK...</p></div>}
          {geo && (
            <svg viewBox="0 0 1000 520" className="absolute inset-0 h-full w-full">
              {geo.list.map((sh: any, i: number) => { const c = REG.find((r) => matchName(sh.name, r)); const isSel = sel && c && c.name === sel.name; return (
                <path key={i} d={sh.d} vectorEffect="non-scaling-stroke" style={{ cursor: c ? "pointer" : "default", fill: isSel ? "rgba(56,189,248,.5)" : c ? (c.core ? "rgba(56,189,248,.22)" : "rgba(56,189,248,.10)") : "rgba(30,41,59,.6)", stroke: isSel ? "#7dd3fc" : c ? "rgba(125,211,252,.5)" : "rgba(71,85,105,.45)", strokeWidth: isSel ? 1.4 : 0.6, transition: "fill .25s ease, stroke .25s ease" }}
                  onMouseEnter={() => c && setHover(c)} onMouseLeave={() => setHover(null)} onClick={() => c && setSel(c)} />); })}
              {REG.filter((c) => c.office).map((c) => { const [x, y] = geo.P(c.lng, c.lat); return (
                <g key={c.name} className="cursor-pointer" onClick={() => setSel(c)}>
                  <circle cx={x} cy={y} r={2.6} fill={c.core ? "#fbbf24" : "#38bdf8"} />
                  {sel?.name === c.name && <circle cx={x} cy={y} r={8} fill="none" stroke="#fbbf24" className="pulse" />}
                </g>); })}
              {(() => { const [x, y] = geo.P(KOICA.hqLng, KOICA.hqLat); return (<g><circle cx={x} cy={y} r={3.4} fill="#f472b6" /><circle cx={x} cy={y} r={8} fill="none" stroke="#f472b6" className="pulse" /><text x={x + 9} y={y + 3} fill="#f9a8d4" fontSize={11} className="jb">HQ Seongnam</text></g>); })()}
            </svg>)}
          <AnimatePresence>{hover && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-3 top-3 rounded-xl glass px-3 py-2 chrome">
              <p className="text-[13px] font-bold text-white">{hover.name}</p><p className="jb text-[10px] text-cyan-300">{hover.core ? "CORE PARTNER" : "KOICA OFFICE"} · {hover.city}</p>
            </motion.div>)}
          </AnimatePresence>
        </div>
        <aside className="w-full md:w-72 shrink-0 space-y-2 md:space-y-3 overflow-y-auto border-t md:border-t-0 md:border-l border-cyan-500/15 bg-[#0a0f1c]/80 p-3 chrome max-h-[40vh] md:max-h-none">
          <p className="jb text-[10px] tracking-[0.2em] text-cyan-300">DOSSIER</p>
          <AnimatePresence mode="wait">
            {sel ? (
              <motion.div key={sel.name} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={SPRING_SOFT}>
                <p className="text-[15px] font-bold text-white">{sel.name}</p>
                <p className="jb text-[10px] text-cyan-300">{sel.sectors.join(" · ")}</p>
                {sel.projects.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="mt-2 rounded-lg border border-cyan-500/15 bg-black/30 p-2">
                    <p className="text-[11px] font-bold text-cyan-200">{p[0]}</p>
                    <p className="jb text-[10px] text-[#5a7a9a]">{p[2]} · <span className="text-[#ffd700]">{p[3]}</span></p>
                    <p className="text-[10px] text-emerald-300/80">→ {p[4]}</p>
                  </motion.div>))}
                <p className="mt-2 text-[10px] italic text-zinc-400">"{sel.story}"</p>
              </motion.div>) : <p className="text-[11px] text-[#5a7a9a]">Click a country or marker to open its dossier.</p>}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
function SafariApp() {
  const [omni, setOmni] = useState(""); const [q, setQ] = useState<string | null>(null); const [res, setRes] = useState<any[]>([]); const [loading, setLoading] = useState(false);
  const search = async (term: string) => { setQ(term); setLoading(true); try { const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srlimit=6&format=json&origin=*`); const j = await r.json(); setRes(j?.query?.search ?? []); } catch { setRes([]); } setLoading(false); };
  return (
    <div className="flex h-full flex-col bg-[#111416]">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-white/5 bg-[#191c1e]/95 px-3 chrome">
        <form onSubmit={(e) => { e.preventDefault(); search(omni); }} className="mx-auto flex h-8 w-full max-w-[560px] items-center gap-2 rounded-full bg-black/40 px-3">
          <L.Lock className="size-3.5 text-emerald-400" />
          <input value={omni} onChange={(e) => setOmni(e.target.value)} placeholder="Search — try: KOICA" className="flex-1 bg-transparent text-center text-[12px] text-zinc-300 outline-none placeholder:text-zinc-500" />
          {loading && <L.RotateCw className="size-3.5 animate-spin text-[#83ffe6]" />}
        </form>
      </div>
      <div className="flex-1 overflow-y-auto">
        {q === null ? (
          <div className="p-6 sm:p-10 text-center">
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={SPRING_SOFT} className="text-2xl sm:text-4xl font-black text-white">Power, elevate, and inspire.</motion.h1>
            <div className="mx-auto mt-6 sm:mt-8 grid max-w-2xl grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[["Education", "from-sky-500 to-blue-700", L.GraduationCap], ["Health", "from-rose-500 to-red-700", L.Stethoscope], ["Climate", "from-emerald-500 to-green-700", L.Sprout]].map(([t, g, I]: any, i) => (
                <motion.button key={t} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING_POP, delay: i * 0.08 }}
                  whileHover={{ y: -6, scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => search(`KOICA ${t}`)}
                  className={cx("rounded-2xl bg-gradient-to-b p-6 shadow-lg", g)}><I className="mx-auto size-8 text-white" /><p className="mt-2 text-sm font-bold text-white">{t}</p></motion.button>))}
            </div>
          </div>) : (
          <div className="mx-auto max-w-3xl p-4 sm:p-8">
            {res.map((r: any, i) => (<motion.div key={r.pageid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="mb-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 selectable"><p className="text-[14px] font-semibold text-[#83ffe6]">{r.title}</p><p className="mt-1 text-[12px] text-zinc-400" dangerouslySetInnerHTML={{ __html: r.snippet }} /></motion.div>))}
          </div>)}
      </div>
    </div>
  );
}
function MessagesApp() {
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: "WeKO? Infinite build is live. Try: open koica.pdf" }]);
  const [v, setV] = useState(""); const ix = useRef(0);
  const R = ["Cross-check complete. 4 sources agree.", "₩1.5322T — that's 88× the 1991 budget.", "27,000+ WFK volunteers since 1990.", "Run: impact Rwanda — the trace is beautiful.", "Leaving no one behind. Always."];
  const send = () => { if (!v.trim()) return; setMsgs((m) => [...m, { me: true, t: v }]); const r = R[ix.current++ % R.length]; setV(""); setTimeout(() => setMsgs((m) => [...m, { me: false, t: r }]), 800); };
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/5 bg-zinc-800/70 px-3 py-2 chrome">
        <span className="grid size-8 place-items-center rounded-full bg-gradient-to-b from-amber-400 to-orange-600"><L.Fingerprint className="size-4 text-white" /></span>
        <div><p className="text-[13px] font-semibold text-zinc-100">KOICA Case Bot</p><p className="text-[10px] text-emerald-400">online</p></div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4 selectable">{msgs.map((m, i) => <motion.p key={i} initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={SPRING_POP} className={cx("max-w-[75%] rounded-2xl px-3 py-1.5 text-[13px]", m.me ? "ml-auto bg-sky-600 text-white" : "bg-zinc-700 text-zinc-100")}>{m.t}</motion.p>)}</div>
      <div className="flex items-center gap-2 border-t border-white/5 p-3 chrome">
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="iMessage…" className="flex-1 rounded-full bg-white/10 px-4 py-1.5 text-[13px] text-zinc-100 outline-none" />
        <motion.button whileTap={{ scale: 0.85 }} onClick={send} className="grid size-8 place-items-center rounded-full bg-sky-600 text-white"><L.Send className="size-4" /></motion.button>
      </div>
    </div>
  );
}
function CodeApp() {
  const os = useOS();
  const [code, setCode] = useState('{\n  "case": "WEKO-08",\n  "country": "Rwanda",\n  "status": "ACTIVE"\n}');
  const [saved, setSaved] = useState(true);
  return (
    <div className="jb flex h-full flex-col bg-[#1e1e1e] text-[12px]">
      <textarea value={code} spellCheck={false} onChange={(e) => { setCode(e.target.value); setSaved(false); }}
        onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); setSaved(true); os.notify("VS Code", "case.json saved"); } }}
        className="flex-1 resize-none bg-transparent p-3 leading-5 text-amber-200 outline-none" />
      <div className="flex justify-between bg-[#007acc] px-2 py-0.5 text-[10px] text-white chrome"><span>main*</span><span>{saved ? "✓ saved" : "● modified — ⌘S"}</span></div>
    </div>
  );
}
function SettingsApp() {
  const os = useOS(); const [sec, setSec] = useState("General");
  return (
    <div className="flex h-full">
      <div className="w-40 md:w-44 shrink-0 space-y-1 border-r border-white/5 bg-zinc-900/70 p-3 chrome">
        {[["General", L.Settings], ["Wallpaper", L.Palette], ["Network", L.Wifi], ["Users", L.User]].map(([id, I]: any) => (
          <motion.button key={id} whileTap={{ scale: 0.97 }} onClick={() => setSec(id)} className={cx("relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px]", sec === id ? "text-white" : "text-zinc-300 hover:bg-white/5")}>
            {sec === id && <motion.span layoutId="setpill" transition={SPRING_POP} className="absolute inset-0 rounded-md bg-sky-600" />}
            <I className="relative size-4" /><span className="relative">{id}</span>
          </motion.button>))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {sec === "General" && (<div className="max-w-md space-y-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-white/5 p-4 selectable">
            <p className="text-[14px] font-bold text-zinc-100">About</p>
            <div className="mt-2 grid grid-cols-[110px_1fr] gap-y-1 text-[12px] text-zinc-400">
              <span>Chip</span><span className="text-zinc-200">Apple M4 Max</span>
              <span>Version</span><span className="text-zinc-200">KOICA Sequoia 15.2 (WEKO-∞)</span>
              <span>Geography</span><span className="text-zinc-200">Natural Earth 110m (local)</span>
              <span>Icons</span><span className="text-zinc-200">folderog.webp + koicahub.webp</span>
              <span>PDF engine</span><span className="text-zinc-200">native viewer (koica.pdf)</span>
            </div>
          </motion.div>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => os.setDark(!os.dark)} className="flex w-full items-center justify-between rounded-xl bg-white/5 p-4 text-[13px] text-zinc-200 hover:bg-white/10 chrome">Dark Mode <span className="font-bold">{os.dark ? "On" : "Off"}</span></motion.button>
        </div>)}
        {sec === "Wallpaper" && (
          <div className="grid max-w-2xl grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {WALLPAPERS.map((w, i) => (
              <motion.button key={w.name} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...SPRING_POP, delay: i * 0.03 }}
                whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }} onClick={() => os.setWallpaper(i)}
                className={cx("relative h-24 sm:h-28 overflow-hidden rounded-xl ring-2 chrome", os.wallpaper === i ? "ring-sky-400" : "ring-transparent")}
                style={w.img ? { backgroundImage: `url(${w.img})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: w.css }}>
                <span className="absolute inset-x-0 bottom-0 rounded-b-xl bg-black/50 py-1 text-[10px] text-white backdrop-blur-sm">{w.name}</span>
                {os.wallpaper === i && <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-sky-500 text-white"><L.Check className="size-3" /></span>}
              </motion.button>))}
          </div>)}
        {sec === "Network" && <p className="text-[13px] text-zinc-300 selectable">Connected to Cupertino-5G</p>}
        {sec === "Users" && <p className="text-[13px] text-zinc-300 selectable">WeKO — administrator</p>}
      </div>
    </div>
  );
}
function MonitorApp() {
  const [cpu, setCpu] = useState(34); const [ram, setRam] = useState(62); const [net, setNet] = useState(12);
  useEffect(() => { const t = setInterval(() => { setCpu((c) => clamp(c + (Math.random() * 10 - 5), 10, 95)); setRam((c) => clamp(c + (Math.random() * 4 - 2), 40, 85)); setNet((c) => clamp(c + (Math.random() * 20 - 10), 0, 100)); }, 1000); return () => clearInterval(t); }, []);
  const G = ({ v, c }: { v: number; c: string }) => (
    <div className="relative h-20 sm:h-24 rounded-lg bg-black/40 border border-white/5 overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <path d={`M0,${100 - v} Q25,${90 - v} 50,${100 - v} T100,${100 - v} L100,100 L0,100 Z`} fill={c} fillOpacity="0.2" />
        <path d={`M0,${100 - v} Q25,${90 - v} 50,${100 - v} T100,${100 - v}`} fill="none" stroke={c} strokeWidth="2" />
      </svg>
      <div className="absolute bottom-2 right-2 text-xl sm:text-2xl font-bold" style={{ color: c }}>{Math.round(v)}%</div>
    </div>);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 bg-zinc-950 h-full content-start">
      <div><p className="mb-2 text-sm text-zinc-400">CPU</p><G v={cpu} c="#00e5ff" /></div>
      <div><p className="mb-2 text-sm text-zinc-400">Memory</p><G v={ram} c="#ff00ff" /></div>
      <div><p className="mb-2 text-sm text-zinc-400">Network</p><G v={net} c="#00ff41" /></div>
    </div>);
}
function MusicApp() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-6 sm:p-8">
      <motion.div animate={playing ? { rotate: 360 } : { rotate: 0 }} transition={{ repeat: playing ? Infinity : 0, duration: 8, ease: "linear" }}
        className="size-40 sm:size-56 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl mb-6 sm:mb-8 flex items-center justify-center shine"><L.Music2 className="size-16 sm:size-20 text-white/80" /></motion.div>
      <p className="text-xl sm:text-2xl font-bold text-white">Synthwave Detective</p>
      <p className="text-sm text-zinc-400 mb-6">KOICA OSINT Ambience</p>
      <motion.button whileTap={{ scale: 0.88 }} onClick={() => setPlaying(!playing)} className="grid size-14 sm:size-16 place-items-center rounded-full bg-white text-black hover:scale-105 transition-transform">{playing ? <L.Pause className="size-7 sm:size-8" fill="currentColor" /> : <L.Play className="size-7 sm:size-8 ml-1" fill="currentColor" />}</motion.button>
      {playing && <div className="flex items-end gap-1 h-12 mt-6 sm:mt-8">{Array.from({ length: 20 }).map((_, i) => <div key={i} className="w-1.5 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full wavebar" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s` }} />)}</div>}
    </div>);
}
function CalculatorApp() {
  const [d, setD] = useState("0"); const [p, setP] = useState<number | null>(null); const [op, setOp] = useState<string | null>(null); const [rst, setRst] = useState(false);
  const inp = (v: string) => { if (d === "0" || rst) { setD(v); setRst(false); } else setD(d + v); };
  const oper = (o: string) => { const c = parseFloat(d); if (p !== null && op) { let r = 0; if (op === "+") r = p + c; if (op === "-") r = p - c; if (op === "*") r = p * c; if (op === "/") r = p / c; setD(String(r)); setP(r); } else setP(c); setOp(o); setRst(true); };
  const B = ({ l, o, c }: any) => <motion.button whileTap={{ scale: 0.9 }} onClick={o} className={cx("h-12 sm:h-14 rounded-full text-lg sm:text-xl font-medium chrome", c)}>{l}</motion.button>;
  return (
    <div className="flex h-full flex-col bg-zinc-900 p-3 sm:p-4">
      <div className="flex-1 flex items-end justify-end p-3 sm:p-4 selectable"><motion.p key={d} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-light text-white">{d}</motion.p></div>
      <div className="grid grid-cols-4 gap-2">
        <B l="C" o={() => { setD("0"); setP(null); setOp(null); }} c="bg-zinc-700 text-white" /><B l="±" o={() => setD(String(parseFloat(d) * -1))} c="bg-zinc-700 text-white" /><B l="%" o={() => setD(String(parseFloat(d) / 100))} c="bg-zinc-700 text-white" /><B l="/" o={() => oper("/")} c="bg-orange-500 text-white" />
        {["7", "8", "9"].map((n) => <B key={n} l={n} o={() => inp(n)} c="bg-zinc-800 text-white" />)}<B l="*" o={() => oper("*")} c="bg-orange-500 text-white" />
        {["4", "5", "6"].map((n) => <B key={n} l={n} o={() => inp(n)} c="bg-zinc-800 text-white" />)}<B l="-" o={() => oper("-")} c="bg-orange-500 text-white" />
        {["1", "2", "3"].map((n) => <B key={n} l={n} o={() => inp(n)} c="bg-zinc-800 text-white" />)}<B l="+" o={() => oper("+")} c="bg-orange-500 text-white" />
        <B l="0" o={() => inp("0")} c="col-span-2 bg-zinc-800 text-white text-left pl-6" /><B l="." o={() => !d.includes(".") && inp(".")} c="bg-zinc-800 text-white" /><B l="=" o={() => { oper("="); setOp(null); }} c="bg-orange-500 text-white" />
      </div>
    </div>);
}
function CalendarApp() {
  const [now] = useState(new Date());
  const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const fd = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  return (
    <div className="flex h-full flex-col bg-zinc-950 p-4 sm:p-6">
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-white">{now.toLocaleString("default", { month: "long", year: "numeric" })}</motion.p>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center text-[10px] sm:text-xs text-zinc-500 font-semibold">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 flex-1 content-start">
        {Array.from({ length: fd }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: dim }, (_, i) => i + 1).map((d) => (
          <motion.div key={d} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: d * 0.008 }}
            className={cx("rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm chrome", d === now.getDate() ? "bg-sky-600 text-white shadow-lg" : "bg-white/5 text-zinc-300")}>
            <p className="font-semibold">{d}</p>
          </motion.div>))}
      </div>
    </div>);
}
function NotesApp() {
  const [notes, setNotes] = useState([
    { id: 1, title: "WEKO-08", body: "Rwanda SAPMP: 80% wetland produce reaches market. 43,000 teachers ICT-trained." },
    { id: 2, title: "KOICA facts", body: "₩1.5322T budget 2026 · 28.2% of Korea ODA · 61% grant share · 48 countries · 49 offices · 27,000+ volunteers · GCF accredited · INSARAG Heavy KDRT." }]);
  const [sel, setSel] = useState(1); const a = notes.find((n) => n.id === sel);
  return (
    <div className="flex h-full bg-zinc-950">
      <div className="w-40 sm:w-56 border-r border-white/5 chrome">
        {notes.map((n) => (<motion.button key={n.id} whileTap={{ scale: 0.98 }} onClick={() => setSel(n.id)} className={cx("relative w-full text-left p-3 border-b border-white/5", sel === n.id ? "text-white" : "hover:bg-white/5")}>
          {sel === n.id && <motion.span layoutId="notepill" transition={SPRING_POP} className="absolute inset-0 bg-sky-600/20" />}
          <p className="relative text-sm font-semibold text-zinc-200 truncate">{n.title}</p></motion.button>))}
      </div>
      <div className="flex-1 p-4 sm:p-6">
        {a && <textarea value={a.body} onChange={(e) => setNotes(notes.map((n) => n.id === sel ? { ...n, body: e.target.value } : n))} className="h-full w-full bg-transparent text-sm text-zinc-300 outline-none resize-none selectable" />}
      </div>
    </div>);
}

/* ── 22. HUB / TIMELINE / PROGRAMS / STORY / ABOUT / TRASH ───────────────────── */
function HubApp() {
  const [tab, setTab] = useState<"overview" | "sectors" | "regions" | "goals">("overview");
  const donutColors = ["#38bdf8", "#a78bfa", "#fb7185", "#fbbf24", "#34d399", "#f472b6", "#94a3b8"];
  const total = KOICA.sectors.reduce((s, d) => s + d[1], 0); let acc = 0; const r = 42, C = 2 * Math.PI * r;
  return (
    <div className="h-full overflow-y-auto bg-[#07080c] text-white">
      <div className="sticky top-0 z-20 glass border-b border-white/5 px-4 py-3 flex items-center justify-between chrome">
        <div className="flex items-center gap-2"><img src="/koicahub.webp" alt="" className="size-6 object-contain" /><span className="text-sm font-bold">KOICA Hub</span></div>
        <div className="flex gap-1">{(["overview", "sectors", "regions", "goals"] as const).map((t) => (
          <motion.button key={t} whileTap={{ scale: 0.94 }} onClick={() => setTab(t)} className={cx("px-2.5 py-1 rounded-lg text-[11px] capitalize transition", tab === t ? "bg-sky-600 text-white" : "text-zinc-400 hover:bg-white/10")}>{t}</motion.button>))}</div>
      </div>
      {tab === "overview" && (
        <div className="p-4 sm:p-6 space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING_SOFT} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-950 border border-white/10 p-6 sm:p-8">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl" />
            <img src="/koicahub.webp" alt="" className="mb-3 size-14 object-contain drop-shadow-[0_8px_20px_rgba(56,189,248,.35)] floaty" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300 mb-2">Korea International Cooperation Agency · 한국국제협력단</p>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight max-w-xl">Leaving no one behind, building a world of co-prosperity.</h1>
            <p className="mt-3 text-sm text-zinc-300 max-w-xl">{KOICA.mission}</p>
            <div className="mt-5 flex flex-wrap gap-2">{KOICA.values.map((v, i) => (
              <motion.span key={v} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...ELASTIC_ICON, delay: i * 0.08 }} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-200">{v}</motion.span>))}</div>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[["₩1.5322T", "2026 Support Budget", L.Coins, "from-amber-500 to-orange-600"], ["28.2%", "of Korea's total ODA", L.PieChart, "from-sky-500 to-blue-600"], ["49", "Overseas Offices", L.Building2, "from-emerald-500 to-green-600"], ["27,000+", "WFK Volunteers", L.Users, "from-purple-500 to-indigo-600"]].map(([v, l, I, g]: any, i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING_SOFT, delay: i * 0.06 }} whileHover={{ y: -4 }} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className={cx("size-9 rounded-xl bg-gradient-to-b flex items-center justify-center mb-3", g)}><I className="size-4 text-white" /></div>
                <p className="text-xl sm:text-2xl font-black">{v}</p><p className="text-[11px] text-zinc-400 mt-0.5">{l}</p>
              </motion.div>))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4"><p className="text-sm font-bold">Budget Growth 1991 → 2026</p><span className="text-[10px] text-zinc-500 font-mono">₩ trillion</span></div>
            <div className="flex items-end gap-2 h-40">
              {KOICA.budget.map(([y, v]) => (
                <div key={y} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                  <span className="text-[9px] text-zinc-400 font-mono opacity-0 group-hover:opacity-100 transition">{v}</span>
                  <motion.div className="w-full rounded-t-lg bg-gradient-to-t from-sky-600 to-cyan-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-colors" initial={{ height: 0 }} animate={{ height: `${(v / 1.5322) * 100}%` }} transition={{ duration: 1, delay: 0.3 }} />
                  <span className="text-[9px] text-zinc-500">{String(y).slice(2)}</span>
                </div>))}
            </div>
            <p className="text-[11px] text-zinc-500 mt-3">An 88× expansion — from ₩17.4B to ₩1.5322 trillion. {KOICA.grantShare} executed by KOICA.</p>
          </motion.div>
        </div>)}
      {tab === "sectors" && (
        <div className="p-4 sm:p-6 grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center">
            <div className="relative" style={{ width: 180, height: 180 }}>
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {KOICA.sectors.map((d, i) => { const frac = d[1] / total; const dash = frac * C; const off = -acc * C; acc += frac;
                  return <circle key={i} cx={50} cy={50} r={r} fill="none" stroke={donutColors[i % donutColors.length]} strokeWidth="12" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={off} />; })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-black">7</span><span className="text-[9px] text-zinc-400 uppercase tracking-wider">sectors</span></div>
            </div>
            <div className="mt-4 w-full space-y-1.5">{KOICA.sectors.map(([n, p], i) => (
              <div key={n} className="flex items-center gap-2 text-[11px]"><span className="size-2.5 rounded-full" style={{ background: donutColors[i] }} /><span className="flex-1 text-zinc-300">{n}</span><span className="text-zinc-500 font-mono">{p}%</span></div>))}</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-sm font-bold mb-4">Allocation by Income Level</p>
            <div className="space-y-3">{KOICA.income.map(([n, p], i) => (
              <div key={n} className="space-y-1"><div className="flex justify-between text-[11px]"><span className="text-zinc-300">{n}</span><span className="text-zinc-400 font-mono">{p}%</span></div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 1, delay: i * 0.1 }} /></div></div>))}</div>
          </div>
        </div>)}
      {tab === "regions" && (
        <div className="p-4 sm:p-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-sm font-bold mb-4">Regional Allocation</p>
            <div className="space-y-3">{KOICA.regions.map(([n, p], i) => (
              <div key={n} className="space-y-1"><div className="flex justify-between text-[11px]"><span className="text-zinc-300">{n}</span><span className="text-zinc-400 font-mono">{p}%</span></div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden"><motion.div className={cx("h-full rounded-full", ["bg-emerald-400", "bg-amber-400", "bg-purple-400", "bg-sky-400", "bg-zinc-400"][i])} initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 1, delay: i * 0.08 }} /></div></div>))}</div>
            <p className="text-[11px] text-zinc-500 mt-3">Africa support is continuously increasing in line with government policy.</p>
          </div>
        </div>)}
      {tab === "goals" && (
        <div className="p-4 sm:p-6 grid sm:grid-cols-2 gap-3">
          {KOICA.goals.map(([n, d, I], i) => (
            <motion.div key={n} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING_SOFT, delay: i * 0.08 }} whileHover={{ y: -3 }} className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-5">
              <div className="size-10 rounded-xl bg-gradient-to-b from-sky-500 to-indigo-600 flex items-center justify-center mb-3"><I className="size-5 text-white" /></div>
              <p className="font-bold">{n}</p><p className="text-[12px] text-zinc-400 mt-1">{d}</p>
            </motion.div>))}
        </div>)}
    </div>
  );
}
function TimelineApp() {
  const [era, setEra] = useState("All");
  const eras = ["All", "Foundation", "Expansion", "Global", "Innovation", "Resilience", "Future"];
  const items = HISTORY.filter((h) => era === "All" || h.era === era);
  const eraColor: Record<string, string> = { Foundation: "bg-amber-500", Expansion: "bg-emerald-500", Global: "bg-sky-500", Innovation: "bg-purple-500", Resilience: "bg-rose-500", Future: "bg-cyan-400" };
  return (
    <div className="h-full overflow-y-auto bg-[#07080c] text-white p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4"><L.History className="size-5 text-amber-300" /><h1 className="text-lg font-bold">KOICA History · 1991 → 2026</h1></div>
      <div className="flex flex-wrap gap-1.5 mb-6 chrome">
        {eras.map((e) => (<motion.button key={e} whileTap={{ scale: 0.94 }} onClick={() => setEra(e)} className={cx("px-3 py-1.5 rounded-full text-[11px] transition", era === e ? "bg-white text-black font-semibold" : "bg-white/10 text-zinc-300 hover:bg-white/20")}>{e}</motion.button>))}
      </div>
      <div className="relative pl-6 space-y-5">
        <div className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-sky-500 via-purple-500 to-amber-400" />
        {items.map((h, i) => (
          <motion.div key={h.year + h.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING_SOFT, delay: i * 0.05 }} className="relative">
            <span className={cx("absolute -left-[22px] top-1.5 size-3 rounded-full ring-4 ring-[#07080c]", eraColor[h.era])} />
            <div className={cx("rounded-2xl border p-4", h.hl ? "bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30" : "bg-white/5 border-white/10")}>
              <div className="flex items-center gap-2 mb-1"><span className="text-base font-black">{h.year}</span>
                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-zinc-400">{h.era}</span>
                {h.hl && <L.Star className="size-3 text-amber-300" />}</div>
              <p className="text-[13px] text-zinc-300 flex items-start gap-2"><h.icon className="size-4 mt-0.5 text-sky-300 shrink-0" />{h.text}</p>
            </div>
          </motion.div>))}
      </div>
    </div>
  );
}
function ProgramsApp() {
  const icons = [L.Globe, L.Handshake, L.GraduationCap, L.ShieldCheck, L.Lightbulb, L.LifeBuoy, L.Users, L.HeartPulse];
  const grads = ["from-sky-500 to-blue-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-600", "from-emerald-500 to-green-600", "from-purple-500 to-indigo-600", "from-red-500 to-rose-600", "from-cyan-500 to-teal-600", "from-lime-500 to-green-600"];
  return (
    <div className="h-full overflow-y-auto bg-[#07080c] text-white p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1"><L.Layers className="size-5 text-sky-300" /><h1 className="text-lg font-bold">Program Modalities</h1></div>
      <p className="text-[12px] text-zinc-400 mb-5">8 integrated delivery channels — from bilateral projects to humanitarian assistance.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {KOICA.programs.map(([n, d], i) => { const I = icons[i] ?? L.Globe; return (
          <motion.div key={n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING_SOFT, delay: i * 0.06 }} whileHover={{ y: -3 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-5 cursor-pointer hover:border-white/25 transition">
            <div className={cx("size-10 rounded-xl bg-gradient-to-b flex items-center justify-center mb-3", grads[i])}><I className="size-5 text-white" /></div>
            <p className="font-bold text-sm">{String(i + 1).padStart(2, "0")} · {n}</p>
            <p className="text-[12px] text-zinc-400 mt-1.5 leading-relaxed">{d}</p>
          </motion.div>); })}
      </div>
    </div>
  );
}
function StoryApp() {
  const imgs = ["/koica.webp", "/koica2.webp", "/koica4.webp"];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % imgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 bg-[radial-gradient(90%_90%_at_50%_10%,#3b1d5a,#120b1e)] p-6 sm:p-8 text-center">
      <AnimatePresence mode="wait"><motion.img key={i} src={imgs[i]} alt="" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 0.25, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} className="absolute inset-0 h-full w-full object-cover" /></AnimatePresence>
      <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={SPRING_SOFT} className="relative max-w-md text-xl sm:text-2xl font-black leading-tight text-white">DATA CAN SHOW CHANGE.<br />PEOPLE GIVE IT MEANING.</motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="relative max-w-sm text-[12px] sm:text-[13px] text-zinc-300 selectable">"The school is on the map. The clinic is on the map. But the story is the child who now walks ten minutes less, every day, forever."</motion.p>
      <p className="relative jb text-[11px] sm:text-[12px] tracking-widest text-sky-300">KOICA — CONNECTING PEOPLE, CREATING CHANGE</p>
    </div>);
}
function AboutApp() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <motion.img src="/koicahub.webp" alt="" draggable={false} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={ELASTIC_ICON} className="h-16 sm:h-20 w-16 sm:w-20 object-contain rounded-2xl drop-shadow-2xl" />
      <p className="text-lg sm:text-xl font-black text-zinc-100">KOICA Sequoia</p>
      <p className="text-[11px] sm:text-[12px] text-zinc-500">Version 15.2 (WEKO-∞ Infinite Edition)</p>
      <div className="mt-2 grid grid-cols-[110px_1fr] gap-y-1 text-[11px] sm:text-[12px] text-zinc-500 selectable">
        <span>Chip</span><span className="text-zinc-200">Apple M4 Max</span>
        <span>Geography</span><span className="text-zinc-200">Natural Earth 110m</span>
        <span>Icons</span><span className="text-zinc-200">folderog + koicahub webp</span>
        <span>PDFs</span><span className="text-zinc-200">koica.pdf · koica_brochure.pdf</span>
      </div>
      <p className="mt-4 max-w-xs text-[11px] text-zinc-600">Interactive concept piece. Data compiled from publicly available KOICA documents. Not affiliated with KOICA.</p>
    </div>);
}
function TrashApp() {
  const os = useOS();
  const [items, setItems] = useState([{ name: "old_portfolio.zip", ext: "ZIP", size: "6.6 MB" }]);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 chrome">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setItems([]); os.notify("Trash", "Emptied."); }} disabled={!items.length} className="rounded-md bg-white/10 px-3 py-1 text-[12px] text-zinc-200 hover:bg-white/20 disabled:opacity-40">Empty Trash</motion.button>
        <span className="text-[11px] text-zinc-500">{items.length} items</span>
      </div>
      {items.length === 0 ? <div className="grid flex-1 place-items-center text-zinc-600"><L.Trash2 className="size-16 opacity-50" /></div> :
        <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(90px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3 sm:gap-4 p-4">
          {items.map((i) => (<motion.div key={i.name} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-1 chrome"><DocIcon ext={i.ext} size={48} /><p className="text-[12px] text-zinc-300 text-center">{i.name}</p></motion.div>))}
        </div>}
    </div>);
}

/* ── 23. APP REGISTRY — hub uses koicahub.webp ───────────────────────────────── */
const AppImg = ({ src }: { src: string }) => <img src={src} alt="" draggable={false} className="h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,.55)]" />;
const Squircle = ({ grad, children }: { grad: string; children: React.ReactNode }) => <div className={cx("grid h-full w-full place-items-center rounded-[24%] bg-gradient-to-b shadow-lg ring-1 ring-white/20", grad)}>{children}</div>;
const APPS: Record<AppId, { name: string; w: number; h: number; Icon: () => React.ReactNode; view: React.FC<any> }> = {
  finder: { name: "Finder", w: 900, h: 580, view: FinderApp, Icon: () => <AppImg src="/finder.webp" /> },
  safari: { name: "Safari", w: 1000, h: 680, view: SafariApp, Icon: () => <AppImg src="/safariog.webp" /> },
  messages: { name: "Messages", w: 640, h: 520, view: MessagesApp, Icon: () => <AppImg src="/message.webp" /> },
  terminal: { name: "Terminal", w: 880, h: 580, view: TerminalApp, Icon: () => <AppImg src="/terminalmac.webp" /> },
  code: { name: "VS Code", w: 900, h: 600, view: CodeApp, Icon: () => <AppImg src="/vscode.webp" /> },
  hub: { name: "KOICA Hub", w: 1020, h: 660, view: HubApp, Icon: () => <AppImg src="/koicahub.webp" /> },
  timeline: { name: "History", w: 820, h: 620, view: TimelineApp, Icon: () => <Squircle grad="from-sky-400 to-blue-700"><L.History className="size-[50%] text-white" /></Squircle> },
  programs: { name: "Programs", w: 860, h: 620, view: ProgramsApp, Icon: () => <Squircle grad="from-emerald-400 to-green-700"><L.Layers className="size-[50%] text-white" /></Squircle> },
  atlas: { name: "World Atlas", w: 1080, h: 640, view: AtlasApp, Icon: () => <Squircle grad="from-teal-400 to-cyan-700"><L.Globe className="size-[50%] text-white" /></Squircle> },
  settings: { name: "Settings", w: 860, h: 580, view: SettingsApp, Icon: () => <AppImg src="/setting.webp" /> },
  photos: { name: "Photos", w: 760, h: 560, view: PhotosApp, Icon: () => <AppImg src="/photo.webp" /> },
  media: { name: "Media", w: 860, h: 560, view: MediaApp, Icon: () => <Squircle grad="from-fuchsia-500 to-purple-700"><L.Clapperboard className="size-[50%] text-white" /></Squircle> },
  story: { name: "Story", w: 720, h: 560, view: StoryApp, Icon: () => <Squircle grad="from-pink-500 to-rose-700"><L.Heart className="size-[50%] text-white" fill="white" /></Squircle> },
  about: { name: "About", w: 420, h: 480, view: AboutApp, Icon: () => <AppImg src="/appleicon.webp" /> },
  quicklook: { name: "Quick Look", w: 720, h: 560, view: QuickLookApp, Icon: () => <Squircle grad="from-zinc-600 to-zinc-800"><L.Eye className="size-[50%] text-white" /></Squircle> },
  pdf: { name: "PDF Viewer", w: 900, h: 640, view: PdfApp, Icon: () => <Squircle grad="from-red-500 to-rose-700"><L.FileText className="size-[50%] text-white" /></Squircle> },
  trash: { name: "Trash", w: 720, h: 480, view: TrashApp, Icon: () => <AppImg src="/trash.webp" /> },
  monitor: { name: "Activity", w: 800, h: 560, view: MonitorApp, Icon: () => <Squircle grad="from-emerald-500 to-teal-700"><L.Activity className="size-[50%] text-white" /></Squircle> },
  music: { name: "Music", w: 600, h: 600, view: MusicApp, Icon: () => <Squircle grad="from-pink-500 to-purple-700"><L.Music2 className="size-[50%] text-white" /></Squircle> },
  calculator: { name: "Calculator", w: 320, h: 480, view: CalculatorApp, Icon: () => <Squircle grad="from-zinc-700 to-zinc-900"><L.Calculator className="size-[50%] text-white" /></Squircle> },
  calendar: { name: "Calendar", w: 700, h: 560, view: CalendarApp, Icon: () => <Squircle grad="from-red-500 to-red-700"><L.CalendarDays className="size-[50%] text-white" /></Squircle> },
  notes: { name: "Notes", w: 700, h: 560, view: NotesApp, Icon: () => <Squircle grad="from-yellow-200 to-yellow-400"><L.StickyNote className="size-[50%] text-yellow-800" /></Squircle> },
};

/* ── 24. DESKTOP WIDGETS — clock · weather · system · stacks · hub · calendar ── */
function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const rx = useMotionValue(0); const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 }); const sry = useSpring(ry, { stiffness: 220, damping: 22 });
  const onMove = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={cx("rounded-2xl glass shadow-xl chrome transition-shadow hover:shadow-[0_18px_50px_rgba(0,0,0,.55)]", className)}>
      {children}
    </motion.div>
  );
}
const tzTime = (tz: string) => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz });
function ClockWidget() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const hh = String(t.getHours()).padStart(2, "0"), mm = String(t.getSeconds() % 2 === 0 ? t.getMinutes() : t.getMinutes()).padStart(2, "0");
  const cities: [string, string][] = [["Seoul · HQ", "Asia/Seoul"], ["Kigali", "Africa/Kigali"], ["Accra", "Africa/Accra"], ["Bogotá", "America/Bogota"]];
  return (
    <Tilt className="p-4">
      <div className="flex items-end justify-between">
        <p className="text-[34px] font-bold leading-none tabular-nums text-white">
          {hh}<span className={cx("mx-0.5", t.getSeconds() % 2 === 0 ? "opacity-100" : "opacity-30")}>:</span>{mm}
        </p>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-zinc-300">{String(t.getSeconds()).padStart(2, "0")}s</span>
      </div>
      <p className="mt-1 text-[11px] text-zinc-400">{t.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {cities.map(([c, tz], i) => (
          <motion.div key={c} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
            className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1">
            <span className="text-[9px] text-zinc-400">{c}</span>
            <span className="text-[10px] font-mono text-zinc-200">{tzTime(tz)}</span>
          </motion.div>))}
      </div>
    </Tilt>
  );
}
const CONDS = ["Clear", "Clouds", "Rain", "Thunder", "Snow"] as const;
function WeatherWidget() {
  const [ci, setCi] = useState(2);
  useEffect(() => { const i = setInterval(() => setCi((c) => (c + 1) % CONDS.length), 9000); return () => clearInterval(i); }, []);
  const cond = CONDS[ci];
  const hour = new Date().getHours(); const isDay = hour >= 6 && hour < 18;
  const base = cond === "Snow" ? -3 : cond === "Rain" ? 18 : cond === "Thunder" ? 21 : cond === "Clouds" ? 24 : 27;
  const skyDay: Record<string, string> = {
    Clear: "linear-gradient(180deg,#38bdf8,#0ea5e9 45%,#0369a1)",
    Clouds: "linear-gradient(180deg,#7c8ba1,#475569)",
    Rain: "linear-gradient(180deg,#4b5b6e,#334155)",
    Thunder: "linear-gradient(180deg,#2b3648,#0f172a)",
    Snow: "linear-gradient(180deg,#aebccb,#64748b)",
  };
  const skyNight: Record<string, string> = {
    Clear: "linear-gradient(180deg,#0b1026,#1e1b4b)",
    Clouds: "linear-gradient(180deg,#1f2637,#111827)",
    Rain: "linear-gradient(180deg,#1c2534,#0b1220)",
    Thunder: "linear-gradient(180deg,#141b2b,#050810)",
    Snow: "linear-gradient(180deg,#33415c,#1e293b)",
  };
  const Icon = cond === "Clear" ? (isDay ? L.Sun : L.MoonStar) : cond === "Clouds" ? L.Cloud : cond === "Rain" ? L.CloudRain : cond === "Thunder" ? L.CloudLightning : L.CloudSnow;
  const drops = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ left: (i * 7.3 + 4) % 96, delay: (i * 0.13) % 1.1 })), []);
  const flakes = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ left: (i * 8.1 + 3) % 96, delay: (i * 0.5) % 6 })), []);
  const stars = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ left: (i * 6.7 + 2) % 96, top: (i * 11.3) % 55, delay: (i * 0.3) % 2.6 })), []);
  const hours = [0, 1, 2, 3, 4].map((i) => ({ h: (hour + i + 1) % 24, t: base + Math.round(Math.sin(i + hour) * 2) - i * 0.4 | 0 }));
  return (
    <Tilt className="overflow-hidden">
      <div className="relative h-[168px]" style={{ background: isDay ? skyDay[cond] : skyNight[cond] }}>
        {!isDay && stars.map((s, i) => <span key={i} className="absolute size-[2px] rounded-full bg-white twinkle" style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }} />)}
        {isDay && cond === "Clear" && (
          <div className="absolute right-5 top-4">
            <div className="absolute -inset-3 rounded-full bg-amber-300/30 blur-xl" />
            <div className="rayspin absolute -inset-2 rounded-full border border-dashed border-amber-200/50" />
            <L.Sun className="relative size-8 text-amber-300 drop-shadow-[0_0_14px_rgba(252,211,77,.8)]" />
          </div>)}
        {!isDay && cond === "Clear" && <L.MoonStar className="absolute right-6 top-5 size-7 text-zinc-100 drop-shadow-[0_0_12px_rgba(255,255,255,.6)]" />}
        {(cond === "Clouds" || cond === "Rain" || cond === "Thunder") && (<>
          <div className="drift absolute left-4 top-5 h-6 w-20 rounded-full bg-white/25 blur-md" />
          <div className="drift absolute left-16 top-9 h-5 w-16 rounded-full bg-white/20 blur-md" style={{ animationDelay: "1.2s" }} />
        </>)}
        {(cond === "Rain" || cond === "Thunder") && drops.map((d, i) => (
          <span key={i} className="raindrop absolute top-6 h-3 w-[1.5px] rounded-full bg-sky-200/70" style={{ left: `${d.left}%`, animationDelay: `${d.delay}s` }} />))}
        {cond === "Snow" && flakes.map((f, i) => (
          <span key={i} className="snow absolute top-4 size-[3px] rounded-full bg-white/85" style={{ left: `${f.left}%`, animationDelay: `${f.delay}s` }} />))}
        {cond === "Thunder" && <div className="flash absolute inset-0 bg-white/70" />}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <div>
            <p className="text-[11px] font-semibold text-white/85">Seongnam-si · KR</p>
            <p className="text-[30px] font-bold leading-none text-white drop-shadow">{base}°</p>
          </div>
          <div className="text-right">
            <Icon className="ml-auto size-7 text-white drop-shadow" />
            <p className="text-[10px] font-medium text-white/85">{cond}</p>
            <p className="text-[9px] text-white/60">H:{base + 3}° L:{base - 5}°</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-1 px-2.5 py-2">
        {hours.map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex flex-1 flex-col items-center gap-0.5 rounded-lg bg-white/5 py-1">
            <span className="text-[8px] text-zinc-400">{String(h.h).padStart(2, "0")}:00</span>
            <Icon className="size-3 text-sky-300" />
            <span className="text-[9px] font-semibold text-zinc-200">{h.t}°</span>
          </motion.div>))}
      </div>
      <div className="flex justify-between border-t border-white/5 px-3 py-1.5 text-[9px] text-zinc-400">
        <span className="flex items-center gap-1"><L.Droplets className="size-3 text-sky-300" />{cond === "Rain" ? 82 : cond === "Snow" ? 70 : 46}%</span>
        <span className="flex items-center gap-1"><L.Wind className="size-3 text-teal-300" />{cond === "Thunder" ? 24 : 9} km/h</span>
        <span className="flex items-center gap-1"><L.SunDim className="size-3 text-amber-300" />UV {isDay ? 5 : 0}</span>
      </div>
    </Tilt>
  );
}
const Spark = ({ data, color }: { data: number[]; color: string }) => {
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${31 - (v / 100) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-7 w-full">
      <polyline points={`0,32 ${pts} 100,32`} fill={color} fillOpacity=".14" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>);
};
function SystemWidget() {
  const os = useOS();
  const [cpu, setCpu] = useState<number[]>(Array.from({ length: 24 }, () => 30 + Math.random() * 20));
  const [ram, setRam] = useState<number[]>(Array.from({ length: 24 }, () => 55 + Math.random() * 10));
  const [net, setNet] = useState<number[]>(Array.from({ length: 24 }, () => 10 + Math.random() * 30));
  const [up, setUp] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setCpu((a) => [...a.slice(1), clamp(a[a.length - 1] + (Math.random() * 18 - 9), 8, 96)]);
      setRam((a) => [...a.slice(1), clamp(a[a.length - 1] + (Math.random() * 6 - 3), 40, 88)]);
      setNet((a) => [...a.slice(1), clamp(a[a.length - 1] + (Math.random() * 30 - 15), 2, 100)]);
      setUp((u) => u + 1);
    }, 1200);
    return () => clearInterval(t);
  }, []);
  const R = 15.5, CIRC = 2 * Math.PI * R;
  const mm = String(Math.floor(up / 60)).padStart(2, "0"), ss = String(up % 60).padStart(2, "0");
  return (
    <Tilt className="p-3.5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-200"><L.Cpu className="size-3.5 text-emerald-300" /> System</p>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-300">● LIVE</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {[["CPU", cpu, "#22d3ee"], ["MEM", ram, "#e879f9"], ["NET", net, "#4ade80"]].map(([l, d, c]: any) => (
          <div key={l} className="rounded-lg bg-black/30 p-1.5">
            <div className="flex justify-between text-[8px] text-zinc-400"><span>{l}</span><span className="font-mono" style={{ color: c }}>{Math.round(d[d.length - 1])}%</span></div>
            <Spark data={d} color={c} />
          </div>))}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="relative grid size-11 place-items-center">
          <svg viewBox="0 0 36 36" className="size-11 -rotate-90">
            <circle cx="18" cy="18" r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="4" />
            <motion.circle cx="18" cy="18" r={R} fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={CIRC} initial={{ strokeDashoffset: CIRC }} animate={{ strokeDashoffset: CIRC * (1 - 0.68) }} transition={{ duration: 1.4, ease: "easeOut" }} />
          </svg>
          <span className="absolute text-[9px] font-bold text-sky-300">68%</span>
        </div>
        <div className="flex-1 space-y-0.5 text-[9px] text-zinc-400">
          <p className="flex justify-between"><span>Storage</span><span className="text-zinc-200">348 / 512 GB</span></p>
          <p className="flex justify-between"><span>Memory</span><span className="text-zinc-200">42 / 128 GiB</span></p>
          <p className="flex justify-between"><span>Uptime</span><span className="font-mono text-zinc-200">{mm}:{ss}</span></p>
        </div>
      </div>
      <motion.button whileTap={{ scale: 0.96 }} onClick={() => os.open("monitor")}
        className="mt-2 w-full rounded-lg bg-white/8 py-1 text-[10px] font-semibold text-zinc-200 hover:bg-white/15">Open Activity Monitor</motion.button>
    </Tilt>
  );
}
function StacksWidget() {
  const os = useOS();
  const tiles: { label: string; node: React.ReactNode; run: () => void }[] = [
    { label: "Documents", node: <FolderIcon size={34} />, run: () => os.open("finder", { path: "~/Documents" }) },
    { label: "Case File", node: <FolderIcon size={34} />, run: () => os.open("finder", { path: "~/cases/WEKO-08" }) },
    { label: "Pictures", node: <FolderIcon size={34} />, run: () => os.open("finder", { path: "~/Pictures" }) },
    { label: "KOICA Video", node: <div className="grid size-[34px] place-items-center rounded-lg bg-gradient-to-b from-fuchsia-500 to-purple-700 shadow"><L.Play className="size-4 text-white ml-0.5" fill="white" /></div>, run: () => os.open("media") },
  ];
  return (
    <Tilt className="p-3.5">
      <p className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-200"><L.FolderOpen className="size-3.5 text-sky-300" /> Stacks</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {tiles.map((t, i) => (
          <motion.button key={t.label} initial={{ opacity: 0, y: 10, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...SPRING_POP, delay: i * 0.06 }}
            whileHover={{ y: -5, scale: 1.08, rotate: i % 2 ? 2 : -2 }} whileTap={{ scale: 0.9 }} onClick={t.run}
            className="flex flex-col items-center gap-1 rounded-xl bg-white/5 p-2 hover:bg-white/10">
            {t.node}<span className="text-[8px] text-zinc-400 leading-tight">{t.label}</span>
          </motion.button>))}
      </div>
    </Tilt>
  );
}
const HUB_FACTS = ["₩1.5322T support budget (2026)", "28.2% of Korea's total ODA", "49 offices in 48 countries", "27,000+ WFK volunteers since 1990", "GCF Accredited Entity since 2021", "KDRT: INSARAG Heavy · WHO EMT Type-1"];
function HubTickerWidget() {
  const os = useOS(); const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % HUB_FACTS.length), 3500); return () => clearInterval(t); }, []);
  return (
    <Tilt className="p-3">
      <div className="flex items-center gap-2.5">
        <motion.img src="/koicahub.webp" alt="" whileHover={{ rotate: 8, scale: 1.1 }} transition={ELASTIC_ICON} className="size-9 object-contain drop-shadow-[0_4px_12px_rgba(251,191,36,.4)]" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">KOICA Hub</p>
          <div className="h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.35 }}
                className="truncate text-[10px] text-zinc-300">{HUB_FACTS[i]}</motion.p>
            </AnimatePresence>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => os.open("hub")}
          className="rounded-full bg-amber-500/20 px-2.5 py-1 text-[9px] font-bold text-amber-300 hover:bg-amber-500/30">OPEN</motion.button>
      </div>
    </Tilt>
  );
}
function CalendarMiniWidget() {
  const os = useOS(); const now = new Date();
  const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const fd = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  return (
    <Tilt className="p-3">
      <button onClick={() => os.open("calendar")} className="w-full text-left chrome">
        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300">{now.toLocaleString("default", { month: "long" })} <span className="text-zinc-400">{now.getFullYear()}</span></p>
        <div className="mt-1.5 grid grid-cols-7 gap-[3px] text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="text-[7px] text-zinc-500">{d}</span>)}
          {Array.from({ length: fd }).map((_, i) => <span key={`e${i}`} />)}
          {Array.from({ length: dim }, (_, i) => i + 1).map((d) => (
            <span key={d} className={cx("grid h-4 place-items-center rounded text-[8px]", d === now.getDate() ? "bg-rose-500 font-bold text-white shadow" : "text-zinc-400")}>{d}</span>))}
        </div>
      </button>
    </Tilt>
  );
}
function DesktopWidgets() {
  return (
    <div className="widget-scroll pointer-events-auto absolute left-4 top-10 z-[700] hidden w-[280px] flex-col gap-3 overflow-y-auto pb-24 lg:flex" style={{ maxHeight: "calc(100vh - 120px)" }}>
      {[<ClockWidget key="c" />, <WeatherWidget key="w" />, <SystemWidget key="s" />, <StacksWidget key="f" />, <HubTickerWidget key="h" />, <CalendarMiniWidget key="k" />].map((W, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -30, scale: 0.94 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ ...SPRING_SOFT, delay: 0.35 + i * 0.09 }}>
          {W}
        </motion.div>))}
    </div>
  );
}

/* ── 25. iOS / WATCH SHELLS ──────────────────────────────────────────────────── */
function IOSShell({ openApp }: { openApp: (a: AppId, p?: any) => void }) {
  const os = useOS(); const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const homeApps: AppId[] = ["hub", "terminal", "atlas", "timeline", "programs", "media", "photos", "messages", "safari", "notes", "calculator", "calendar", "settings", "monitor", "music", "story"];
  const dockApps: AppId[] = ["finder", "safari", "terminal", "messages"];
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: WALLPAPERS[os.wallpaper].css }}>
      {WALLPAPERS[os.wallpaper].img && <img src={WALLPAPERS[os.wallpaper].img} alt="" className="absolute inset-0 h-full w-full object-cover kenburns" />}
      <div className="absolute inset-0 bg-black/15 backdrop-blur-2xl" />
      <div className="chrome relative z-10 flex items-center justify-between px-6 pt-3 text-[13px] font-semibold text-white">
        <span>{t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })}</span>
        <div className="flex items-center gap-1"><L.Signal className="size-3.5" /><L.Wifi className="size-3.5" /><L.BatteryFull className="size-4" /></div>
      </div>
      <div className="relative z-10 mx-auto mt-1 h-7 w-28 rounded-full bg-black shadow-inner" />
      <div className="relative z-10 mt-6 grid grid-cols-4 gap-x-3 gap-y-5 px-4 chrome overflow-y-auto pb-32">
        {homeApps.map((id, i) => (
          <motion.button key={id} initial={{ opacity: 0, scale: 0.4, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ ...ELASTIC_ICON, delay: i * 0.03 }} whileTap={{ scale: 0.82 }}
            onClick={() => openApp(id)} className="flex flex-col items-center gap-1">
            <div className="size-14 grid place-items-center">{React.createElement(APPS[id].Icon)}</div>
            <span className="text-[10.5px] text-white font-medium drop-shadow-md truncate max-w-[70px]">{APPS[id].name}</span>
          </motion.button>))}
      </div>
      <div className="absolute inset-x-3 bottom-3 z-10 rounded-[28px] bg-white/15 backdrop-blur-2xl border border-white/20 p-2 chrome">
        <div className="grid grid-cols-4 gap-2">{dockApps.map((id) => (
          <motion.button key={id} whileTap={{ scale: 0.82 }} onClick={() => openApp(id)} className="grid size-14 place-items-center mx-auto">{React.createElement(APPS[id].Icon)}</motion.button>))}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0.5 z-10 flex justify-center"><div className="h-1 w-32 rounded-full bg-white/70" /></div>
    </div>);
}
function WatchShell({ openApp }: { openApp: (a: AppId, p?: any) => void }) {
  const [t, setT] = useState(new Date()); const [view, setView] = useState<"face" | "grid">("face");
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const apps: AppId[] = ["hub", "terminal", "atlas", "timeline", "programs", "media", "messages", "settings"];
  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex items-center justify-center">
      <div className="relative w-[240px] h-[290px] rounded-[52px] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 p-[10px] shadow-[0_20px_60px_rgba(0,0,0,.9)]">
        <div className="absolute -right-[6px] top-[70px] w-[10px] h-[54px] rounded-r-lg bg-gradient-to-b from-orange-500 to-orange-700 shadow-lg" onClick={() => setView(view === "face" ? "grid" : "face")} />
        <div className="absolute -right-[4px] top-[150px] w-[8px] h-[34px] rounded-r-md bg-zinc-600" />
        <div className="w-full h-full rounded-[42px] bg-black overflow-hidden relative">
          <div className="chrome absolute top-2 inset-x-0 flex justify-between px-4 text-[9px] text-zinc-400 z-20">
            <span className="text-amber-400 font-mono">{t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })}</span>
            <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500" />94%</span>
          </div>
          {view === "face" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center px-3">
              <div className="relative w-32 h-32 rounded-full border border-zinc-800 flex items-center justify-center">
                <div className="absolute inset-2 rounded-full border border-dashed border-zinc-800" />
                <div className="text-center"><p className="text-[34px] font-extrabold text-white leading-none tabular-nums">{t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })}</p>
                  <p className="text-[8px] text-orange-400 uppercase tracking-widest mt-1">KOICA ∞</p></div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5 w-full">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => openApp("hub")} className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-1.5 text-center"><p className="text-[8px] text-amber-300 font-bold">₩1.53T</p><p className="text-[6px] text-zinc-500">budget</p></motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => openApp("atlas")} className="rounded-xl bg-sky-500/15 border border-sky-500/30 p-1.5 text-center"><p className="text-[8px] text-sky-300 font-bold">49</p><p className="text-[6px] text-zinc-500">offices</p></motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => openApp("timeline")} className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-1.5 text-center"><p className="text-[8px] text-emerald-300 font-bold">35y</p><p className="text-[6px] text-zinc-500">since '91</p></motion.button>
              </div>
            </motion.div>) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full grid grid-cols-3 gap-2 content-center px-4 pt-4">
              {apps.map((id, i) => (
                <motion.button key={id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...ELASTIC_ICON, delay: i * 0.04 }} whileTap={{ scale: 0.8 }}
                  onClick={() => openApp(id)} className="aspect-square rounded-full overflow-hidden ring-1 ring-white/20">{React.createElement(APPS[id].Icon)}</motion.button>))}
            </motion.div>)}
        </div>
      </div>
    </div>);
}

/* ── 26. ROOT ────────────────────────────────────────────────────────────────── */
let WIN_SEQ = 1;
export default function Page() {
  const [booted, setBooted] = useState(false); const [sleeping, setSleeping] = useState(false); const [locked, setLocked] = useState(false);
  const [spot, setSpot] = useState(false); const [dark, setDark] = useState(true); const [wallpaper, setWallpaper] = useState(0);
  const [volume, setVolume] = useState(70); const [brightness, setBrightness] = useState(85);
  const [wins, setWins] = useState<Win[]>([]); const [focusedId, setFocusedId] = useState<number | null>(null);
  const [notices, setNotices] = useState<any[]>([]); const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [missionControl, setMissionControl] = useState(false);
  const { bp } = useBreakpoint(); const isWatch = bp === "watch"; const isIOS = bp === "mobile";
  const notify = useCallback((t: string, b: string, icon?: React.ReactNode) => { const id = Date.now() + Math.random(); setNotices((n) => [...n, { id, t, b, icon }]); setTimeout(() => setNotices((n) => n.filter((x) => x.id !== id)), 4200); }, []);
  const focus = useCallback((id: number) => { setWins((ws) => { const top = Math.max(...ws.map((w) => w.z), 10); return ws.map((w) => (w.id === id ? { ...w, z: top + 1 } : w)); }); setFocusedId(id); }, []);
  const open = useCallback((app: AppId, props?: any) => {
    setWins((ws) => {
      const ex = ws.find((w) => w.app === app); const top = Math.max(...ws.map((w) => w.z), 10);
      if (ex) { setFocusedId(ex.id); return ws.map((w) => (w.id === ex.id ? { ...w, minimized: false, z: top + 1, props: props ?? w.props } : w)); }
      const d = APPS[app]; const off = (ws.length % 6) * 24; const id = WIN_SEQ++;
      const viewW = Math.min(d.w, window.innerWidth - 24); const viewH = Math.min(d.h, window.innerHeight - 60);
      const win: Win = { id, app, title: d.name, x: Math.max(12, (window.innerWidth - viewW) / 2 - 60 + off), y: Math.max(MENU_H + 6, (window.innerHeight - viewH) / 2 - 50 + off), w: viewW, h: viewH, z: top + 1, minimized: false, maximized: false, snapped: null, props };
      setFocusedId(id); return [...ws, win];
    });
  }, []);
  const close = useCallback((id: number) => { setWins((ws) => ws.filter((w) => w.id !== id)); setFocusedId((f) => (f === id ? null : f)); }, []);
  const minimize = useCallback((id: number) => { setWins((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w))); setFocusedId(null); }, []);
  const restore = useCallback((id: number) => { setWins((ws) => { const top = Math.max(...ws.map((w) => w.z), 10); return ws.map((w) => (w.id === id ? { ...w, minimized: false, z: top + 1 } : w)); }); setFocusedId(id); }, []);
  const toggleMax = useCallback((id: number) => { setWins((ws) => ws.map((w) => { if (w.id !== id) return w; if (w.maximized) return { ...w, maximized: false, snapped: null, ...(w.prev ?? {}) }; return { ...w, maximized: true, snapped: null, prev: { x: w.x, y: w.y, w: w.w, h: w.h }, x: 0, y: MENU_H, w: window.innerWidth, h: window.innerHeight - MENU_H }; })); focus(id); }, [focus]);
  const snapWindow = useCallback((id: number, side: "left" | "right" | null) => { setWins((ws) => ws.map((w) => { if (w.id !== id) return w; if (!side) return { ...w, snapped: null, ...(w.prev ?? {}) }; return { ...w, snapped: side, maximized: false, prev: { x: w.x, y: w.y, w: w.w, h: w.h } }; })); focus(id); }, [focus]);
  const commit = useCallback((id: number, b: Partial<Win>) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...b } : w))), []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.code === "Space") { e.preventDefault(); setSpot((s) => !s); }
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); setSpot(true); }
      if (e.key === "Escape") { setSpot(false); setCtx(null); }
      if (mod && e.key.toLowerCase() === "w" && focusedId) { e.preventDefault(); close(focusedId); }
      if (mod && e.key.toLowerCase() === "m" && focusedId) { e.preventDefault(); minimize(focusedId); }
      if (e.key === "F11") { e.preventDefault(); setMissionControl((m) => !m); }
      if (mod && /^[1-9]$/.test(e.key)) { e.preventDefault(); const map: AppId[] = ["hub", "terminal", "atlas", "timeline", "programs", "media", "photos", "settings", "monitor"]; const a = map[+e.key - 1]; if (a) open(a); }
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [focusedId, close, minimize, open]);
  const api: OSApi = { dark, setDark, wallpaper, setWallpaper, open, close, minimize, restore, toggleMax, snapWindow, focus, commit, notify, sleep: () => setSleeping(true), lock: () => setLocked(true), restart: () => { setWins([]); setBooted(false); }, focusedApp: wins.find((w) => w.id === focusedId)?.app ?? null, focusedId, wins, notices, volume, setVolume, brightness, setBrightness, missionControl, setMissionControl };
  const wp = WALLPAPERS[wallpaper];
  if (booted && (isWatch || isIOS)) {
    return (
      <OS.Provider value={api}>
        <style>{GLOBAL_CSS}</style>
        {isWatch ? <WatchShell openApp={open} /> : <IOSShell openApp={open} />}
        <AnimatePresence>{wins.map((w) => (
          <motion.div key={w.id} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={SPRING_POP} className="fixed inset-0 z-[2000] flex flex-col bg-zinc-950">
            <div className="chrome flex items-center justify-between px-4 py-2 bg-zinc-900/95 backdrop-blur-xl border-b border-white/5">
              <button onClick={() => close(w.id)} className="text-sky-400 text-[15px] font-medium">Close</button>
              <p className="text-[15px] font-semibold text-white truncate">{APPS[w.app].name}</p><span className="w-12" />
            </div>
            <div className="flex-1 overflow-hidden">{React.createElement(APPS[w.app].view, { winId: w.id, ...(w.props ?? {}) })}</div>
          </motion.div>))}
        </AnimatePresence>
        {spot && <Spotlight onClose={() => setSpot(false)} />}
        <Notifications notices={notices} />
      </OS.Provider>);
  }
  return (
    <OS.Provider value={api}>
      <style>{GLOBAL_CSS}</style>
      <div className="fixed inset-0 overflow-hidden" style={{ background: wp.css }}>
        <AnimatePresence mode="sync">
          {wp.img && (
            <motion.div key={wallpaper} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.0 }}
              className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center kenburns" style={{ backgroundImage: `url(${wp.img})` }} />
              <div className="absolute inset-0" style={{ background: wp.css }} />
            </motion.div>)}
        </AnimatePresence>
        {!wp.img && <motion.div key={"g" + wallpaper} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} className="grad-animate absolute inset-0" style={{ background: wp.css }} />}
        <div className="pointer-events-none absolute inset-0 z-[9990] bg-black transition-opacity" style={{ opacity: (100 - brightness) / 130 }} />
        <div className="notch hidden sm:flex"><div className="w-2 h-2 rounded-full bg-zinc-800" /><span className="text-[10px] text-zinc-500 font-mono">WeKO ∞</span></div>
        <AnimatePresence>{!booted && <BootScreen key="boot" onDone={() => setBooted(true)} />}</AnimatePresence>
        {booted && (<>
          <MenuBar openSpotlight={() => setSpot(true)} openApp={open} />
          {/* clean Stage — pins removed; WidgetKit column provides essentials */}
          <div className="absolute inset-x-0 bottom-0 top-8" onContextMenu={(e) => { e.preventDefault(); if (e.altKey) { setMissionControl(true); return; } setCtx({ x: e.clientX, y: e.clientY }); }} />
          <DesktopWidgets />
          <AnimatePresence>{wins.map((w) => <WindowFrame key={w.id} win={w} />)}</AnimatePresence>
          <Dock /><Notifications notices={notices} />
          <AnimatePresence>{ctx && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={SPRING_POP}
              className="chrome absolute z-[940] w-56 rounded-lg border border-white/10 bg-zinc-800/95 p-1 shadow-2xl backdrop-blur-2xl"
              style={{ left: Math.min(ctx.x, window.innerWidth - 240), top: Math.min(ctx.y, window.innerHeight - 220) }}>
              {[{ l: "Change Wallpaper", r: () => setWallpaper((w) => (w + 1) % WALLPAPERS.length) }, { l: "Toggle Dark Mode", r: () => setDark(!dark) }, { l: "Open KOICA Hub", r: () => open("hub") }, { l: "Open koica.pdf", r: () => open("pdf", { src: "/koica.pdf", title: "koica.pdf" }) }, { l: "Open Terminal", r: () => open("terminal") }, { l: "Mission Control", r: () => setMissionControl(true) }].map((it) => (
                <button key={it.l} onClick={() => { it.r(); setCtx(null); }} className="block w-full rounded-md px-3 py-1.5 text-left text-[13px] text-zinc-100 hover:bg-sky-600">{it.l}</button>))}
            </motion.div>)}
          </AnimatePresence>
          {ctx && <div className="fixed inset-0 z-[939]" onClick={() => setCtx(null)} />}
          <AnimatePresence>{spot && <Spotlight key="spot" onClose={() => setSpot(false)} />}</AnimatePresence>
          <AnimatePresence>{missionControl && <MissionControl key="mc" />}</AnimatePresence>
          <AnimatePresence>{sleeping && <motion.div key="sl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] cursor-pointer bg-black" onClick={() => setSleeping(false)} />}</AnimatePresence>
          <AnimatePresence>{locked && <LockScreen key="lk" unlock={() => setLocked(false)} />}</AnimatePresence>
          <p className="chrome pointer-events-none absolute bottom-1 left-3 z-[700] text-[10px] text-white/40 hidden sm:block">macOS Sequoia · KOICA Infinite Premium · Natural Earth geography · public information</p>
        </>)}
      </div>
    </OS.Provider>);
}
