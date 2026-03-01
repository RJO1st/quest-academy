"use client";
console.log("🚀 QUIZ ENGINE (NEW) –", new Date().toISOString());
// ╔══════════════════════════════════════════════════════════════╗
// ║         LAUNCHPARD — QUIZ ENGINE (with logging)             ║
// ╚══════════════════════════════════════════════════════════════╝
import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { generateSessionQuestions, getExplanationForQuestion } from "../../lib/proceduralEngine";

// ─── ICONS (unchanged) ──────────────────────────────────────────────────────
const CheckCircleIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const XCircleIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>);
const BrainIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.5 2A5 5 0 0 1 12 7.33A5 5 0 0 1 14.5 2" /><path d="M17 15a5 5 0 1 1-5 5" /><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0"/></svg>);
const ZapIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>);
const ArrowRightIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>);
const EyeIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
const ArrowLeftIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>);
const FlameIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>);
const StarIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const RocketIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.5-1 1-4c1.5 0 3 .5 3 .5L9 12Z"/><path d="M12 15v5s1 .5 4 1c0-1.5-.5-3-.5-3L12 15Z"/></svg>);
const PlanetIcon = ({ size = 24, className = "" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="8"/><path d="M7 21L17 3"/></svg>);
const XIcon = ({ size = 24 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>);

// ─── TARA FEEDBACK (personalised) ─────────────────────────────────────────────
// Inside QuizEngine.jsx, replace the existing getTaraFeedback with this enhanced version

// ── Explain It Back handler (now calls AI API) ────────────────────────────────
const handleEIB = async () => {
  if (!eibText.trim()) return;
  setLoadingEIB(true);
  const currQ = sessionQuestions[qIdx];
  const correctAnswer = currQ?.opts?.[currQ.a] ?? '';

  try {
    const response = await fetch('/api/tara', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: eibText,
        subject: currQ?.subject || subject || 'maths',
        correctAnswer,
        scholarName: student?.name,
        scholarYear: student?.year,
        question: currQ
      })
    });

    if (!response.ok) {
      throw new Error('API response not OK');
    }

    const data = await response.json();
    setEibFeedback(data.feedback || "Tara: Thanks for sharing your thoughts! Keep up the great work. ✨");
  } catch (err) {
    console.error('Tara feedback error:', err);
    // More helpful fallback that encourages the scholar
    setEibFeedback("Tara: I'm having a little trouble connecting right now, but your effort is brilliant! Let's keep going. 🚀");
  } finally {
    setLoadingEIB(false);
  }
};

// ─── VISUAL COMPONENTS (compact) ─────────────────────────────────────────────
const TenFrame = ({ filled, ghost = 0, total = 10, filledColour = '#6366f1', ghostColour = '#fca5a5' }) => {
  const cols = 5;
  const cells = Array.from({ length: total });
  return (
    <div
      className="inline-grid gap-1 p-2 bg-white rounded-xl border border-slate-200 shadow-inner"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {cells.map((_, i) => {
        const isFilled = i < filled;
        const isGhost  = !isFilled && i < filled + ghost;
        return (
          <div
            key={i}
            className="w-5 h-5 rounded-full border transition-all"
            style={{
              backgroundColor: isFilled ? filledColour : isGhost ? ghostColour : 'transparent',
              borderColor: isFilled ? filledColour : isGhost ? '#f87171' : '#e2e8f0',
              opacity: isGhost ? 0.55 : 1,
            }}
          />
        );
      })}
    </div>
  );
};

const AdditionVisual = ({ a, b }) => {
  const total = a + b;
  const frameSize = total <= 10 ? 10 : 20;
  return (
    <div className="w-full p-3 bg-indigo-50 rounded-xl border border-indigo-100">
      <div className="flex justify-center items-center gap-2 mb-2 text-sm">
        <span className="font-black text-indigo-600 bg-indigo-100 rounded px-2 py-0.5">{a}</span>
        <span className="text-lg font-black text-slate-400">+</span>
        <span className="font-black text-emerald-600 bg-emerald-100 rounded px-2 py-0.5">{b}</span>
        <span className="text-lg font-black text-slate-400">=</span>
        <span className="font-black text-slate-300 bg-slate-100 rounded px-2 py-0.5">?</span>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <div className="flex flex-col items-center">
          <TenFrame filled={Math.min(a, frameSize)} total={frameSize} filledColour="#6366f1" />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Group A: {a}</span>
        </div>
        <div className="flex flex-col items-center">
          <TenFrame filled={Math.min(b, frameSize)} total={frameSize} filledColour="#10b981" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Group B: {b}</span>
        </div>
      </div>
      <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
        Count all counters together
      </p>
    </div>
  );
};

const SubtractionVisual = ({ a, b, ans }) => {
  const frameSize = a <= 10 ? 10 : 20;
  return (
    <div className="w-full p-3 bg-rose-50 rounded-xl border border-rose-100">
      <div className="flex justify-center items-center gap-2 mb-2 text-sm">
        <span className="font-black text-slate-600 bg-slate-100 rounded px-2 py-0.5">{a}</span>
        <span className="text-lg font-black text-slate-400">−</span>
        <span className="font-black text-rose-500 bg-rose-100 rounded px-2 py-0.5">{b}</span>
        <span className="text-lg font-black text-slate-400">=</span>
        <span className="font-black text-emerald-600 bg-emerald-100 rounded px-2 py-0.5">{ans}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <div className="flex flex-col items-center">
          <TenFrame filled={ans} ghost={b} total={frameSize} filledColour="#10b981" ghostColour="#fca5a5" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Start: {a}</span>
        </div>
        <div className="flex flex-col items-center">
          <TenFrame filled={b} total={frameSize} filledColour="#f87171" />
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">Subtract: {b}</span>
        </div>
      </div>
      <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
        Green counters = what's left
      </p>
    </div>
  );
};

const BarModelVisual = ({ a, b, ans, operation }) => {
  const leftPct  = operation === '+' ? (a / (a + b)) * 100 : (ans / a) * 100;
  const rightPct = 100 - leftPct;
  return (
    <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Bar Model</p>
      <div className="flex justify-center mb-1">
        <span className="text-xs font-black text-slate-600 bg-slate-200 rounded px-2 py-0.5">
          Whole: {operation === '+' ? a + b : a}
        </span>
      </div>
      <div className="h-6 rounded-lg overflow-hidden bg-slate-200 mb-2 flex">
        <div className="h-full rounded-l-lg transition-all" style={{ width: `${leftPct}%`, background: operation === '+' ? '#6366f1' : '#10b981' }} />
        <div className="h-full rounded-r-lg transition-all" style={{ width: `${rightPct}%`, background: operation === '+' ? '#10b981' : '#fca5a5' }} />
      </div>
      <div className="flex justify-between text-[10px] font-black">
        <span style={{ color: operation === '+' ? '#6366f1' : '#059669' }}>
          {operation === '+' ? a : ans}
        </span>
        <span style={{ color: operation === '+' ? '#059669' : '#f87171' }}>
          {operation === '+' ? b : b}
        </span>
      </div>
    </div>
  );
};

const PlaceValueChart = ({ computed, step }) => {
  if (!computed) return null;
  const { a, b, carry, answer, operation } = computed;
  const isUnitsActive = step === 0 || step === 1;
  const isTensActive = step === 2 || step === 3;
  const maxLen = Math.max(String(a).length, String(b).length, String(answer).length, 2);
  const pad = (n) => String(n).padStart(maxLen, ' ');
  const aStr = pad(a), bStr = pad(b), ansStr = pad(answer);
  const li = maxLen - 2, ri = maxLen - 1;

  return (
    <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-100 font-mono text-2xl md:text-3xl font-black w-full max-w-xs mx-auto shadow-inner">
      <div className={`flex w-full mb-1 text-rose-500 text-sm h-5 ${isTensActive && step >= 2 && carry ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex-1" /><div className="flex-1 text-center">+{carry}</div><div className="flex-1" />
      </div>
      <div className="flex w-full text-slate-700 mb-1">
        <div className="flex-1" />
        <div className={`flex-1 text-center transition-colors ${isTensActive ? 'text-indigo-600' : ''}`}>{aStr[li] !== ' ' ? aStr[li] : ''}</div>
        <div className={`flex-1 text-center transition-colors ${isUnitsActive ? 'text-indigo-600' : ''}`}>{aStr[ri]}</div>
      </div>
      <div className="flex w-full text-slate-700 mb-2 pb-2 border-b-4 border-slate-300">
        <div className="flex-1 text-center text-slate-400">{operation}</div>
        <div className={`flex-1 text-center transition-colors ${isTensActive ? 'text-indigo-600' : ''}`}>{bStr[li] !== ' ' ? bStr[li] : ''}</div>
        <div className={`flex-1 text-center transition-colors ${isUnitsActive ? 'text-indigo-600' : ''}`}>{bStr[ri]}</div>
      </div>
      <div className="flex w-full text-slate-800">
        <div className="flex-1" />
        <div className={`flex-1 text-center transition-all ${step >= 3 ? 'opacity-100 text-emerald-600' : 'opacity-0'}`}>{ansStr[li] !== ' ' ? ansStr[li] : ''}</div>
        <div className={`flex-1 text-center transition-all ${step >= 1 ? 'opacity-100 text-emerald-600' : 'opacity-0'}`}>{ansStr[ri]}</div>
      </div>
    </div>
  );
};

// ─── MAIN QUIZ ENGINE ────────────────────────────────────────────────────────
export default function QuizEngine({ 
  world, 
  student, 
  subject, 
  onClose, 
  onComplete, 
  questionCount = 10,
  previousQuestionIds = [] 
}) {
  console.log(`[QuizEngine] Received ${previousQuestionIds.length} previous question IDs for scholar ${student?.id}`);

  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [dbQuestionIds, setDbQuestionIds] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [generating, setGenerating] = useState(true);

  const [finished, setFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState({ score: 0, answers: [] });

  const [showInteractiveExplanation, setShowInteractiveExplanation] = useState(false);
  const [explanationStep, setExplanationStep] = useState(0);
  const [explanationData, setExplanationData] = useState(null);

  const [eibText, setEibText] = useState("");
  const [eibFeedback, setEibFeedback] = useState("");   // this holds Tara's response
  const [loadingEIB, setLoadingEIB] = useState(false);

  const [savingResult, setSavingResult] = useState(false);

  const timerRef = useRef(null);

  // ── Fetch questions ────────────────────────────────────────────────────────
  const fetchQuestions = useCallback(async () => {
    setGenerating(true);
    const parsedYear = student?.year ? parseInt(student.year, 10) : 4;
    const region = student?.region || 'UK';
    const proficiency = 50; // placeholder

    console.log(`[QuizEngine] Calling generateSessionQuestions with year=${parsedYear}, subject=${subject}, previousIds count=${previousQuestionIds.length}`);

    const qs = await generateSessionQuestions(
      parsedYear,
      region,
      questionCount,
      proficiency,
      subject || 'maths',
      [], // mistakes (optional)
      previousQuestionIds
    );

    console.log(`[QuizEngine] Generated ${qs.length} questions. IDs from DB:`, qs.filter(q => q.id).map(q => q.id));

    setSessionQuestions(qs);
    setDbQuestionIds(qs.filter(q => q.id).map(q => q.id));

    setQIdx(0);
    setSelected(null);
    setExplanationData(null);
    setShowInteractiveExplanation(false);
    setExplanationStep(0);
    setEibText("");
    setEibFeedback("");
    setTimeLeft(45);
    setGenerating(false);
  }, [student, subject, questionCount, previousQuestionIds]);

  useEffect(() => {
    setFinished(false);
    setResults({ score: 0, answers: [] });
    setTotalScore(0);
    setStreak(0);
    fetchQuestions();
  }, [fetchQuestions]);

  // ── Answer picking ─────────────────────────────────────────────────────────
  const handlePick = useCallback((idx) => {
    if (selected !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(idx);

    const currQ = sessionQuestions[qIdx];
    const isCorrect = idx === currQ.a;

    if (isCorrect) {
      setResults(r => ({ ...r, score: r.score + 1, answers: [...r.answers, { q: currQ.q, correct: true }] }));
      setTotalScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setResults(r => ({ ...r, answers: [...r.answers, { q: currQ.q, correct: false }] }));
      setStreak(0);
      const expData = getExplanationForQuestion(currQ);
      if (expData) setExplanationData(expData);
    }
  }, [selected, qIdx, sessionQuestions]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (selected !== null || finished || sessionQuestions.length === 0 || generating) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handlePick(-1); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIdx, selected, finished, handlePick, sessionQuestions, generating]);

  // ── Explain It Back ────────────────────────────────────────────────────────
  const handleEIB = async () => {
    if (!eibText.trim()) return;
    setLoadingEIB(true);
    const currQ = sessionQuestions[qIdx];
    const correctAnswer = currQ?.opts?.[currQ.a] ?? '';

    try {
      const response = await fetch('/api/tara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: eibText,
          subject: currQ?.subject || subject || 'maths',
          correctAnswer,
          scholarName: student?.name,
          scholarYear: student?.year,
          question: currQ
        })
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      setEibFeedback(data.feedback || "Tara: Thanks for sharing your thoughts! Keep up the great work. ✨");
    } catch (err) {
      console.error('Tara feedback error:', err);
      setEibFeedback("Tara: I'm having a little trouble connecting right now, but your effort is brilliant! Let's keep going. 🚀");
    } finally {
      setLoadingEIB(false);
    }
  };

  // ── Next question ──────────────────────────────────────────────────────────
  const next = () => {
    if (qIdx < sessionQuestions.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
      setTimeLeft(45);
      setExplanationData(null);
      setShowInteractiveExplanation(false);
      setExplanationStep(0);
      setEibText("");
      setEibFeedback("");
    } else {
      finishQuest();
    }
  };

  // ── Finish quest – save result AND insert question history ─────────────────
  const finishQuest = async () => {
    setSavingResult(true);
    try {
      if (student?.id) {
        // Save quiz result
        await supabase.from('quiz_results').insert([{
          scholar_id: student.id,
          subject: subject || 'maths',
          score: results.score + (selected === sessionQuestions[qIdx]?.a ? 1 : 0),
          total_questions: questionCount,
          completed_at: new Date().toISOString(),
        }]);

        // Increment XP
        await supabase.rpc('increment_scholar_xp', {
          s_id: student.id,
          xp_to_add: totalScore,
        });

        // Record question history for DB‑sourced questions
        if (dbQuestionIds.length > 0) {
          console.log(`[QuizEngine] Inserting ${dbQuestionIds.length} question IDs into history for scholar ${student.id}:`, dbQuestionIds);
          const historyInserts = dbQuestionIds.map(qid => ({
            scholar_id: student.id,
            question_id: qid,
          }));
          await supabase.from('scholar_question_history').insert(historyInserts);
        }
      }
    } catch (e) {
      console.error('Supabase save error:', e);
    } finally {
      setSavingResult(false);
      setFinished(true);
      if (onComplete) onComplete({ score: results.score, totalScore });
    }
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (generating) return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[5000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] p-6 text-center max-w-sm w-full shadow-2xl animate-pulse">
        <RocketIcon size={48} className="mx-auto text-indigo-500 mb-4" />
        <h3 className="text-xl font-black text-slate-800 mb-1">Pre‑Flight Checks...</h3>
        <p className="text-sm text-slate-500 font-bold">Loading Mission Data.</p>
      </div>
    </div>
  );

  // ── Finish screen ──────────────────────────────────────────────────────────
  if (finished) return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[5000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] p-6 text-center max-w-sm w-full shadow-2xl relative border-b-4 border-slate-200">
        <div className="mx-auto mb-4 flex justify-center text-indigo-500"><PlanetIcon size={64} /></div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Orbit Achieved!</h2>
        <p className="text-slate-500 font-bold text-sm mb-2">
          {results.score}/{sessionQuestions.length} Correct.
        </p>
        <p className="text-indigo-600 font-black text-base mb-4">+{totalScore} Stardust</p>
        <div className="flex justify-center gap-3 mb-5">
          <div className="bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
            <FlameIcon size={16} className="text-amber-500" />
            <span className="font-black text-amber-700 text-sm">{streak}</span>
          </div>
          <div className="bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
            <StarIcon size={16} className="text-purple-500" />
            <span className="font-black text-purple-700 text-sm">{totalScore}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setFinished(false);
            fetchQuestions();
          }}
          className="w-full bg-indigo-600 text-white font-black py-3 rounded-2xl hover:bg-indigo-700 transition-all text-sm shadow flex items-center justify-center gap-2 border-b-4 border-indigo-800"
        >
          Next Mission <ArrowRightIcon size={16} />
        </button>
        <button
          onClick={() => onClose?.()}
          className="w-full mt-2 bg-slate-100 text-slate-600 font-black py-3 rounded-2xl hover:bg-slate-200 text-sm border-b-4 border-slate-200"
        >
          Return to Base
        </button>
      </div>
    </div>
  );

  const q = sessionQuestions[qIdx];
  if (!q) return null;

  const isCorrectAnswer = selected === q.a;
  const canProceed = isCorrectAnswer || (selected !== null && !isCorrectAnswer && eibFeedback);

  // ── Main quiz UI (compact) ─────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[4000] flex items-center justify-center p-2">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border-b-4 border-slate-200 max-h-[90vh] flex flex-col">

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100">
          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${((qIdx + 1) / sessionQuestions.length) * 100}%` }} />
        </div>

        {/* Header */}
        <div className="p-3 flex justify-between items-center bg-slate-50 border-b border-slate-100">
          <span className="bg-indigo-50 px-2 py-1 rounded-lg font-black text-indigo-600 text-[10px] uppercase tracking-widest flex items-center gap-1">
            <RocketIcon size={12}/> Mission {qIdx + 1}/{sessionQuestions.length}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-black">
              <FlameIcon size={14} className="text-amber-500" /> {streak}
              <StarIcon size={14} className="text-purple-500" /> {totalScore}
            </div>
            <div className={`text-base font-black tabular-nums ${timeLeft < 6 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 p-0.5">
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable content – designed to fit without scroll */}
        <div className="p-4 overflow-y-auto">
          <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">{q.q}</h3>

          {/* Visual selector */}
          {q.visual && (() => {
            const v = q.visual;
            if (typeof v === 'object') {
              if (v.type === 'addition-dots') return <div className="mb-3"><AdditionVisual a={v.a} b={v.b} /></div>;
              if (v.type === 'subtraction-partwhole') return <div className="mb-3"><SubtractionVisual a={v.a} b={v.b} ans={v.ans} /></div>;
              if (v.type === 'bar-model') return <div className="mb-3"><BarModelVisual a={v.a} b={v.b} ans={v.ans} operation={v.operation} /></div>;
            }
            return (
              <div className="mb-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-center text-xl font-bold text-indigo-900 shadow-inner">
                {v}
              </div>
            );
          })()}

          {/* Answer options – 2 columns */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {q.opts.map((opt, i) => {
              const isAnswered = selected !== null;
              const isOptionCorrect = i === q.a;
              const isSelected = selected === i;

              let cls = "bg-white border-slate-200 hover:border-indigo-500 text-slate-700";
              if (isAnswered) {
                if (isOptionCorrect) cls = "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-100";
                else if (isSelected) cls = "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-100";
                else cls = "bg-white border-slate-100 opacity-30 grayscale";
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handlePick(i)}
                  className={`p-2 rounded-xl font-bold border transition-all text-sm ${cls}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{opt}</span>
                    {isAnswered && isOptionCorrect && <CheckCircleIcon className="text-emerald-500" size={16} />}
                    {isAnswered && isSelected && !isOptionCorrect && <XCircleIcon className="text-rose-500" size={16} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Post-answer panel */}
          {selected !== null && (
            <div className="space-y-3 border-t border-slate-100 pt-3">

              {/* Explanation */}
              <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-indigo-500 flex gap-2 items-start">
                <BrainIcon size={20} className="text-indigo-500 shrink-0" />
                <p className="text-xs font-bold text-slate-800 leading-relaxed">{q.exp}</p>
              </div>

              {/* Show Me How button */}
              {!isCorrectAnswer && !showInteractiveExplanation && explanationData && (
                <button
                  onClick={() => setShowInteractiveExplanation(true)}
                  className="w-full bg-indigo-100 text-indigo-700 font-black py-2 px-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors text-xs border border-indigo-200"
                >
                  <EyeIcon size={16} /> View Flight Data
                </button>
              )}

              {/* Step-by-step stepper */}
              {showInteractiveExplanation && explanationData && (
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-black text-indigo-800 uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <EyeIcon size={12} /> Navigation Computer
                    </h4>
                    <span className="bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                      Step {explanationStep + 1} of {explanationData.steps.length}
                    </span>
                  </div>

                  {explanationData.visual === "place-value-chart" && (
                    <div className="mb-3">
                      <PlaceValueChart computed={explanationData.computed} step={explanationStep} />
                    </div>
                  )}

                  <div className="bg-white p-2 rounded-lg border border-indigo-100 text-center mb-2 shadow-sm">
                    <p className="text-xs font-black text-indigo-900">{explanationData.steps[explanationStep]}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setExplanationStep(s => Math.max(0, s - 1))}
                      disabled={explanationStep === 0}
                      className="flex-1 bg-white text-indigo-600 font-black py-1.5 rounded-lg border border-indigo-200 disabled:opacity-40 hover:bg-indigo-50 transition-colors text-xs flex items-center justify-center gap-1"
                    >
                      <ArrowLeftIcon size={12} /> Prev
                    </button>
                    {explanationStep < explanationData.steps.length - 1 ? (
                      <button
                        onClick={() => setExplanationStep(s => s + 1)}
                        className="flex-[2] bg-indigo-600 text-white font-black py-1.5 rounded-lg shadow-md hover:bg-indigo-700 transition-all text-xs flex items-center justify-center gap-1"
                      >
                        Next Step <ArrowRightIcon size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowInteractiveExplanation(false)}
                        className="flex-[2] bg-emerald-500 text-white font-black py-1.5 rounded-lg shadow-md hover:bg-emerald-600 transition-all text-xs flex items-center justify-center gap-1"
                      >
                        <CheckCircleIcon size={12} /> Got It!
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tara's Challenge (only if wrong) */}
              {!isCorrectAnswer && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <p className="text-amber-800 font-bold text-xs mb-2">
                    <span className="font-black">Tara's Challenge:</span> Explain why <span className="underline">{q.opts[q.a]}</span> is correct:
                  </p>
                  <textarea
  value={eibText}
  onChange={e => setEibText(e.target.value)}
  onKeyDown={handleKeyDown}
  className="..."
  rows={2}
  placeholder="Your reasoning..."
/>
                  <button
  disabled={loadingEIB || !eibText.trim()}
  onClick={handleEIB}
  className="w-full bg-amber-500 text-white font-black py-2 rounded-lg text-xs uppercase tracking-widest border-b-4 border-amber-700 disabled:opacity-50 flex items-center justify-center gap-1"
>
  <ZapIcon size={12} />
  {loadingEIB ? "Thinking..." : "Tell Tara"}
</button>
                  {eibFeedback && (
                    <div className="mt-2 p-2 bg-white rounded-lg border border-amber-100 text-amber-900 font-bold italic text-xs">
                      {eibFeedback}
                    </div>
                  )}
                </div>
              )}

              {/* Next button */}
              {canProceed && (
                <button
                  onClick={next}
                  disabled={savingResult}
                  className="w-full bg-slate-900 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 text-sm border-b-4 border-black disabled:opacity-60"
                >
                  {savingResult ? "Saving..." : qIdx === sessionQuestions.length - 1 ? "Complete Mission" : "Continue"}
                  {!savingResult && <ArrowRightIcon size={16} />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}