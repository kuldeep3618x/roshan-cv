import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

const W0 = [
  ['Duplicate', 'Medium', 'Rooms share Number 101', 'Resolve Duplicates'],
  ['Duplicate', 'Low', 'Doors share Mark D-014', 'Resolve Duplicates'],
  ['Duplicate', 'Low', 'Windows share Type Mark W-02', 'Resolve Duplicates'],
  ['Join', 'Medium', 'Highlighted walls are joined but do not intersect', 'Resolve Joins'],
  ['Join', 'High', 'Column and beam join could not be resolved', 'Resolve Joins'],
  ['Overlap', 'High', 'Highlighted walls overlap', 'Resolve Overlaps'],
  ['Overlap', 'Medium', 'Room separation line overlaps a wall', 'Resolve Overlaps'],
  ['Sketch', 'Low', 'Line in sketch is slightly off axis', 'Repair Sketches'],
  ['Sketch', 'Medium', 'Sketch loop is open', 'Manual Review'],
  ['Room', 'Medium', 'Room is not in a properly enclosed region', 'Manual Review'],
].map(([kind, sev, text, fix], id) => ({ id, kind, sev, text, fix, fixed: false, on: false }));
const KINDS = ['Duplicate', 'Join', 'Overlap', 'Sketch', 'Room'];
const BUTTONS = ['Resolve Duplicates', 'Resolve Joins', 'Resolve Overlaps', 'Repair Sketches'];
const SEV = { Low: 'in', Medium: 'at', High: 'fl' };

export default function WarningRemover() {
  const [rows, setRows] = useState(W0);
  const [chips, setChips] = useState([]);
  const [q, setQ] = useState('');
  const [plan, setPlan] = useState(null);
  const [toast, show] = useToast();

  const vis = rows.filter((r) => (!chips.length || chips.includes(r.kind)) && (r.text + r.kind + r.fix).toLowerCase().includes(q.toLowerCase()));
  const ticked = rows.filter((r) => r.on && !r.fixed);
  const tgl = (id) => setRows((rs) => rs.map((r) => (r.id === id && !r.fixed ? { ...r, on: !r.on } : r)));

  const resolve = (btn) => {
    const t = ticked.filter((r) => r.fix === btn);
    if (!t.length) return show(`Tick ${btn.replace('Resolve ', '').replace('Repair ', '').toLowerCase()} warnings first`);
    setRows((rs) => rs.map((r) => (t.some((x) => x.id === r.id) ? { ...r, fixed: true, on: false } : r)));
    setPlan(null);
    show(`${t.length} warning${t.length > 1 ? 's' : ''} fixed · one undo step · nothing deleted`);
  };
  const preview = () => {
    if (!ticked.length) return show('Tick the warnings you want to preview');
    setPlan(ticked.map((r) => (r.fix === 'Manual Review' ? `${r.text}: left for manual review` : `${r.text}: ${r.fix.toLowerCase()} on the ticked elements`)));
  };

  return (
    <>
      <Info
        n="17" eyebrow="Revit add-in tool"
        title={<>Warning <em>Remover</em></>}
        desc="Collect the model's Revit warnings, group them and fix the ones that can be fixed safely, always on the rows you ticked."
        bullets={['Filter chips and search, then tick rows', 'Plain-language preview before any change', 'Never deletes, never ungroups, one undo step']}
        chips={['C#', 'Revit API', 'WPF', 'CSV / Excel / JSON']}
        hint="tick duplicates, Preview Change, then Resolve Duplicates"
      />
      <DesktopWin title="Warning Remover" sub="Revit Tools" pin={false} toast={toast}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="tile" style={{ '--c': '#38bdf8' }}><small>All</small><b style={{ fontSize: 22 }}>{rows.length}</b></div>
          <div className="tile" style={{ '--c': '#fb7185' }}><small>High severity</small><b style={{ fontSize: 22 }}>{rows.filter((r) => r.sev === 'High' && !r.fixed).length}</b></div>
          <div className="tile" style={{ '--c': '#34d399' }}><small>Fixed</small><b style={{ fontSize: 22 }}>{rows.filter((r) => r.fixed).length}</b></div>
          <div className="tile" style={{ '--c': '#fbbf24' }}><small>Manual review</small><b style={{ fontSize: 22 }}>{rows.filter((r) => r.fix === 'Manual Review' && !r.fixed).length}</b></div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {KINDS.map((k) => <span key={k} className={'chipbtn' + (chips.includes(k) ? ' on' : '')} onClick={() => setChips((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]))}>{k}</span>)}
          <input className="tx" style={{ marginLeft: 'auto', width: 170 }} placeholder="Search warnings…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4>Warnings · {vis.length} shown · {ticked.length} ticked</h4>
          <div style={{ overflow: 'auto', maxHeight: 190 }}>
            <table>
              <thead><tr><th style={{ width: 24 }} /><th>Warning</th><th>Severity</th><th>Fix by</th></tr></thead>
              <tbody>
                {vis.map((r, i) => (
                  <tr key={r.id} className={'r' + (r.on ? ' sel' : '') + (r.fixed ? ' dim' : '')} style={{ '--i': i }} onClick={() => tgl(r.id)}>
                    <td><span className={'cb' + (r.on ? '' : ' o')} /></td>
                    <td>{r.fixed ? '✓ ' : ''}{r.text}</td><td><span className={'p ' + SEV[r.sev]}>{r.sev}</span></td><td>{r.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {plan && (
          <div className="card" style={{ borderColor: 'var(--gold)' }}>
            <h4>Preview Change · plan for ticked rows</h4>
            {plan.map((p) => <div key={p} style={{ fontSize: 11.5, padding: '2px 0' }}>• {p}</div>)}
          </div>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setRows((rs) => rs.map((r) => (vis.some((v) => v.id === r.id) && !r.fixed ? { ...r, on: true } : r)))}>Select All</button>
          <button className="btn" onClick={() => setRows((rs) => rs.map((r) => ({ ...r, on: false })))}>Clear</button>
          <button className="btn" onClick={preview}>Preview Change</button>
          <span style={{ flex: 1 }} />
          {BUTTONS.map((b, i) => <button key={b} className={'btn' + (i === 0 ? ' gold' : '')} onClick={() => resolve(b)}>{b}</button>)}
        </div>
      </DesktopWin>
    </>
  );
}
