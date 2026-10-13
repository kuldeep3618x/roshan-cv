import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

const L0 = [
  ['ARC-Tower-A', 'Loaded', 3, null],
  ['STR-Tower-A', 'Loaded', 2, null],
  ['MEP-Tower-A', 'Loaded', 4, null],
  ['MEP-Plant-Nested', 'Loaded', 1, 'MEP-Tower-A'],
  ['FAC-Tower-A', 'Unloaded', 2, null],
  ['LND-Site', 'Loaded', 1, null],
  ['Survey-Old', 'Not found', 1, null],
].map(([name, status, inst, parent], id) => ({ id, name, status, inst, parent, on: false, forMe: false }));
const PICKED = ['MEP-Tower-A', 'FAC-Tower-A'];
const CLS = { Loaded: 'ok', Unloaded: 'at', 'Not found': 'fl', 'Unloaded for me': 'in' };

export default function LinkLoader() {
  const [links, setLinks] = useState(L0);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [note, setNote] = useState('');
  const [toast, show] = useToast();

  const vis = links.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()) && (status === 'All' || l.status === status));
  const ordered = [...vis].sort((a, b) => (a.parent || a.name).localeCompare(b.parent || b.name) || (a.parent ? 1 : -1));
  const tgl = (id) => setLinks((ls) => ls.map((l) => (l.id === id && !l.parent ? { ...l, on: !l.on } : l)));

  const run = (load) => {
    const t = vis.filter((l) => l.on && !l.parent);
    if (!t.length) return show('Tick one or more links first');
    let changed = 0, skipped = 0, failed = 0;
    setLinks((ls) => ls.map((l) => {
      if (!t.some((x) => x.id === l.id)) return l;
      if (l.status === 'Not found') { failed += 1; return l; }
      const already = load ? l.status === 'Loaded' : l.status !== 'Loaded';
      if (already) { skipped += 1; return l; }
      changed += 1;
      return { ...l, status: load ? 'Loaded' : l.forMe ? 'Unloaded for me' : 'Unloaded' };
    }));
    setTimeout(() => {}, 0);
    const msg = `${load ? 'Load' : 'Unload'} done: ${t.length - skipped - (t.filter((x) => x.status === 'Not found').length)} changed, ${skipped} skipped, ${t.filter((x) => x.status === 'Not found').length} failed (file not found)`;
    setNote(msg);
    show(msg);
  };

  return (
    <>
      <Info
        n="18" eyebrow="Revit add-in tool"
        title={<>Link <em>Loader</em></>}
        desc="Load or unload many Revit links in one step, picked by name and status or by your current Revit selection."
        bullets={['Tree of links with status and instances', 'Filter by name and status, or tick the Revit selection', 'Unload for me on workshared models']}
        chips={['C#', 'Revit API', 'WPF']}
        hint="tick two links, then Unload Checked"
      />
      <DesktopWin title="Link Loader" sub="Revit Tools" pin={false} toast={toast}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="tx" style={{ width: 180 }} placeholder="Name contains…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="seg" style={{ margin: 0 }}>{['All', 'Loaded', 'Unloaded', 'Not found'].map((s) => <span key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>{s}</span>)}</div>
          <span style={{ flex: 1 }} />
          <button className="btn" onClick={() => { setQ(''); setStatus('All'); }}>Clear Filter</button>
          <button className="btn" onClick={() => { setQ(''); setStatus('All'); setLinks((ls) => ls.map((l) => ({ ...l, on: PICKED.includes(l.name) }))); show('Ticked the links selected in Revit'); }}>Tick Revit Selection</button>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4>Revit links · {vis.length} shown · {links.filter((l) => l.on).length} ticked</h4>
          <table>
            <thead><tr><th style={{ width: 24 }} /><th>Link</th><th>Status</th><th>Instances</th><th>Unload for me</th></tr></thead>
            <tbody>
              {ordered.map((l, i) => (
                <tr key={l.id} className={'r' + (l.on ? ' sel' : '')} style={{ '--i': i }} onClick={() => tgl(l.id)}>
                  <td>{l.parent ? '' : <span className={'cb' + (l.on ? '' : ' o')} />}</td>
                  <td style={{ paddingLeft: l.parent ? 26 : 9 }}>{l.parent ? '↳ ' : ''}{l.name}</td>
                  <td><span className={'p ' + CLS[l.status]}>{l.status}</span></td><td>{l.inst}</td>
                  <td>{l.parent ? '—' : <span className={'cb' + (l.forMe ? '' : ' o')} onClick={(e) => { e.stopPropagation(); setLinks((ls) => ls.map((x) => (x.id === l.id ? { ...x, forMe: !x.forMe } : x))); }} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', flex: 1 }}>{note || 'Nested links follow their parent. Load and unload are not part of undo.'}</span>
          <button className="btn" onClick={() => setLinks((ls) => ls.map((l) => ({ ...l, on: !l.parent && vis.some((v) => v.id === l.id) })))}>Check All</button>
          <button className="btn" onClick={() => run(false)}>Unload Checked</button>
          <button className="btn gold pulse" onClick={() => run(true)}>Load Checked</button>
        </div>
      </DesktopWin>
    </>
  );
}
