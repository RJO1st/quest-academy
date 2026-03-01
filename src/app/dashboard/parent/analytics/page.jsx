"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // FIXED IMPORT
import { createBrowserClient } from "@supabase/ssr";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Icons
const TrophyIcon = ({ size = 24 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>);
const ArrowLeftIcon = ({ size = 24 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

export default function ParentAnalytics() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("quiz_results").select(`*, scholars(name)`).order('completed_at', { ascending: true });
      if (!error && data) setResults(data);
      setLoading(false);
    };
    fetchStats();
  }, [supabase]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-black">Loading Academy Intelligence...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          {/* FIXED BUTTON USING LINK */}
          <Link href="/dashboard/parent" className="flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-all uppercase text-sm tracking-widest">
            <ArrowLeftIcon size={18} /> Back to Academy Hub
          </Link>
          <div className="bg-white px-6 py-2 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center gap-3">
            <TrophyIcon size={20} className="text-amber-500" />
            <span className="font-black text-slate-700 uppercase tracking-tight text-sm">Academy Intelligence</span>
          </div>
        </header>

        <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Performance Analytics</h1>
        
        {/* Chart logic remains here... */}
        <div className="bg-white p-8 md:p-12 rounded-[56px] shadow-sm border-2 border-slate-100 mb-10">
          <h3 className="text-xl font-black text-slate-800 mb-10 uppercase tracking-widest text-indigo-500 text-center">Accuracy Trend (%)</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="completed_at" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '24px' }} />
                <Area type="monotone" dataKey="accuracy" stroke="#4f46e5" strokeWidth={6} fill="#eef2ff" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}