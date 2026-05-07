import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design tokens matching Rhythm site ───
const T = {
  terracotta: "#C4724A",
  terracottaLight: "#E8C4AE",
  terracottaPale: "#F5EDE6",
  sage: "#7A9E7E",
  sageLight: "#C2D7C4",
  sagePale: "#EEF4EF",
  cream: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalMid: "#5A5A5A",
  charcoalLight: "#8A8A8A",
  white: "#FFFFFF",
  border: "rgba(44,44,44,0.12)",
};

const fontDisplay = "'Cormorant Garamond', Georgia, serif";
const fontBody = "'DM Sans', system-ui, sans-serif";

// ─── Google Fonts loader ───
function useFonts() {
  useEffect(() => {
    if (document.getElementById("rhythm-fonts")) return;
    const link = document.createElement("link");
    link.id = "rhythm-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Phone frame wrapper ───
function PhoneFrame({ children }) {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: T.charcoal, fontFamily: fontBody,
      padding: "24px 16px",
    }}>
      <div style={{
        width: 390, minHeight: 780, maxHeight: "90vh",
        background: T.cream, borderRadius: 44,
        border: `8px solid ${T.charcoal}`,
        boxShadow: "0 0 0 2px #444, 0 32px 80px rgba(0,0,0,0.5)",
        overflow: "hidden", position: "relative", display: "flex",
        flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{
          height: 44, background: T.cream, display: "flex",
          alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: T.charcoal }}>9:41</span>
          <div style={{ width: 120, height: 28, background: T.charcoal, borderRadius: 20 }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 16, height: 10, border: `1.5px solid ${T.charcoal}`, borderRadius: 2, position: "relative" }}>
              <div style={{ position: "absolute", top: 1, left: 1, width: "70%", height: "calc(100% - 2px)", background: T.charcoal, borderRadius: 1 }} />
            </div>
          </div>
        </div>
        {/* Screen content */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{
          height: 34, display: "flex", alignItems: "center", justifyContent: "center",
          background: T.cream, flexShrink: 0,
        }}>
          <div style={{ width: 120, height: 4, background: T.charcoal, borderRadius: 4, opacity: 0.3 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Shared UI primitives ───
function Btn({ children, onClick, variant = "primary", style = {} }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "13px 24px", fontSize: 13, fontWeight: 500,
    letterSpacing: "0.06em", textTransform: "uppercase",
    fontFamily: fontBody, border: "none", cursor: "pointer",
    transition: "all 0.2s", width: "100%", ...style,
  };
  const variants = {
    primary: { background: T.terracotta, color: T.white },
    sage: { background: T.sage, color: T.white },
    outline: { background: "transparent", color: T.charcoal, border: `1.5px solid ${T.charcoal}` },
    ghost: { background: T.terracottaPale, color: T.terracotta, border: `1px solid ${T.terracottaLight}` },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick}>{children}</button>;
}

function ScreenWrap({ children, style = {} }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 24px 32px", ...style }}>
      {children}
    </div>
  );
}

function Label({ children, color = T.terracotta }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color, marginBottom: 8 }}>
      {children}
    </p>
  );
}

function DisplayH({ children, size = 28, style = {} }) {
  return (
    <h2 style={{ fontFamily: fontDisplay, fontSize: size, fontWeight: 400, lineHeight: 1.15, color: T.charcoal, margin: "0 0 16px", ...style }}>
      {children}
    </h2>
  );
}

function ProgressDots({ total, current }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 6, height: 6,
          borderRadius: 3, background: i === current ? T.terracotta : T.terracottaLight,
          transition: "all 0.3s",
        }} />
      ))}
    </div>
  );
}

function Slider({ value, onChange, min = 0, max = 10, label, color = T.terracotta }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <p style={{ fontSize: 12, color: T.charcoalMid, marginBottom: 8 }}>{label}</p>}
      <div style={{ position: "relative" }}>
        <input type="range" min={min} max={max} value={value} step={1}
          onChange={({target:{value:v}}) => onChange(Number(v))}
          style={{ width: "100%", accentColor: color, height: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: T.charcoalLight }}>{min}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color }}>{value}</span>
          <span style={{ fontSize: 10, color: T.charcoalLight }}>{max}</span>
        </div>
      </div>
    </div>
  );
}

function Card({ children, style = {}, color = T.white }) {
  return (
    <div style={{
      background: color, border: `1px solid ${T.border}`,
      padding: "16px 18px", marginBottom: 12, ...style,
    }}>
      {children}
    </div>
  );
}

// ─── ONBOARDING ───
const GOALS = [
  { id: "knowledge", label: "Understanding my cycle", icon: "◎", desc: "Learn the neuroscience behind your phases" },
  { id: "daily", label: "Daily interventions", icon: "◈", desc: "Guided practices tailored to today" },
  { id: "mental", label: "Mental health support", icon: "◇", desc: "Evidence-based tools for mood and anxiety" },
  { id: "provider", label: "Acting on provider advice", icon: "◉", desc: "Structured support for recommended interventions" },
];

const PHASES = ["Menstrual", "Follicular", "Ovulatory", "Luteal", "Not sure"];
const REGULARITY = ["Very regular", "Somewhat regular", "Irregular", "Postpartum", "Perimenopausal"];
const MOODS = [
  { label: "Low energy", val: "low_energy" },
  { label: "Anxious", val: "anxious" },
  { label: "Unmotivated", val: "unmotivated" },
  { label: "Foggy", val: "foggy" },
  { label: "Overwhelmed", val: "overwhelmed" },
  { label: "Irritable", val: "irritable" },
  { label: "Okay", val: "okay" },
  { label: "Good", val: "good" },
];

function OnboardingAge({ onNext }) {
  const [age, setAge] = useState(32);
  const [reg, setReg] = useState(null);
  return (
    <ScreenWrap>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <span style={{ fontFamily: fontDisplay, fontSize: 22, color: T.terracotta }}>Rhythm</span>
          <span style={{ fontSize: 10, color: T.charcoalLight, letterSpacing: "0.1em", textTransform: "uppercase" }}>— setup</span>
        </div>
        <ProgressDots total={4} current={0} />
        <Label>Step 1 of 4</Label>
        <DisplayH size={26}>About your cycle.</DisplayH>
        <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 24 }}>
          This helps Rhythm calibrate its phase model and choose the right interpretation framework for you.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: T.charcoal, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>Your age</p>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <input type="range" min={18} max={65} value={age} step={1}
            onChange={({target:{value:v}}) => setAge(Number(v))}
            style={{ flex: 1, accentColor: T.terracotta }} />
          <span style={{ fontFamily: fontDisplay, fontSize: 32, fontWeight: 300, color: T.terracotta, minWidth: 48 }}>{age}</span>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: T.charcoal, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>Cycle pattern</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {REGULARITY.map(r => (
            <button key={r} onClick={() => setReg(r)} style={{
              padding: "12px 16px", border: `1.5px solid ${reg === r ? T.terracotta : T.border}`,
              background: reg === r ? T.terracottaPale : T.white,
              color: reg === r ? T.terracotta : T.charcoalMid,
              fontSize: 13, fontFamily: fontBody, cursor: "pointer",
              textAlign: "left", transition: "all 0.2s",
            }}>{r}</button>
          ))}
        </div>
      </div>

      <Btn onClick={() => reg && onNext({ age, regularity: reg })} variant={reg ? "primary" : "ghost"}>
        Continue →
      </Btn>
    </ScreenWrap>
  );
}

function OnboardingGoals({ onNext }) {
  const [selected, setSelected] = useState([]);
  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return (
    <ScreenWrap>
      <div style={{ marginBottom: 24 }}>
        <ProgressDots total={4} current={1} />
        <Label>Step 2 of 4</Label>
        <DisplayH size={26}>What are you looking for?</DisplayH>
        <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 0 }}>
          Select all that apply. This shapes which intervention types Rhythm prioritises for you.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, flex: 1 }}>
        {GOALS.map(g => {
          const on = selected.includes(g.id);
          return (
            <button key={g.id} onClick={() => toggle(g.id)} style={{
              padding: "14px 16px", border: `1.5px solid ${on ? T.sage : T.border}`,
              background: on ? T.sagePale : T.white,
              cursor: "pointer", textAlign: "left", transition: "all 0.2s",
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 18, color: on ? T.sage : T.charcoalLight, marginTop: 1 }}>{g.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: on ? T.sage : T.charcoal, margin: "0 0 3px", fontFamily: fontBody }}>{g.label}</p>
                <p style={{ fontSize: 11, color: T.charcoalLight, margin: 0 }}>{g.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Btn onClick={() => selected.length && onNext({ goals: selected })} variant={selected.length ? "primary" : "ghost"}>
        Continue →
      </Btn>
    </ScreenWrap>
  );
}

function OnboardingPhase({ onNext }) {
  const [phase, setPhase] = useState(null);
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState(null);
  return (
    <ScreenWrap>
      <ProgressDots total={4} current={2} />
      <Label>Step 3 of 4</Label>
      <DisplayH size={26}>How are you today?</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 20 }}>
        Your daily state is the primary signal. Phase gives context — you give the data.
      </p>

      <p style={{ fontSize: 12, fontWeight: 500, color: T.charcoal, marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>Current cycle phase</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {PHASES.map(p => (
          <button key={p} onClick={() => setPhase(p)} style={{
            padding: "8px 14px", fontSize: 12, fontFamily: fontBody, cursor: "pointer",
            border: `1.5px solid ${phase === p ? T.terracotta : T.border}`,
            background: phase === p ? T.terracottaPale : T.white,
            color: phase === p ? T.terracotta : T.charcoalMid,
            transition: "all 0.2s",
          }}>{p}</button>
        ))}
      </div>

      <Slider value={energy} onChange={setEnergy} min={1} max={10} label="Energy level right now" />

      <p style={{ fontSize: 12, fontWeight: 500, color: T.charcoal, marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>Primary mood</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {MOODS.map(m => (
          <button key={m.val} onClick={() => setMood(m.val)} style={{
            padding: "7px 12px", fontSize: 12, fontFamily: fontBody, cursor: "pointer",
            border: `1.5px solid ${mood === m.val ? T.terracotta : T.border}`,
            background: mood === m.val ? T.terracottaPale : T.white,
            color: mood === m.val ? T.terracotta : T.charcoalMid,
            transition: "all 0.2s",
          }}>{m.label}</button>
        ))}
      </div>

      <Btn onClick={() => phase && mood && onNext({ phase, energy, mood })} variant={phase && mood ? "primary" : "ghost"}>
        Continue →
      </Btn>
    </ScreenWrap>
  );
}

function OnboardingProfile({ data, onNext }) {
  const [anxiety, setAnxiety] = useState(5);
  const [mindfulness, setMindfulness] = useState("some");
  const MXP = ["None", "Some", "Regular practice"];
  return (
    <ScreenWrap>
      <ProgressDots total={4} current={3} />
      <Label>Step 4 of 4</Label>
      <DisplayH size={26}>Your psychological profile.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 20 }}>
        Two questions. These shape which interventions Rhythm recommends at all.
      </p>

      <Slider value={anxiety} onChange={setAnxiety} min={1} max={10}
        label="Anxiety sensitivity — how much do anxious feelings bother you?" />

      <p style={{ fontSize: 12, fontWeight: 500, color: T.charcoal, marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>Mindfulness / meditation experience</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {MXP.map(m => (
          <button key={m} onClick={() => setMindfulness(m.toLowerCase())} style={{
            padding: "11px 14px", border: `1.5px solid ${mindfulness === m.toLowerCase() ? T.sage : T.border}`,
            background: mindfulness === m.toLowerCase() ? T.sagePale : T.white,
            color: mindfulness === m.toLowerCase() ? T.sage : T.charcoalMid,
            fontSize: 13, fontFamily: fontBody, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
          }}>{m}</button>
        ))}
      </div>

      <Btn onClick={() => onNext({ anxiety, mindfulness })} variant="primary">
        Show my interventions →
      </Btn>
    </ScreenWrap>
  );
}

// ─── INTERVENTION MENU ───
const INTERVENTIONS = [
  { id: "journal", label: "Journaling", tag: "Expressive writing", color: T.terracotta, bg: T.terracottaPale, border: T.terracottaLight, time: "8 min", desc: "Process today's experience through structured reflection." },
  { id: "reframe", label: "Cognitive reframing", tag: "CBT", color: T.charcoal, bg: T.white, border: T.border, time: "7 min", desc: "Examine a thought that's weighing on you. Watch it shift." },
  { id: "breathwork", label: "Box breathing", tag: "Autonomic regulation", color: T.sage, bg: T.sagePale, border: T.sageLight, time: "5 min", desc: "A clinical breathwork protocol. Breathe with the wind." },
  { id: "act", label: "Body awareness", tag: "ACT — defusion", color: T.charcoalMid, bg: "#F0EDE8", border: T.border, time: "6 min", desc: "Observe how your body feels today without judgement." },
  { id: "effort", label: "Effort tracking", tag: "Behavioral activation", color: T.terracotta, bg: T.white, border: T.terracottaLight, time: "6 min", desc: "Plan an activity. Compare predicted vs actual effort." },
];

function InterventionMenu({ data, onSelect }) {
  const phase = data.phase || "your current phase";
  const mood = data.mood ? data.mood.replace("_", " ") : "";
  return (
    <ScreenWrap style={{ padding: "20px 20px 32px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: fontDisplay, fontSize: 20, color: T.terracotta }}>Rhythm</span>
        </div>
        <div style={{ background: T.terracottaPale, border: `1px solid ${T.terracottaLight}`, padding: "12px 14px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: T.terracotta, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Today's context</p>
          <p style={{ fontSize: 12, color: T.charcoalMid, margin: 0 }}>
            <strong style={{ color: T.charcoal }}>{phase}</strong> phase · Energy {data.energy}/10 · Feeling <strong style={{ color: T.charcoal }}>{mood}</strong>
          </p>
        </div>
        <DisplayH size={22} style={{ marginBottom: 6 }}>Your interventions.</DisplayH>
        <p style={{ fontSize: 12, color: T.charcoalLight, margin: "0 0 4px" }}>Tap one to begin. Each takes 5–8 minutes.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {INTERVENTIONS.map((iv, i) => (
          <button key={iv.id} onClick={() => onSelect(iv.id)} style={{
            background: iv.bg, border: `1.5px solid ${iv.border}`,
            padding: "14px 16px", cursor: "pointer", textAlign: "left",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            transition: "all 0.2s", fontFamily: fontBody,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: iv.color, background: "rgba(255,255,255,0.6)", padding: "2px 6px" }}>{iv.tag}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: T.charcoal, margin: "0 0 4px" }}>{iv.label}</p>
              <p style={{ fontSize: 11, color: T.charcoalMid, margin: 0, lineHeight: 1.5 }}>{iv.desc}</p>
            </div>
            <span style={{ fontSize: 10, color: T.charcoalLight, marginLeft: 12, flexShrink: 0, marginTop: 2 }}>{iv.time}</span>
          </button>
        ))}
      </div>
    </ScreenWrap>
  );
}

// ─── INTERVENTION 1: JOURNALING ───
const JOURNAL_PROMPTS = [
  { q: "Right now, my body feels...", hint: "Temperature, tension, heaviness, energy — just notice without judging." },
  { q: "One thing that felt harder than usual today was...", hint: "Small or large. It doesn't need to make sense." },
  { q: "If I could say something kind to myself about that, it would be...", hint: "Write it as if to a close friend." },
  { q: "What does my body or mind need most right now?", hint: "Be specific. Rest, movement, quiet, connection?" },
];

function JournalIntervention({ data, onDone }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [done, setDone] = useState(false);
  const current = JOURNAL_PROMPTS[step];

  if (done) return (
    <ScreenWrap>
      <Label color={T.sage}>Journaling complete</Label>
      <DisplayH size={26} style={{ marginBottom: 12 }}>Well done.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.7, marginBottom: 24 }}>
        Expressive writing activates prefrontal processing of emotional material — shifting from reactive limbic response toward regulated reflection. Even four sentences changes how your nervous system encodes the experience.
      </p>
      <div style={{ background: T.sagePale, border: `1px solid ${T.sageLight}`, padding: "14px 16px", marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.sage, marginBottom: 10 }}>Your entries</p>
        {JOURNAL_PROMPTS.map((p, i) => answers[i] && (
          <div key={i} style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: T.sage, margin: "0 0 3px" }}>{p.q}</p>
            <p style={{ fontSize: 12, color: T.charcoal, margin: 0, fontStyle: "italic" }}>"{answers[i]}"</p>
          </div>
        ))}
      </div>
      <Btn onClick={onDone} variant="sage">Back to interventions</Btn>
    </ScreenWrap>
  );

  return (
    <ScreenWrap>
      <Label>Journaling · {step + 1} of {JOURNAL_PROMPTS.length}</Label>
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {JOURNAL_PROMPTS.map((_, i) => (
          <div key={i} style={{ height: 3, flex: 1, background: i <= step ? T.terracotta : T.terracottaLight, transition: "all 0.3s" }} />
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 400, color: T.charcoal, lineHeight: 1.3, marginBottom: 8 }}>
          {current.q}
        </p>
        <p style={{ fontSize: 12, color: T.charcoalLight, fontStyle: "italic", marginBottom: 20 }}>{current.hint}</p>
        <textarea
          value={answers[step]}
          onChange={e => {
            const a = [...answers]; a[step] = _v; setAnswers(a);
          }}
          placeholder={`Write freely - no one else will see this.`}
          style={{
            width: "100%", minHeight: 140, padding: "14px", fontSize: 13,
            fontFamily: fontBody, color: T.charcoal, background: T.white,
            border: `1.5px solid ${T.border}`, resize: "none", lineHeight: 1.7,
            outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 0 && <Btn onClick={() => setStep(s => s - 1)} variant="outline" style={{ flex: "0 0 80px" }}>←</Btn>}
        <Btn
          onClick={() => step < JOURNAL_PROMPTS.length - 1 ? setStep(s => s + 1) : setDone(true)}
          variant="primary"
          style={{ flex: 1 }}
        >
          {step < JOURNAL_PROMPTS.length - 1 ? "Next prompt →" : "Complete ✓"}
        </Btn>
      </div>
    </ScreenWrap>
  );
}

// ─── INTERVENTION 2: COGNITIVE REFRAMING ───
const DISTORTIONS = [
  "All-or-nothing thinking",
  "Should statements",
  "Mind reading",
  "Catastrophising",
  "Emotional reasoning",
  "Personalisation",
];

function ReframeIntervention({ data, onDone }) {
  const [step, setStep] = useState(0);
  const [belief, setBelief] = useState(80);
  const [distortion, setDistortion] = useState(null);
  const [evidence_for, setEvidenceFor] = useState("");
  const [evidence_against, setEvidenceAgainst] = useState("");
  const [reframe, setReframe] = useState("");
  const [beliefAfter, setBeliefAfter] = useState(null);
  const [done, setDone] = useState(false);

  const thought = "I have no motivation today. I'm falling behind.";

  if (done) {
    const shift = belief - (beliefAfter || belief);
    return (
      <ScreenWrap>
        <Label color={T.terracotta}>Reframing complete</Label>
        <DisplayH size={24}>The shift.</DisplayH>
        <div style={{ background: T.white, border: `1px solid ${T.border}`, padding: "20px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 10, color: T.charcoalLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Before</p>
              <span style={{ fontFamily: fontDisplay, fontSize: 40, fontWeight: 300, color: T.terracotta }}>{belief}%</span>
            </div>
            <div style={{ flex: 1, height: 2, background: T.border, margin: "0 16px", position: "relative" }}>
              <div style={{ position: "absolute", top: -8, right: 0, fontSize: 20 }}>→</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 10, color: T.charcoalLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>After</p>
              <span style={{ fontFamily: fontDisplay, fontSize: 40, fontWeight: 300, color: T.sage }}>{beliefAfter}%</span>
            </div>
          </div>
          {shift > 0 && (
            <div style={{ background: T.sagePale, border: `1px solid ${T.sageLight}`, padding: "10px 14px" }}>
              <p style={{ fontSize: 12, color: T.sage, margin: 0 }}>
                ↓ {shift} percentage points. That's a real shift — not because the thought was wrong, but because you examined it.
              </p>
            </div>
          )}
        </div>
        {reframe && (
          <Card color={T.terracottaPale} style={{ border: `1px solid ${T.terracottaLight}`, marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: T.terracotta, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Your reframe</p>
            <p style={{ fontSize: 13, color: T.charcoal, fontStyle: "italic", margin: 0 }}>"{reframe}"</p>
          </Card>
        )}
        <p style={{ fontSize: 12, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 24 }}>
          Reduced belief in automatic negative thoughts is the measurable outcome of cognitive restructuring. The luteal phase lowers frustration tolerance and increases cognitive load — motivation fluctuation here is neurobiologically expected, not a personal failing.
        </p>
        <Btn onClick={onDone} variant="primary">Back to interventions</Btn>
      </ScreenWrap>
    );
  }

  const steps = [
    // Step 0: Introduce the thought
    <div key={0} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Label>Cognitive reframing · Step 1 of 5</Label>
      <DisplayH size={22}>The thought we're examining.</DisplayH>
      <div style={{ background: T.white, border: `2px solid ${T.terracotta}`, padding: "18px", marginBottom: 20, position: "relative" }}>
        <div style={{ width: 16, height: 16, background: T.terracotta, borderRadius: "50%", position: "absolute", top: -8, left: 20 }} />
        <p style={{ fontFamily: fontDisplay, fontSize: 18, fontStyle: "italic", color: T.charcoal, lineHeight: 1.4, margin: 0 }}>
          "{thought}"
        </p>
      </div>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 20 }}>
        This thought pattern — productivity tied to self-worth, motivation fluctuation read as failure — is one of the most common automatic negative thoughts in women aged 30–40, and is strongly amplified in the luteal phase.
      </p>
      <p style={{ fontSize: 12, color: T.charcoalLight, lineHeight: 1.6, fontStyle: "italic" }}>
        We're going to examine how much you believe this right now — and see if that changes by the end.
      </p>
    </div>,

    // Step 1: Rate belief
    <div key={1} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Label>Cognitive reframing · Step 2 of 5</Label>
      <DisplayH size={22}>How much do you believe it?</DisplayH>
      <div style={{ background: T.white, border: `1px solid ${T.border}`, padding: "14px", marginBottom: 20 }}>
        <p style={{ fontFamily: fontDisplay, fontSize: 16, fontStyle: "italic", color: T.charcoalMid, margin: 0 }}>"{thought}"</p>
      </div>
      <p style={{ fontSize: 13, color: T.charcoalMid, marginBottom: 24 }}>Rate your belief right now, 0–100%.</p>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: fontDisplay, fontSize: 64, fontWeight: 300, color: T.terracotta }}>{belief}</span>
        <span style={{ fontSize: 20, color: T.terracotta }}>%</span>
      </div>
      <input type="range" min={0} max={100} value={belief} step={5}
        onChange={({target:{value:v}}) => setBelief(Number(v))}
        style={{ width: "100%", accentColor: T.terracotta, marginBottom: 8 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: T.charcoalLight }}>0% — don't believe it</span>
        <span style={{ fontSize: 11, color: T.charcoalLight }}>100% — completely</span>
      </div>
    </div>,

    // Step 2: Identify distortion
    <div key={2} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Label>Cognitive reframing · Step 3 of 5</Label>
      <DisplayH size={22}>What kind of thinking is this?</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.6, marginBottom: 16 }}>
        Cognitive distortions are predictable patterns of inaccurate thinking. Recognising which pattern is active is itself a reframing tool.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {DISTORTIONS.map(d => (
          <button key={d} onClick={() => setDistortion(d)} style={{
            padding: "11px 14px", border: `1.5px solid ${distortion === d ? T.terracotta : T.border}`,
            background: distortion === d ? T.terracottaPale : T.white,
            color: distortion === d ? T.terracotta : T.charcoalMid,
            fontSize: 13, fontFamily: fontBody, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
          }}>{d}</button>
        ))}
      </div>
    </div>,

    // Step 3: Evidence
    <div key={3} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Label>Cognitive reframing · Step 4 of 5</Label>
      <DisplayH size={22}>Examine the evidence.</DisplayH>
      <p style={{ fontSize: 12, color: T.charcoalMid, marginBottom: 16, lineHeight: 1.6 }}>
        List one piece of evidence for the thought, and one against. Be specific — vague doesn't count.
      </p>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: T.terracotta, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Evidence that it's true</p>
        <textarea value={evidence_for} onChange={({target:{value:v}}) => setEvidenceFor(v)}
          placeholder={`e.g. I haven't started the report I planned to finish today.`}
          style={{ width: "100%", height: 72, padding: 12, fontSize: 12, fontFamily: fontBody, border: `1.5px solid ${T.border}`, resize: "none", lineHeight: 1.6, background: T.white, boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: T.sage, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Evidence against</p>
        <textarea value={evidence_against} onChange={({target:{value:v}}) => setEvidenceAgainst(v)}
          placeholder={`e.g. I answered three emails, made lunch, and got out of bed when I didn't want to.`}
          style={{ width: "100%", height: 72, padding: 12, fontSize: 12, fontFamily: fontBody, border: `1.5px solid ${T.border}`, resize: "none", lineHeight: 1.6, background: T.white, boxSizing: "border-box" }} />
      </div>
    </div>,

    // Step 4: Reframe + rate again
    <div key={4} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Label>Cognitive reframing · Step 5 of 5</Label>
      <DisplayH size={22}>Write a balanced thought.</DisplayH>
      <p style={{ fontSize: 12, color: T.charcoalMid, marginBottom: 12, lineHeight: 1.6 }}>
        Not "everything is fine" — something accurate but less absolute. What would you say to a friend?
      </p>
        <textarea value={reframe} onInput={function(ev){setReframe(ev.currentTarget.value)}}
        placeholder={`e.g. "My motivation is lower today - that is real. It is also phase-related and temporary. I have still done things today, even if not what I planned."`}
        style={{ width: "100%", height: 100, padding: 12, fontSize: 12, fontFamily: fontBody, border: `1.5px solid ${T.border}`, resize: "none", lineHeight: 1.7, background: T.white, marginBottom: 20, boxSizing: "border-box" }} />
      <p style={{ fontSize: 12, color: T.charcoalMid, marginBottom: 8 }}>Now rate your belief in the original thought again.</p>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: fontDisplay, fontSize: 52, fontWeight: 300, color: beliefAfter !== null ? T.sage : T.charcoalLight }}>
          {beliefAfter !== null ? beliefAfter : "—"}
        </span>
        {beliefAfter !== null && <span style={{ fontSize: 18, color: T.sage }}>%</span>}
      </div>
      <input type="range" min={0} max={100} value={beliefAfter || 0} step={5}
        onChange={({target:{value:v}}) => setBeliefAfter(Number(v))}
        style={{ width: "100%", accentColor: T.sage }} />
    </div>,
  ];

  return (
    <ScreenWrap style={{ display: "flex", flexDirection: "column" }}>
      {steps[step]}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 0 && <Btn onClick={() => setStep(s => s - 1)} variant="outline" style={{ flex: "0 0 60px" }}>←</Btn>}
        <Btn
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : setDone(true)}
          variant="primary" style={{ flex: 1 }}
          disabled={step === 2 && !distortion}
        >
          {step < steps.length - 1 ? "Continue →" : "See the shift →"}
        </Btn>
      </div>
    </ScreenWrap>
  );
}

// ─── INTERVENTION 3: BOX BREATHING ───
function BreathworkIntervention({ onDone }) {
  const [phase, setPhase] = useState("ready"); // ready | running | done
  const [breathPhase, setBreathPhase] = useState("inhale"); // inhale | hold_in | exhale | hold_out
  const [progress, setProgress] = useState(0); // 0–1 within current phase
  const [cycle, setCycle] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const TOTAL_CYCLES = 4;
  const PHASE_DURATION = { inhale: 4, hold_in: 4, exhale: 4, hold_out: 4 };
  const PHASE_ORDER = ["inhale", "hold_in", "exhale", "hold_out"];
  const PHASE_LABELS = { inhale: "Inhale", hold_in: "Hold", exhale: "Exhale", hold_out: "Hold" };
  const intervalRef = useRef(null);
  const phaseRef = useRef(breathPhase);
  const progressRef = useRef(0);
  const cycleRef = useRef(0);
  phaseRef.current = breathPhase;
  progressRef.current = progress;
  cycleRef.current = cycle;

  const start = useCallback(() => {
    setPhase("running");
    setBreathPhase("inhale");
    setProgress(0);
    setCycle(0);
    setElapsed(0);
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const tick = 50; // ms
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        const newE = e + tick;
        // figure out where we are
        const totalPerCycle = Object.values(PHASE_DURATION).reduce((a, b) => a + b, 0) * 1000;
        const posInCycle = newE % totalPerCycle;
        let acc = 0;
        for (let i = 0; i < PHASE_ORDER.length; i++) {
          const dur = PHASE_DURATION[PHASE_ORDER[i]] * 1000;
          if (posInCycle < acc + dur) {
            setBreathPhase(PHASE_ORDER[i]);
            setProgress((posInCycle - acc) / dur);
            break;
          }
          acc += dur;
        }
        const completedCycles = Math.floor(newE / totalPerCycle);
        setCycle(completedCycles);
        if (completedCycles >= TOTAL_CYCLES) {
          clearInterval(intervalRef.current);
          setPhase("done");
        }
        return newE;
      });
    }, tick);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  // Wind particle: y position 0 (bottom) to 1 (top)
  const getParticleY = () => {
    if (breathPhase === "inhale") return progress;
    if (breathPhase === "hold_in") return 1;
    if (breathPhase === "exhale") return 1 - progress;
    return 0; // hold_out
  };

  const particleY = getParticleY();
  const TRACK_H = 200;

  const phaseColors = {
    inhale: T.sage,
    hold_in: T.terracotta,
    exhale: T.charcoalMid,
    hold_out: T.terracottaLight,
  };

  if (phase === "done") return (
    <ScreenWrap>
      <Label color={T.sage}>Box breathing complete</Label>
      <DisplayH size={26}>4 cycles complete.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.7, marginBottom: 20 }}>
        Box breathing (4-4-4-4) is one of the most evidence-supported breathing protocols for acute autonomic regulation. Equal-duration phases activate the parasympathetic nervous system via vagal afferent signalling — directly increasing HRV.
      </p>
      <Card color={T.sagePale} style={{ border: `1px solid ${T.sageLight}` }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: T.sage, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Why this works</p>
        <p style={{ fontSize: 12, color: T.charcoalMid, lineHeight: 1.65, margin: 0 }}>
          The 4-second exhale phase specifically stimulates the vagus nerve. In the luteal phase, when sympathetic tone is elevated and HRV is typically lower, this protocol directly counteracts the neurobiological pattern.
        </p>
      </Card>
      <div style={{ marginTop: 20 }}>
        <Btn onClick={onDone} variant="sage">Back to interventions</Btn>
      </div>
    </ScreenWrap>
  );

  if (phase === "ready") return (
    <ScreenWrap>
      <Label>Box breathing · Clinical protocol</Label>
      <DisplayH size={26}>4 — 4 — 4 — 4.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.7, marginBottom: 20 }}>
        Inhale for 4 seconds. Hold for 4. Exhale for 4. Hold for 4. Repeat 4 times.
      </p>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.7, marginBottom: 8 }}>
        Follow the particle as it rises and falls. Breathe with it — don't force it.
      </p>
      <Card color={T.sagePale} style={{ border: `1px solid ${T.sageLight}`, marginBottom: 28 }}>
        <p style={{ fontSize: 12, color: T.sage, margin: 0, lineHeight: 1.6 }}>
          Used clinically for anxiety, PTSD, and autonomic dysregulation. Takes 64 seconds. Evidence: reduces acute anxiety via vagal activation in multiple RCTs.
        </p>
      </Card>
      <Btn onClick={start} variant="sage">Begin →</Btn>
    </ScreenWrap>
  );

  // Running state
  const currentColor = phaseColors[breathPhase];
  const countdown = Math.ceil(PHASE_DURATION[breathPhase] * (1 - progress));

  return (
    <ScreenWrap style={{ alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <Label color={currentColor}>Box breathing · Cycle {Math.min(cycle + 1, TOTAL_CYCLES)} of {TOTAL_CYCLES}</Label>
        <p style={{ fontFamily: fontDisplay, fontSize: 28, fontWeight: 300, color: currentColor, margin: "0 0 4px", transition: "color 0.5s" }}>
          {PHASE_LABELS[breathPhase]}
        </p>
        <p style={{ fontFamily: fontDisplay, fontSize: 48, fontWeight: 300, color: currentColor, margin: 0, transition: "color 0.5s" }}>
          {countdown}
        </p>
      </div>

      {/* Breathing track */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
        <div style={{ position: "relative", width: 60, height: TRACK_H }}>
          {/* Track line */}
          <div style={{ position: "absolute", left: "50%", top: 0, width: 1.5, height: "100%", background: T.border, transform: "translateX(-50%)" }} />
          {/* Tick marks */}
          {[0, 0.25, 0.5, 0.75, 1].map(pos => (
            <div key={pos} style={{
              position: "absolute", left: "50%", top: (1 - pos) * TRACK_H - 0.5,
              width: pos === 0 || pos === 1 ? 16 : 8, height: 1.5,
              background: T.charcoalLight, transform: "translateX(-50%)", opacity: 0.4,
            }} />
          ))}
          {/* Phase fill */}
          <div style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            width: 3, borderRadius: 2, background: currentColor, opacity: 0.3,
            bottom: 0, height: `${particleY * 100}%`,
            transition: "height 0.05s linear, background 0.5s",
          }} />
          {/* Particle */}
          <div style={{
            position: "absolute", left: "50%", transform: "translate(-50%, 50%)",
            bottom: `${particleY * TRACK_H}px`,
            width: 16, height: 16, borderRadius: "50%",
            background: currentColor,
            transition: "bottom 0.05s linear, background 0.5s",
            boxShadow: `0 0 12px ${currentColor}66`,
          }} />
          {/* Labels */}
          <span style={{ position: "absolute", left: 36, top: -8, fontSize: 9, color: T.charcoalLight, letterSpacing: "0.06em", textTransform: "uppercase" }}>top</span>
          <span style={{ position: "absolute", left: 36, bottom: -8, fontSize: 9, color: T.charcoalLight, letterSpacing: "0.06em", textTransform: "uppercase" }}>base</span>
        </div>

        {/* Phase guide */}
        <div style={{ marginLeft: 28, display: "flex", flexDirection: "column", gap: 8 }}>
          {PHASE_ORDER.map(p => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p === breathPhase ? phaseColors[p] : T.border, transition: "all 0.3s" }} />
              <span style={{ fontSize: 11, color: p === breathPhase ? phaseColors[p] : T.charcoalLight, fontWeight: p === breathPhase ? 500 : 400, transition: "all 0.3s" }}>
                {PHASE_LABELS[p]} · 4s
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cycle dots */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < cycle ? T.sage : i === cycle ? currentColor : T.border, transition: "all 0.3s" }} />
        ))}
      </div>
    </ScreenWrap>
  );
}

// ─── INTERVENTION 4: ACT — BODY AWARENESS ───
const ACT_STATEMENTS = [
  "My body feels different at different points in my cycle.",
  "Some days my body feels harder to live in.",
  "I notice myself judging how I feel physically.",
  "My energy and body sensations don't always match what I expect.",
];

function ActIntervention({ onDone }) {
  const [step, setStep] = useState(0);
  const [floating, setFloating] = useState(false);
  const [floated, setFloated] = useState([]);
  const [done, setDone] = useState(false);
  const [bodyNow, setBodyNow] = useState("");
  const [values, setValues] = useState("");

  const floatThought = (thought) => {
    setFloating(true);
    setTimeout(() => {
      setFloated(f => [...f, thought]);
      setFloating(false);
    }, 1800);
  };

  if (done) return (
    <ScreenWrap>
      <Label color={T.sage}>ACT — complete</Label>
      <DisplayH size={24}>Observed, not attached.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.7, marginBottom: 20 }}>
        Defusion — creating distance between yourself and your thoughts about your body — is one of the core ACT mechanisms. Noticing that a thought is just a thought, not a fact, reduces the psychological inflexibility that amplifies physical discomfort.
      </p>
      <Card color={T.sagePale} style={{ border: `1px solid ${T.sageLight}` }}>
        <p style={{ fontSize: 11, color: T.sage, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontWeight: 500 }}>What you let pass</p>
        {floated.map((f, i) => (
          <p key={i} style={{ fontSize: 12, color: T.charcoalMid, fontStyle: "italic", margin: "0 0 6px" }}>"{f}"</p>
        ))}
      </Card>
      <div style={{ marginTop: 20 }}>
        <Btn onClick={onDone} variant="sage">Back to interventions</Btn>
      </div>
    </ScreenWrap>
  );

  const steps = [
    // Intro
    <div key="intro" style={{ flex: 1 }}>
      <Label>Body awareness · ACT defusion</Label>
      <DisplayH size={24}>Your body across the cycle.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.7, marginBottom: 16 }}>
        Your body changes measurably across your cycle — bloating, breast tenderness, energy shifts, changes in how exercise feels. These are real neurobiological and physiological events.
      </p>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.7, marginBottom: 16 }}>
        The problem isn't the changes themselves — it's the layer of judgement we add on top of them. ACT defusion creates space between you and that layer.
      </p>
      <Card color={T.sagePale} style={{ border: `1px solid ${T.sageLight}` }}>
        <p style={{ fontSize: 12, color: T.sage, margin: 0, lineHeight: 1.6 }}>
          In a moment, we'll practice watching thoughts about your body float by — like leaves on a stream — without grabbing onto them.
        </p>
      </Card>
    </div>,

    // Body check-in
    <div key="body" style={{ flex: 1 }}>
      <Label>Body awareness · Step 2</Label>
      <DisplayH size={22}>How does your body feel right now?</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 16 }}>
        Just notice. No judgement yet — just observation. Where is there tension, heaviness, discomfort, or ease?
      </p>
      <textarea value={bodyNow} onChange={({target:{value:v}}) => setBodyNow(v)}
        placeholder={`e.g. Heavy in my lower abdomen. Shoulders tight. Tired behind my eyes. Slightly bloated.`}
        style={{ width: "100%", height: 110, padding: 12, fontSize: 12, fontFamily: fontBody, border: `1.5px solid ${T.border}`, resize: "none", lineHeight: 1.7, background: T.white, boxSizing: "border-box" }} />
      <p style={{ fontSize: 11, color: T.charcoalLight, fontStyle: "italic", marginTop: 8 }}>
        These sensations are information. They are not you, and they are not permanent.
      </p>
    </div>,

    // Defusion stream
    <div key="stream" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Label>Body awareness · Step 3</Label>
      <DisplayH size={22}>Let it float past.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 20 }}>
        Tap each thought to place it on the stream and watch it go. You don't have to agree or disagree — just observe.
      </p>
      <div style={{ position: "relative", height: 120, background: "#EEF4F0", border: `1px solid ${T.sageLight}`, marginBottom: 20, overflow: "hidden" }}>
        {/* Stream lines */}
        {[30, 60, 90].map(y => (
          <div key={y} style={{ position: "absolute", top: y, left: 0, right: 0, height: 1, background: T.sageLight, opacity: 0.5 }} />
        ))}
        <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 11, color: T.sageLight, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {floating ? "flowing..." : floated.length > 0 ? `${floated.length} passed` : "the stream"}
        </p>
        {floating && (
          <div style={{
            position: "absolute", top: "35%", left: "-10%",
            animation: "flowAcross 1.8s linear forwards",
            fontSize: 11, color: T.sage, background: T.white,
            border: `1px solid ${T.sageLight}`, padding: "4px 10px",
            whiteSpace: "nowrap",
          }}>
            <style>{`@keyframes flowAcross { from { left: -20%; } to { left: 110%; } }`}</style>
            🍃 floating away...
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {ACT_STATEMENTS.filter(s => !floated.includes(s)).map(s => (
          <button key={s} onClick={() => !floating && floatThought(s)} style={{
            padding: "10px 14px", border: `1px solid ${T.sageLight}`,
            background: T.white, color: T.charcoalMid, fontSize: 12,
            fontFamily: fontBody, cursor: floating ? "default" : "pointer",
            textAlign: "left", lineHeight: 1.5, opacity: floating ? 0.5 : 1,
            transition: "opacity 0.3s",
          }}>
            "{s}" →
          </button>
        ))}
        {floated.length === ACT_STATEMENTS.length && (
          <p style={{ fontSize: 13, color: T.sage, fontStyle: "italic", textAlign: "center", padding: 12 }}>All thoughts observed and released.</p>
        )}
      </div>
    </div>,

    // Values anchor
    <div key="values" style={{ flex: 1 }}>
      <Label>Body awareness · Step 4</Label>
      <DisplayH size={22}>What matters to you today — regardless of how your body feels?</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 16 }}>
        ACT asks: even with this discomfort present, what do you want to move toward? Not despite your body — alongside it.
      </p>
      <textarea value={values} onChange={({target:{value:v}}) => setValues(v)}
        placeholder={`e.g. Being present with people I care about. Getting the work done that I find meaningful. Taking care of myself without punishing myself for needing it.`}
        style={{ width: "100%", height: 100, padding: 12, fontSize: 12, fontFamily: fontBody, border: `1.5px solid ${T.border}`, resize: "none", lineHeight: 1.7, background: T.white, boxSizing: "border-box" }} />
    </div>,
  ];

  return (
    <ScreenWrap style={{ display: "flex", flexDirection: "column" }}>
      {steps[step]}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 0 && <Btn onClick={() => setStep(s => s - 1)} variant="outline" style={{ flex: "0 0 60px" }}>←</Btn>}
        <Btn
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : setDone(true)}
          variant="sage" style={{ flex: 1 }}
        >
          {step < steps.length - 1 ? "Continue →" : "Complete ✓"}
        </Btn>
      </div>
    </ScreenWrap>
  );
}

// ─── INTERVENTION 5: EFFORT PERCEPTION ───
const ACTIVITIES = ["Go to the gym", "Go for a walk", "Run", "Yoga / stretching", "Swim", "Cycle outdoors", "Home workout"];

function EffortIntervention({ onDone }) {
  const [step, setStep] = useState(0);
  const [activity, setActivity] = useState(null);
  const [custom, setCustom] = useState("");
  const [predictedEffort, setPredictedEffort] = useState(6);
  const [predictedMood, setPredictedMood] = useState(5);
  const [didIt, setDidIt] = useState(null);
  const [actualEffort, setActualEffort] = useState(5);
  const [actualMood, setActualMood] = useState(6);
  const [reflection, setReflection] = useState("");
  const [plan, setPlan] = useState("");
  const [done, setDone] = useState(false);

  const activityName = activity === "custom" ? custom : activity;

  if (done) {
    const effortGap = predictedEffort - actualEffort;
    const moodGap = actualMood - predictedMood;
    return (
      <ScreenWrap>
        <Label color={T.terracotta}>Effort tracking — complete</Label>
        <DisplayH size={24}>Predicted vs. actual.</DisplayH>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Effort: predicted", val: predictedEffort, color: T.charcoalMid },
            { label: "Effort: actual", val: actualEffort, color: T.terracotta },
            { label: "Mood: predicted", val: predictedMood, color: T.charcoalMid },
            { label: "Mood: actual", val: actualMood, color: T.sage },
          ].map(item => (
            <div key={item.label} style={{ background: T.white, border: `1px solid ${T.border}`, padding: "14px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 10, color: T.charcoalLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{item.label}</p>
              <span style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 300, color: item.color }}>{item.val}</span>
              <span style={{ fontSize: 14, color: item.color }}>/10</span>
            </div>
          ))}
        </div>

        <Card color={T.terracottaPale} style={{ border: `1px solid ${T.terracottaLight}`, marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: T.terracotta, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>The gap</p>
          {effortGap > 1 && <p style={{ fontSize: 12, color: T.charcoalMid, margin: "0 0 6px", lineHeight: 1.6 }}>
            Your body worked <strong>less hard</strong> than you expected by {effortGap} points — a classic effort overestimation pattern. Anticipatory effort perception is often inflated in the luteal phase, which can suppress initiation of activity even when the actual experience is manageable.
          </p>}
          {effortGap < -1 && <p style={{ fontSize: 12, color: T.charcoalMid, margin: "0 0 6px", lineHeight: 1.6 }}>
            It was harder than you predicted — by {Math.abs(effortGap)} points. That's valuable calibration data.
          </p>}
          {Math.abs(effortGap) <= 1 && <p style={{ fontSize: 12, color: T.charcoalMid, margin: "0 0 6px", lineHeight: 1.6 }}>
            Your prediction was well-calibrated. Your effort perception model for this activity is accurate.
          </p>}
          {moodGap > 1 && <p style={{ fontSize: 12, color: T.sage, margin: 0, lineHeight: 1.6 }}>
            Your mood after was {moodGap} points higher than you expected. Affect forecasting is notoriously inaccurate for exercise — people consistently underpredict how good movement will make them feel.
          </p>}
        </Card>

        {reflection && (
          <Card style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: T.charcoalLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Your reflection</p>
            <p style={{ fontSize: 12, color: T.charcoalMid, fontStyle: "italic", margin: 0 }}>"{reflection}"</p>
          </Card>
        )}
        {plan && (
          <Card color={T.sagePale} style={{ border: `1px solid ${T.sageLight}`, marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: T.sage, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Next time</p>
            <p style={{ fontSize: 12, color: T.charcoalMid, fontStyle: "italic", margin: 0 }}>"{plan}"</p>
          </Card>
        )}

        <Btn onClick={onDone} variant="primary">Back to interventions</Btn>
      </ScreenWrap>
    );
  }

  const steps = [
    // Pick activity + predict
    <div key="predict" style={{ flex: 1 }}>
      <Label>Effort tracking · Step 1 of 3</Label>
      <DisplayH size={22}>Plan your activity.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 16 }}>
        Choose something you're planning to do today or this week. Then predict how hard and how you'll feel.
      </p>
      <p style={{ fontSize: 11, fontWeight: 500, color: T.charcoal, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Activity</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {ACTIVITIES.map(a => (
          <button key={a} onClick={() => setActivity(a)} style={{
            padding: "8px 12px", fontSize: 12, fontFamily: fontBody, cursor: "pointer",
            border: `1.5px solid ${activity === a ? T.terracotta : T.border}`,
            background: activity === a ? T.terracottaPale : T.white,
            color: activity === a ? T.terracotta : T.charcoalMid, transition: "all 0.2s",
          }}>{a}</button>
        ))}
        <button onClick={() => setActivity("custom")} style={{
          padding: "8px 12px", fontSize: 12, fontFamily: fontBody, cursor: "pointer",
          border: `1.5px solid ${activity === "custom" ? T.terracotta : T.border}`,
          background: activity === "custom" ? T.terracottaPale : T.white,
          color: activity === "custom" ? T.terracotta : T.charcoalMid, transition: "all 0.2s",
        }}>Other...</button>
      </div>
      {activity === "custom" && (
        <input value={custom} onChange={({target:{value:v}}) => setCustom(v)} placeholder={`Describe your activity`}
          style={{ width: "100%", padding: "10px 12px", fontSize: 13, fontFamily: fontBody, border: `1.5px solid ${T.border}`, marginBottom: 16, boxSizing: "border-box" }} />
      )}
      <Slider value={predictedEffort} onChange={setPredictedEffort} min={1} max={10}
        label="How physically hard do you predict it will feel? (1 = very easy, 10 = maximal)" color={T.terracotta} />
      <Slider value={predictedMood} onChange={setPredictedMood} min={1} max={10}
        label="How do you predict you'll feel after? (1 = worse, 10 = much better)" color={T.sage} />
    </div>,

    // Did you do it?
    <div key="did" style={{ flex: 1 }}>
      <Label>Effort tracking · Step 2 of 3</Label>
      <DisplayH size={22}>After the activity.</DisplayH>
      <div style={{ background: T.terracottaPale, border: `1px solid ${T.terracottaLight}`, padding: "14px", marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: T.terracotta, margin: 0 }}>Planned: <strong>{activityName || "your activity"}</strong></p>
      </div>
      <p style={{ fontSize: 13, color: T.charcoalMid, marginBottom: 20 }}>Did you do it?</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {["Yes", "Partially", "No"].map(d => (
          <button key={d} onClick={() => setDidIt(d)} style={{
            flex: 1, padding: "12px", border: `1.5px solid ${didIt === d ? T.terracotta : T.border}`,
            background: didIt === d ? T.terracottaPale : T.white,
            color: didIt === d ? T.terracotta : T.charcoalMid,
            fontSize: 13, fontFamily: fontBody, cursor: "pointer", transition: "all 0.2s",
          }}>{d}</button>
        ))}
      </div>
      {didIt && didIt !== "No" && <>
        <Slider value={actualEffort} onChange={setActualEffort} min={1} max={10}
          label="How hard did it actually feel?" color={T.terracotta} />
        <Slider value={actualMood} onChange={setActualMood} min={1} max={10}
          label="How do you feel right now?" color={T.sage} />
      </>}
      {didIt === "No" && (
        <Card color={T.sagePale} style={{ border: `1px solid ${T.sageLight}` }}>
          <p style={{ fontSize: 12, color: T.sage, margin: 0, lineHeight: 1.6 }}>
            That's data too. We'll reflect on what got in the way — that's often more useful than the activity itself.
          </p>
        </Card>
      )}
    </div>,

    // Reflect + plan
    <div key="reflect" style={{ flex: 1 }}>
      <Label>Effort tracking · Step 3 of 3</Label>
      <DisplayH size={22}>Perception vs. experience.</DisplayH>
      <p style={{ fontSize: 13, color: T.charcoalMid, lineHeight: 1.65, marginBottom: 16 }}>
        This is the core of effort perception research: the gap between how hard we expect something to be and how hard it actually is shapes whether we initiate it at all.
      </p>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: T.charcoal, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>What was the difference between what you expected and what you experienced?</p>
        <textarea value={reflection} onChange={({target:{value:v}}) => setReflection(v)}
          placeholder={`e.g. I thought it would feel exhausting but once I started it felt manageable. The anticipation was worse than the thing itself.`}
          style={{ width: "100%", height: 80, padding: 12, fontSize: 12, fontFamily: fontBody, border: `1.5px solid ${T.border}`, resize: "none", lineHeight: 1.7, background: T.white, boxSizing: "border-box" }} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 500, color: T.charcoal, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>What will you tell yourself next time the anticipation feels like too much?</p>
        <textarea value={plan} onChange={({target:{value:v}}) => setPlan(v)}
          placeholder={`e.g. "Remember that last time felt much more manageable than I expected. Start anyway."`}
          style={{ width: "100%", height: 80, padding: 12, fontSize: 12, fontFamily: fontBody, border: `1.5px solid ${T.border}`, resize: "none", lineHeight: 1.7, background: T.white, boxSizing: "border-box" }} />
      </div>
    </div>,
  ];

  return (
    <ScreenWrap style={{ display: "flex", flexDirection: "column" }}>
      {steps[step]}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 0 && <Btn onClick={() => setStep(s => s - 1)} variant="outline" style={{ flex: "0 0 60px" }}>←</Btn>}
        <Btn
          onClick={() => {
            if (step < steps.length - 1) setStep(s => s + 1);
            else setDone(true);
          }}
          variant="primary" style={{ flex: 1 }}
          disabled={step === 0 && !activity}
        >
          {step < steps.length - 1 ? "Continue →" : "See your data →"}
        </Btn>
      </div>
    </ScreenWrap>
  );
}

// ─── ROOT APP ───
export default function RhythmDemo() {
  useFonts();
  const [screen, setScreen] = useState("onboarding_age");
  const [userData, setUserData] = useState({});
  const [activeIntervention, setActiveIntervention] = useState(null);

  const advance = (key, newData) => {
    setUserData(d => ({ ...d, ...newData }));
    setScreen(key);
  };

  const renderScreen = () => {
    if (activeIntervention) {
      const props = { data: userData, onDone: () => { setActiveIntervention(null); setScreen("menu"); } };
      switch (activeIntervention) {
        case "journal": return <JournalIntervention {...props} />;
        case "reframe": return <ReframeIntervention {...props} />;
        case "breathwork": return <BreathworkIntervention onDone={props.onDone} />;
        case "act": return <ActIntervention onDone={props.onDone} />;
        case "effort": return <EffortIntervention onDone={props.onDone} />;
      }
    }
    switch (screen) {
      case "onboarding_age": return <OnboardingAge onNext={d => advance("onboarding_goals", d)} />;
      case "onboarding_goals": return <OnboardingGoals onNext={d => advance("onboarding_phase", d)} />;
      case "onboarding_phase": return <OnboardingPhase onNext={d => advance("onboarding_profile", d)} />;
      case "onboarding_profile": return <OnboardingProfile data={userData} onNext={d => advance("menu", d)} />;
      case "menu": return <InterventionMenu data={userData} onSelect={id => { setActiveIntervention(id); }} />;
      default: return null;
    }
  };

  return (
    <PhoneFrame>
      {renderScreen()}
    </PhoneFrame>
  );
}
