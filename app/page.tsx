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
  // New palette (palette.scss)
  indigo: '#27187e',       // indigo-ink — sidebar bg, dark surfaces
  blue: '#758bfd',         // cornflower-blue — primary accent
  periwinkle: '#aeb8fe',   // periwinkle — muted sidebar text
  platinum: '#f1f2f6',     // platinum — light page bg
  orange: '#ff8600',       // princeton-orange — warnings, highlights

  // Legacy neutrals kept for body content
  charcoal: '#363636',
  lightGray: '#E5E5E5',
  white: '#FFFFFF',
  bgSecondary: '#f1f2f6',  // now maps to platinum
  bgTertiary: '#F8F8FB',
  textPrimary: '#1a1a2e',
  textSecondary: '#555570',
  textTertiary: '#8888aa',

  // Sidebar (uses indigo palette)
  sidebarText: 'rgba(255,255,255,0.92)',
  sidebarMuted: 'rgba(174,184,254,0.6)',
  sidebarDim: 'rgba(174,184,254,0.35)',
  sidebarBorder: 'rgba(117,139,253,0.15)',

  // Status
  green: '#1d8a5e',
  red: '#C94040',
};

// ─── Event & Status Colors ────────────────────────────────────────────────────

const EVENT_COLORS: Record<EventStatus, { border: string; iconBg: string; iconColor: string; cardBg: string }> = {
  success: { border: '#1d8a5e', iconBg: 'rgba(29,138,94,0.1)',    iconColor: '#1d8a5e', cardBg: 'transparent' },
  warning: { border: '#ff8600', iconBg: 'rgba(255,134,0,0.1)',    iconColor: '#ff8600', cardBg: 'rgba(255,134,0,0.03)' },
  danger:  { border: '#C94040', iconBg: 'rgba(201,64,64,0.1)',    iconColor: '#C94040', cardBg: 'rgba(201,64,64,0.03)' },
  info:    { border: '#758bfd', iconBg: 'rgba(117,139,253,0.1)',  iconColor: '#758bfd', cardBg: 'rgba(117,139,253,0.03)' },
  accent:  { border: '#758bfd', iconBg: 'rgba(117,139,253,0.12)', iconColor: '#758bfd', cardBg: 'rgba(117,139,253,0.04)' },
};

const ICON_TEXT: Record<string, string> = {
  check: "✓", alert: "⚠", breach: "✕", notice: "⚑", clock: "◷", report: "◈",
};

const FINAL_STATUS: Record<FinalStatus, { label: string; color: string; bg: string; rowBg: string }> = {
  fulfilled: { label: 'Fulfilled', color: '#1d8a5e', bg: 'rgba(29,138,94,0.1)',   rowBg: 'transparent' },
  breached:  { label: 'Breached',  color: '#C94040', bg: 'rgba(201,64,64,0.18)',   rowBg: 'rgba(201,64,64,0.07)' },
  cured:     { label: 'Cured',     color: '#4f6ef7', bg: 'rgba(79,110,247,0.18)',  rowBg: 'rgba(79,110,247,0.07)' },
};

// ─── Button Style Helpers ─────────────────────────────────────────────────────

const btnPrimary: React.CSSProperties = {
  background: '#27187e',
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
  background: '#758bfd',
  color: '#ffffff',
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
  color: '#27187e',
  border: '1px solid #aeb8fe',
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
  border: '1px solid rgba(174,184,254,0.25)',
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
      background: '#27187e',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto',
      padding: '28px 0',
    }}>
      {/* Brand */}
      <div style={{ padding: '0 28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 16, color: '#aeb8fe' }}>◈</span>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>AccordAlert</span>
        </div>
        <span style={{ fontSize: 11, color: 'rgba(174,184,254,0.5)', letterSpacing: 0.3 }}>Definitely-Not-Evil-Corp Inc.</span>
      </div>
      <div style={{ borderTop: '1px solid rgba(117,139,253,0.2)', paddingTop: 24 }}>
        {children}
      </div>
    </aside>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10.5, fontWeight: 600, color: 'rgba(174,184,254,0.45)', textTransform: 'uppercase' as const, letterSpacing: 1.5, padding: '0 28px', marginBottom: 8 }}>{title}</p>
      {children}
    </div>
  );
}

function NavItem({ label, active, badge, onClick }: { label: string; active?: boolean; badge?: number; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}>
      {active && (
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#aeb8fe', borderRadius: '0 2px 2px 0' }} />
      )}
      <div style={{ padding: '9px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: active ? 'white' : 'rgba(174,184,254,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>
        {badge !== undefined && (
          <span style={{ background: 'rgba(117,139,253,0.25)', color: '#aeb8fe', fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 999, border: '1px solid rgba(117,139,253,0.4)' }}>{badge}</span>
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
  // Show the "click me" nudge on obl-1 until user has clicked anything
  const showNudge = selectedId === null;

  const h = (id: string, type: OblType, text: React.ReactNode) => {
    const sel = selectedId === id;
    const isNudge = showNudge && id === 'obl-1';
    const bg = type === "ours"
      ? (sel ? 'rgba(255,134,0,0.28)' : 'rgba(255,134,0,0.13)')
      : (sel ? 'rgba(117,139,253,0.22)' : 'rgba(117,139,253,0.1)');
    const borderColor = type === "ours" ? '#ff8600' : '#758bfd';
    const borderStyle = type === "ours" ? '2px solid #ff8600' : '2px dashed #758bfd';
    return (
      <span style={{ position: 'relative', display: 'inline' }}>
        {isNudge && (
          <span style={{
            position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
            background: '#27187e', color: '#fff', fontSize: 11, fontWeight: 600,
            padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap' as const,
            fontFamily: 'Inter, sans-serif', pointerEvents: 'none', zIndex: 10,
            boxShadow: '0 2px 8px rgba(39,24,126,0.35)',
          }}>
            👆 click me
            {/* Tail */}
            <span style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #27187e' }} />
          </span>
        )}
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
          <span style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(255,134,0,0.2)', border: '2px solid #ff8600', display: 'inline-block' }} />
          Our Obligations (Client)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#444' }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(117,139,253,0.15)', border: '2px dashed #758bfd', display: 'inline-block' }} />
          Monitored Obligations (Contractor)
        </div>
      </div>

      <h1 style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px', fontFamily: "'Merriweather', serif" }}>
        Service Agreement
      </h1>
      <p style={{ textAlign: 'center', fontSize: 12.5, color: '#444', margin: '0 0 14px', fontFamily: "'Merriweather', serif", fontStyle: 'italic' }}>
        For Office Renovation and Construction Services
      </p>
      <div style={{ textAlign: 'center', margin: '0 0 20px', padding: '10px 0', borderTop: '1px solid #D8D4CC', borderBottom: '1px solid #D8D4CC' }}>
        <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Agreement No.', 'DNEC-2025-0041'],
              ['Effective Date', 'January 15, 2025'],
              ['Project', '100 Bay Street Office Renovation'],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ fontSize: 10.5, color: '#888', fontFamily: 'Inter, sans-serif', paddingRight: 16, paddingBottom: 3, fontWeight: 500, letterSpacing: 0.2 }}>{label}:</td>
                <td style={{ fontSize: 10.5, color: '#444', fontFamily: 'Inter, sans-serif', paddingBottom: 3 }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

  const [activeSection, setActiveSection] = useState<string>('score');

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
    setActiveSection('score');
  }, [screen]);

  // Scroll-spy: update active nav section as the report scrolls
  useEffect(() => {
    if (screen !== 'report') return;
    let observer: IntersectionObserver | null = null;
    const timer = setTimeout(() => {
      const container = reportScrollRef.current;
      if (!container) return;
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length > 0) {
            setActiveSection(visible[0].target.id.replace('section-', ''));
          }
        },
        { root: container, rootMargin: '-5% 0px -55% 0px', threshold: 0 }
      );
      ['score', 'breakdown', 'breach', 'prevention', 'legal'].forEach((id) => {
        const el = document.getElementById(`section-${id}`);
        if (el) observer!.observe(el);
      });
    }, 150);
    return () => { clearTimeout(timer); observer?.disconnect(); };
  }, [screen]);

  const scrollToSection = (id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
    // Placeholder lines with obligation-hint borders for the preview card
    const previewLines = [
      { opacity: 0.95, width: '100%', border: 'none',   color: 'orange' as const },
      { opacity: 0.80, width:  '88%', border: 'orange', color: 'orange' as const },
      { opacity: 0.70, width: '100%', border: 'none',   color: null },
      { opacity: 0.90, width:  '92%', border: 'blue',   color: 'blue' as const },
      { opacity: 0.65, width: '100%', border: 'blue',   color: 'blue' as const },
      { opacity: 0.75, width:  '80%', border: 'none',   color: null },
      { opacity: 0.60, width:  '95%', border: 'blue',   color: 'blue' as const },
    ];

    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#111827', fontFamily: 'Inter, sans-serif', position: 'relative' }}>

        {/* Graph paper grid */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'repeating-linear-gradient(rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 48px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Soft purple blob behind headline */}
        <div style={{
          position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)',
          width: 820, height: 560,
          background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.06) 0%, transparent 68%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Header */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid #E5E7EB', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 18, color: '#6C63FF' }}>◈</span>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 19, fontWeight: 800, color: '#111827', letterSpacing: -0.5 }}>AccordAlert</span>
          </div>
          <span style={{ fontSize: 12, color: '#9CA3AF', letterSpacing: 0.2 }}>Definitely-Not-Evil-Corp Inc.</span>
        </div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 860, margin: '0 auto', padding: '72px 40px 88px', textAlign: 'center' }}>

          {/* Badges */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999, background: '#EEF2FF', border: '1px solid #C7D2FE', fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: '#6C63FF' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#6C63FF', display: 'inline-block' }} />
              Contract Intelligence Engine
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999, background: '#F0FDF4', border: '1px solid #BBF7D0', fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: '#16A34A' }}>
              <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              Active
            </div>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(36px, 5.5vw, 60px)', fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.06, marginBottom: 22, color: '#111827' }}>
            Monitor Contracts.<br />Prevent Breaches.
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 520, margin: '0 auto 52px', lineHeight: 1.65, letterSpacing: -0.1 }}>
            Upload a contract to automatically extract obligations, track deadlines, and detect compliance risks before they become costly legal disputes.
          </p>

          {/* Contract preview card — with hover tilt + obligation hints */}
          <div className="landing-doc-card" style={{ maxWidth: 460, margin: '0 auto 36px', background: '#F8F7F3', border: '1px solid #D1D5DB', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '28px 32px', color: '#1C1C1C', textAlign: 'left' }}>
            <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 3.5, textTransform: 'uppercase' as const, margin: '0 0 14px', fontFamily: 'Merriweather, serif', color: '#2a2a2a' }}>Service Agreement</p>
            <div style={{ borderTop: '1px solid #D8D4CC', paddingTop: 14, fontFamily: 'Merriweather, serif' }}>
              <p style={{ fontSize: 10.5, color: '#555', margin: '0 0 8px', lineHeight: 1.6 }}>This Service Agreement is entered into as of <strong>January 15, 2025</strong>, by and between:</p>
              <p style={{ fontSize: 10.5, color: '#555', margin: '0 0 14px', paddingLeft: 12, lineHeight: 1.6 }}>
                <strong>Party A:</strong> Definitely-Not-Evil-Corp Inc.<br />
                <strong>Party B:</strong> Maple Leaf Construction Ltd.
              </p>
              {/* Placeholder body lines with obligation-hint borders */}
              {previewLines.map((line, i) => (
                <div key={i} style={{
                  height: 7, borderRadius: 2, margin: '6px 0',
                  width: line.width, opacity: line.opacity,
                  background: line.border === 'orange' ? 'rgba(255,134,0,0.18)' : line.border === 'blue' ? 'rgba(117,139,253,0.15)' : '#E8E4DC',
                  borderLeft: line.border === 'orange' ? '3px solid rgba(255,134,0,0.55)' : line.border === 'blue' ? '3px solid rgba(117,139,253,0.5)' : '3px solid transparent',
                }} />
              ))}
              <div style={{ marginTop: 16, display: 'flex', gap: 36 }}>
                <div style={{ flex: 1 }}><div style={{ borderBottom: '1px solid #aaa', height: 18, marginBottom: 4 }} /><div style={{ height: 5, background: '#E0DCD4', borderRadius: 2 }} /></div>
                <div style={{ flex: 1 }}><div style={{ borderBottom: '1px solid #aaa', height: 18, marginBottom: 4 }} /><div style={{ height: 5, background: '#E0DCD4', borderRadius: 2 }} /></div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            className="landing-cta-btn"
            onClick={() => setScreen('analysis')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 999, padding: '14px 32px', fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 48 }}
          >
            Upload &amp; Analyze Contract
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>

          {/* Gradient divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.25), transparent)', margin: '0 auto 48px', maxWidth: 480 }} />

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, textAlign: 'left' }}>
            {[
              { title: 'Obligation Extraction', desc: 'AI identifies every deadline, deliverable, and duty from your contracts', icon: '◈', iconColor: '#6C63FF', iconBg: '#EEF2FF', accent: '#6C63FF' },
              { title: 'Breach Detection',      desc: 'Real-time monitoring flags missed deadlines before they escalate',          icon: '⚑', iconColor: '#D97706', iconBg: '#FFFBEB', accent: '#F59E0B' },
              { title: 'Compliance Reporting',  desc: 'Automated reports with legal risk assessment and recommended actions',      icon: '◧', iconColor: '#059669', iconBg: '#ECFDF5', accent: '#10B981' },
            ].map(f => (
              <div key={f.title} className="landing-feature-card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10, padding: '0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                {/* Top accent bar */}
                <div style={{ height: 3, background: f.accent }} />
                <div style={{ padding: '18px 18px 20px' }}>
                  <div style={{ width: 36, height: 36, background: f.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: f.iconColor, marginBottom: 14 }}>{f.icon}</div>
                  <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 13.5, color: '#111827', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{f.title}</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: '#6B7280', lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              </div>
            ))}
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
          </NavSection>
          <NavSection title="Analysis">
            <NavItem label="Our Obligations" badge={4} />
            <NavItem label="Contractor Obligations" badge={6} />
            <NavItem label="Risk Items" badge={2} />
          </NavSection>
          {/* Bottom info card */}
          <div style={{ padding: '0 20px', marginTop: 8 }}>
            <div style={{ background: 'rgba(117,139,253,0.12)', border: '1px solid rgba(117,139,253,0.25)', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#aeb8fe', fontWeight: 600 }}>10 obligations identified</p>
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
        <div style={{ width: 400, flexShrink: 0, background: C.bgSecondary, borderLeft: `1px solid ${C.lightGray}`, overflowY: 'auto' }}>
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
                  <div style={{ flex: 1, background: 'rgba(255,134,0,0.08)', border: '1px solid rgba(255,134,0,0.2)', borderRadius: 8, padding: '12px 14px' }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#ff8600' }}>4</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textSecondary }}>Our Obligations</p>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(117,139,253,0.07)', border: '1px solid rgba(117,139,253,0.18)', borderRadius: 8, padding: '12px 14px' }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#758bfd' }}>6</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textSecondary }}>Monitored Obligations</p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: 20 }}>
                {/* Card header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 8, width: 8, height: 8, borderRadius: '50%', background: selectedObl.type === 'ours' ? '#ff8600' : '#758bfd', display: 'inline-block', flexShrink: 0 }} />
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
                <div style={{ width: `${(visibleEvents / TIMELINE_EVENTS.length) * 100}%`, height: '100%', background: '#758bfd', borderRadius: 2, transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{visibleEvents} of {TIMELINE_EVENTS.length} events</span>
            </div>
          </NavSection>
          <NavSection title="Event Types">
            <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Success', color: C.green },
                { label: 'Warning', color: '#758bfd' },
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
          <NavItem label="Compliance Score"    active={activeSection === 'score'}      onClick={() => scrollToSection('score')} />
          <NavItem label="Obligation Breakdown" active={activeSection === 'breakdown'}  onClick={() => scrollToSection('breakdown')} />
          <NavItem label="Breach Analysis"     active={activeSection === 'breach'}     onClick={() => scrollToSection('breach')} />
          <NavItem label="Prevention Insights" active={activeSection === 'prevention'} onClick={() => scrollToSection('prevention')} />
          <NavItem label="Legal Reference"     active={activeSection === 'legal'}      onClick={() => scrollToSection('legal')} />
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
            <p style={{ margin: 0, fontSize: 12, color: C.textTertiary }}>Service Agreement — Definitely-Not-Evil-Corp Inc. | Sept 22, 2025</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setScreen('timeline')} style={btnSecondary}>← Back to Timeline</button>
            <button onClick={() => setScreen('landing')} style={btnGold}>⌂ New Analysis</button>
          </div>
        </div>

        {/* Report content */}
        <div ref={reportScrollRef} style={{ flex: 1, overflowY: 'auto', padding: 36 }}>

          {/* Score card */}
          <div id="section-score" style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
            <CircularProgress pct={80} />
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, color: C.textTertiary }}>Contract Compliance Report</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 2px', fontSize: 20, fontWeight: 600, color: C.charcoal }}>Service Agreement — Definitely-Not-Evil-Corp Inc.</h2>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: C.textTertiary }}>Counterparty: Maple Leaf Construction Ltd.</p>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: C.textSecondary }}>Report generated: September 22, 2025</p>
              <p style={{ margin: 0, fontSize: 14, color: '#758bfd', fontWeight: 500 }}>8 of 10 obligations fulfilled — 1 unresolved breach</p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Fulfilled',         value: 8,  color: C.green },
              { label: 'Breached',          value: 1,  color: C.red },
              { label: 'Cured',             value: 1,  color: C.blue },
              { label: 'Total Obligations', value: 10, color: '#758bfd' },
            ].map((s) => (
              <div key={s.label} style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderLeft: `4px solid ${s.color}`, borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: C.charcoal }}>{s.value}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textSecondary }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Obligation breakdown */}
          <div id="section-breakdown" style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
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
                        <span style={{ background: fs.bg, color: fs.color, border: `1px solid ${fs.color}55`, borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
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
          <div id="section-breach">
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
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#758bfd', textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Financial Impact</p>
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
                style={{ background: damagesInitiated ? 'rgba(42,157,106,0.08)' : 'rgba(117,139,253,0.08)', border: `1px solid ${damagesInitiated ? C.green : '#758bfd'}`, borderRadius: 999, color: damagesInitiated ? C.green : '#758bfd', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, padding: '8px 16px' }}>
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
              <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#758bfd', textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Lessons Learned</p>
              <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>AccordAlert first flagged a late report on April 25 (3 days late) — 7 weeks before the June breach. Earlier intervention and stricter automated follow-ups at the first warning could have prevented the June missed report entirely.</p>
            </div>
          </div>

          </div>{/* end section-breach */}

          {/* Prevention insights */}
          <div id="section-prevention" style={{ background: C.white, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: 22, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.charcoal }}>How AccordAlert Prevented Escalation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '⚑', color: '#758bfd', title: 'Early Warning Detection', desc: 'AccordAlert flagged the late April 25 progress report 7 weeks before the June breach. Earlier intervention could have prevented the breach entirely.' },
                { icon: '◷', color: C.blue, title: 'Cure Period Management', desc: 'Automated breach notice generation and cure period tracking ensured the June reporting breach was resolved within the legal timeframe under Article 3.1.' },
                { icon: '◈', color: '#758bfd', title: 'Financial Exposure Tracking', desc: 'Real-time monitoring of the completion deadline allowed Definitely-Not-Evil-Corp to withhold the $75,000 final payment and prepare legal strategy before the cure period expired.' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.bgTertiary, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '14px 16px' }}>
                  <div style={{ width: 32, height: 32, background: 'rgba(204,164,59,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#758bfd', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: C.charcoal }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal framework footer */}
          <div id="section-legal" style={{ background: 'rgba(117,139,253,0.06)', border: '1px solid rgba(117,139,253,0.18)', borderRadius: 8, padding: '22px 24px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: '#758bfd' }}>Compliance Framework Reference</h3>
            <p style={{ margin: 0, fontSize: 13, color: C.textSecondary, lineHeight: 1.75 }}>
              This report is prepared for the management of Definitely-Not-Evil-Corp Inc. Under <em>Hadley v Baxendale</em> (1854), damages for breach of contract are limited to losses reasonably foreseeable at the time of contracting. Under <em>Hamilton v Open Window Bakery Ltd</em> (2004 SCC 9), premature cessation of contractual performance gives rise to breach liability. AccordAlert helps businesses monitor obligations, enforce cure periods, and document compliance to minimize legal risk and protect against preventable breaches.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
