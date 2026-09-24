import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

// A glimpse of the APS Command Center I am building: one web app that hosts delivery dashboards and the add-in control board.
// All figures below are invented sample data.

const NAV = ['Executive', 'Model sharing', 'Issues', 'Add-in board'];

const KPIS = [
  { label: 'Overall progress', value: 74, suffix: '%', delta: '+6.2%', tone: 'good' },
  { label: 'Open issues', value: 184, suffix: '', delta: '-21', tone: 'good' },
  { label: 'Submission compliance', value: 94.6, suffix: '%', delta: '+2.4%', tone: 'good', dec: 1 },
  { label: 'BIM health', value: 88, suffix: '%', delta: '+1.1%', tone: 'good' },
];

const PROJECTS = [
  { name: 'Tower A', owner: 'Design management', status: 'On track', pct: 74, risk: 18 },
  { name: 'MEP coordination', owner: 'Coordination lead', status: 'Watchlist', pct: 61, risk: 41 },
  { name: 'Facade package', owner: 'QA / QC', status: 'At risk', pct: 49, risk: 68 },
  { name: 'Fit-out stage 2', owner: 'Construction', status: 'On track', pct: 81, risk: 22 },
];

const SHARING = [
  { name: 'Architectural', up: 18, req: 20 },
  { name: 'Structural', up: 15, req: 16 },
  { name: 'MEP', up: 14, req: 18 },
  { name: 'Facade', up: 9, req: 12 },
];

const ISSUES = [
  { d: 'Structural', open: 42, closed: 158, overdue: 11 },
  { d: 'MEP', open: 57, closed: 192, overdue: 19 },
  { d: 'Architectural', open: 31, closed: 126, overdue: 9 },
  { d: 'Facade', open: 23, closed: 74, overdue: 14 },
];

const ADDINS = [
  { name: 'Workset Assigner', host: 'Revit', ver: 'v2.4.1', adoption: 92, on: true },
  { name: 'Clash Tolerance', host: 'Navisworks', ver: 'v1.8.0', adoption: 81, on: true },
  { name: 'Clash Analyser', host: 'Navisworks', ver: 'v1.3.2', adoption: 67, on: true },
  { name: 'Sheet Publisher', host: 'Revit', ver: 'v0.9.0', adoption: 23, on: false },
];

const FEED = [
  'Model health check passed: Tower A (ARC)',
  'Add-in v2.4.1 rolled out to 3 offices',
  'MIDP check: 39 deliverables missing this week',
  'Clash Analyser opened in 14 sessions today',
  'New ACC issue batch synced (52 items)',
  'Fabric refresh completed in 4 min',
];

function useCount(target, dec = 0, key) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 900);
      const e = 1 - (1 - p) ** 3;
      setV(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, key]);
  return v.toFixed(dec);
}

function Kpi({ k, tab }) {
  const val = useCount(k.value, k.dec || 0, tab);
  return (
    <div className="cc__kpi">
      <span className="cc__kpiLabel">{k.label}</span>
      <strong>
        {val}
        {k.suffix}
      </strong>
      <span className={`cc__delta cc__delta--${k.tone}`}>{k.delta}</span>
    </div>
  );
}

function Executive({ tab }) {
  return (
    <>
      <div className="cc__kpis">
        {KPIS.map((k) => (
          <Kpi key={k.label} k={k} tab={tab} />
        ))}
      </div>
      <div className="cc__panel">
        <h4>Project status</h4>
        {PROJECTS.map((p) => (
          <div key={p.name} className="cc__row">
            <div>
              <strong>{p.name}</strong>
              <small>{p.owner}</small>
            </div>
            <span className={`cc__pill cc__pill--${p.status.replace(/\s/g, '').toLowerCase()}`}>{p.status}</span>
            <div className="cc__track">
              <i style={{ width: `${p.pct}%` }} />
            </div>
            <span className="cc__num">{p.pct}%</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Sharing() {
  return (
    <div className="cc__panel">
      <h4>Model sharing, this week</h4>
      {SHARING.map((m) => {
        const pct = Math.round((m.up / m.req) * 100);
        return (
          <div key={m.name} className="cc__row">
            <div>
              <strong>{m.name}</strong>
              <small>
                {m.up} of {m.req} models uploaded
              </small>
            </div>
            <div className="cc__track cc__track--wide">
              <i className={pct < 80 ? 'is-warn' : ''} style={{ width: `${pct}%` }} />
            </div>
            <span className="cc__num">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function Issues() {
  const max = Math.max(...ISSUES.map((i) => i.open + i.closed));
  return (
    <div className="cc__panel">
      <h4>Issues by discipline</h4>
      {ISSUES.map((i) => (
        <div key={i.d} className="cc__row">
          <strong>{i.d}</strong>
          <div className="cc__stack cc__track--wide" title={`${i.open} open, ${i.closed} closed, ${i.overdue} overdue`}>
            <i className="is-closed" style={{ width: `${(i.closed / max) * 100}%` }} />
            <i className="is-open" style={{ width: `${(i.open / max) * 100}%` }} />
          </div>
          <span className="cc__num">{i.overdue} overdue</span>
        </div>
      ))}
      <p className="cc__legend">
        <span className="cc__dot cc__dot--closed" /> Closed <span className="cc__dot cc__dot--open" /> Open
      </p>
    </div>
  );
}

function AddinBoard() {
  const [items, setItems] = useState(ADDINS);
  return (
    <div className="cc__panel">
      <h4>Add-in control board</h4>
      <p className="cc__hint">Try the kill switch: it disables an add-in for everyone.</p>
      {items.map((a, i) => (
        <div key={a.name} className="cc__row">
          <div>
            <strong>{a.name}</strong>
            <small>
              {a.host} · {a.ver}
            </small>
          </div>
          <div className="cc__track">
            <i style={{ width: `${a.on ? a.adoption : 0}%` }} />
          </div>
          <span className="cc__num">{a.on ? `${a.adoption}%` : 'off'}</span>
          <button
            type="button"
            className={`cc__switch ${a.on ? 'is-on' : ''}`}
            aria-pressed={a.on}
            aria-label={`${a.on ? 'Disable' : 'Enable'} ${a.name}`}
            onClick={() => setItems((s) => s.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))}
          >
            <span />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function CommandCenter() {
  const [tab, setTab] = useState(0);
  const [feed, setFeed] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setFeed((f) => (f + 1) % FEED.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section section--alt" id="command-center">
      <div className="container">
        <SectionHead kicker="In development" title="A glimpse of the APS Command Center" />
        <p className="muted tools__intro">
          One web app on Autodesk Platform Services that brings delivery dashboards and the add-in control board into a
          single place. Click through the tabs; everything here is sample data.
        </p>
        <Reveal>
          <div className="cc" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
            <aside className="cc__side">
              <div className="cc__brand">
                <span className="cc__mark">CC</span>
                <div>
                  <strong>APS Command Center</strong>
                  <small>Digital delivery</small>
                </div>
              </div>
              <nav aria-label="Command Center sections">
                {NAV.map((n, i) => (
                  <button key={n} type="button" className={`cc__nav ${i === tab ? 'is-active' : ''}`} onClick={() => setTab(i)}>
                    {n}
                  </button>
                ))}
              </nav>
              <div className="cc__live">
                <span className="cc__pulse" />
                <span key={feed} className="cc__feed">
                  {FEED[feed]}
                </span>
              </div>
            </aside>
            <div className="cc__main">
              <header className="cc__top">
                <div>
                  <p className="eyebrow">Autodesk Platform Services</p>
                  <h3>{NAV[tab]}</h3>
                </div>
                <span className="cc__tag">Sample data</span>
              </header>
              <div className="cc__body" key={tab}>
                {tab === 0 && <Executive tab={tab} />}
                {tab === 1 && <Sharing />}
                {tab === 2 && <Issues />}
                {tab === 3 && <AddinBoard />}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
