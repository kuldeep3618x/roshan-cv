import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

const INIT = [
  ['ARC vs STR / Level 01–05', 'Hard', 0, 214, true],
  ['ARC vs MEP / Ceiling voids', 'Hard', 0, 388, true],
  ['MEP vs STR / Risers', 'Hard', 5, 96, true],
  ['Fire stopping / Penetrations', 'Hard', 0, 41, false],
  ['Ducts vs Pipes / Plant room', 'Clearance', 25, 152, true],
  ['Facade vs STR / Podium', 'Hard', 0, 67, true],
  ['Lift core vs MEP', 'Clearance', 15, 33, false],
  ['Landscape vs Utilities', 'Hard', 0, 18, false],
].map(([name, type, cur, res, sel], id) => ({ id, name, type, cur, res, sel }));

export default function ClashTolerance() {
  const [tests, setTests] = useState(INIT);
  const [q, setQ] = useState('');
  const [tol, setTol] = useState('10');
  const [flash, setFlash] = useState([]);
  const [note, setNote] = useState('');
  const [toast, show] = useToast();

  const visible = tests.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));
  const nSel = tests.filter((t) => t.sel).length;
  const toggle = (id) => setTests((ts) => ts.map((t) => (t.id === id ? { ...t, sel: !t.sel } : t)));

  const apply = () => {
    const v = parseFloat(tol);
    const chosen = tests.filter((t) => t.sel);
    if (!chosen.length || Number.isNaN(v) || v < 0) {
      show('Select at least one test and enter a valid tolerance (mm)');
      return;
    }
    setTests((ts) => ts.map((t) => (t.sel ? { ...t, cur: v } : t)));
    setFlash(chosen.map((t) => t.id));
    setTimeout(() => setFlash([]), 1100);
    setNote(`${chosen.length} of ${tests.length} tests updated · Ctrl+Z to undo`);
    show(`${chosen.length} tests set to ${v} mm in one undoable step`);
  };

  return (
    <>
      <Info
        n="01" eyebrow="Navisworks add-in"
        title={<>Bulk clash <em>tolerance</em>, in one click</>}
        desc="Set or adjust the tolerance on every Clash Detective test from a single window, instead of opening each test's Rules tab one by one."
        bullets={['Filter, multi-select and apply a tolerance to many tests', 'All changes commit as one undoable transaction', 'Non-modal window: keep orbiting the model']}
        chips={['C#', '.NET 4.8', 'Navisworks API', 'WPF']}
        hint="tick tests, change the tolerance, hit Apply"
      />
      <DesktopWin title="Clash Tolerance" sub="Navisworks Tools" toast={toast}>
        <div className="card" style={{ flex: 1 }}>
          <h4>Clash tests — select one or more to apply a tolerance</h4>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 9 }}>
            <input className="tx" style={{ width: 250 }} placeholder="Filter by name…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn" onClick={() => setTests((ts) => ts.map((t) => (t.name.toLowerCase().includes(q.toLowerCase()) ? { ...t, sel: true } : t)))}>Select All</button>
            <button className="btn" onClick={() => setTests((ts) => ts.map((t) => ({ ...t, sel: false })))}>Clear</button>
          </div>
          <table>
            <thead><tr><th style={{ width: 30 }} /><th>Clash test</th><th>Type</th><th>Current (mm)</th><th>Results</th></tr></thead>
            <tbody>
              {visible.map((t, i) => (
                <tr key={t.id} className={'r' + (t.sel ? ' sel' : '') + (flash.includes(t.id) ? ' flash' : '')} style={{ '--i': i }} onClick={() => toggle(t.id)}>
                  <td><span className={'cb' + (t.sel ? '' : ' o')} /></td>
                  <td>{t.name}</td><td>{t.type}</td><td>{t.cur}</td><td>{t.res}</td>
                </tr>
              ))}
              {!visible.length && <tr><td colSpan={5} style={{ color: 'var(--muted)' }}>No clash tests match “{q}”</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Tolerance (mm)</span>
          <input className="tx" style={{ width: 90 }} value={tol} onChange={(e) => setTol(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} />
          <span style={{ flex: 1 }} />
          <button className="btn" onClick={() => { setTests((ts) => ts.map((t) => ({ ...t, cur: INIT[t.id].cur }))); setNote(''); show('Refreshed from the open model'); }}>Refresh</button>
          <button className="btn gold pulse" style={{ padding: '9px 20px', fontSize: 12.5 }} onClick={apply}>Apply Tolerance</button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{note || `${nSel} of ${tests.length} tests selected · Ready`}</div>
      </DesktopWin>
    </>
  );
}
