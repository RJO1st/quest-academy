"use client";
<<<<<<< HEAD

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const RocketIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.5-1 1-4c1.5 0 3 .5 3 .5L9 12Z"/>
    <path d="M12 15v5s1 .5 4 1c0-1.5-.5-3-.5-3L12 15Z"/>
  </svg>
);

const XIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const MenuIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const ChevronIcon = ({ size = 16, dir = "right" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === "down" ? "rotate(90deg)" : "none", transition: "transform 0.2s ease" }}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// ─── CONSTANTS – now with parent‑friendly terminology ─────────────────────────
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  { emoji: "🧠", title: "Adaptive AI", desc: "Generates fresh questions perfectly calibrated to your child's exact level – keeps them challenged but not frustrated." },
  { emoji: "📊", title: "Parent Dashboard", desc: "Live insights on accuracy, speed, and topic mastery. See exactly where your child needs help." },
  { emoji: "👨‍👩‍👧‍👦", title: "Family Profiles", desc: "Manage up to 4 scholars from one account. Set individual targets and track each child's progress." },
  { emoji: "🔒", title: "Secure Sync", desc: "All progress is instantly synced across devices. Switch from tablet to desktop seamlessly." },
  { emoji: "📚", title: "Full Curriculum", desc: "Covers Maths, English, Verbal & Non-Verbal Reasoning for GL Assessment, CEM, and independent schools." },
  { emoji: "🏆", title: "XP & Streaks", desc: "Leaderboards, badges, and rewards turn daily practice into a game – motivating kids to keep going." },
];

const PRICING_PLANS = [
  { name: "Scholar", price: "£9.99", per: "/mo", desc: "One child, getting started on their 11+ journey.", cta: "Start Free Trial", highlight: false, features: ["1 Scholar profile", "AI‑generated questions", "Core subjects (Maths, English)", "Weekly progress report"] },
  { name: "Family", price: "£17.99", per: "/mo", desc: "The complete package for families with multiple children.", cta: "Start Free Trial", highlight: true, badge: "Most Popular", features: ["Up to 4 Scholar profiles", "Full subject coverage (inc. Reasoning)", "Parent Dashboard with analytics", "Priority support"] },
  { name: "Academy", price: "£34.99", per: "/mo", desc: "The ultimate edge for serious preparation.", cta: "Contact Us", highlight: false, features: ["Unlimited profiles", "Advanced telemetry", "Custom study plans", "Monthly progress review call"] },
];

const REVIEWS = [
  { initials: "SM", name: "Sarah M.", role: "Parent, Surrey", rating: 5, quote: "Within a week the AI had pinpointed my daughter's weak spots in verbal reasoning. She went up 18% in a month." },
  { initials: "RP", name: "Rajan P.", role: "Parent, Hertfordshire", rating: 5, quote: "My son went from 65% to 89% accuracy in maths in six weeks. The dashboard gives me real confidence – I can see exactly where he's improving." },
];

const FAQS = [
  { q: "What age is LaunchPard for?", a: "Years 3–6 (ages 7–11). Our AI adapts content difficulty to match your child's current year group and target school type." },
  { q: "How does the 14‑day free trial work?", a: "Full access to the Family plan for 14 days, no credit card required. Cancel anytime with zero obligation." },
  { q: "Can my child use this on a tablet?", a: "Yes – fully optimised for tablets, phones, and desktop. All progress syncs instantly." },
];

const STATS = [
  { n: "12k+", l: "Active Scholars" },
  { n: "97%", l: "Success Rate" },
  { n: "4.9 ★", l: "Parent Rating" },
  { n: "14‑day", l: "Free Trial" },
];

export default function HomePage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [modal, setModal] = useState(null);
=======
import React, { useState } from "react";

// --- MOCKS FOR PREVIEW ENVIRONMENT ---
// These mocks allow the component to render in the preview without external dependencies.
const useRouter = () => ({
  push: (path) => console.log(`Navigating to: ${path}`),
});

const createBrowserClient = () => ({
  auth: {
    signUp: async ({ email }) => {
      console.log("Mock signing up:", email);
      return { data: { user: { email } }, error: null };
    },
    signInWithPassword: async ({ email }) => {
      console.log("Mock signing in:", email);
      return { data: { user: { email } }, error: null };
    }
  }
});

// --- INLINED ICONS ---
const TrophyIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

const BrainIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A5 5 0 0 1 12 7.33A5 5 0 0 1 14.5 2"/><path d="M17 15a5 5 0 1 1-5 5"/><path d="M2 9a5 5 0 0 1 7-4.5h.5a5 5 0 0 1 4.5 7v.5a5 5 0 0 1-7 4.5H6.5a5 5 0 0 1-4.5-7Z"/><path d="M22 9a5 5 0 0 0-7-4.5h-.5a5 5 0 0 0-4.5 7v.5a5 5 0 0 0 7 4.5h.5a5 5 0 0 0 4.5-7Z"/></svg>
);

const UsersIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const ArrowRightIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const ShieldCheckIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const ZapIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
);

const StarIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const XCircleIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

const CheckCircleIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

// --- COMPONENT ---
export default function Gateway() {
  const [activeModal, setActiveModal] = useState(null); 
>>>>>>> origin/main
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scholarCode, setScholarCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
<<<<<<< HEAD
  const [openFaq, setOpenFaq] = useState(null);

  const openModal = useCallback((type) => {
    setModal(type);
    setError("");
    setEmail("");
    setPassword("");
    setScholarCode("");
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setError("");
  }, []);
=======
  
  const router = useRouter();
  const supabase = createBrowserClient();
>>>>>>> origin/main

  const handleParentAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
<<<<<<< HEAD
      if (modal === "signup") {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (data?.session) {
          router.push("/dashboard/parent");
        } else {
          alert("✅ Check your email to confirm your account!");
        }
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        if (data?.session) {
          router.push("/dashboard/parent");
        }
      }
      closeModal();
=======
      if (activeModal === "parent_signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        alert("Success! Welcome to Quest Academy.");
        setActiveModal(null);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/parent");
      }
>>>>>>> origin/main
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleScholarCode = async (e) => {
    e.preventDefault();
    const code = scholarCode.trim().toUpperCase();
    if (code.length < 4) {
      setError("Code too short!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/scholar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const text = await response.text();

      if (!text || text.startsWith('<')) {
        console.error("API returned HTML instead of JSON. Raw response:", text);
        setError("Service temporarily unavailable. Please try again.");
        setLoading(false);
        return;
      }

      const result = JSON.parse(text);

      if (!response.ok) {
        setError(result.error || "Scholar code not found. Please check with your parent.");
      } else {
        localStorage.setItem("active_scholar", JSON.stringify(result.scholar));
        closeModal();
        router.push("/dashboard/student");
      }
    } catch (err) {
      console.error("Crash:", err);
      setError("System error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3 font-black text-xl text-slate-900">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md border-b-4 border-indigo-800">
              <RocketIcon size={20} />
            </div>
            LaunchPard
          </div>

          <div className="hidden md:flex gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => openModal("scholar")}
              className="hidden md:flex items-center gap-2 font-bold text-slate-500 hover:text-indigo-600 px-4 py-2 transition-colors"
            >
              👨‍🎓 Scholar Login
            </button>
            <button
              onClick={() => openModal("login")}
              className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-2xl border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 hover:bg-indigo-700 transition-all"
            >
              Parent Portal
            </button>
=======
  const handleStudentAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/student");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <TrophyIcon size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight">Quest Academy</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-bold text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <button onClick={() => setActiveModal("student_login")} className="hover:text-indigo-600 transition-colors flex items-center gap-2">
              <BrainIcon size={18} /> Scholar Login
            </button>
            <div className="flex items-center gap-3 border-l-2 border-slate-200 pl-8">
              <button onClick={() => setActiveModal("parent_login")} className="text-slate-600 hover:text-indigo-600 transition-colors">Sign In</button>
              <button onClick={() => setActiveModal("parent_signup")} className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg">Get Started</button>
            </div>
>>>>>>> origin/main
          </div>
        </div>
      </nav>

<<<<<<< HEAD
      <main className="flex-grow pt-32 px-6">
        {/* HERO */}
        <section className="text-center max-w-5xl mx-auto mb-32">
          <span className="inline-block bg-indigo-100 text-indigo-700 font-bold px-5 py-2 rounded-full text-sm uppercase tracking-widest mb-6 border border-indigo-200">
            🇬🇧 UK 11+ Prep • Trusted by 12,000+ parents
          </span>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95]">
            Turn screen time into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">scholarship.</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Gamified AI learning that actually prepares your child for the 11+. 
            Earn XP, track progress, and get insights only a parent could love.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button
              onClick={() => openModal("signup")}
              className="bg-indigo-600 text-white text-xl px-10 py-5 rounded-[24px] font-black shadow-xl border-b-4 border-indigo-800 active:translate-y-1 hover:bg-indigo-700 transition-all"
            >
              Start Free Trial 🚀
            </button>
            <button
              onClick={() => openModal("scholar")}
              className="bg-white text-slate-700 text-xl px-10 py-5 rounded-[24px] font-black shadow-sm border-2 border-slate-200 border-b-4 active:translate-y-1 hover:bg-slate-50 transition-all"
            >
              Scholar Login
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="bg-white border-2 border-slate-100 border-b-4 rounded-[32px] p-8 shadow-sm text-center"
              >
                <div className="text-3xl font-black text-indigo-600">{s.n}</div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-7xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Built for families. Powered by AI.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border-2 border-slate-100 border-b-8 rounded-[40px] p-10 hover:border-indigo-200 transition-all group"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{f.emoji}</div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">{f.title}</h3>
                <p className="text-slate-500 font-bold text-lg leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-7xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">Simple pricing. No hidden costs.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative bg-white border-4 rounded-[48px] p-10 flex flex-col shadow-sm ${
                  p.highlight
                    ? 'border-indigo-600 border-b-[12px] scale-105 shadow-2xl z-10'
                    : 'border-slate-200 border-b-[12px]'
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-black text-sm uppercase px-6 py-2 rounded-full shadow-lg">
                    ⭐ {p.badge}
                  </div>
                )}
                <div className="text-6xl font-black mb-4 tracking-tighter">
                  {p.price}
                  <span className="text-xl text-slate-400 font-bold">{p.per}</span>
                </div>
                <p className="text-slate-500 font-bold text-lg mb-10 flex-grow">{p.desc}</p>
                <button
                  onClick={() => openModal(p.cta === "Contact Us" ? null : "signup")}
                  className={`w-full py-5 rounded-[24px] font-black text-xl border-b-4 transition-all mb-10 ${
                    p.highlight
                      ? 'bg-indigo-600 text-white border-indigo-800'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {p.cta}
                </button>
                <div className="space-y-4">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-4 font-bold text-slate-600">
                      <CheckIcon size={20} className={p.highlight ? "text-indigo-600" : "text-emerald-500"} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="reviews" className="bg-indigo-600 py-24 rounded-[60px] max-w-7xl mx-auto mb-32 text-white px-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-white/10 p-10 rounded-[40px] border-2 border-white/20">
              <p className="text-2xl font-bold italic mb-8">"{r.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-400 rounded-full flex items-center justify-center font-black">
                  {r.initials}
                </div>
                <div className="font-black text-xl">{r.name}, {r.role}</div>
              </div>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-3xl mx-auto mb-32">
          <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-widest text-slate-400">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left font-black text-xl flex justify-between items-center transition-colors hover:bg-slate-50"
                >
                  {faq.q}
                  <ChevronIcon dir={openFaq === i ? "down" : "right"} />
                </button>
                {openFaq === i && (
                  <p className="p-6 pt-0 font-bold text-slate-500 border-t-2 border-slate-50">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
=======
      {/* --- HERO SECTION --- */}
      <main className="pt-32 pb-20">
        <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-black text-sm mb-8 uppercase tracking-wider border border-indigo-100">
            <StarIcon size={16} /> The UK's Premier 11+ Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-balance text-slate-900">
            Turn screen time into <span className="text-indigo-600 relative inline-block">scholarship.<div className="absolute -bottom-2 left-0 w-full h-3 bg-indigo-200 -z-10 rounded-full"></div></span>
          </h1>
          <p className="text-xl text-slate-500 font-bold mb-10 max-w-2xl mx-auto leading-relaxed">
            Manage multiple children, track deep analytics, and let our adaptive AI engine build the perfect 11+ learning journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 font-black">
            <button onClick={() => setActiveModal("parent_signup")} className="bg-indigo-600 text-white text-lg px-10 py-5 rounded-full shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105">
              Start Free Trial
            </button>
            <button onClick={() => setActiveModal("student_login")} className="bg-white border-2 border-slate-200 text-slate-600 text-lg px-10 py-5 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm">
              Enter Scholar Code
            </button>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="px-6 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Built for Families. Powered by AI.</h2>
              <p className="text-xl text-slate-500 font-bold">Everything you need to manage your child's 11+ journey.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-10 rounded-[40px] border-2 border-slate-100">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <UsersIcon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-3">Family Profiles</h3>
                <p className="text-slate-500 font-bold leading-relaxed">Manage multiple scholars under one parent account. Set individual target exams and year groups.</p>
              </div>
              <div className="bg-slate-50 p-10 rounded-[40px] border-2 border-slate-100">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheckIcon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-3">Secure Cloud Vault</h3>
                <p className="text-slate-500 font-bold leading-relaxed">All progress is instantly synced to our secure database. Switch from iPad to Desktop seamlessly.</p>
              </div>
              <div className="bg-slate-50 p-10 rounded-[40px] border-2 border-slate-100">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <ZapIcon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-3">Deep Analytics</h3>
                <p className="text-slate-500 font-bold leading-relaxed">Track accuracy, speed, and exact topic proficiencies on your live Parent Dashboard.</p>
              </div>
            </div>
>>>>>>> origin/main
          </div>
        </section>
      </main>

<<<<<<< HEAD
      {/* FOOTER */}
      <footer className="bg-slate-900 py-16 px-6 text-slate-400 font-bold text-center border-t-8 border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-2 text-white font-black text-2xl">
            <RocketIcon size={24} /> LaunchPard
          </div>
          <div>© {new Date().getFullYear()} LaunchPard Learning. Registered in England & Wales.</div>
        </div>
      </footer>

      {/* MODALS */}
      {modal && (
        <div
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-md rounded-[48px] border-[6px] border-slate-100 shadow-2xl p-10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {modal === 'scholar'
                  ? 'Scholar Login'
                  : modal === 'signup'
                  ? 'Create Parent Account'
                  : 'Parent Login'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-rose-500 p-2">
                <XIcon size={28} />
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-5 rounded-[24px] font-black mb-8 border-4 border-rose-100">
                ⚠️ {error}
              </div>
            )}

            {modal === 'scholar' ? (
              <form onSubmit={handleScholarCode}>
                <input
                  type="text"
                  required
                  className="w-full p-6 bg-slate-50 border-4 border-slate-100 rounded-[32px] font-black text-center text-4xl uppercase tracking-widest outline-none focus:border-indigo-500 mb-8"
                  placeholder="QUEST-1234"
                  value={scholarCode}
                  onChange={(e) => setScholarCode(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-6 rounded-[32px] text-2xl border-b-4 border-indigo-800 shadow-lg active:translate-y-1"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Access Dashboard →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleParentAuth} className="space-y-4">
                <input
                  type="email"
                  required
                  className="w-full p-5 bg-slate-50 border-4 border-slate-100 rounded-[24px] font-bold text-lg outline-none focus:border-indigo-500"
                  placeholder="parent@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  required
                  className="w-full p-5 bg-slate-50 border-4 border-slate-100 rounded-[24px] font-bold text-lg outline-none focus:border-indigo-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-5 rounded-[24px] text-xl border-b-4 border-indigo-800 shadow-lg active:translate-y-1"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : 'Continue'}
                </button>
                <div className="text-center mt-5">
                  <button
                    type="button"
                    className="text-indigo-600 font-bold hover:underline"
                    onClick={() => setModal(modal === 'login' ? 'signup' : 'login')}
                  >
                    {modal === 'login'
                      ? "New here? Create a parent account"
                      : "Already have an account? Log in"}
                  </button>
                </div>
=======
      {/* PARENT AUTH MODAL */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-800">
                {activeModal === 'student_login' ? "Enter Academy" : activeModal === 'parent_signup' ? "Create Account" : "Parent Sign In"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <XCircleIcon size={28} />
              </button>
            </div>

            {error && <div className="mx-6 mt-6 p-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm border border-rose-100">{error}</div>}

            {(activeModal === 'parent_login' || activeModal === 'parent_signup') && (
              <form onSubmit={handleParentAuth} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-wider text-slate-400">Email Address</label>
                  <input type="email" required className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-wider text-slate-400">Password</label>
                  <input type="password" required className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 mt-4">
                  {loading ? "Authenticating..." : activeModal === 'parent_signup' ? "Sign Up" : "Secure Sign In"}
                </button>
                <div className="text-center pt-2">
                   <button 
                     type="button"
                     onClick={() => setActiveModal(activeModal === 'parent_signup' ? 'parent_login' : 'parent_signup')}
                     className="text-indigo-600 font-bold text-sm hover:underline"
                   >
                     {activeModal === 'parent_signup' ? "Already a member? Sign In" : "New to Quest Academy? Sign Up"}
                   </button>
                </div>
              </form>
            )}

            {activeModal === 'student_login' && (
              <form onSubmit={handleStudentAuth} className="p-6 space-y-6">
                <div className="text-center">
                   <label className="block text-sm font-black text-slate-400 mb-4 uppercase tracking-widest">Scholar Access Code</label>
                   <input 
                     type="text" 
                     required 
                     maxLength={6} 
                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-center text-2xl tracking-[0.5em] focus:border-indigo-500 outline-none transition-all uppercase" 
                     placeholder="XXXXXX" 
                     value={scholarCode} 
                     onChange={(e) => setScholarCode(e.target.value)} 
                   />
                </div>
                <button type="submit" disabled={loading || scholarCode.length < 4} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? "Loading..." : "Enter Academy"} <ArrowRightIcon size={20} />
                </button>
>>>>>>> origin/main
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
