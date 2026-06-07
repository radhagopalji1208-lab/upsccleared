import { useState, useEffect, useRef } from "react";

const SUBJECTS = [
  { id: "gs1", name: "GS Paper I", icon: "🏛️", color: "#1a6b4a", bg: "#e1f5ee", topics: ["History", "Geography", "Society", "Art & Culture"] },
  { id: "gs2", name: "GS Paper II", icon: "⚖️", color: "#185fa5", bg: "#e6f1fb", topics: ["Polity", "Governance", "International Relations", "Social Justice"] },
  { id: "gs3", name: "GS Paper III", icon: "🌾", color: "#854f0b", bg: "#faeeda", topics: ["Economy", "Environment", "Science & Technology", "Security"] },
  { id: "gs4", name: "GS Paper IV", icon: "💡", color: "#533489", bg: "#eeedfe", topics: ["Ethics", "Integrity", "Aptitude", "Case Studies"] },
  { id: "csat", name: "CSAT", icon: "🧮", color: "#993c1d", bg: "#faece7", topics: ["Comprehension", "Reasoning", "Maths", "Decision Making"] },
  { id: "essay", name: "Essay", icon: "✍️", color: "#3b6d11", bg: "#eaf3de", topics: ["Essay Writing", "Language Skills", "Structure", "Previous Topics"] },
];

const SYLLABUS = {
  gs1: {
    "History": ["Indian Culture (Harappan to Mughal)", "Modern India (1857–1947)", "Post-Independence Consolidation", "World History (18th–20th Century)"],
    "Geography": ["Salient Features of World Physical Geography", "Distribution of Key Natural Resources", "Geophysical Phenomena", "Changes in Critical Geographical Features"],
    "Society": ["Salient Features of Indian Society", "Diversity of India", "Role of Women and Women's Organisation", "Population & Associated Issues", "Urbanisation & Migration"],
    "Art & Culture": ["Indian Art Forms", "Architecture", "Literature", "Performing Arts"],
  },
  gs2: {
    "Polity": ["Indian Constitution", "Functions of Parliament", "Judiciary", "Federalism & Centre-State Relations", "Constitutional Bodies"],
    "Governance": ["Government Policies & Schemes", "E-governance", "SHGs, NGOs", "Welfare Schemes"],
    "International Relations": ["India & Neighbourhood", "Bilateral/Global Groupings", "Effect of Foreign Policies on India"],
    "Social Justice": ["Mechanisms against Vulnerable Sections", "Issues relating to Health, Education, Poverty"],
  },
  gs3: {
    "Economy": ["Indian Economy", "Inclusive Growth", "Government Budgeting", "Agriculture & Food Security", "Land Reforms"],
    "Environment": ["Conservation", "Environmental Pollution", "Climate Change", "Disaster Management"],
    "Science & Technology": ["Developments in IT & Space", "Biotechnology", "IP Rights"],
    "Security": ["Internal Security Challenges", "Money Laundering", "Border Management", "Cyber Security"],
  },
  gs4: {
    "Ethics": ["Ethics & Human Interface", "Human Values", "Role of Family, Society, Educational Institutions"],
    "Integrity": ["Attitude", "Emotional Intelligence", "Contributions of Moral Thinkers"],
    "Aptitude": ["Probity in Governance", "Philosophical Basis of Governance & Probity"],
    "Case Studies": ["Case Studies on Above Issues"],
  },
  csat: {
    "Comprehension": ["Reading Comprehension", "Passage Analysis", "Inference Drawing"],
    "Reasoning": ["Logical Reasoning", "Analytical Ability"],
    "Maths": ["Basic Numeracy", "Data Interpretation"],
    "Decision Making": ["Problem Solving", "General Mental Ability"],
  },
  essay: {
    "Essay Writing": ["Introduction Techniques", "Body Structure", "Conclusion Methods"],
    "Language Skills": ["Vocabulary", "Grammar", "Sentence Construction"],
    "Structure": ["Topic Analysis", "Planning & Outlining"],
    "Previous Topics": ["Philosophy & Ethics", "Society", "Economy", "Governance"],
  },
};

const PYQ_BANK = [
  { year: 2023, paper: "GS1", q: "Assess the importance of the Pala Empire in the context of Indian cultural history.", subject: "gs1", topic: "History", type: "mains", marks: 15 },
  { year: 2023, paper: "GS2", q: "Discuss the role of the Finance Commission in maintaining fiscal federalism in India.", subject: "gs2", topic: "Polity", type: "mains", marks: 15 },
  { year: 2023, paper: "GS3", q: "How is the government of India working to reduce carbon intensity of the economy?", subject: "gs3", topic: "Environment", type: "mains", marks: 15 },
  { year: 2022, paper: "GS1", q: "Discuss the main features of Vedic society and religion. Do you think some of the features are still prevailing in Indian society today? Critically examine.", subject: "gs1", topic: "History", type: "mains", marks: 15 },
  { year: 2022, paper: "GS2", q: "Examine the legitimacy of judicial review in the context of separation of powers.", subject: "gs2", topic: "Polity", type: "mains", marks: 10 },
  { year: 2021, paper: "GS1", q: "What are the main features of Indo-Islamic architecture? How did it represent a synthesis of Indian and Islamic architectural styles?", subject: "gs1", topic: "Art & Culture", type: "mains", marks: 15 },
  { year: 2023, paper: "Prelims", q: "With reference to the Indian economy, 'Open Market Operations' refers to:", subject: "gs3", topic: "Economy", type: "prelims", options: ["Borrowing by scheduled banks from the RBI", "Lending by commercial banks to industry and trade", "Purchase and sale of government securities by the RBI", "None of the above"], answer: 2, explanation: "Open Market Operations (OMO) refers to the RBI buying or selling government securities in the open market to control liquidity." },
  { year: 2023, paper: "Prelims", q: "Consider the following statements about 'Pradhan Mantri Jan Dhan Yojana': 1. It is a financial inclusion scheme. 2. Zero-balance accounts are allowed. 3. It provides accidental insurance cover. Which of the above is/are correct?", subject: "gs2", topic: "Governance", type: "prelims", options: ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], answer: 3, explanation: "PMJDY is India's financial inclusion program. It allows zero-balance accounts and provides ₹1 lakh accidental insurance and ₹30,000 life insurance." },
  { year: 2022, paper: "Prelims", q: "Which one of the following statements best describes the 'Gram Nyayalayas Act'?", subject: "gs2", topic: "Polity", type: "prelims", options: ["It provides for establishment of fast-track courts for speedy trial", "It provides for village courts for trial of certain offences", "It establishes courts for civil disputes only", "It provides for Lok Adalat at village level"], answer: 1, explanation: "Gram Nyayalayas Act, 2008 provides for establishment of mobile courts at the grassroots level for speedy disposal of cases." },
  { year: 2021, paper: "Prelims", q: "'Agenda 21' sometimes seen in news is:", subject: "gs3", topic: "Environment", type: "prelims", options: ["UN framework on climate change", "Action plan for sustainable development from Rio Summit 1992", "Nuclear non-proliferation treaty", "Paris Agreement on emissions"], answer: 1, explanation: "Agenda 21 is a non-binding action plan of the United Nations related to sustainable development, produced at the 1992 Earth Summit in Rio." },
];

const CURRENT_AFFAIRS_TOPICS = [
  { title: "India-Maldives Relations", category: "International Relations", date: "2024", importance: "High" },
  { title: "Digital India 3.0", category: "Governance", date: "2024", importance: "High" },
  { title: "Carbon Credits Market", category: "Environment", date: "2024", importance: "Medium" },
  { title: "India's Semiconductor Mission", category: "S&T", date: "2024", importance: "High" },
  { title: "National Education Policy Impact", category: "Social", date: "2024", importance: "Medium" },
];

const PROGRESS_DATA = {
  gs1: 45, gs2: 60, gs3: 30, gs4: 75, csat: 55, essay: 20,
};

export default function UPSCApp() {
  const [view, setView] = useState("dashboard");
  const [activeSub, setActiveSub] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [testMode, setTestMode] = useState(null);
  const [testQs, setTestQs] = useState([]);
  const [testIdx, setTestIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });
  const [testDone, setTestDone] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [filterYear, setFilterYear] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [syllabusExpanded, setSyllabusExpanded] = useState({});
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [chatMessages, setChatMessages] = useState([{ role: "assistant", text: "Namaste! I'm your UPSC AI Mentor. Ask me anything about the syllabus, concepts, or exam strategy." }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const startTest = (type, subjectId) => {
    let pool = PYQ_BANK.filter(q => {
      if (type === "prelims") return q.type === "prelims" && (!subjectId || q.subject === subjectId);
      return q.type === "mains" && (!subjectId || q.subject === subjectId);
    });
    if (filterYear !== "All") pool = pool.filter(q => q.year === parseInt(filterYear));
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(5, pool.length));
    if (shuffled.length === 0) { alert("No questions found for this filter. Try changing year or type."); return; }
    setTestQs(shuffled);
    setTestIdx(0);
    setSelected(null);
    setAnswered(false);
    setScore({ correct: 0, wrong: 0, total: 0 });
    setTestDone(false);
    setTestMode(type);
    setView("test");
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === testQs[testIdx].answer;
    setScore(s => ({ ...s, correct: s.correct + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1), total: s.total + 1 }));
  };

  const nextQ = () => {
    if (testIdx + 1 >= testQs.length) { setTestDone(true); return; }
    setTestIdx(i => i + 1);
    setSelected(null);
    setAnswered(false);
  };

  const loadAIContent = async (subject, topic) => {
    setAiLoading(true);
    setAiContent("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `Give me a concise UPSC study note for the topic "${topic}" under ${subject}. Include: 1) Key concepts (3-5 bullet points), 2) Important facts for exam, 3) A practice question with answer. Format clearly with headings. Keep it under 400 words.` }]
        })
      });
      const data = await res.json();
      setAiContent(data.content?.[0]?.text || "Could not load content.");
    } catch { setAiContent("Failed to load AI content. Please try again."); }
    setAiLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(m => [...m, { role: "user", text: userMsg }]);
    setChatLoading(true);
    try {
      const history = chatMessages.filter(m => m.role !== "system").map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an expert UPSC coach helping an Indian civil services aspirant. Give concise, exam-focused answers. Use bullet points where helpful. Refer to UPSC syllabus, PYQs, and current affairs when relevant.",
          messages: [...history, { role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      setChatMessages(m => [...m, { role: "assistant", text: data.content?.[0]?.text || "Sorry, I couldn't respond." }]);
    } catch { setChatMessages(m => [...m, { role: "assistant", text: "Connection error. Please try again." }]); }
    setChatLoading(false);
  };

  const saveNote = (key) => {
    if (!noteInput.trim()) return;
    setNotes(n => ({ ...n, [key]: [...(n[key] || []), noteInput.trim()] }));
    setNoteInput("");
  };

  const styles = {
    app: { fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f8f9fa", color: "#1a1a2e" },
    nav: { background: "#1a1a2e", color: "#fff", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 },
    navBrand: { fontSize: 20, fontWeight: 700, color: "#ffd700", letterSpacing: 1 },
    navLinks: { display: "flex", gap: 8 },
    navBtn: (active) => ({ background: active ? "#ffd700" : "transparent", color: active ? "#1a1a2e" : "#ccc", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontWeight: active ? 700 : 400, fontSize: 13, transition: "all 0.2s" }),
    main: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" },
    grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 },
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 },
    card: { background: "#fff", borderRadius: 12, border: "1px solid #e8eaf0", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    subjectCard: (bg, color) => ({ background: bg, border: `2px solid ${color}20`, borderRadius: 12, padding: "1.25rem", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }),
    heading: { fontSize: 26, fontWeight: 700, marginBottom: 4, color: "#1a1a2e" },
    subheading: { fontSize: 18, fontWeight: 600, marginBottom: 12, color: "#1a1a2e" },
    muted: { color: "#666", fontSize: 14 },
    badge: (color, bg) => ({ background: bg, color, fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }),
    btn: (primary) => ({ background: primary ? "#1a1a2e" : "#fff", color: primary ? "#ffd700" : "#1a1a2e", border: primary ? "none" : "1.5px solid #ddd", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.15s" }),
    progress: (pct, color) => ({ height: 8, borderRadius: 4, background: "#e8eaf0", position: "relative", overflow: "hidden" }),
    progressFill: (pct, color) => ({ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.6s ease" }),
    input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box" },
    tag: { background: "#eeedfe", color: "#533489", fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600 },
    aiBox: { background: "#f0f4ff", border: "1px solid #c5d5f5", borderRadius: 10, padding: "1rem", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 400, overflowY: "auto" },
  };

  // ---- VIEWS ----

  const Dashboard = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={styles.heading}>📚 UPSC Dashboard</h1>
          <p style={styles.muted}>Track your preparation across all subjects</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.btn(true)} onClick={() => startTest("prelims", null)}>🎯 Take Prelims Test</button>
          <button style={styles.btn(false)} onClick={() => startTest("mains", null)}>📝 Take Mains Test</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[{ label: "Questions Practiced", val: "124", icon: "❓" }, { label: "Tests Taken", val: "18", icon: "✅" }, { label: "Topics Covered", val: "47", icon: "📖" }, { label: "Streak Days", val: "12", icon: "🔥" }].map(stat => (
          <div key={stat.label} style={{ ...styles.card, textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>{stat.val}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ ...styles.subheading, marginBottom: 16 }}>Subjects</h2>
      <div style={styles.grid3}>
        {SUBJECTS.map(s => (
          <div key={s.id} style={styles.subjectCard(s.bg, s.color)}
            onClick={() => { setActiveSub(s.id); setView("subject"); }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <span style={{ ...styles.badge(s.color, s.bg), filter: "brightness(0.85)" }}>{PROGRESS_DATA[s.id]}%</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: s.color, marginBottom: 4 }}>{s.name}</div>
            <div style={styles.progress()}>
              <div style={styles.progressFill(PROGRESS_DATA[s.id], s.color)} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              {s.topics.slice(0, 3).map(t => <span key={t} style={{ fontSize: 11, background: "#fff8", padding: "2px 8px", borderRadius: 10, color: s.color, fontWeight: 500 }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, ...styles.card }}>
        <h2 style={{ ...styles.subheading, marginBottom: 12 }}>🗞️ Current Affairs Focus</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
          {CURRENT_AFFAIRS_TOPICS.map(t => (
            <div key={t.title} style={{ padding: "10px 14px", background: "#f8f9fa", borderRadius: 8, border: "1px solid #e8eaf0" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t.title}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ ...styles.tag, fontSize: 11 }}>{t.category}</span>
                <span style={{ fontSize: 11, color: t.importance === "High" ? "#cc3300" : "#888", fontWeight: 600 }}>{t.importance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SubjectView = () => {
    const sub = SUBJECTS.find(s => s.id === activeSub);
    if (!sub) return null;
    const syllabus = SYLLABUS[activeSub];
    return (
      <div>
        <button style={{ ...styles.btn(false), marginBottom: 16 }} onClick={() => setView("dashboard")}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 40 }}>{sub.icon}</span>
          <div>
            <h1 style={{ ...styles.heading, marginBottom: 4 }}>{sub.name}</h1>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={styles.btn(true)} onClick={() => startTest("prelims", activeSub)}>🎯 Prelims PYQ</button>
              <button style={styles.btn(false)} onClick={() => startTest("mains", activeSub)}>📝 Mains PYQ</button>
            </div>
          </div>
        </div>

        <div style={styles.grid2}>
          {Object.entries(syllabus).map(([topic, subtopics]) => (
            <div key={topic} style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => setSyllabusExpanded(e => ({ ...e, [`${activeSub}-${topic}`]: !e[`${activeSub}-${topic}`] }))}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: sub.color, margin: 0 }}>{topic}</h3>
                <span>{syllabusExpanded[`${activeSub}-${topic}`] ? "▲" : "▼"}</span>
              </div>
              {syllabusExpanded[`${activeSub}-${topic}`] && (
                <div style={{ marginTop: 12 }}>
                  {subtopics.map(st => (
                    <div key={st} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <span style={{ fontSize: 14 }}>{st}</span>
                      <button style={{ background: sub.bg, color: sub.color, border: "none", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                        onClick={() => { setActiveTopic({ sub: sub.name, topic: st }); setAiContent(""); setView("topic"); }}>
                        Study →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TopicView = () => {
    if (!activeTopic) return null;
    const noteKey = `${activeTopic.sub}-${activeTopic.topic}`;
    return (
      <div>
        <button style={{ ...styles.btn(false), marginBottom: 16 }} onClick={() => setView("subject")}>← Back to {activeTopic.sub}</button>
        <h1 style={{ ...styles.heading, marginBottom: 4 }}>{activeTopic.topic}</h1>
        <p style={styles.muted}>{activeTopic.sub}</p>

        <div style={{ ...styles.card, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ ...styles.subheading, margin: 0 }}>🤖 AI Study Notes</h2>
            <button style={styles.btn(true)} onClick={() => loadAIContent(activeTopic.sub, activeTopic.topic)} disabled={aiLoading}>
              {aiLoading ? "Loading..." : "Generate Notes"}
            </button>
          </div>
          {aiLoading && <div style={{ textAlign: "center", padding: 30, color: "#888" }}>🔄 Generating study notes...</div>}
          {aiContent && <div style={styles.aiBox}>{aiContent}</div>}
          {!aiContent && !aiLoading && <div style={{ color: "#aaa", textAlign: "center", padding: 20 }}>Click "Generate Notes" to get AI-powered study material for this topic</div>}
        </div>

        <div style={styles.card}>
          <h2 style={{ ...styles.subheading, marginBottom: 12 }}>📓 My Notes</h2>
          <div style={{ marginBottom: 10 }}>
            {(notes[noteKey] || []).map((n, i) => (
              <div key={i} style={{ padding: "8px 12px", background: "#fffde7", borderRadius: 8, marginBottom: 6, fontSize: 14, border: "1px solid #ffe082" }}>
                {n}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={styles.input} placeholder="Add a note..." value={noteInput} onChange={e => setNoteInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveNote(noteKey)} />
            <button style={styles.btn(true)} onClick={() => saveNote(noteKey)}>Add</button>
          </div>
        </div>
      </div>
    );
  };

  const TestView = () => {
    if (testDone) {
      const pct = Math.round((score.correct / score.total) * 100);
      return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ ...styles.card, textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: 60 }}>{pct >= 70 ? "🎉" : pct >= 40 ? "👍" : "📚"}</div>
            <h1 style={{ ...styles.heading, margin: "12px 0 4px" }}>Test Complete!</h1>
            <div style={{ fontSize: 48, fontWeight: 700, color: pct >= 70 ? "#1a6b4a" : pct >= 40 ? "#854f0b" : "#993c1d", margin: "12px 0" }}>{pct}%</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1a6b4a" }}>{score.correct}</div>
                <div style={styles.muted}>Correct</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#993c1d" }}>{score.wrong}</div>
                <div style={styles.muted}>Wrong</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{score.total}</div>
                <div style={styles.muted}>Total</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={styles.btn(true)} onClick={() => startTest(testMode, null)}>Retake Test</button>
              <button style={styles.btn(false)} onClick={() => setView("dashboard")}>Dashboard</button>
              <button style={styles.btn(false)} onClick={() => setView("pyq")}>View All PYQs</button>
            </div>
          </div>
        </div>
      );
    }

    const q = testQs[testIdx];
    if (!q) return null;
    const isPrelims = q.type === "prelims";

    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <span style={styles.muted}>Question {testIdx + 1} / {testQs.length}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ ...styles.badge("#185fa5", "#e6f1fb") }}>{q.paper}</span>
            <span style={{ ...styles.badge("#854f0b", "#faeeda") }}>{q.year}</span>
          </div>
        </div>
        <div style={{ ...styles.progress() }}>
          <div style={styles.progressFill(((testIdx) / testQs.length) * 100, "#1a1a2e")} />
        </div>

        <div style={{ ...styles.card, marginTop: 16 }}>
          <p style={{ fontSize: 16, lineHeight: 1.7, fontWeight: 500, marginBottom: 20 }}>{q.q}</p>

          {isPrelims && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = "#f8f9fa", border = "#e0e0e0", color = "#333";
                if (answered) {
                  if (i === q.answer) { bg = "#e1f5ee"; border = "#1a6b4a"; color = "#1a6b4a"; }
                  else if (i === selected && i !== q.answer) { bg = "#faece7"; border = "#993c1d"; color = "#993c1d"; }
                }
                return (
                  <button key={i} disabled={answered} onClick={() => handleAnswer(i)}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: 8, padding: "10px 16px", textAlign: "left", cursor: answered ? "default" : "pointer", color, fontSize: 14, fontWeight: answered && i === q.answer ? 600 : 400, transition: "all 0.2s" }}>
                    <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
                  </button>
                );
              })}
              {answered && (
                <div style={{ background: "#e8f4fd", border: "1px solid #90caf9", borderRadius: 8, padding: "12px 16px", marginTop: 8 }}>
                  <strong>📖 Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          )}

          {!isPrelims && (
            <div>
              <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "12px 16px", marginBottom: 12, fontSize: 13 }}>
                <strong>Type:</strong> Mains Descriptive &nbsp; <strong>Marks:</strong> {q.marks}
              </div>
              <div style={{ marginTop: 8, color: "#555", fontSize: 14 }}>
                💡 <strong>Attempt this question</strong> in your answer writing practice. Think of: Introduction → Body (facts, analysis, examples) → Conclusion
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          {(!isPrelims || answered) && (
            <button style={styles.btn(true)} onClick={nextQ}>
              {testIdx + 1 >= testQs.length ? "See Results" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const PYQView = () => {
    const years = ["All", ...new Set(PYQ_BANK.map(q => q.year.toString()))].sort((a, b) => b - a);
    const filtered = PYQ_BANK.filter(q =>
      (filterYear === "All" || q.year.toString() === filterYear) &&
      (filterType === "All" || q.type === filterType)
    );
    return (
      <div>
        <h1 style={{ ...styles.heading, marginBottom: 4 }}>Previous Year Questions</h1>
        <p style={{ ...styles.muted, marginBottom: 16 }}>UPSC PYQs from 2019–2023</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          <select style={{ ...styles.input, width: "auto" }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
            {years.map(y => <option key={y}>{y}</option>)}
          </select>
          <select style={{ ...styles.input, width: "auto" }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            {["All", "prelims", "mains"].map(t => <option key={t}>{t}</option>)}
          </select>
          <button style={styles.btn(true)} onClick={() => startTest(filterType === "mains" ? "mains" : "prelims", null)}>
            🎯 Test with Filtered
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((q, i) => {
            const sub = SUBJECTS.find(s => s.id === q.subject);
            return (
              <div key={i} style={styles.card}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={styles.badge("#1a1a2e", "#e8eaf0")}>{q.year}</span>
                  <span style={{ ...styles.badge(sub?.color || "#555", sub?.bg || "#eee") }}>{q.paper}</span>
                  <span style={{ ...styles.badge(q.type === "prelims" ? "#185fa5" : "#854f0b", q.type === "prelims" ? "#e6f1fb" : "#faeeda") }}>{q.type}</span>
                  <span style={styles.tag}>{q.topic}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{q.q}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const SyllabusView = () => (
    <div>
      <h1 style={{ ...styles.heading, marginBottom: 4 }}>UPSC Syllabus</h1>
      <p style={{ ...styles.muted, marginBottom: 20 }}>Complete IAS syllabus — Prelims & Mains</p>
      {SUBJECTS.map(sub => (
        <div key={sub.id} style={{ ...styles.card, marginBottom: 14, borderLeft: `4px solid ${sub.color}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            onClick={() => setSyllabusExpanded(e => ({ ...e, [sub.id]: !e[sub.id] }))}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{sub.icon}</span>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: sub.color }}>{sub.name}</h2>
            </div>
            <span style={{ fontSize: 20 }}>{syllabusExpanded[sub.id] ? "▲" : "▼"}</span>
          </div>
          {syllabusExpanded[sub.id] && (
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {Object.entries(SYLLABUS[sub.id]).map(([topic, subs]) => (
                <div key={topic} style={{ background: sub.bg, borderRadius: 8, padding: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: sub.color, marginBottom: 6 }}>{topic}</div>
                  {subs.map(s => <div key={s} style={{ fontSize: 13, color: "#444", padding: "2px 0" }}>• {s}</div>)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const ChatView = () => (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ ...styles.heading, marginBottom: 4 }}>🤖 AI Mentor</h1>
      <p style={{ ...styles.muted, marginBottom: 16 }}>Powered by Claude AI — ask about concepts, strategy, current affairs</p>
      <div style={{ ...styles.card, minHeight: 400, maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
        {chatMessages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: m.role === "user" ? "#1a1a2e" : "#f0f4ff", color: m.role === "user" ? "#ffd700" : "#222", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
          </div>
        ))}
        {chatLoading && <div style={{ color: "#888", fontSize: 13, padding: "6px 14px" }}>🤔 Mentor is thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input style={styles.input} placeholder="Ask about UPSC topics, strategy, current affairs..." value={chatInput}
          onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} />
        <button style={styles.btn(true)} onClick={sendChat} disabled={chatLoading}>Send</button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {["Explain Article 356", "What is PFMS scheme?", "Mains writing tips", "Ethics vs morality in UPSC"].map(s => (
          <button key={s} style={{ background: "#eeedfe", color: "#533489", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 500 }} onClick={() => setChatInput(s)}>{s}</button>
        ))}
      </div>
    </div>
  );

  const navItems = [
    { id: "dashboard", label: "🏠 Home" },
    { id: "syllabus", label: "📚 Syllabus" },
    { id: "pyq", label: "📋 PYQs" },
    { id: "chat", label: "🤖 AI Mentor" },
  ];

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>UPSC Prep</div>
        <div style={styles.navLinks}>
          {navItems.map(n => (
            <button key={n.id} style={styles.navBtn(view === n.id)} onClick={() => setView(n.id)}>{n.label}</button>
          ))}
        </div>
      </nav>
      <main style={styles.main}>
        {view === "dashboard" && <Dashboard />}
        {view === "subject" && <SubjectView />}
        {view === "topic" && <TopicView />}
        {view === "test" && <TestView />}
        {view === "pyq" && <PYQView />}
        {view === "syllabus" && <SyllabusView />}
        {view === "chat" && <ChatView />}
      </main>
    </div>
  );
}
