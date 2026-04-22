import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'lumen_journal_v2';
const TODAY = new Date('2026-04-22');

// ─── TASK DATA ─────────────────────────────────────────────
const SPRINTS = [
  {
    id: 's1',
    numeral: 'I',
    title: 'Sensing & Early Outreach',
    dateRange: 'Apr 20 – Apr 26',
    budget: 8,
  },
  {
    id: 's2',
    numeral: 'II',
    title: 'Baseline, Risk Logic & Abstract',
    dateRange: 'Apr 27 – May 3',
    budget: 9,
  },
  {
    id: 's3',
    numeral: 'III',
    title: 'Hardware & First Critiques',
    dateRange: 'May 4 – May 10',
    budget: 11,
  },
  {
    id: 's4',
    numeral: 'IV',
    title: 'Assembly, Video & Submission',
    dateRange: 'May 11 – May 16',
    budget: 12,
  },
];

const TASKS = [
  // PRE-SPRINT
  { id: 'T1.1', sprint: 's1', day: '2026-04-15', hours: 3, tier: 'must',
    title: 'EAR calculation with live display',
    desc: 'MediaPipe face mesh, 6-point EAR formula per eye, averaged. Prints live on webcam feed.',
    doneDefault: true },

  // SPRINT 1
  { id: 'T1.2', sprint: 's1', day: '2026-04-20', hours: 0.5, tier: 'must',
    title: 'Jan Gulliksen email',
    desc: 'Acknowledgment request. Accessibility and human-centered technology professor at KTH.' },
  { id: 'T1.3', sprint: 's1', day: '2026-04-20', hours: 0.5, tier: 'must',
    title: 'Start autoethnography log',
    desc: 'Google Sheet at notes/autoethnography.csv. Daily 5-minute entries. Source material for Abstract §4.' },
  { id: 'T1.6', sprint: 's1', day: '2026-04-20', hours: 0.5, tier: 'must',
    title: 'Blink counter with threshold',
    desc: 'Bilateral EAR check, consecutive-frame filter (CONSEC_FRAMES=2), minimum open duration (CONSEC_OPEN=3). 10/10 count accurate.',
    doneDefault: true },
  { id: 'T1.7', sprint: 's1', day: '2026-04-21', hours: 1, tier: 'must',
    title: 'Live blinks-per-minute display',
    desc: 'Rolling 60-second counter using collections.deque with timestamp appending. Displayed via cv2.putText.' },
  { id: 'T1.8', sprint: 's1', day: '2026-04-22', hours: 1, tier: 'must',
    title: 'Robustness testing',
    desc: 'Glasses on/off, dim lighting, head angles ±30°. Document in README under Known Limitations.' },
  { id: 'T1.9', sprint: 's1', day: '2026-04-22', hours: 0.25, tier: 'must',
    title: 'Measure desk footprint',
    desc: 'Validate 10cm dome + 12cm base against actual workspace before print submission.' },
  { id: 'T1.10', sprint: 's1', day: '2026-04-22', hours: 0.25, tier: 'must',
    title: 'Course deadline mapping',
    desc: 'Save as deadlines.md. DM1590, DM2624, DH2670 deadlines mapped against sprint schedule.' },
  { id: 'T1.11', sprint: 's1', day: '2026-04-23', hours: 0.5, tier: 'must',
    title: 'Order hardware',
    desc: 'XIAO ESP32-S3, NeoPixel ring 16 LEDs, push-button, USB-C cable 2m, jumper wires. Electrokit.' },
  { id: 'T1.12', sprint: 's1', day: '2026-04-23', hours: 1, tier: 'must',
    title: 'ACM template setup',
    desc: 'Download from NordiCHI guidelines. Scaffold paper/abstract.tex with ACM single-column format.' },
  { id: 'T1.13', sprint: 's1', day: '2026-04-24', hours: 0.5, tier: 'must',
    title: 'Record EAR demo clip',
    desc: '60 seconds, clean background, daylight, landmarks visible. For Yuting email attachment.' },
  { id: 'T1.14', sprint: 's1', day: '2026-04-24', hours: 0.5, tier: 'must',
    title: 'Yuting Chen email',
    desc: 'Co-author outreach. Tangible interaction PhD candidate at KTH. Attach EAR clip.' },
  { id: 'T1.15', sprint: 's1', day: '2026-04-25', hours: 0.5, tier: 'should',
    title: 'README initial update',
    desc: 'Problem, stack, status, known limitations.' },
  { id: 'T1.16', sprint: 's1', day: '2026-04-25', hours: 0.5, tier: 'should',
    title: 'List 5–7 classmates for critiques',
    desc: 'DM1590, DM2624, DH2670 cohorts. Names and rough availability.' },

  // SPRINT 2
  { id: 'T2.1', sprint: 's2', day: '2026-04-27', hours: 1.5, tier: 'must',
    title: 'Rolling baseline engine',
    desc: '30-minute deque for real use + 30-second quick-cal for demos.' },
  { id: 'T2.2', sprint: 's2', day: '2026-04-28', hours: 1.5, tier: 'must',
    title: 'Risk score with break definition',
    desc: 'Four break-reset conditions per spec §4.3. Weighted 0.5 blink_risk + 0.5 focus_risk.' },
  { id: 'T2.3', sprint: 's2', day: '2026-04-29', hours: 0.5, tier: 'must',
    title: 'State machine definition',
    desc: 'Python enum: CALM, ATTENTION, BREAK, BREATHING, PAUSED.' },
  { id: 'T2.4', sprint: 's2', day: '2026-04-29', hours: 1, tier: 'must',
    title: 'Mock state visualization',
    desc: 'Tkinter colored circle. Validates logic before hardware arrives.' },
  { id: 'T2.5', sprint: 's2', day: '2026-04-30', hours: 1, tier: 'must',
    title: 'F1 validation',
    desc: '5-min recording, manual count vs system output. Report exact F1 in README.' },
  { id: 'T2.6', sprint: 's2', day: '2026-05-01', hours: 1.5, tier: 'must',
    title: 'Draft Abstract §1 — Problem & RQ',
    desc: 'Position notification tools within McFarlane 2002 "immediate" category. Introduce Lumen as negotiated instance. 160 words.' },
  { id: 'T2.7', sprint: 's2', day: '2026-05-02', hours: 2, tier: 'must',
    title: 'CAD render of Lumen',
    desc: 'Fusion 360 render, 1500×1200 px. Photorealistic on desk with laptop. Backup still image.' },
  { id: 'T2.8', sprint: 's2', day: '2026-05-03', hours: 1, tier: 'must',
    title: 'Draft Abstract §2 — Artifact',
    desc: 'Artifact and negotiation mechanisms. Matthews et al. 2004, Ho & Intille 2005. 200 words.' },

  // SPRINT 3
  { id: 'T3.1', sprint: 's3', day: '2026-05-04', hours: 2.5, tier: 'must',
    title: 'ESP32-S3 firmware',
    desc: 'Non-blocking sketch. GPIO 4 button, GPIO 5 NeoPixel. 115200 baud. All 5 states + bidirectional serial.' },
  { id: 'T3.2', sprint: 's3', day: '2026-05-05', hours: 2, tier: 'must',
    title: 'Dome CAD + print submission',
    desc: 'Fusion 360 dome and base. 2–3mm translucent walls. Submit STL to KTH Middla.' },
  { id: 'T3.3', sprint: 's3', day: '2026-05-06', hours: 2, tier: 'must',
    title: 'Python bidirectional serial',
    desc: 'Full Lumen class with listener thread. on_pause stops webcam. on_resume restarts.' },
  { id: 'T3.4', sprint: 's3', day: '2026-05-07', hours: 1.5, tier: 'must',
    title: 'Setup description document',
    desc: 'Equipment list, annotated photo, one paragraph per item, footprint dimensions. submission/setup_description.pdf.' },
  { id: 'T3.5', sprint: 's3', day: '2026-05-08', hours: 1, tier: 'must',
    title: 'End-to-end integration test',
    desc: 'Webcam → risk score → ESP32 → LED. All 5 states, tap, hold all functional.' },
  { id: 'T3.6', sprint: 's3', day: '2026-05-09', hours: 1, tier: 'must',
    title: 'Design critique session I',
    desc: '5min demo, 15min use, 10min debrief. Notes in notes/critique_01.md.' },
  { id: 'T3.7', sprint: 's3', day: '2026-05-09', hours: 1, tier: 'must',
    title: 'Draft Abstract §3 — Design stance',
    desc: 'Critical design framing. McFarlane taxonomy explicit. 140 words.' },
  { id: 'T3.8', sprint: 's3', day: '2026-05-10', hours: 1, tier: 'should',
    title: 'Design critique session II',
    desc: 'Second peer session if schedulable. Alternative: reflection + 15+ autoethnography entries.' },

  // SPRINT 4
  { id: 'T4.1', sprint: 's4', day: '2026-05-11', hours: 1.5, tier: 'must',
    title: 'Full Lumen assembly',
    desc: 'Dome, base, NeoPixel, button, XIAO. Test all 5 states + tap + hold. Photograph 3 angles.' },
  { id: 'T4.2', sprint: 's4', day: '2026-05-11', hours: 0.5, tier: 'should',
    title: 'Design critique session III',
    desc: 'Third peer session.' },
  { id: 'T4.3', sprint: 's4', day: '2026-05-12', hours: 1, tier: 'must',
    title: 'Conference lighting test',
    desc: 'Bright fluorescent, dim warm ambient, mixed backlit. Document EAR threshold ranges.' },
  { id: 'T4.4', sprint: 's4', day: '2026-05-12', hours: 1, tier: 'must',
    title: 'Draft Abstract §4 — Method & Findings',
    desc: 'Negotiation patterns in self-directed use. Pull from autoethnography and critiques. 160 words.' },
  { id: 'T4.5', sprint: 's4', day: '2026-05-13', hours: 2, tier: 'must',
    title: 'Video recording day',
    desc: '90-second clip. Calm → amber → red → tap → hold → calm. Tripod, warm lamp, clean background.' },
  { id: 'T4.6', sprint: 's4', day: '2026-05-13', hours: 0.5, tier: 'must',
    title: 'Video edit',
    desc: 'iMovie. Title card. Export MP4 1080p.' },
  { id: 'T4.7', sprint: 's4', day: '2026-05-14', hours: 1, tier: 'stretch',
    title: 'Design critique sessions IV & V',
    desc: 'Additional sessions if schedulable. Deepens findings material.' },
  { id: 'T4.8', sprint: 's4', day: '2026-05-14', hours: 1, tier: 'must',
    title: 'Draft Abstract §5 + figure caption',
    desc: 'Demo flow and annotated setup photo.' },
  { id: 'T4.9', sprint: 's4', day: '2026-05-15', hours: 1.5, tier: 'must',
    title: 'Abstract editing pass',
    desc: 'Integrate §1–§5. Tighten to 2 pages. Verify ACM formatting. All 4 new references.' },
  { id: 'T4.10', sprint: 's4', day: '2026-05-15', hours: 0.5, tier: 'must',
    title: 'Peer read',
    desc: 'One classmate with the prompt: "does this sound like bullshit?"' },
  { id: 'T4.11', sprint: 's4', day: '2026-05-16', hours: 0.5, tier: 'must',
    title: 'Final materials check',
    desc: 'Abstract PDF, still image, setup description, 2-min video. All four ready.' },
  { id: 'T4.12', sprint: 's4', day: '2026-05-16', hours: 0.5, tier: 'must',
    title: 'SUBMIT TO PCS',
    desc: 'Upload all four. Verify confirmations.' },
  { id: 'T4.13', sprint: 's4', day: '2026-05-16', hours: 0.5, tier: 'must',
    title: 'README polish',
    desc: 'Submission status, F1, video link, limitations.' },
];

const GATES = {
  s1: [
    'Live blinks-per-minute display working?',
    'Jan email sent and acknowledged?',
    'Yuting email sent with EAR demo clip?',
    'Autoethnography: 5+ entries?',
    'XIAO ESP32-S3 hardware ordered?',
    'Desk footprint validated?',
  ],
  s2: [
    'State machine transitions on risk?',
    'Break logic fires on all four conditions?',
    'F1 ≥ 0.7?',
    'XIAO ESP32-S3 arrived?',
    'Yuting response received?',
    'CAD render presentable?',
    'Abstract §1 and §2 drafted?',
  ],
  s3: [
    'Firmware flashing to XIAO ESP32-S3?',
    'Python serial round-tripping events?',
    'Dome print submitted?',
    'Setup description complete?',
    'Critique I done?',
    'Abstract §1–§3 drafted?',
  ],
  s4: [
    'Lumen physically assembled?',
    'Video recorded and edited to 90s?',
    'Lighting test completed?',
    'Abstract §1–§5 integrated to 2-page PDF?',
    '3+ critique sessions completed?',
    'Submitted?',
  ],
};

// ─── HELPERS ─────────────────────────────────────────────
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseDay(dayStr) {
  const [y, m, d] = dayStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDayShort(date) {
  return `${DOW[date.getDay()]} · ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function daysBetween(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b - a) / msPerDay);
}

function formatHours(h) {
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h === Math.floor(h)) return `${h}h`;
  return `${h}h`;
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [taskState, setTaskState] = useState({});
  const [gateState, setGateState] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [collapsedSprints, setCollapsedSprints] = useState({});
  const isInitialMount = useRef(true);

  // Load state on mount
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result && result.value) {
          const parsed = JSON.parse(result.value);
          setTaskState(parsed.tasks || {});
          setGateState(parsed.gates || {});
          setExpandedDays(parsed.expandedDays || { [dateKey(TODAY)]: true });
          setCollapsedSprints(parsed.collapsedSprints || {});
        } else {
          // First load defaults: today expanded
          setExpandedDays({ [dateKey(TODAY)]: true });
        }
      } catch (e) {
        // Key doesn't exist yet — first time user
        setExpandedDays({ [dateKey(TODAY)]: true });
      }
      setLoaded(true);
    })();
  }, []);

  // Persist on every state change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const payload = JSON.stringify({
      tasks: taskState,
      gates: gateState,
      expandedDays,
      collapsedSprints,
    });
    window.storage.set(STORAGE_KEY, payload).catch(() => {});
  }, [taskState, gateState, expandedDays, collapsedSprints, loaded]);

  // Task helpers
  const isTaskDone = (task) => {
    if (taskState[task.id] !== undefined) return taskState[task.id];
    return task.doneDefault === true;
  };

  const toggleTask = (task) => {
    setTaskState(prev => ({ ...prev, [task.id]: !isTaskDone(task) }));
  };

  const toggleGate = (sprintId, idx) => {
    const key = `${sprintId}_${idx}`;
    setGateState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDay = (dayKey) => {
    setExpandedDays(prev => ({ ...prev, [dayKey]: !prev[dayKey] }));
  };

  const toggleSprint = (sprintId) => {
    setCollapsedSprints(prev => ({ ...prev, [sprintId]: !prev[sprintId] }));
  };

  const resetAll = () => {
    if (window.confirm('Reset the journal? This clears all progress.')) {
      setTaskState({});
      setGateState({});
      setExpandedDays({ [dateKey(TODAY)]: true });
      setCollapsedSprints({});
    }
  };

  // Group tasks by day
  const tasksByDay = {};
  TASKS.forEach(t => {
    if (!tasksByDay[t.day]) tasksByDay[t.day] = [];
    tasksByDay[t.day].push(t);
  });

  // Stats
  const totalTasks = TASKS.length;
  const doneTasks = TASKS.filter(isTaskDone).length;
  const submitDate = new Date('2026-05-16');
  const daysToSubmit = daysBetween(TODAY, submitDate);

  const todayKey = dateKey(TODAY);
  const todayTasks = tasksByDay[todayKey] || [];
  const todayHoursTotal = todayTasks.reduce((s, t) => s + t.hours, 0);
  const todayHoursDone = todayTasks.filter(isTaskDone).reduce((s, t) => s + t.hours, 0);

  // Build sprint view
  const sprintsView = SPRINTS.map(sprint => {
    const sprintTasks = TASKS.filter(t => t.sprint === sprint.id);
    const days = [...new Set(sprintTasks.map(t => t.day))].sort();
    const totalSprintTasks = sprintTasks.length;
    const doneSprintTasks = sprintTasks.filter(isTaskDone).length;
    return { ...sprint, days, totalSprintTasks, doneSprintTasks };
  });

  if (!loaded) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f4efe6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.2em', color: '#8a7d6c', textTransform: 'uppercase'
      }}>Loading Journal…</div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..500;1,9..144,300..500&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lumen-app {
          min-height: 100vh;
          background: #f4efe6;
          color: #1a1612;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          position: relative;
        }

        .lumen-app::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          mix-blend-mode: multiply;
        }

        .l-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 40px 32px 80px;
          position: relative;
          z-index: 1;
        }

        /* ─── MASTHEAD ─── */
        .l-masthead {
          border-top: 1.5px solid #1a1612;
          padding: 10px 0 12px;
          margin-bottom: 36px;
          display: flex;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a7d6c;
          border-bottom: 1px solid #d9d0bc;
        }
        .l-masthead-right { display: flex; gap: 18px; }
        .l-masthead strong { color: #1a1612; font-weight: 500; }

        /* ─── HERO ─── */
        .l-hero { margin-bottom: 36px; }
        .l-hero-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c85a28;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .l-hero-tag::before {
          content: '';
          width: 22px;
          height: 1px;
          background: #c85a28;
        }
        .l-hero h1 {
          font-family: 'Fraunces', Georgia, serif;
          font-variation-settings: "opsz" 96, "wght" 400;
          font-size: 44px;
          line-height: 0.95;
          letter-spacing: -0.025em;
          margin-bottom: 10px;
          color: #1a1612;
        }
        .l-hero h1 em {
          font-style: italic;
          font-variation-settings: "opsz" 96, "wght" 350;
          color: #c85a28;
        }
        .l-hero-sub {
          font-family: 'Fraunces', Georgia, serif;
          font-variation-settings: "opsz" 24, "wght" 400;
          font-style: italic;
          font-size: 15px;
          color: #4a3f33;
          max-width: 480px;
        }

        /* ─── STATS ─── */
        .l-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 20px 0;
          margin-bottom: 40px;
          border-top: 1px solid #d9d0bc;
          border-bottom: 1px solid #d9d0bc;
        }
        .l-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a7d6c;
          margin-bottom: 6px;
        }
        .l-stat-val {
          font-family: 'Fraunces', Georgia, serif;
          font-variation-settings: "opsz" 48, "wght" 400;
          font-size: 22px;
          line-height: 1;
          color: #1a1612;
        }
        .l-stat-val em {
          font-family: 'Fraunces', Georgia, serif;
          font-style: italic;
          color: #8a7d6c;
          font-variation-settings: "opsz" 48, "wght" 350;
        }
        .l-stat-sub {
          font-size: 11px;
          color: #8a7d6c;
          margin-top: 4px;
        }
        .l-stat-bar {
          height: 2px;
          background: #d9d0bc;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }
        .l-stat-bar-fill {
          height: 100%;
          background: #c85a28;
          transition: width 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        /* ─── TODAY SECTION ─── */
        .l-today {
          margin-bottom: 48px;
          padding: 24px 28px;
          background: #ebe4d6;
          border-left: 2px solid #c85a28;
          position: relative;
        }
        .l-today-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c85a28;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .l-today-title {
          font-family: 'Fraunces', Georgia, serif;
          font-variation-settings: "opsz" 36, "wght" 400;
          font-size: 22px;
          color: #1a1612;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .l-today-meta {
          font-size: 12px;
          color: #4a3f33;
          margin-bottom: 18px;
        }
        .l-today-meta strong { color: #1a1612; font-weight: 500; }
        .l-today-empty {
          font-style: italic;
          color: #8a7d6c;
          font-size: 13px;
          padding: 8px 0;
        }

        /* ─── SPRINTS ─── */
        .l-sprint {
          margin-bottom: 44px;
        }
        .l-sprint-header {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          gap: 20px;
          align-items: baseline;
          padding: 10px 0 14px;
          border-bottom: 1px solid #1a1612;
          cursor: pointer;
          user-select: none;
          transition: opacity 0.2s;
        }
        .l-sprint-header:hover { opacity: 0.7; }
        .l-sprint-numeral {
          font-family: 'Fraunces', Georgia, serif;
          font-style: italic;
          font-variation-settings: "opsz" 72, "wght" 300;
          font-size: 36px;
          line-height: 0.9;
          color: #1a1612;
        }
        .l-sprint-label {
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
        }
        .l-sprint-title-line {
          font-family: 'Fraunces', Georgia, serif;
          font-variation-settings: "opsz" 36, "wght" 400;
          font-size: 20px;
          color: #1a1612;
          letter-spacing: -0.01em;
        }
        .l-sprint-range {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a7d6c;
        }
        .l-sprint-tally {
          text-align: right;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #4a3f33;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .l-sprint-chev {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 10px;
          color: #8a7d6c;
          transition: transform 0.25s;
        }
        .l-sprint.collapsed .l-sprint-chev { transform: rotate(-90deg); }

        .l-sprint-body { padding-top: 8px; }
        .l-sprint.collapsed .l-sprint-body { display: none; }

        /* ─── DAY ROWS ─── */
        .l-day {
          border-bottom: 1px solid #e3dcc9;
          transition: background 0.15s;
        }
        .l-day.is-today { background: rgba(200, 90, 40, 0.03); }

        .l-day-head {
          display: grid;
          grid-template-columns: 140px 1fr auto 20px;
          gap: 18px;
          align-items: center;
          padding: 14px 12px;
          cursor: pointer;
          user-select: none;
        }
        .l-day-head:hover { background: rgba(200, 90, 40, 0.04); }

        .l-day-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #4a3f33;
          letter-spacing: 0.04em;
          font-weight: 500;
        }
        .l-day.is-today .l-day-date { color: #c85a28; }
        .l-day.is-past .l-day-date { color: #8a7d6c; }

        .l-day-date-today {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c85a28;
          margin-left: 8px;
          font-weight: 500;
        }

        .l-day-progress {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #4a3f33;
        }
        .l-day-progress-dots {
          display: flex;
          gap: 3px;
        }
        .l-day-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #d9d0bc;
          transition: background 0.2s;
        }
        .l-day-dot.done { background: #c85a28; }

        .l-day-hours {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #4a3f33;
          text-align: right;
        }
        .l-day-hours em {
          color: #8a7d6c;
          font-style: normal;
        }

        .l-day-chev {
          font-size: 10px;
          color: #8a7d6c;
          transition: transform 0.25s;
        }
        .l-day.expanded .l-day-chev { transform: rotate(90deg); }

        .l-day-tasks {
          display: none;
          padding: 4px 12px 16px;
        }
        .l-day.expanded .l-day-tasks { display: block; }

        /* ─── TASK ─── */
        .l-task {
          display: grid;
          grid-template-columns: 22px 60px 1fr auto;
          gap: 14px;
          padding: 10px 0;
          cursor: pointer;
          align-items: start;
          border-bottom: 1px dotted #e3dcc9;
          transition: background 0.15s;
        }
        .l-task:last-child { border-bottom: none; }
        .l-task:hover {
          background: rgba(200, 90, 40, 0.04);
          margin: 0 -10px;
          padding: 10px;
        }

        .l-task-check {
          width: 16px;
          height: 16px;
          border: 1.5px solid #8a7d6c;
          border-radius: 50%;
          margin-top: 2px;
          position: relative;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .l-task.done .l-task-check {
          background: #c85a28;
          border-color: #c85a28;
        }
        .l-task.done .l-task-check::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 2.5px;
          width: 8px;
          height: 3.5px;
          border-left: 1.5px solid #f4efe6;
          border-bottom: 1.5px solid #f4efe6;
          transform: rotate(-45deg);
        }

        .l-task-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          color: #8a7d6c;
          padding-top: 3px;
          letter-spacing: 0.03em;
        }

        .l-task-content { min-width: 0; }
        .l-task-title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1612;
          line-height: 1.35;
          margin-bottom: 2px;
        }
        .l-task.done .l-task-title {
          color: #8a7d6c;
          text-decoration: line-through;
          text-decoration-color: #b8ad98;
        }
        .l-task-desc {
          font-size: 12.5px;
          color: #4a3f33;
          line-height: 1.45;
        }
        .l-task.done .l-task-desc { color: #8a7d6c; }

        .l-task-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
          padding-top: 2px;
          flex-shrink: 0;
        }
        .l-task-hours {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #1a1612;
          font-weight: 500;
        }
        .l-task-tier {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8a7d6c;
        }
        .l-task-tier.must { color: #c85a28; }

        /* ─── GATE ─── */
        .l-gate {
          margin-top: 20px;
          padding: 20px 24px;
          background: #ebe4d6;
          border-left: 2px solid #1a1612;
          position: relative;
        }
        .l-gate::before {
          content: '¶';
          position: absolute;
          top: 16px;
          left: -14px;
          background: #f4efe6;
          padding: 0 3px;
          font-family: 'Fraunces', Georgia, serif;
          font-style: italic;
          font-size: 16px;
          color: #4a3f33;
        }
        .l-gate-label {
          font-family: 'Fraunces', Georgia, serif;
          font-style: italic;
          font-size: 16px;
          color: #1a1612;
          margin-bottom: 2px;
        }
        .l-gate-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a7d6c;
          margin-bottom: 14px;
        }
        .l-gate-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 5px 0;
          cursor: pointer;
          font-size: 13px;
          color: #4a3f33;
          transition: color 0.15s;
        }
        .l-gate-item:hover { color: #1a1612; }
        .l-gate-dot {
          width: 10px;
          height: 10px;
          border: 1.5px solid #8a7d6c;
          border-radius: 2px;
          flex-shrink: 0;
          position: relative;
          transition: all 0.15s;
        }
        .l-gate-item.done .l-gate-dot {
          background: #1a1612;
          border-color: #1a1612;
        }
        .l-gate-item.done .l-gate-dot::after {
          content: '✓';
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f4efe6;
          font-size: 7px;
          font-weight: bold;
        }
        .l-gate-item.done {
          color: #8a7d6c;
          text-decoration: line-through;
          text-decoration-color: #b8ad98;
        }

        /* ─── COLOPHON ─── */
        .l-colophon {
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1.5px solid #1a1612;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        .l-colophon-text {
          font-family: 'Fraunces', Georgia, serif;
          font-style: italic;
          font-size: 13px;
          color: #8a7d6c;
          max-width: 420px;
        }
        .l-reset {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: none;
          border: 1px solid #8a7d6c;
          color: #8a7d6c;
          padding: 8px 14px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .l-reset:hover {
          background: #1a1612;
          color: #f4efe6;
          border-color: #1a1612;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 640px) {
          .l-container { padding: 28px 20px 60px; }
          .l-masthead { flex-direction: column; gap: 6px; }
          .l-hero h1 { font-size: 34px; }
          .l-stats { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .l-day-head { grid-template-columns: 1fr auto 20px; gap: 12px; padding: 12px 8px; }
          .l-day-date { grid-column: 1 / 4; font-size: 12px; }
          .l-day-progress { grid-column: 1 / 3; grid-row: 2; margin-top: 4px; }
          .l-day-hours { grid-column: 3; grid-row: 2; margin-top: 4px; }
          .l-day-chev { grid-column: 3; grid-row: 1; }
          .l-task { grid-template-columns: 18px 1fr auto; gap: 10px; }
          .l-task-id { grid-column: 2; grid-row: 1; font-size: 10px; margin-bottom: -4px; }
          .l-task-content { grid-column: 2; grid-row: 2; }
          .l-task-meta { grid-column: 3; grid-row: 1 / 3; }
          .l-sprint-numeral { font-size: 28px; }
          .l-sprint-title-line { font-size: 17px; }
        }
      `}</style>

      <div className="lumen-app">
        <div className="l-container">

          {/* MASTHEAD */}
          <div className="l-masthead">
            <div><strong>Lumen</strong> · Sprint Journal · Vol. 01</div>
            <div className="l-masthead-right">
              <span>KTH · NordiCHI 2026</span>
              <span>Apr 22, 2026</span>
            </div>
          </div>

          {/* HERO */}
          <div className="l-hero">
            <div className="l-hero-tag">Edition VII · In Progress</div>
            <h1>Twenty-six days<em>,</em> four sprints.</h1>
            <p className="l-hero-sub">
              A tangible object for negotiated screen-work interruption, tracked day by day toward the NordiCHI submission.
            </p>
          </div>

          {/* STATS */}
          <div className="l-stats">
            <div>
              <div className="l-stat-label">Completed</div>
              <div className="l-stat-val">
                {String(doneTasks).padStart(2, '0')}
                <em style={{ fontStyle: 'italic' }}> / </em>
                {String(totalTasks).padStart(2, '0')}
              </div>
              <div className="l-stat-bar"><div className="l-stat-bar-fill" style={{ width: (totalTasks ? (doneTasks/totalTasks*100) : 0) + '%' }} /></div>
            </div>
            <div>
              <div className="l-stat-label">Days to Submit</div>
              <div className="l-stat-val">{daysToSubmit}</div>
              <div className="l-stat-sub">May 16 · AoE</div>
            </div>
            <div>
              <div className="l-stat-label">Today's Load</div>
              <div className="l-stat-val">
                {formatHours(todayHoursDone)}
                <em> / </em>
                {formatHours(todayHoursTotal)}
              </div>
              <div className="l-stat-sub">{todayTasks.length} tasks</div>
            </div>
            <div>
              <div className="l-stat-label">Next Gate</div>
              <div className="l-stat-val">Apr 26</div>
              <div className="l-stat-sub">Sprint I review</div>
            </div>
          </div>

          {/* TODAY */}
          <div className="l-today">
            <div className="l-today-tag">Today · Wednesday April 22</div>
            <div className="l-today-title">
              {todayTasks.length > 0
                ? `${todayTasks.filter(t => !isTaskDone(t)).length} tasks remaining`
                : 'No scheduled tasks'}
            </div>
            <div className="l-today-meta">
              {todayTasks.length > 0 && (
                <>Budget: <strong>{formatHours(todayHoursTotal)}</strong> · Completed: <strong>{formatHours(todayHoursDone)}</strong></>
              )}
            </div>
            {todayTasks.length === 0 ? (
              <div className="l-today-empty">Rest day or catch-up. Use for autoethnography entries and reading.</div>
            ) : (
              todayTasks.map(task => (
                <TaskRow key={task.id} task={task} done={isTaskDone(task)} onToggle={() => toggleTask(task)} compact />
              ))
            )}
          </div>

          {/* SPRINTS */}
          {sprintsView.map(sprint => {
            const isCollapsed = collapsedSprints[sprint.id] === true;
            return (
              <div key={sprint.id} className={`l-sprint${isCollapsed ? ' collapsed' : ''}`}>
                <div className="l-sprint-header" onClick={() => toggleSprint(sprint.id)}>
                  <div className="l-sprint-numeral">{sprint.numeral}</div>
                  <div className="l-sprint-label">
                    <span className="l-sprint-title-line">{sprint.title}</span>
                    <span className="l-sprint-range">{sprint.dateRange} · {sprint.budget}h budget</span>
                  </div>
                  <div className="l-sprint-tally">
                    <span>{sprint.doneSprintTasks}/{sprint.totalSprintTasks}</span>
                    <span className="l-sprint-chev">▾</span>
                  </div>
                </div>

                <div className="l-sprint-body">
                  {sprint.days.map(dayKey => {
                    const dayTasks = tasksByDay[dayKey] || [];
                    const dayDate = parseDay(dayKey);
                    const isToday = dayKey === todayKey;
                    const isPast = dayDate < TODAY && !isToday;
                    const dayDoneCount = dayTasks.filter(isTaskDone).length;
                    const dayHoursTotal = dayTasks.reduce((s, t) => s + t.hours, 0);
                    const dayHoursDone = dayTasks.filter(isTaskDone).reduce((s, t) => s + t.hours, 0);
                    const isExpanded = expandedDays[dayKey] === true;

                    return (
                      <div key={dayKey} className={`l-day${isToday ? ' is-today' : ''}${isPast ? ' is-past' : ''}${isExpanded ? ' expanded' : ''}`}>
                        <div className="l-day-head" onClick={() => toggleDay(dayKey)}>
                          <div className="l-day-date">
                            {formatDayShort(dayDate)}
                            {isToday && <span className="l-day-date-today"> · Today</span>}
                          </div>
                          <div className="l-day-progress">
                            <div className="l-day-progress-dots">
                              {dayTasks.map((_, i) => (
                                <div key={i} className={`l-day-dot${i < dayDoneCount ? ' done' : ''}`} />
                              ))}
                            </div>
                            <span>{dayDoneCount}/{dayTasks.length}</span>
                          </div>
                          <div className="l-day-hours">
                            {formatHours(dayHoursDone)}<em> / {formatHours(dayHoursTotal)}</em>
                          </div>
                          <div className="l-day-chev">▸</div>
                        </div>
                        <div className="l-day-tasks">
                          {dayTasks.map(task => (
                            <TaskRow
                              key={task.id}
                              task={task}
                              done={isTaskDone(task)}
                              onToggle={() => toggleTask(task)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Gate */}
                  <div className="l-gate">
                    <div className="l-gate-label">Sprint Gate</div>
                    <div className="l-gate-sub">Evaluation Checkpoints</div>
                    {GATES[sprint.id].map((text, idx) => {
                      const key = `${sprint.id}_${idx}`;
                      const done = gateState[key] === true;
                      return (
                        <div
                          key={idx}
                          className={`l-gate-item${done ? ' done' : ''}`}
                          onClick={() => toggleGate(sprint.id, idx)}
                        >
                          <div className="l-gate-dot" />
                          <span>{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* COLOPHON */}
          <div className="l-colophon">
            <p className="l-colophon-text">Progress saved to browser. Private to this machine. A working instrument, not a finished document.</p>
            <button className="l-reset" onClick={resetAll}>Reset Journal</button>
          </div>

        </div>
      </div>
    </>
  );
}

function TaskRow({ task, done, onToggle, compact }) {
  return (
    <div className={`l-task${done ? ' done' : ''}`} onClick={onToggle}>
      <div className="l-task-check" />
      <div className="l-task-id">{task.id}</div>
      <div className="l-task-content">
        <div className="l-task-title">{task.title}</div>
        {!compact && <div className="l-task-desc">{task.desc}</div>}
        {compact && <div className="l-task-desc">{task.desc}</div>}
      </div>
      <div className="l-task-meta">
        <div className="l-task-hours">{formatHours(task.hours)}</div>
        <div className={`l-task-tier ${task.tier}`}>
          {task.tier === 'must' ? 'Essential' : task.tier === 'should' ? 'Important' : 'Optional'}
        </div>
      </div>
    </div>
  );
}
