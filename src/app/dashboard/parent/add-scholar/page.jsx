"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { UserPlusIcon, ArrowRightIcon, ZapIcon } from "../../../../components/ui/Icons";

export default function AddChildPage() {
  const [name, setName] = useState("");
  const [yearLevel, setYearLevel] = useState("4");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleAddChild = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication session lost. Please log in again.");

      const randomId = Math.floor(1000 + Math.random() * 9000);
      const accessCode = `QUEST-${randomId}`;

      const { error } = await supabase.from("scholars").insert([{
  parent_id: user.id, // Must be the UUID from auth.getUser()
  name: name,         // Matches the state from your input
  year: parseInt(yearLevel), // MUST be 'year' (lowercase) to match the SQL
  access_code: accessCode,   // Matches 'QUEST-XXXX'
  region: "UK",
  total_xp: 0
}]);

      if (error) throw error;
      
      // Successfully added! Head back to the dashboard.
      router.push("/dashboard/parent");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center font-sans">
      <div className="bg-white w-full max-w-xl rounded-[48px] p-10 md:p-16 shadow-2xl border-t-8 border-indigo-500">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><UserPlusIcon size={28} /></div>
          <h1 className="text-4xl font-black text-slate-800">New Scholar</h1>
        </div>
        <p className="text-slate-500 font-bold mb-10 italic">Enroll an explorer into the Academy.</p>

        {errorMsg && (
          <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-4 rounded-2xl mb-6 font-bold text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAddChild} className="space-y-8">
          <div>
            <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">Scholar's First Name</label>
            <input 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl px-6 py-5 font-black text-2xl focus:border-indigo-500 outline-none" 
              placeholder="e.g. Willy" 
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">Current School Year</label>
            <select 
              value={yearLevel} 
              onChange={(e) => setYearLevel(e.target.value)} 
              className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl px-6 py-5 font-black text-xl cursor-pointer outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100 flex gap-4 text-indigo-900 font-bold text-sm leading-relaxed">
            <ZapIcon className="text-indigo-500 shrink-0" size={32} />
            <p>We will generate a unique <span className="font-black underline">Access Code</span> for this scholar. They will use this to log in!</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={() => router.push("/dashboard/parent/add-scholar")} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-5 rounded-[24px]">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[24px] shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
              {loading ? "Enrolling..." : "Add to Academy"} <ArrowRightIcon size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}