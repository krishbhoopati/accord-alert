"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "landing" | "analysis" | "timeline" | "report";
type OblType = "ours" | "monitored";
type EventStatus = "success" | "warning" | "danger" | "info" | "accent";
type FinalStatus = "fulfilled" | "breached" | "cured";

interface Obligation {
  id: string;
  party: string;
  partyFull: string;
  type: OblType;
  obligation: string;
  deadline: string;
  category: string;
  articleRef: string;
  riskIfMissed: string;
  finalStatus: FinalStatus;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: EventStatus;
  icon: string;
}

// ─── Obligations ──────────────────────────────────────────────────────────────

const OBLIGATIONS: Obligation[] = [
  {
    id: "obl-1",
    party: "Contractor",
    partyFull: "Maple Leaf Construction Ltd.",
    type: "monitored",
    obligation: "Submit detailed architectural plans to the Client for approval",
    deadline: "February 15, 2025",
    category: "Delivery",
    articleRef: "Article 2.1",
    riskIfMissed:
      "Delay in architectural plans will push back permit applications and the construction start date, potentially causing cascading deadline failures across the entire project.",
    finalStatus: "fulfilled",
  },
  {
    id: "obl-2",
    party: "Client",
    partyFull: "Definitely-Not-Evil-Corp Inc.",
    type: "ours",
    obligation:
      "Review and approve or request revisions to the architectural plans within 14 business days of receipt",
    deadline: "March 7, 2025",
    category: "Administrative",
    articleRef: "Article 2.2",
    riskIfMissed:
      "Failure to respond within the 14 business day window could delay the project timeline and may constitute a breach by the Client, exposing Definitely-Not-Evil-Corp to counterclaims.",
    finalStatus: "fulfilled",
  },
  {
    id: "obl-3",
    party: "Contractor",
    partyFull: "Maple Leaf Construction Ltd.",
    type: "monitored",
    obligation:
      "Obtain all necessary municipal building permits before commencing construction",
    deadline: "March 21, 2025",
    category: "Administrative",
    articleRef: "Article 2.3",
    riskIfMissed:
      "Construction without permits may result in municipal stop-work orders, fines, and project delays. Definitely-Not-Evil-Corp could face liability as the property owner.",
    finalStatus: "fulfilled",
  },
  {
    id: "obl-4",
    party: "Contractor",
    partyFull: "Maple Leaf Construction Ltd.",
    type: "monitored",
    obligation:
      "Commence construction and substantially complete the office renovation",
    deadline: "April 1, 2025 (start) — August 31, 2025 (completion)",
    category: "Construction",
    articleRef: "Article 2.4",
    riskIfMissed:
      "Failure to complete by August 31, 2025 may result in claims for consequential damages. Under Hadley v Baxendale (1854), foreseeable losses from delay — including temporary office costs and lost productivity — may be recoverable.",
    finalStatus: "breached",
  },
  {
    id: "obl-5",
    party: "Contractor",
    partyFull: "Maple Leaf Construction Ltd.",
    type: "monitored",
    obligation:
      "Provide bi-weekly written progress reports to the Client every second Friday during construction",
    deadline: "Bi-weekly during construction period",
    category: "Reporting",
    articleRef: "Article 2.5",
    riskIfMissed:
      "Missed reports create gaps in project oversight. Repeated failure to report may indicate broader performance issues, as seen in Hamilton v Open Window Bakery Ltd (2004 SCC 9) where cessation of performance led to breach liability.",
    finalStatus: "cured",
  },
  {
    id: "obl-6",
    party: "Client",
    partyFull: "Definitely-Not-Evil-Corp Inc.",
    type: "ours",
    obligation: "Pay deposit of $50,000 upon signing the Agreement",
    deadline: "January 20, 2025",
    category: "Payment",
    articleRef: "Article 2.6(a)",
    riskIfMissed:
      "Failure to pay the deposit may constitute breach of contract, entitling the Contractor to suspend work or terminate the Agreement under Article 3.",
    finalStatus: "fulfilled",
  },
  {
    id: "obl-7",
    party: "Client",
    partyFull: "Definitely-Not-Evil-Corp Inc.",
    type: "ours",
    obligation:
      "Pay progress payment of $75,000 upon completion of framing and rough-in stage",
    deadline: "Estimated June 1, 2025",
    category: "Payment",
    articleRef: "Article 2.6(b)",
    riskIfMissed:
      "Late payment could give the Contractor grounds to suspend work under Article 3, further delaying the project and increasing costs.",
    finalStatus: "fulfilled",
  },
  {
    id: "obl-8",
    party: "Client",
    partyFull: "Definitely-Not-Evil-Corp Inc.",
    type: "ours",
    obligation: "Pay final payment of $75,000 upon substantial completion",
    deadline: "Within 15 business days of completion",
    category: "Payment",
    articleRef: "Article 2.6(c)",
    riskIfMissed:
      "Withholding final payment without legal justification could expose Definitely-Not-Evil-Corp to a counterclaim for breach. However, payment may be legitimately withheld if the Contractor has not achieved substantial completion.",
    finalStatus: "fulfilled",
  },
  {
    id: "obl-9",
    party: "Contractor",
    partyFull: "Maple Leaf Construction Ltd.",
    type: "monitored",
    obligation:
      "Maintain comprehensive liability insurance of no less than $2,000,000 throughout the project duration",
    deadline: "Ongoing — proof due by January 31, 2025",
    category: "Insurance",
    articleRef: "Article 2.7",
    riskIfMissed:
      "Lapse in insurance coverage exposes both parties to uninsured liability during construction. This is a material obligation — failure to maintain coverage could justify suspension of the project.",
    finalStatus: "fulfilled",
  },
  {
    id: "obl-10",
    party: "Contractor",
    partyFull: "Maple Leaf Construction Ltd.",
    type: "monitored",
    obligation:
      "Provide 12-month warranty on all workmanship and remedy defects within 30 days of notification",
    deadline: "Within 30 days of defect notification",
    category: "Warranty",
    articleRef: "Article 2.8",
    riskIfMissed:
      "Failure to honour the warranty could require Definitely-Not-Evil-Corp to engage alternative contractors for defect repair and pursue damages for breach of the warranty provision.",
    finalStatus: "fulfilled",
  },
];

// ─── Timeline Events ──────────────────────────────────────────────────────────

const TIMELINE_EVENTS: TimelineEvent[] = [
  { date: "Jan 15, 2025", title: "Contract Signed", description: "Service Agreement executed between Definitely-Not-Evil-Corp Inc. and Maple Leaf Construction Ltd.", status: "success", icon: "check" },
  { date: "Jan 20, 2025", title: "Deposit Payment Sent", description: "Definitely-Not-Evil-Corp paid $50,000 deposit as required under Article 2.6(a).", status: "success", icon: "check" },
  { date: "Jan 31, 2025", title: "Insurance Proof Received", description: "Contractor provided proof of $2,000,000 liability insurance coverage per Article 2.7.", status: "success", icon: "check" },
  { date: "Feb 14, 2025", title: "Architectural Plans Delivered", description: "Contractor submitted architectural plans one day before the February 15 deadline.", status: "success", icon: "check" },
  { date: "Mar 5, 2025", title: "Plans Approved by Client", description: "Definitely-Not-Evil-Corp approved architectural plans within the 14 business day review period.", status: "success", icon: "check" },
  { date: "Mar 18, 2025", title: "Building Permits Obtained", description: "Contractor obtained all required municipal building permits ahead of the March 21 deadline.", status: "success", icon: "check" },
  { date: "Apr 1, 2025", title: "Construction Commenced", description: "Renovation work began on schedule at 100 Bay Street, Toronto.", status: "success", icon: "check" },
  { date: "Apr 11, 2025", title: "Progress Report #1 Received", description: "First bi-weekly progress report submitted on time.", status: "success", icon: "check" },
  { date: "Apr 25, 2025", title: "⚠ Progress Report #2 — Late", description: "Bi-weekly progress report due April 25 was submitted 3 days late on April 28. AccordAlert flagged this as an early warning.", status: "warning", icon: "alert" },
  { date: "May 9, 2025", title: "Progress Report #3 Received", description: "Bi-weekly report received on time. Contractor back on track with reporting obligations.", status: "success", icon: "check" },
  { date: "Jun 1, 2025", title: "⚠ Framing Stage Incomplete", description: "Progress payment of $75,000 triggered but framing and rough-in stage not yet fully complete. AccordAlert flagged milestone discrepancy.", status: "warning", icon: "alert" },
  { date: "Jun 15, 2025", title: "🚨 Progress Report — Missed", description: "Bi-weekly progress report due June 13 was never submitted. AccordAlert detected a breach of Article 2.5. Breach notice recommended.", status: "danger", icon: "breach" },
  { date: "Jun 16, 2025", title: "Breach Notice Issued", description: "Definitely-Not-Evil-Corp issued written breach notice to Contractor per Article 3.1. 15 business day cure period begins.", status: "info", icon: "notice" },
  { date: "Jun 20, 2025", title: "Cure Period Active", description: "Contractor has until July 7, 2025 to remedy the reporting breach. AccordAlert monitoring cure period deadline.", status: "info", icon: "clock" },
  { date: "Jun 27, 2025", title: "Breach Cured", description: "Contractor submitted overdue progress report and resumed bi-weekly reporting schedule. Breach cured within cure period.", status: "success", icon: "check" },
  { date: "Aug 25, 2025", title: "⚠ Completion Deadline Approaching", description: "6 days until the August 31 substantial completion deadline. AccordAlert early warning: construction is approximately 85% complete.", status: "warning", icon: "alert" },
  { date: "Sep 1, 2025", title: "🚨 Completion Deadline Missed", description: "Construction not substantially completed by August 31, 2025. This constitutes a potential breach of Article 2.4.", status: "danger", icon: "breach" },
  { date: "Sep 2, 2025", title: "Breach Notice Issued", description: "Definitely-Not-Evil-Corp issued written breach notice regarding the missed completion deadline. 15 business day cure period begins.", status: "info", icon: "notice" },
  { date: "Sep 22, 2025", title: "🚨 Cure Period Expired", description: "Contractor failed to achieve substantial completion within the 15 business day cure period. Breach of Article 2.4 confirmed.", status: "danger", icon: "breach" },
  { date: "Sep 22, 2025", title: "Compliance Report Generated", description: "AccordAlert generated a full compliance report with risk assessment and recommended next steps.", status: "accent", icon: "report" },
];

// ─── Color Constants ──────────────────────────────────────────────────────────

const C = {
  navy: '#242F40',
  charcoal: '#363636',
  gold: '#CCA43B',
  lightGray: '#E5E5E5',
  white: '#FFFFFF',
  bgSecondary: '#F4F4F4',
  bgTertiary: '#FAFAFA',
  textPrimary: '#363636',
  textSecondary: '#666666',
  textTertiary: '#999999',
  sidebarText: 'rgba(255,255,255,0.9)',
  sidebarMuted: 'rgba(255,255,255,0.55)',
  sidebarDim: 'rgba(255,255,255,0.35)',
  sidebarBorder: 'rgba(255,255,255,0.1)',
  green: '#2A9D6A',
  red: '#C94040',
  blue: '#4A6FA5',
};

// ─── Event & Status Colors ────────────────────────────────────────────────────

const EVENT_COLORS: Record<EventStatus, { border: string; iconBg: string; iconColor: string; cardBg: string }> = {
  success: { border: '#2A9D6A', iconBg: 'rgba(42,157,106,0.1)',   iconColor: '#2A9D6A', cardBg: 'transparent' },
  warning: { border: '#CCA43B', iconBg: 'rgba(204,164,59,0.12)',  iconColor: '#CCA43B', cardBg: 'rgba(204,164,59,0.03)' },
  danger:  { border: '#C94040', iconBg: 'rgba(201,64,64,0.1)',    iconColor: '#C94040', cardBg: 'rgba(201,64,64,0.03)' },
  info:    { border: '#4A6FA5', iconBg: 'rgba(74,111,165,0.1)',   iconColor: '#4A6FA5', cardBg: 'rgba(74,111,165,0.03)' },
  accent:  { border: '#CCA43B', iconBg: 'rgba(204,164,59,0.12)', iconColor: '#CCA43B', cardBg: 'rgba(204,164,59,0.04)' },
};

const ICON_TEXT: Record<string, string> = {
  check: "✓", alert: "⚠", breach: "✕", notice: "⚑", clock: "◷", report: "◈",
};

const FINAL_STATUS: Record<FinalStatus, { label: string; color: string; bg: string; rowBg: string }> = {
  fulfilled: { label: 'Fulfilled', color: '#2A9D6A', bg: 'rgba(42,157,106,0.1)',  rowBg: 'transparent' },
  breached:  { label: 'Breached',  color: '#C94040', bg: 'rgba(201,64,64,0.1)',   rowBg: 'rgba(201,64,64,0.03)' },
  cured:     { label: 'Cured',     color: '#4A6FA5', bg: 'rgba(74,111,165,0.1)',  rowBg: 'rgba(74,111,165,0.03)' },
};

// ─── Button Style Helpers ─────────────────────────────────────────────────────

const btnPrimary: React.CSSProperties = {
  background: '#363636',
  color: 'white',
  border: 'none',
  borderRadius: 999,
  padding: '10px 22px',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
};

const btnGold: React.CSSProperties = {
  background: '#CCA43B',
  color: '#363636',
  border: 'none',
  borderRadius: 999,
  padding: '10px 24px',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  background: 'transparent',
  color: '#363636',
  border: '1px solid #E5E5E5',
  borderRadius: 999,
  padding: '9px 20px',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
};

const btnNavyOutline: React.CSSProperties = {
  background: 'transparent',
  color: 'rgba(255,255,255,0.8)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 999,
  padding: '7px 14px',
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  cursor: 'pointer',
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      background: '#242F40',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto',
      padding: '28px 0',
    }}>
      {/* Brand */}
      <div style={{ padding: '0 28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 16, color: '#CCA43B' }}>◈</span>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, color: 'white', letterSpacing: -0.3 }}>AccordAlert</span>
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.3 }}>Definitely-Not-Evil-Corp Inc.</span>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
        {children}
      </div>
    </aside>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: 1.2, padding: '0 28px', marginBottom: 8 }}>{title}</p>
      {children}
    </div>
  );
}

function NavItem({ label, active, badge, onClick }: { label: string; active?: boolean; badge?: number; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}>
      {active && (
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#CCA43B', borderRadius: '0 2px 2px 0' }} />
      )}
      <div style={{ padding: '9px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: active ? 'white' : 'rgba(255,255,255,0.55)', fontWeight: active ? 500 : 400 }}>{label}</span>
        {badge !== undefined && (
          <span style={{ background: 'rgba(204,164,59,0.25)', color: '#CCA43B', fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 999, border: '1px solid rgba(204,164,59,0.3)' }}>{badge}</span>
        )}
      </div>
    </div>
  );
}

// ─── Circular Progress SVG ────────────────────────────────────────────────────

function CircularProgress({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#E5E5E5" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#CCA43B" strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x="70" y="66" textAnchor="middle" fill="#363636" fontSize="26" fontWeight="700" fontFamily="Inter, sans-serif">{pct}%</text>
      <text x="70" y="83" textAnchor="middle" fill="#999999" fontSize="11" fontFamily="Inter, sans-serif">compliant</text>
    </svg>
  );
}

// ─── Contract Document ────────────────────────────────────────────────────────

function ContractDoc({ onSelect, selectedId }: { onSelect: (id: string) => void; selectedId: string | null }) {
  const h = (id: string, type: OblType, text: React.ReactNode) => {
    const sel = selectedId === id;
    const bg = type === "ours"
      ? (sel ? 'rgba(204,164,59,0.35)' : 'rgba(204,164,59,0.18)')
      : (sel ? 'rgba(36,47,64,0.18)' : 'rgba(36,47,64,0.09)');
    const borderColor = type === "ours" ? '#CCA43B' : 'rgba(36,47,64,0.5)';
    const borderStyle = type === "ours" ? '2px solid #CCA43B' : '2px dashed rgba(36,47,64,0.5)';
    return (
      <span
        onClick={(e) => { e.stopPropagation(); onSelect(id); }}
        style={{
          background: bg,
          borderBottom: borderStyle,
          cursor: 'pointer',
          borderRadius: 2,
          outline: sel ? `2px solid ${borderColor}` : 'none',
          outlineOffset: 1,
          transition: 'background 0.15s',
        }}
      >
        {text}
      </span>
    );
  };

  const doc: React.CSSProperties = {
    background: '#FDFCF8',
    border: '1px solid #E8E4DC',
    borderRadius: 4,
    boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    padding: '52px 56px',
    color: '#1C1C1C',
    fontFamily: "'Merriweather', Georgia, 'Times New Roman', serif",
    fontSize: 13,
    lineHeight: 1.9,
  };
  const p: React.CSSProperties = { margin: '0 0 12px' };
  const art: React.CSSProperties = { fontWeight: 700, fontSize: 11.5, letterSpacing: 1.5, textTransform: 'uppercase' as const, margin: '22px 0 10px', color: '#333' };
  const ind: React.CSSProperties = { margin: '0 0 10px', paddingLeft: 18 };

  return (
    <div style={doc}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, padding: '10px 14px', background: '#F2F0EC', borderRadius: 4, border: '1px solid #E0DDD6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#444' }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(204,164,59,0.35)', border: '2px solid #CCA43B', display: 'inline-block' }} />
          Our Obligations (Client)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#444' }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(36,47,64,0.18)', border: '2px dashed rgba(36,47,64,0.5)', display: 'inline-block' }} />
          Monitored Obligations (Contractor)
        </div>
      </div>

      <h1 style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 4px', fontFamily: "'Merriweather', serif" }}>
        Service Agreement
      </h1>
      <p style={{ textAlign: 'center', fontSize: 11.5, color: '#666', margin: '0 0 22px' }}>(the &ldquo;Agreement&rdquo;)</p>

      <div style={{ borderTop: '1px solid #D0CCC6', paddingTop: 18 }}>
        <p style={p}>This Service Agreement (&ldquo;Agreement&rdquo;) is entered into as of <strong>January 15, 2025</strong>, by and between:</p>
        <p style={{ ...p, paddingLeft: 20 }}>
          <strong>Party A:</strong> Definitely-Not-Evil-Corp Inc. (&ldquo;Client&rdquo;)<br />
          <strong>Party B:</strong> Maple Leaf Construction Ltd. (&ldquo;Contractor&rdquo;)
        </p>

        <p style={art}>Article 1 — Scope of Work</p>
        <p style={p}>The Contractor agrees to renovate the Client&rsquo;s office space at 100 Bay Street, Toronto, Ontario, including demolition of existing interior walls, installation of new electrical and plumbing systems, and finishing work including painting and flooring.</p>

        <p style={art}>Article 2 — Obligations and Deadlines</p>
        <p style={p}><strong>2.1</strong> {h('obl-1', 'monitored', 'The Contractor shall submit detailed architectural plans to the Client for approval by February 15, 2025.')}</p>
        <p style={p}><strong>2.2</strong> {h('obl-2', 'ours', 'The Client shall review and approve or request revisions to the architectural plans within 14 business days of receipt, no later than March 7, 2025.')}</p>
        <p style={p}><strong>2.3</strong> {h('obl-3', 'monitored', 'The Contractor shall obtain all necessary municipal building permits before commencing construction, no later than March 21, 2025.')}</p>
        <p style={p}><strong>2.4</strong> {h('obl-4', 'monitored', 'Construction shall commence no later than April 1, 2025 and shall be substantially completed by August 31, 2025.')}</p>
        <p style={p}><strong>2.5</strong> {h('obl-5', 'monitored', 'The Contractor shall provide the Client with bi-weekly written progress reports every second Friday during the construction period.')}</p>
        <p style={p}><strong>2.6</strong> The Client shall make the following payments to the Contractor:</p>
        <p style={ind}>
          (a) {h('obl-6', 'ours', 'A deposit of $50,000 upon signing this Agreement, due January 20, 2025')};<br />
          (b) {h('obl-7', 'ours', 'A progress payment of $75,000 upon completion of the framing and rough-in stage, estimated June 1, 2025')};<br />
          (c) {h('obl-8', 'ours', 'A final payment of $75,000 upon substantial completion, due within 15 business days of completion')}.
        </p>
        <p style={p}><strong>2.7</strong> {h('obl-9', 'monitored', 'The Contractor shall maintain comprehensive liability insurance of no less than $2,000,000 throughout the duration of the project and provide proof of insurance to the Client by January 31, 2025.')}</p>
        <p style={p}><strong>2.8</strong> Upon substantial completion, {h('obl-10', 'monitored', 'the Contractor shall provide a 12-month warranty on all workmanship and shall remedy any defects reported within the warranty period within 30 days of notification')}.</p>

        <p style={art}>Article 3 — Breach and Remedies</p>
        <p style={p}><strong>3.1</strong> If either party fails to perform a material obligation under this Agreement, the non-breaching party shall provide written notice specifying the breach. The breaching party shall have 15 business days from receipt of notice to cure the breach.</p>
        <p style={p}><strong>3.2</strong> If the breach is not cured within the cure period, the non-breaching party may terminate this Agreement and pursue damages.</p>

        <p style={art}>Article 4 — Governing Law</p>
        <p style={p}>This Agreement shall be governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.</p>

        <div style={{ borderTop: '1px solid #D0CCC6', marginTop: 22, paddingTop: 20 }}>
          <p style={{ fontWeight: 700, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 18px', color: '#444' }}>Signatures</p>
          <div style={{ display: 'flex', gap: 48 }}>
            <div style={{ flex: 1 }}>
              <div style={{ borderBottom: '1px solid #444', marginBottom: 6, height: 24 }} />
              <p style={{ margin: 0, fontSize: 11, color: '#666' }}>For Definitely-Not-Evil-Corp Inc.</p>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ borderBottom: '1px solid #444', marginBottom: 6, height: 24 }} />
              <p style={{ margin: 0, fontSize: 11, color: '#666' }}>For Maple Leaf Construction Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AccordAlert() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [selectedOblId, setSelectedOblId] = useState<string | null>(null);
  const [visibleEvents, setVisibleEvents] = useState(0);
  const [showReportBtn, setShowReportBtn] = useState(false);
  const [terminationSent, setTerminationSent] = useState(false);
  const [legalEngaged, setLegalEngaged] = useState(false);
  const [damagesInitiated, setDamagesInitiated] = useState(false);

  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const reportScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline as events appear
  useEffect(() => {
    if (screen !== 'timeline' || !timelineScrollRef.current) return;
    timelineScrollRef.current.scrollTop = timelineScrollRef.current.scrollHeight;
  }, [visibleEvents, showReportBtn, screen]);

  // Scroll report to top when navigating to it
  useEffect(() => {
    if (screen !== 'report' || !reportScrollRef.current) return;
    reportScrollRef.current.scrollTop = 0;
  }, [screen]);

  // Timeline animation
  useEffect(() => {
    if (screen !== 'timeline') {
      setVisibleEvents(0);
      setShowReportBtn(false);
      return;
    }
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let count = 0;
    const scheduleNext = () => {
      count++;
      setVisibleEvents(count);
      if (count < TIMELINE_EVENTS.length) {
        timeouts.push(setTimeout(scheduleNext, 700));
      } else {
        timeouts.push(setTimeout(() => setShowReportBtn(true), 1500));
      }
    };
    timeouts.push(setTimeout(scheduleNext, 400));
    return () => timeouts.forEach(clearTimeout);
  }, [screen]);

  const selectedObl = OBLIGATIONS.find((o) => o.id === selectedOblId) ?? null;

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN 1 — LANDING
  // ─────────────────────────────────────────────────────────────────────────────

  if (screen === 'landing') {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
        {/* Sidebar */}
        <Sidebar>
          <NavSection title="Platform">
            <NavItem label="Contract Analysis" active />
            <NavItem label="Timeline Simulation" />
            <NavItem label="Compliance Report" />
          </NavSection>
          <NavSection title="About">
            <NavItem label="How It Works" />
            <NavItem label="Legal Framework" />
          </NavSection>
        </Sidebar>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', background: C.white }}>
          {/* Header */}
          <div style={{ padding: '28px 40px', borderBottom: `1px solid ${C.lightGray}` }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 600, color: C.charcoal, margin: '0 0 6px', letterSpacing: -0.5 }}>Contract Compliance Platform</h1>
            <p style={{ fontSize: 15, color: C.textSecondary, margin: 0 }}>AI-powered monitoring to prevent breach of contract and minimize legal risk.</p>
          </div>

          {/* Content area */}
          <div style={{ padding: 40 }}>
            {/* Tagline badge */}
            <div style={{ marginBottom: 32 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(204,164,59,0.12)', border: '1px solid rgba(204,164,59,0.3)', color: C.gold, borderRadius: 999, padding: '5px 14px', fontSize: 12, fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, background: C.gold, borderRadius: '50%', display: 'inline-block' }} />
                AI-Powered Compliance Monitoring
              </span>
            </div>

            {/* Document preview card */}
            <div style={{ maxWidth: 480, margin: '0 auto 40px', background: '#F8F7F3', border: '1px solid #E0DDD6', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)', padding: 28, color: '#1C1C1C' }}>
              <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 12px', fontFamily: 'Playfair Display, serif' }}>SERVICE AGREEMENT</p>
              <div style={{ borderTop: '1px solid #D8D4CC', paddingTop: 14, fontFamily: 'Merriweather, serif' }}>
                <p style={{ fontSize: 11, color: '#555', margin: '0 0 10px' }}>This Service Agreement is entered into as of January 15, 2025, by and between:</p>
                <p style={{ fontSize: 11, color: '#555', margin: '0 0 14px', paddingLeft: 12 }}>
                  <strong>Party A:</strong> Definitely-Not-Evil-Corp Inc. (&ldquo;Client&rdquo;)<br />
                  <strong>Party B:</strong> Maple Leaf Construction Ltd. (&ldquo;Contractor&rdquo;)
                </p>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 8, background: '#E8E4DC', borderRadius: 2, margin: '6px 0', opacity: 1 - i * 0.15 }} />
                ))}
                <div style={{ margin: '14px 0 6px', height: 1, background: '#D8D4CC' }} />
                {[0.9, 0.7, 0.85, 0.6].map((op, i) => (
                  <div key={i} style={{ height: 7, background: '#E8E4DC', borderRadius: 2, margin: '5px 0', opacity: op, width: `${70 + i * 7}%` }} />
                ))}
                <div style={{ marginTop: 18, display: 'flex', gap: 40 }}>
                  <div style={{ flex: 1 }}><div style={{ borderBottom: '1px solid #888', height: 18, marginBottom: 4 }} /><div style={{ height: 6, background: '#E0DCD4', borderRadius: 2 }} /></div>
                  <div style={{ flex: 1 }}><div style={{ borderBottom: '1px solid #888', height: 18, marginBottom: 4 }} /><div style={{ height: 6, background: '#E0DCD4', borderRadius: 2 }} /></div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 48 }}>
              <button style={btnSecondary}>Load Sample Contract</button>
              <button onClick={() => setScreen('analysis')} style={btnGold}>Upload &amp; Analyze Contract →</button>
            </div>

            {/* Feature cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { title: 'Obligation Extraction', desc: 'AI identifies every deadline, deliverable, and duty from your contracts', icon: '◈' },
                { title: 'Breach Detection', desc: 'Real-time monitoring flags missed deadlines before they escalate', icon: '⚑' },
                { title: 'Compliance Reporting', desc: 'Automated reports with legal risk assessment and recommended actions', icon: '◧' },
              ].map((f) => (
                <div key={f.title} style={{ background: C.bgTertiary, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '20px 18px' }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(204,164,59,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: C.gold, marginBottom: 14 }}>{f.icon}</div>
                  <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 14, color: C.charcoal, fontFamily: 'Playfair Display, serif' }}>{f.title}</p>
                  <p style={{ margin: 0, fontSize: 13, color: C.textSecondary, lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN 2 — CONTRACT ANALYSIS
  // ─────────────────────────────────────────────────────────────────────────────

  if (screen === 'analysis') {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
        {/* Sidebar */}
        <Sidebar>
          <NavSection title="Document">
            <NavItem label="Overview" active />
            <NavItem label="Obligations" />
            <NavItem label="Payments" />
            <NavItem label="Breach & Remedies" />
          </NavSection>
          <NavSection title="Analysis">
            <NavItem label="Our Obligations" badge={4} />
            <NavItem label="Contractor Obligations" badge={6} />
            <NavItem label="Risk Items" badge={2} />
          </NavSection>
          {/* Bottom info card */}
          <div style={{ padding: '0 20px', marginTop: 8 }}>
            <div style={{ background: 'rgba(204,164,59,0.12)', border: '1px solid rgba(204,164,59,0.25)', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#CCA43B', fontWeight: 600 }}>10 obligations identified</p>
            </div>
          </div>
        </Sidebar>

        {/* Main workspace */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.white }}>
          {/* Header */}
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.lightGray}`, padding: '0 36px', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>Contract Analysis</h2>
              <p style={{ margin: 0, fontSize: 12, color: C.textTertiary }}>Service Agreement — Maple Leaf Construction Ltd.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setScreen('landing')} style={btnSecondary}>← Back</button>
              <button onClick={() => setScreen('timeline')} style={btnGold}>Simulate Contract Lifecycle →</button>
            </div>
          </div>

          {/* Document viewer */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 36 }}>
            <ContractDoc onSelect={setSelectedOblId} selectedId={selectedOblId} />
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 300, flexShrink: 0, background: C.bgSecondary, borderLeft: `1px solid ${C.lightGray}`, overflowY: 'auto' }}>
          {/* Panel header */}
          <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.lightGray}` }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, color: C.charcoal, margin: 0 }}>AI Review Summary</h3>
          </div>

          <div style={{ padding: 16 }}>
            {!selectedObl ? (
              <>
                {/* Instruction card */}
                <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.lightGray}`, padding: 20, textAlign: 'center', marginBottom: 16 }}>
                  <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 500, color: C.textPrimary }}>Click a highlighted clause to view obligation details</p>
                </div>
                {/* Summary stats */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, background: 'rgba(204,164,59,0.1)', border: '1px solid rgba(204,164,59,0.25)', borderRadius: 8, padding: '12px 14px' }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.gold }}>4</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textSecondary }}>Our Obligations</p>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(36,47,64,0.07)', border: '1px solid rgba(36,47,64,0.15)', borderRadius: 8, padding: '12px 14px' }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.navy }}>6</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textSecondary }}>Monitored Obligations</p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: 20 }}>
                {/* Card header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 8, width: 8, height: 8, borderRadius: '50%', background: selectedObl.type === 'ours' ? C.gold : C.navy, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: 0.6, color: C.textSecondary, fontWeight: 500 }}>
                      {selectedObl.type === 'ours' ? 'Our Obligation' : 'Monitored Obligation'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedOblId(null)} style={{ background: 'transparent', border: 'none', color: C.textTertiary, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}>✕</button>
                </div>

                {/* Title */}
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: C.charcoal, margin: '0 0 16px', lineHeight: 1.4 }}>{selectedObl.obligation}</p>

                {/* Detail rows */}
                {[
                  { label: 'Party', value: selectedObl.partyFull },
                  { label: 'Deadline', value: selectedObl.deadline },
                  { label: 'Category', value: selectedObl.category },
                  { label: 'Article Reference', value: selectedObl.articleRef },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.lightGray}` }}>
                    <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontSize: 12, color: C.textPrimary, textAlign: 'right', maxWidth: '58%' }}>{row.value}</span>
                  </div>
                ))}

                {/* Risk section */}
                <div style={{ background: 'rgba(201,64,64,0.04)', border: '1px solid rgba(201,64,64,0.12)', borderRadius: 6, padding: '12px 14px', margin: '14px 0' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: C.red, textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Risk if Missed</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.textPrimary, lineHeight: 1.6 }}>{selectedObl.riskIfMissed}</p>
                </div>

                {/* Bottom note */}
                <p style={{ fontSize: 11, color: C.textTertiary, lineHeight: 1.5, margin: 0 }}>
                  This analysis helps Definitely-Not-Evil-Corp Inc. monitor compliance. Consult legal counsel for formal advice.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN 3 — TIMELINE
  // ─────────────────────────────────────────────────────────────────────────────

  if (screen === 'timeline') {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
        {/* Sidebar */}
        <Sidebar>
          <NavSection title="Simulation">
            <NavItem label="Contract Lifecycle" active />
            <NavItem label="Jan 15 → Sep 22, 2025" />
          </NavSection>
          <NavSection title="Progress">
            <div style={{ padding: '0 28px', marginBottom: 12 }}>
              <div style={{ height: 4, background: C.lightGray, borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: `${(visibleEvents / TIMELINE_EVENTS.length) * 100}%`, height: '100%', background: C.gold, borderRadius: 2, transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{visibleEvents} of {TIMELINE_EVENTS.length} events</span>
            </div>
          </NavSection>
          <NavSection title="Event Types">
            <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Success', color: C.green },
                { label: 'Warning', color: C.gold },
                { label: 'Breach', color: C.red },
                { label: 'Legal Process', color: C.blue },
              ].map((t) => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </NavSection>
        </Sidebar>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.white }}>
          {/* Header */}
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.lightGray}`, padding: '0 36px', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>Contract Lifecycle Simulation</h2>
              <p style={{ margin: 0, fontSize: 12, color: C.textTertiary }}>Simulating performance of the Service Agreement...</p>
            </div>
            <button onClick={() => setScreen('analysis')} style={btnSecondary}>← Back to Contract</button>
          </div>

          {/* Timeline content */}
          <div ref={timelineScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '36px 48px' }}>
            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: C.lightGray, zIndex: 0 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {TIMELINE_EVENTS.slice(0, visibleEvents).map((ev, i) => {
                  const c = EVENT_COLORS[ev.status];
                  return (
                    <div key={i} className="timeline-event" style={{ display: 'flex', gap: 16, paddingBottom: 20, position: 'relative', zIndex: 1 }}>
                      {/* Icon circle */}
                      <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: c.iconBg, border: `2px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: c.iconColor, fontWeight: 700 }}>
                        {ICON_TEXT[ev.icon]}
                      </div>
                      {/* Card */}
                      <div style={{ flex: 1, background: c.cardBg || C.white, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${c.border}`, borderRadius: 8, padding: '14px 18px', marginTop: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.charcoal }}>{ev.title}</p>
                          <span style={{ fontSize: 11, color: C.textTertiary, whiteSpace: 'nowrap', marginLeft: 8 }}>{ev.date}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: C.textSecondary, lineHeight: 1.55 }}>{ev.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* View report button */}
            {showReportBtn && (
              <div className="timeline-event" style={{ textAlign: 'center', paddingTop: 20 }}>
                <button onClick={() => setScreen('report')} style={btnGold}>
                  View Compliance Report →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCREEN 4 — COMPLIANCE REPORT
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <Sidebar>
        <NavSection title="Report Sections">
          <NavItem label="Compliance Score" active />
          <NavItem label="Obligation Breakdown" />
          <NavItem label="Breach Analysis" />
          <NavItem label="Prevention Insights" />
          <NavItem label="Legal Reference" />
        </NavSection>
        <NavSection title="Summary">
          <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: C.green, fontWeight: 500 }}>8 Fulfilled</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.red, display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: C.red, fontWeight: 500 }}>1 Breached</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.blue, display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: C.blue, fontWeight: 500 }}>1 Cured</span>
            </div>
          </div>
        </NavSection>
      </Sidebar>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.white }}>
        {/* Header */}
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.lightGray}`, padding: '0 36px', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>Compliance Report</h2>
            <p style={{ margin: 0, fontSize: 12, color: C.textTertiary }}>Service Agreement — Maple Leaf Construction Ltd. | Sept 22, 2025</p>
          </div>
          <button onClick={() => setScreen('timeline')} style={btnSecondary}>← Back to Timeline</button>
        </div>

        {/* Report content */}
        <div ref={reportScrollRef} style={{ flex: 1, overflowY: 'auto', padding: 36 }}>

          {/* Score card */}
          <div style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
            <CircularProgress pct={80} />
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, color: C.textTertiary }}>Contract Compliance Report</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 4px', fontSize: 20, fontWeight: 600, color: C.charcoal }}>Service Agreement — Maple Leaf Construction Ltd.</h2>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: C.textSecondary }}>Report generated: September 22, 2025</p>
              <p style={{ margin: 0, fontSize: 14, color: C.gold, fontWeight: 500 }}>8 of 10 obligations fulfilled — 1 unresolved breach</p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Fulfilled',         value: 8,  color: C.green },
              { label: 'Breached',          value: 1,  color: C.red },
              { label: 'Cured',             value: 1,  color: C.blue },
              { label: 'Total Obligations', value: 10, color: C.gold },
            ].map((s) => (
              <div key={s.label} style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderLeft: `4px solid ${s.color}`, borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: C.charcoal }}>{s.value}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textSecondary }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Obligation breakdown */}
          <div style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.lightGray}` }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', margin: 0, fontSize: 16, fontWeight: 600, color: C.charcoal }}>Obligation Breakdown</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.bgTertiary }}>
                  {['Obligation', 'Party', 'Deadline', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.textTertiary, textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OBLIGATIONS.map((obl) => {
                  const fs = FINAL_STATUS[obl.finalStatus];
                  return (
                    <tr key={obl.id} style={{ background: fs.rowBg, borderBottom: `1px solid ${C.lightGray}` }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: C.textPrimary, maxWidth: 280 }}>{obl.obligation}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: C.textSecondary, whiteSpace: 'nowrap' }}>{obl.party}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: C.textSecondary, whiteSpace: 'nowrap' }}>{obl.deadline.length > 30 ? obl.deadline.slice(0, 28) + '…' : obl.deadline}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: fs.bg, color: fs.color, border: `1px solid ${fs.color}30`, borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                          {fs.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Breach analysis */}
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, color: C.charcoal, margin: '0 0 16px' }}>Breach Impact Analysis</h3>

          {/* Card 1 — UNRESOLVED BREACH */}
          <div style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${C.red}`, borderRadius: 8, padding: 22, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ background: 'rgba(201,64,64,0.08)', color: C.red, border: '1px solid rgba(201,64,64,0.2)', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>HIGH RISK</span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.red, display: 'inline-block' }} />
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: C.charcoal }}>Construction Completion</span>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: 13, color: C.textSecondary, lineHeight: 1.65 }}>
              The Contractor failed to substantially complete the renovation by August 31, 2025. A breach notice was issued on September 2, 2025 under Article 3.1. The 15 business day cure period expired on September 22, 2025 without remedy.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: C.bgSecondary, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '14px 16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Financial Impact</p>
                <p style={{ margin: '0 0 4px', fontSize: 12, color: C.textSecondary }}>Estimated daily delay cost: <span style={{ color: C.textPrimary, fontWeight: 500 }}>$2,500</span> (extended temporary office rental)</p>
                <p style={{ margin: '0 0 4px', fontSize: 12, color: C.textSecondary }}>Total delay exposure (22 days): <span style={{ color: C.red, fontWeight: 600 }}>$55,000</span></p>
                <p style={{ margin: 0, fontSize: 12, color: C.textSecondary }}>Final payment of <span style={{ color: C.textPrimary, fontWeight: 500 }}>$75,000 withheld</span> pending resolution under Article 2.6(c)</p>
              </div>
              <div style={{ background: C.bgSecondary, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '14px 16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: C.red, textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Legal Risk</p>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>Under <em>Hadley v Baxendale</em> (1854), Definitely-Not-Evil-Corp may claim foreseeable losses from delayed completion, including alternative premises costs and lost productivity.</p>
                <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>Under Article 3.2, Definitely-Not-Evil-Corp may terminate the Agreement and pursue damages.</p>
              </div>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: C.textPrimary }}>Recommended Actions</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => setTerminationSent((v) => !v)}
                style={{ background: terminationSent ? 'rgba(42,157,106,0.08)' : 'rgba(201,64,64,0.06)', border: `1px solid ${terminationSent ? C.green : C.red}`, borderRadius: 999, color: terminationSent ? C.green : C.red, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, padding: '8px 16px' }}>
                {terminationSent ? '✓ Termination Notice Sent' : 'Send Termination Notice'}
              </button>
              <button
                onClick={() => setLegalEngaged((v) => !v)}
                style={{ background: legalEngaged ? 'rgba(42,157,106,0.08)' : 'rgba(74,111,165,0.06)', border: `1px solid ${legalEngaged ? C.green : C.blue}`, borderRadius: 999, color: legalEngaged ? C.green : C.blue, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, padding: '8px 16px' }}>
                {legalEngaged ? '✓ Legal Counsel Engaged' : 'Engage Legal Counsel'}
              </button>
              <button
                onClick={() => setDamagesInitiated((v) => !v)}
                style={{ background: damagesInitiated ? 'rgba(42,157,106,0.08)' : 'rgba(204,164,59,0.08)', border: `1px solid ${damagesInitiated ? C.green : C.gold}`, borderRadius: 999, color: damagesInitiated ? C.green : C.gold, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, padding: '8px 16px' }}>
                {damagesInitiated ? '✓ Damages Assessment Initiated' : 'Calculate Total Damages'}
              </button>
            </div>
          </div>

          {/* Card 2 — BREACH CURED */}
          <div style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${C.blue}`, borderRadius: 8, padding: 22, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ background: 'rgba(74,111,165,0.08)', color: C.blue, border: '1px solid rgba(74,111,165,0.2)', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>CURED</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: C.charcoal }}>Progress Reporting (Article 2.5)</span>
            </div>

            <p style={{ margin: '0 0 14px', fontSize: 13, color: C.textSecondary, lineHeight: 1.65 }}>
              The Contractor failed to submit the bi-weekly progress report due June 13, 2025. A breach notice was issued on June 16, 2025. The Contractor submitted the overdue report and resumed reporting within the 15 business day cure period.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: C.bgSecondary, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '14px 16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: C.green, textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Financial Impact</p>
                <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>No direct financial loss. The 2-week reporting gap created a temporary blind spot in project oversight.</p>
              </div>
              <div style={{ background: C.bgSecondary, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '14px 16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: C.blue, textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Legal Risk</p>
                <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>Breach was cured within the Article 3.1 cure period. No ongoing liability. However, repeated failures could indicate broader performance issues as in <em>Hamilton v Open Window Bakery Ltd</em> (2004 SCC 9).</p>
              </div>
            </div>

            <div style={{ background: 'rgba(204,164,59,0.06)', border: '1px solid rgba(204,164,59,0.18)', borderRadius: 8, padding: '12px 16px', marginTop: 12 }}>
              <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Lessons Learned</p>
              <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>AccordAlert first flagged a late report on April 25 (3 days late) — 7 weeks before the June breach. Earlier intervention and stricter automated follow-ups at the first warning could have prevented the June missed report entirely.</p>
            </div>
          </div>

          {/* Prevention insights */}
          <div style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: 22, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.charcoal }}>How AccordAlert Prevented Escalation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '⚑', color: C.gold, title: 'Early Warning Detection', desc: 'AccordAlert flagged the late April 25 progress report 7 weeks before the June breach. Earlier intervention could have prevented the breach entirely.' },
                { icon: '◷', color: C.blue, title: 'Cure Period Management', desc: 'Automated breach notice generation and cure period tracking ensured the June reporting breach was resolved within the legal timeframe under Article 3.1.' },
                { icon: '◈', color: C.gold, title: 'Financial Exposure Tracking', desc: 'Real-time monitoring of the completion deadline allowed Definitely-Not-Evil-Corp to withhold the $75,000 final payment and prepare legal strategy before the cure period expired.' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.bgTertiary, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '14px 16px' }}>
                  <div style={{ width: 32, height: 32, background: 'rgba(204,164,59,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: C.gold, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: C.charcoal }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal framework footer */}
          <div style={{ background: 'rgba(204,164,59,0.06)', border: '1px solid rgba(204,164,59,0.18)', borderRadius: 8, padding: '22px 24px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: C.gold }}>Compliance Framework Reference</h3>
            <p style={{ margin: 0, fontSize: 13, color: C.textSecondary, lineHeight: 1.75 }}>
              This report is prepared for the management of Definitely-Not-Evil-Corp Inc. Under <em>Hadley v Baxendale</em> (1854), damages for breach of contract are limited to losses reasonably foreseeable at the time of contracting. Under <em>Hamilton v Open Window Bakery Ltd</em> (2004 SCC 9), premature cessation of contractual performance gives rise to breach liability. AccordAlert helps businesses monitor obligations, enforce cure periods, and document compliance to minimize legal risk and protect against preventable breaches.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
