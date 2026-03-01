import { supabase } from './supabase';

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

// --- DYNAMIC TEMPLATE PARSER ---
const processTemplateString = (str, vars) => {
  if (!str) return str;
  return String(str).replace(/\{([^}]+)\}/g, (match, expr) => {
    let evaluated = expr.trim();
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      evaluated = evaluated.replace(regex, value);
    }
    if (/[a-zA-Z]/.test(evaluated)) return evaluated;
    try {
        const result = new Function(`return ${evaluated};`)();
        return Number.isFinite(result) ? Math.round(result * 100) / 100 : result;
    } catch (e) {
        try {
           const parts = evaluated.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
           if (parts) {
               const n1 = parseFloat(parts[1]);
               const op = parts[2];
               const n2 = parseFloat(parts[3]);
               if (op === '+') return n1 + n2;
               if (op === '-') return n1 - n2;
               if (op === '*') return n1 * n2;
               if (op === '/') return Math.round((n1 / n2) * 100) / 100;
           }
        } catch (fallbackErr) {}
        return evaluated;
    }
  });
};

// --- INTERACTIVE EXPLANATION TEMPLATES ---
export const mathsTemplates = {
  addition: {
    detect: (vars) => (vars.a % 10) + (vars.b % 10) < 10,
    computeVars: (a, b) => {
      const units_a = a % 10, tens_a = Math.floor(a / 10);
      const units_b = b % 10, tens_b = Math.floor(b / 10);
      const units_sum = units_a + units_b;
      const answer = a + b;
      return { a, b, units_a, tens_a, units_b, tens_b, units_sum, units_digit: units_sum, tens_sum: tens_a + tens_b, answer, operation: '+' };
    },
    steps: [
      "Add the units: {units_a} + {units_b} = {units_sum}",
      "Write {units_digit} in the units place.",
      "Add the tens: {tens_a} + {tens_b} = {tens_sum}",
      "The answer is {answer}."
    ],
    visual: "place-value-chart"
  },
  addition_with_carry: {
    detect: (vars) => (vars.a % 10) + (vars.b % 10) >= 10,
    computeVars: (a, b) => {
      const units_a = a % 10, tens_a = Math.floor(a / 10);
      const units_b = b % 10, tens_b = Math.floor(b / 10);
      const units_sum = units_a + units_b;
      const carry = Math.floor(units_sum / 10);
      const units_digit = units_sum % 10;
      const tens_sum = tens_a + tens_b + carry;
      const answer = a + b;
      return { a, b, units_a, tens_a, units_b, tens_b, units_sum, carry, units_digit, tens_sum, answer, operation: '+' };
    },
    steps: [
      "Add the units: {units_a} + {units_b} = {units_sum}",
      "Write {units_digit} in the units place and carry {carry} to the tens column.",
      "Add the tens including the carry: {tens_a} + {tens_b} + {carry} = {tens_sum}",
      "Write {tens_sum} in the tens place. The answer is {answer}."
    ],
    visual: "place-value-chart"
  },
  subtraction: {
    detect: (vars) => (vars.a % 10) >= (vars.b % 10),
    computeVars: (a, b) => {
      const units_a = a % 10, tens_a = Math.floor(a / 10);
      const units_b = b % 10, tens_b = Math.floor(b / 10);
      const units_diff = units_a - units_b;
      const tens_diff = tens_a - tens_b;
      const answer = a - b;
      return { a, b, units_a, tens_a, units_b, tens_b, units_diff, tens_diff, answer, operation: '-' };
    },
    steps: [
      "Subtract the units: {units_a} - {units_b} = {units_diff}",
      "Write {units_diff} in the units place.",
      "Subtract the tens: {tens_a} - {tens_b} = {tens_diff}",
      "The answer is {answer}."
    ],
    visual: "place-value-chart"
  }
};

export const getExplanationForQuestion = (question) => {
  if (!question?.vars || !question?.topic || question.subject !== 'maths') return null;
  const { vars, topic } = question;
  
  const baseTopic = topic.split('_')[0]; 
  const availableTemplates = Object.keys(mathsTemplates)
       .filter(k => k.startsWith(baseTopic))
       .map(k => mathsTemplates[k]);
       
  const selected = availableTemplates.find(t => t.detect?.(vars)) || mathsTemplates[topic];
  if (!selected) return null;
  
  const computed = selected.computeVars(vars.a, vars.b);
  const steps = selected.steps.map(step => processTemplateString(step, computed));
  return { steps, visual: selected.visual, computed };
};

// --- DATA LISTS ---
const NOUNS = [
  "lion", "eagle", "castle", "knight", "ocean", "mountain", "forest", "dragon", 
  "wizard", "river", "pirate", "astronaut", "robot", "dinosaur", "unicorn", 
  "tiger", "elephant", "magician", "queen", "king", "princess", "spacecraft"
];

const ADJS = [
  "fierce", "brave", "ancient", "mysterious", "dark", "gleaming", "silent", 
  "golden", "wild", "wise", "sparkling", "enchanted", "cosmic", "mighty", 
  "clever", "secret", "hidden", "magical", "flying", "whispering"
];

const VERBS = [
  "roared", "soared", "crumbled", "fought", "crashed", "stood", "whispered", 
  "charged", "leapt", "fell", "flew", "swam", "climbed", "discovered", 
  "built", "created", "solved", "explored", "rescued", "guarded"
];

const ADVERBS = [
  "loudly", "gracefully", "slowly", "bravely", "violently", "firmly", 
  "quietly", "quickly", "cautiously", "boldly", "suddenly", "carefully"
];

// --- LOCAL GENERATORS (ensuring answer index is random) ---

// ENHANCED generateLocalMaths with better variety for Year 1-2
export const generateLocalMaths = (year, difficultyMultiplier = 1) => {
  // Year 1 & 2 specific – more variety
  if (year <= 2) {
    const maxNum = year === 1 ? 10 : 20;
    const questionType = Math.random();
    let q, ans, exp, visual, hints, topic;
    let a, b;

    if (questionType < 0.25) { // Simple addition
      a = Math.floor(Math.random() * maxNum) + 1;
      b = Math.floor(Math.random() * (maxNum - a)) + 1; // ensure sum ≤ maxNum
      ans = a + b;
      topic = 'addition';
      const phrases = [
        `What is ${a} + ${b}?`,
        `Add ${a} and ${b}.`,
        `${a} plus ${b} equals?`,
        `How many are ${a} and ${b} altogether?`
      ];
      q = phrases[Math.floor(Math.random() * phrases.length)];
      exp = `${a} and ${b} make ${ans}.`;
      visual = `${Array(a).fill("🟦").join("")} + ${Array(b).fill("🟧").join("")}`;
    } else if (questionType < 0.5) { // Subtraction
      a = Math.floor(Math.random() * maxNum) + 1;
      b = Math.floor(Math.random() * a) + 1; // b ≤ a
      ans = a - b;
      topic = 'subtraction';
      const phrases = [
        `What is ${a} - ${b}?`,
        `Take away ${b} from ${a}.`,
        `${a} minus ${b} equals?`,
        `How many are left if you have ${a} and give away ${b}?`
      ];
      q = phrases[Math.floor(Math.random() * phrases.length)];
      exp = `Start with ${a}, remove ${b}, you get ${ans}.`;
      visual = `${Array(a).fill("🟦").join("")} - ${Array(b).fill("🟧").join("")}`;
    } else if (questionType < 0.7) { // Missing number (e.g., 3 + ? = 7)
      const total = Math.floor(Math.random() * maxNum) + 2; // total between 2 and maxNum
      a = Math.floor(Math.random() * (total - 1)) + 1; // a between 1 and total-1
      b = total - a; // missing addend
      ans = b;
      topic = 'missing_number';
      const phrases = [
        `${a} + ? = ${total}`,
        `What number makes this true? ${a} + __ = ${total}`,
        `Find the missing number: ${a} + ☐ = ${total}`
      ];
      q = phrases[Math.floor(Math.random() * phrases.length)];
      exp = `The missing number is ${b} because ${a} + ${b} = ${total}.`;
      // For missing number, we need to pass a and b as the two addends for potential visual
      // But the answer is b (the missing number). We'll set vars accordingly.
    } else if (questionType < 0.85) { // Comparing numbers
      a = Math.floor(Math.random() * maxNum) + 1;
      b = Math.floor(Math.random() * maxNum) + 1;
      if (a === b) b = (b % maxNum) + 1; // ensure different
      const isGreater = Math.random() > 0.5;
      if (isGreater) {
        ans = a > b ? a : b;
        q = `Which is greater, ${a} or ${b}?`;
        exp = ans === a ? `${a} is greater than ${b}.` : `${b} is greater than ${a}.`;
      } else {
        ans = a < b ? a : b;
        q = `Which is smaller, ${a} or ${b}?`;
        exp = ans === a ? `${a} is smaller than ${b}.` : `${b} is smaller than ${a}.`;
      }
      topic = 'comparison';
    } else { // Simple word problem
      const items = ["apples", "bananas", "oranges", "toys", "stickers", "pencils"];
      const item = items[Math.floor(Math.random() * items.length)];
      a = Math.floor(Math.random() * (maxNum / 2)) + 1;
      b = Math.floor(Math.random() * (maxNum / 2)) + 1;
      if (Math.random() > 0.5) {
        ans = a + b;
        q = `You have ${a} ${item} and your friend gives you ${b} more. How many ${item} do you have now?`;
        exp = `${a} + ${b} = ${ans}.`;
        topic = 'addition_word';
      } else {
        ans = a > b ? a - b : 0;
        q = `You have ${a} ${item} and you eat ${b}. How many are left?`;
        exp = `${a} - ${b} = ${ans}.`;
        topic = 'subtraction_word';
      }
    }

    // Generate wrong options (close to answer, suitable for young children)
    let wrong1 = ans + 1;
    let wrong2 = Math.max(0, ans - 1);
    let wrong3 = ans + 2;
    if (wrong1 === ans) wrong1++;
    if (wrong2 === ans) wrong2 = Math.max(0, ans - 2);
    if (wrong3 === ans || wrong3 === wrong1 || wrong3 === wrong2) wrong3 = ans + 3;

    const options = shuffle([String(ans), String(wrong1), String(wrong2), String(wrong3)]);
    return { 
      q, 
      opts: options, 
      a: options.indexOf(String(ans)), 
      exp, 
      subject: 'maths', 
      visual, 
      hints: ["Count carefully."], 
      vars: { a, b }, 
      topic 
    };
  }

  // ---- Year 3+ (original logic, unchanged) ----
  const op = Math.random();
  let q, ans, exp, visual, hints, topic;
  const maxNum = Math.floor(year * 25 * difficultyMultiplier); 
  let a, b;

  if (op < 0.3) { // Addition
    a = Math.floor(Math.random() * maxNum) + (year * 5);
    b = Math.floor(Math.random() * maxNum) + 1;
    ans = a + b;
    topic = 'addition';
    const phrases = [
      `Calculate: ${a} + ${b}`,
      `What is ${a} plus ${b}?`,
      `Add ${a} and ${b}.`,
      `${a} + ${b} = ?`
    ];
    q = phrases[Math.floor(Math.random() * phrases.length)];
    exp = `Add the units, then the tens. ${a} + ${b} = ${ans}.`;
    hints = [`Try adding ${b} to ${a}.`, `Add the tens first, then the units.`, `The answer is ${ans}.`];
    if (year <= 2 && ans <= 20) visual = `${Array(a).fill("🟦").join("")} + ${Array(b).fill("🟧").join("")}`;
  } else if (op < 0.55) { // Subtraction
    a = Math.floor(Math.random() * maxNum) + 30;
    b = Math.floor(Math.random() * a) + 1;
    ans = a - b;
    topic = 'subtraction';
    const phrases = [
      `Calculate: ${a} - ${b}`,
      `What is ${a} minus ${b}?`,
      `Subtract ${b} from ${a}.`,
      `${a} − ${b} = ?`
    ];
    q = phrases[Math.floor(Math.random() * phrases.length)];
    exp = `Subtract ${b} from ${a} to get ${ans}.`;
    hints = [`You are taking ${b} away from ${a}.`, `Count backwards.`, `The answer is ${ans}.`];
  } else if (op < 0.8) { // Multiplication
    a = Math.floor(Math.random() * (year + 8 * difficultyMultiplier)) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    ans = a * b;
    topic = 'multiplication';
    const phrases = [
      `What is ${a} × ${b}?`,
      `Multiply ${a} by ${b}.`,
      `${a} times ${b}`,
      `${a} × ${b} = ?`
    ];
    q = phrases[Math.floor(Math.random() * phrases.length)];
    exp = `${a} groups of ${b} equals ${ans}.`;
    hints = [`Think of ${a} groups of ${b}.`, `The answer is ${ans}.`];
  } else { // Division
    b = Math.floor(Math.random() * (year + 6 * difficultyMultiplier)) + 2;
    const ansTemp = Math.floor(Math.random() * 12) + 2;
    a = b * ansTemp;
    ans = ansTemp;
    topic = 'division';
    const phrases = [
      `Divide ${a} by ${b}`,
      `What is ${a} ÷ ${b}?`,
      `${a} shared between ${b} groups`,
      `${a} ÷ ${b} = ?`
    ];
    q = phrases[Math.floor(Math.random() * phrases.length)];
    exp = `Since ${b} × ${ans} = ${a}, ${a} ÷ ${b} = ${ans}.`;
    hints = [`How many times does ${b} fit into ${a}?`, `The answer is ${ans}.`];
  }

  // Generate wrong options distinct from correct answer
  let wrong1 = ans + Math.floor(Math.random() * 5) + 1;
  let wrong2 = Math.max(0, ans - (Math.floor(Math.random() * 3) + 1));
  let wrong3 = ans + 10;
  // Ensure no duplicates with ans
  while (wrong1 === ans) wrong1 = ans + Math.floor(Math.random() * 5) + 2;
  while (wrong2 === ans || wrong2 === wrong1) wrong2 = Math.max(0, ans - (Math.floor(Math.random() * 5) + 1));
  while (wrong3 === ans || wrong3 === wrong1 || wrong3 === wrong2) wrong3 = ans + 12;

  const options = shuffle([String(ans), String(wrong1), String(wrong2), String(wrong3)]);
  return { 
    q, 
    opts: options, 
    a: options.indexOf(String(ans)), 
    exp, 
    subject: 'maths', 
    visual, 
    hints, 
    vars: { a, b }, 
    topic 
  };
};

export const generateRealWorldMaths = (year, difficultyMultiplier = 1) => {
  const items = ["video game", "bicycle", "skateboard", "book set", "toy spaceship", "art kit", "soccer ball", "puzzle", "comic books"];
  const item = items[Math.floor(Math.random() * items.length)];
  const cost = Math.floor(Math.random() * 30 * difficultyMultiplier) + 20;
  const savingsPerWeek = Math.floor(Math.random() * 5) + 2;
  const weeksNeeded = Math.ceil(cost / savingsPerWeek);
  
  const q = `Real World Challenge: You want to buy a ${item} that costs £${cost}. If you save £${savingsPerWeek} per week, how many weeks will it take to save enough money?`;
  // Improved explanation: mention that you need to round up because you can't have a fraction of a week
  const exact = (cost / savingsPerWeek).toFixed(2);
  const exp = `You need to save at least £${cost}. Each week you save £${savingsPerWeek}. After 7 weeks you'd have £${savingsPerWeek * 7} (not enough). After ${weeksNeeded} weeks you'd have £${savingsPerWeek * weeksNeeded}. So you need ${weeksNeeded} weeks. (${cost} ÷ ${savingsPerWeek} = ${exact}, so you round up.)`;
  
  let wrong1 = weeksNeeded + 1;
  let wrong2 = weeksNeeded - 1;
  let wrong3 = weeksNeeded + 2;
  while (wrong1 === weeksNeeded) wrong1++;
  while (wrong2 === weeksNeeded || wrong2 === wrong1) wrong2 = weeksNeeded - 2;
  while (wrong3 === weeksNeeded || wrong3 === wrong1 || wrong3 === wrong2) wrong3 = weeksNeeded + 3;

  const opts = shuffle([String(weeksNeeded), String(wrong1), String(wrong2), String(wrong3)]);
  return { 
    q, 
    opts, 
    a: opts.indexOf(String(weeksNeeded)), 
    exp, 
    hints: ["Think about how many weeks to reach at least the cost.", "You might need to round up."], 
    subject: 'maths', 
    isRealWorld: true, 
    vars: { a: cost, b: savingsPerWeek }, 
    topic: 'division' 
  };
};

export const generateLocalEnglish = (year) => {
  const templates = [];
  if (year <= 2) {
    templates.push(
      { q: "Which word rhymes with CAT?", opts: ["BAT", "DOG", "PIG", "SUN"], a: 0, exp: "CAT and BAT sound the same at the end." },
      { q: "Missing letter: D _ G (an animal that barks)", opts: ["O", "A", "E", "I"], a: 0, exp: "D-O-G spells DOG." },
      { q: "Correct spelling:", opts: ["Apple", "Appul", "Aple", "Aplle"], a: 0, exp: "The fruit is spelled A-P-P-L-E." },
      { q: "Which word is a fruit?", opts: ["Carrot", "Apple", "Potato", "Lettuce"], a: 1, exp: "Apple is a fruit." }
    );
  } else {
    templates.push(
      { q: "Identify the VERB: The brave knight fought bravely.", opts: ["brave", "knight", "fought", "bravely"], a: 2, exp: "A verb is a doing or action word. 'fought' is the action here." },
      { q: "Identify the ADJECTIVE: The ancient castle stood silently.", opts: ["ancient", "castle", "stood", "silently"], a: 0, exp: "An adjective describes a noun. 'ancient' describes the castle." },
      { q: "Identify the ADVERB: The mysterious wizard whispered quietly.", opts: ["mysterious", "wizard", "whispered", "quietly"], a: 3, exp: "An adverb describes how a verb is done. 'quietly' describes how he whispered." },
      { q: "Which word is a pronoun?", opts: ["run", "she", "blue", "quickly"], a: 1, exp: "She is a pronoun that replaces a noun." },
      { q: "Find the synonym for 'happy':", opts: ["sad", "joyful", "angry", "tired"], a: 1, exp: "Joyful means the same as happy." },
      { q: "Find the antonym for 'hot':", opts: ["warm", "cold", "boiling", "fire"], a: 1, exp: "Cold is the opposite of hot." }
    );
  }
  const selected = templates[Math.floor(Math.random() * templates.length)];
  return { ...selected, subject: 'english', topic: year <= 2 ? 'phonics' : 'grammar' };
};

export const generateLocalVerbal = (year) => {
  const templates = [];
  if (year <= 2) {
    templates.push(
      { q: "Which word is the odd one out?", opts: ["Car", "Bus", "Train", "Apple"], a: 3, exp: "Car, Bus, and Train are for traveling. Apple is a fruit." },
      { q: "Happy is to Sad, as Hot is to...", opts: ["Cold", "Warm", "Sun", "Fire"], a: 0, exp: "Happy and Sad are opposites. The opposite of Hot is Cold." },
      { q: "Which one doesn't belong?", opts: ["Red", "Blue", "Green", "Circle"], a: 3, exp: "Red, Blue, Green are colours; Circle is a shape." }
    );
  } else {
    templates.push(
      { q: "Find the next letter in the sequence: A, C, E, G, ?", opts: ["H", "I", "J", "K"], a: 1, exp: "The sequence skips one letter forward each time (+2)." },
      { q: "Code shift forward by 1 — code for CAT?", opts: ["DBS", "DBU", "BZS", "CBU"], a: 1, exp: "C+1=D, A+1=B, T+1=U. The code is DBU." },
      { q: "Find the next number: 2, 4, 8, 16, ?", opts: ["24", "30", "32", "64"], a: 2, exp: "Each number doubles the previous (×2)." },
      { q: "Which word is most similar to 'swift'?", opts: ["slow", "quick", "heavy", "light"], a: 1, exp: "Swift means fast, so quick is a synonym." }
    );
  }
  const selected = templates[Math.floor(Math.random() * templates.length)];
  return { ...selected, subject: 'verbal', topic: year <= 2 ? 'vocab' : 'sequences' };
};

export const generateLocalNVR = (year) => {
  const templates = [];
  if (year <= 2) {
    templates.push(
      { q: "Which of these is the odd one out?", opts: ["🔺", "🟥", "🔴", "🐶"], a: 3, exp: "The dog is an animal, while the others are shapes/colors." },
      { q: "What comes next? 🟦 🟧 🟦 🟧 ?", opts: ["🟦", "🟧", "🟩", "🟪"], a: 0, exp: "The pattern alternates Blue and Orange. Next is Blue." },
      { q: "Which shape has 4 sides?", opts: ["Circle", "Square", "Triangle", "Star"], a: 1, exp: "A square has 4 equal sides." }
    );
  } else {
    templates.push(
      { q: "Which shape does not belong in this sequence?", opts: ["Triangle", "Square", "Circle", "Red"], a: 3, exp: "Red is a colour, while the others are shapes." },
      { q: "What comes next? Square, Circle, Triangle, Square, Circle, ?", opts: ["Triangle", "Square", "Circle", "Diamond"], a: 0, exp: "The pattern repeats every three shapes." },
      { q: "Which arrow shows a 90° clockwise rotation of this arrow: → ?", opts: ["↑", "↓", "←", "↗️"], a: 0, exp: "Rotating a right arrow 90° clockwise gives an upward arrow." },
      { q: "Find the mirror image of this: →", opts: ["←", "→", "↑", "↓"], a: 0, exp: "The mirror image of a right arrow is a left arrow." }
    );
  }
  const selected = templates[Math.floor(Math.random() * templates.length)];
  return { ...selected, subject: 'nvr', topic: 'patterns' };
};

export const generateAIQuestions = async ({ year, region, subject, count, proficiency, previousQuestions }) => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, region, subject, count, proficiency, previousQuestions })
    });
    const data = await response.json();
    return data.questions.map(q => ({...q, subject}));
  } catch (e) {
    console.error("AI Generation failed"); return []; 
  }
};

// --- SESSION GENERATOR (with proper deduplication and logging) ---
export const generateSessionQuestions = async (year, region, count, proficiency, subject, mistakes = [], previousQuestionIds = []) => {
  console.log(`[generateSessionQuestions] year=${year}, subject=${subject}, count=${count}, previousIds count=${previousQuestionIds.length}`);

  const mix = subject === "mock" 
    ? [ { s: "maths", n: Math.ceil(count * 0.35) }, { s: "english", n: Math.ceil(count * 0.35) }, { s: "verbal", n: Math.floor(count * 0.15) }, { s: "nvr", n: Math.floor(count * 0.15) } ]
    : [ { s: subject, n: count } ];

  const allQuestions = [];
  const usedIds = new Set(previousQuestionIds);

  for (const { s, n } of mix) {
    let subjectQuestions = [];

    // TIER 1: Supabase (deduped by previousQuestionIds and last_used)
    try {
      if (supabase) {
        console.log(`[generateSessionQuestions] Fetching from DB for subject ${s}, year <= ${year}`);
        const { data, error } = await supabase
          .from('question_bank')
          .select('*')
          .eq('subject', s)
          .lte('year_level', year)
          .order('last_used', { ascending: true, nullsFirst: true })
          .limit(50);

        if (error) {
          console.error(`[generateSessionQuestions] DB error:`, error);
        } else {
          console.log(`[generateSessionQuestions] DB returned ${data?.length || 0} raw questions for ${s}`);
        }

        if (data && data.length > 0) {
          const fresh = data.filter(q => !usedIds.has(q.id));
          console.log(`[generateSessionQuestions] After filtering out used IDs, ${fresh.length} fresh questions remain`);

          const shuffledFresh = shuffle(fresh);
          const candidates = shuffledFresh.slice(0, Math.min(n * 2, fresh.length));
          console.log(`[generateSessionQuestions] Taking ${candidates.length} candidates`);

          for (const row of candidates) {
            let parsedOpts;
            try { parsedOpts = JSON.parse(row.options); } catch(e) { parsedOpts = ["A", "B", "C", "D"]; }
            
            const vars = {
              a: Math.floor(Math.random() * (year * 10)) + 5,
              b: Math.floor(Math.random() * (year * 10)) + 2,
              noun: NOUNS[Math.floor(Math.random() * NOUNS.length)],
              adj: ADJS[Math.floor(Math.random() * ADJS.length)],
              verb: VERBS[Math.floor(Math.random() * VERBS.length)],
              adv: ADVERBS[Math.floor(Math.random() * ADVERBS.length)]
            };
            
            const processedQ = processTemplateString(row.question_text, vars);
            const processedOpts = parsedOpts.map(opt => String(processTemplateString(opt, vars)));
            const correctIdx = parseInt(row.correct_index) || 0;

            const questionObj = {
              id: row.id,
              q: processedQ,
              opts: processedOpts,
              a: correctIdx,
              exp: processTemplateString(row.explanation, vars) || "Correct answer.",
              subject: s,
              passage: row.passage ? processTemplateString(row.passage, vars) : null,
              hints: ["Read carefully.", "Eliminate wrong answers."],
              vars,
              topic: row.topic
            };
            subjectQuestions.push(questionObj);
            usedIds.add(row.id);
          }

          const selectedIds = subjectQuestions.map(q => q.id);
          console.log(`[generateSessionQuestions] Selected DB question IDs for ${s}:`, selectedIds);

          if (selectedIds.length > 0) {
            supabase
              .from('question_bank')
              .update({ last_used: new Date().toISOString() })
              .in('id', selectedIds)
              .then(({ error }) => {
                if (error) console.warn("Failed to update last_used:", error);
              });
          }
        }
      }
    } catch (err) { 
      console.warn("Vault fetch failed, relying on procedural engine:", err); 
    }

    const needed = n - subjectQuestions.length;
    console.log(`[generateSessionQuestions] For ${s}, got ${subjectQuestions.length} DB questions, need ${needed} more`);

    for (let i = 0; i < needed; i++) {
      if (s === "maths") {
        if (Math.random() > 0.7) {
          subjectQuestions.push(generateRealWorldMaths(year));
        } else {
          subjectQuestions.push(generateLocalMaths(year));
        }
      }
      else if (s === "english") subjectQuestions.push(generateLocalEnglish(year));
      else if (s === "verbal") subjectQuestions.push(generateLocalVerbal(year));
      else if (s === "nvr") subjectQuestions.push(generateLocalNVR(year));
    }

    allQuestions.push(...subjectQuestions);
  }

  const final = shuffle(allQuestions).slice(0, count);
  console.log(`[generateSessionQuestions] Final ${final.length} questions. DB IDs in final:`, final.filter(q => q.id).map(q => q.id));
  return final;
};

export const fetchClaudeResponse = async (prompt, system) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 300, system, messages: [{ role: "user", content: prompt }] })
    });
    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    return "Tara says: That's a great effort! Explaining your thinking is the secret to becoming a master scholar. ✨ Keep going!";
  }
};