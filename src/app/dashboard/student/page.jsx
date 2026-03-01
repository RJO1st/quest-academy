"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import QuizEngine from "../../../components/game/QuizEngine"; // adjust path if needed

// Icons (inlined for simplicity – you can move them to a separate file)
const RocketIcon = ({ size = 24 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.5-1 1-4c1.5 0 3 .5 3 .5L9 12Z"/><path d="M12 15v5s1 .5 4 1c0-1.5-.5-3-.5-3L12 15Z"/></svg>);
const BrainIcon = ({ size = 24 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A5 5 0 0 1 12 7.33A5 5 0 0 1 14.5 2"/><path d="M17 15a5 5 0 1 1-5 5"/><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0"/></svg>);
const ZapIcon = ({ size = 24 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>);
const StarIcon = ({ size = 24 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);

export default function StudentDashboard() {
  const [scholar, setScholar] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [previousQuestionIds, setPreviousQuestionIds] = useState([]);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Load scholar from localStorage
  useEffect(() => {
    const savedScholar = localStorage.getItem("active_scholar");
    if (!savedScholar) {
      router.push("/student"); // redirect to login page
    } else {
      setScholar(JSON.parse(savedScholar));
    }
  }, [router]);

  // Fetch question history once scholar is loaded
  useEffect(() => {
    if (scholar?.id) {
      const fetchHistory = async () => {
        const { data, error } = await supabase
          .from('scholar_question_history')
          .select('question_id')
          .eq('scholar_id', scholar.id);
        if (!error && data) {
          setPreviousQuestionIds(data.map(h => h.question_id));
        } else {
          console.error("Failed to fetch question history:", error);
        }
      };
      fetchHistory();
    }
  }, [scholar, supabase]);

  const handleLogout = () => {
    localStorage.removeItem("active_scholar");
    router.push("/");
  };

  if (!scholar) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <BrainIcon size={64} className="animate-bounce text-indigo-600" />
    </div>
  );

  if (activeSubject) {
    return (
      <QuizEngine
        student={scholar}
        subject={activeSubject}
        onClose={() => setActiveSubject(null)}
        questionCount={10}
        previousQuestionIds={previousQuestionIds} // 👈 pass history
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm">
            <RocketIcon size={20} />
          </div>
          <span className="font-black text-xl text-slate-800">LaunchPard</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-400 font-bold hover:text-rose-500 text-sm uppercase tracking-widest transition-colors"
        >
          Log Out
        </button>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 pt-12">
        {/* Hero banner */}
        <div className="bg-indigo-600 rounded-[40px] p-10 text-white mb-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Welcome, {scholar.name}! ✨
            </h1>
            <div className="flex gap-4">
              <span className="bg-white/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm border border-white/10">
                Year {scholar.year}
              </span>
              <span className="bg-amber-400 text-amber-900 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <StarIcon size={16} /> {scholar.total_xp || 0} XP
              </span>
            </div>
          </div>
          <RocketIcon size={250} className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4" />
        </div>

        {/* Subject cards */}
        <h2 className="text-2xl font-black text-slate-800 mb-6 px-2">Choose Your Quest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SubjectCard
            title="Maths"
            sub="Numbers & Logic"
            icon={<ZapIcon size={32} />}
            color="blue"
            onClick={() => setActiveSubject('maths')}
          />
          <SubjectCard
            title="English"
            sub="Grammar & Vocab"
            icon={<span className="text-3xl font-black italic text-rose-600">Aa</span>}
            color="rose"
            onClick={() => setActiveSubject('english')}
          />
          <SubjectCard
            title="Verbal"
            sub="Word Puzzles"
            icon={<BrainIcon size={32} />}
            color="emerald"
            onClick={() => setActiveSubject('verbal')}
          />
          <SubjectCard
            title="Spatial"
            sub="NVR & Patterns"
            icon={<span className="text-3xl">🧩</span>}
            color="amber"
            onClick={() => setActiveSubject('nvr')}
          />
        </div>
      </main>
    </div>
  );
}

// Subject card component
function SubjectCard({ title, sub, icon, color, onClick }) {
  const colors = {
    blue: "hover:border-blue-500 bg-blue-100 text-blue-600",
    rose: "hover:border-rose-500 bg-rose-100 text-rose-600",
    emerald: "hover:border-emerald-500 bg-emerald-100 text-emerald-600",
    amber: "hover:border-amber-500 bg-amber-100 text-amber-600"
  };
  return (
    <button
      onClick={onClick}
      className={`bg-white p-10 rounded-[40px] border-4 border-slate-100 transition-all text-left group hover:shadow-2xl hover:-translate-y-2 ${
        colors[color].split(' ')[0]
      }`}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${
          colors[color].split(' ').slice(1).join(' ')
        }`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 font-bold text-sm leading-relaxed">{sub}</p>
    </button>
  );
}