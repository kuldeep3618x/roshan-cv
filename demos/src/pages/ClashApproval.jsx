import { useEffect, useRef, useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

const STATUSES = ['New', 'Active', 'Reviewed', 'Approved', 'Resolved'];
const COL = { New: '#fb7185', Active: '#fbbf24', Reviewed: '#6ea8fe', Approved: '#34d399', Resolved: '#2dd4bf' };
const CLS = { New: 'fl', Active: 'at', Reviewed: 'in', Approved: 'ok', Resolved: 'ok' };

const INIT = [
  ['ARC vs STR / Level 01–05', 'Clash 014', 'New', 'Basic Wall: Ext 300', 'Beam: UB 457', 12, 'Walls', 'Basic Wall', 'Structural Framing', 'UB 457x191'],
  ['ARC vs STR / Level 01–05', 'Clash 015', 'Active', 'Floor: Conc. 250', 'Column: C400', 8, 'Floors', 'Floor', 'Structural Columns', 'C400x400'],
  ['MEP vs STR / Risers', 'Clash 031', 'New', 'Pipe: CHW 100', 'Slab: Core', 0, 'Pipes', 'Pipe Types', 'Floors', 'Slab 300'],
  ['MEP vs STR / Risers', 'Clash 032', 'Reviewed', 'Duct: Supply 600', 'Beam: UB 533', 22, 'Ducts', 'Rectangular Duct', 'Structural Framing', 'UB 533x210'],
  ['Ducts vs Pipes / Plant room', 'Clash 047', 'Active', 'Duct: Return 800', 'Pipe: HHW 150', 35, 'Ducts', 'Rectangular Duct', 'Pipes', 'Pipe Types'],
  ['Ducts vs Pipes / Plant room', 'Clash 048', 'Approved', 'Duct: Supply 500', 'Cable Tray 300', 40, 'Ducts', 'Rectangular Duct', 'Cable Tray', 'Ladder 300'],
  ['Facade vs STR / Podium', 'Clash 062', 'New', 'Curtain Wall: CW-02', 'Beam: UB 305', 6, 'Curtain Walls', 'Curtain Wall', 'Structural Framing', 'UB 305x165'],
  ['Facade vs STR / Podium', 'Clash 063', 'Resolved', 'Curtain Panel', 'Column: C500', 0, 'Curtain Panels', 'System Panel', 'Structural Columns', 'C500x500'],
].map(([test, result, status, i1, i2, dist, cat, fam, cat2, fam2], id) => ({ id, test, result, status, i1, i2, dist, cat, fam, cat2, fam2, by: status === 'Approved' ? 'Reviewer' : '', note: '' }));

export default function ClashApproval() {
  const [rows, setRows] = useState(INIT);
  const [st, setSt] = useState('All');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState([]);
  const [note, setNote] = useState('');
  const [assets, setAssets] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, show] = useToast();
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const vis = rows.filter((r) => (st === 'All' || r.status === st) && (r.test + r.result + r.i1 + r.i2).toLowerCase().includes(q.toLowerCase()));
  const count = (s) => rows.filter((r) => r.status === s).length;
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const setStatus = (status) => {
    if (!sel.length) return show('Select one or more clash results first');
    setRows((rs) => rs.map((r) => (sel.includes(r.id) ? { ...r, status, by: status === 'Approved' ? 'Reviewer' : r.by } : r)));
    show(`${sel.length} result${sel.length > 1 ? 's' : ''} marked ${status}`);
  };
  const addNote = () => {
    if (!sel.length || !note.trim()) return show('Select a result and type a comment');
    setRows((rs) => rs.map((r) => (sel.includes(r.id) ? { ...r, note: note.trim() } : r)));
    setNote('');
    show('Comment added to the selection');
  };
  const loadAssets = () => {
    if (loading) return;
    setLoading(true);
    timer.current = setTimeout(() => { setLoading(false); setAssets(true); show('Asset info loaded for both items of every result'); }, 1100);
  };

  return (
    <>
      <Info
        n="11" eyebrow="Navisworks add-in tool"
        title={<>Clash <em>Approval</em></>}
        desc="Review clash results across every test in one grid, filter to what matters and record approval decisions with comments."
        bullets={['A status summary and a filter on every column', 'Approve or resolve a selection with who and when', 'Opt-in asset info and CSV export / import']}
        chips={['C#', '.NET 4.8', 'WPF', 'Navisworks Clash API']}
        hint="click a status tile, select rows, Approve Selected, then Load Asset Info"
      />
      <DesktopWin title="Clash Approval" sub="Navisworks Tools" toast={toast}>
        <div style={{ display: 'flex', gap: 8 }}>
          {STATUSES.map((s) => (
            <div key={s} className={'tile click' + (st === s ? ' on' : '')} style={{ '--c': COL[s], padding: '7px 10px' }} onClick={() => setSt(st === s ? 'All' : s)}>
              <small>{s}</small><b style={{ fontSize: 22 }}>{count(s)}</b>
            </div>
          ))}
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4>Clash results · {st === 'All' ? 'all statuses' : st} · {vis.length} shown</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input className="tx" style={{ width: 200 }} placeholder="Filter test, result or item…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn" onClick={() => { setQ(''); setSt('All'); }}>Clear Filters</button>
            <span style={{ flex: 1 }} />
            <button className="btn" onClick={loadAssets}>{loading ? <><span className="spin" />Loading…</> : assets ? 'Asset info loaded' : 'Load Asset Info'}</button>
            <button className="btn" onClick={() => show(`Exported ${vis.length} rows to CSV`)}>Export CSV…</button>
          </div>
          <div style={{ overflow: 'auto', maxHeight: 250 }}>
            <table>
              <thead><tr><th style={{ width: 24 }} /><th>Test</th><th>Result</th><th>Status</th><th>Item 1</th><th>Item 2</th><th>mm</th><th>Approved by</th>{assets && <><th className="hl">Cat 1</th><th className="hl">Cat 2</th></>}</tr></thead>
              <tbody>
                {vis.map((r, i) => (
                  <tr key={r.id} className={'r' + (sel.includes(r.id) ? ' sel' : '')} style={{ '--i': i }} onClick={() => toggle(r.id)}>
                    <td><span className={'cb' + (sel.includes(r.id) ? '' : ' o')} /></td>
                    <td>{r.test}</td><td className="mono">{r.result}</td><td><span className={'p ' + CLS[r.status]}>{r.status}</span></td>
                    <td>{r.i1}</td><td>{r.i2}</td><td>{r.dist}</td><td>{r.by || '—'}{r.note ? ' · ' + r.note : ''}</td>
                    {assets && <><td className="hl">{r.cat}</td><td className="hl">{r.cat2}</td></>}
                  </tr>
                ))}
                {!vis.length && <tr><td colSpan={9} style={{ color: 'var(--muted)' }}>No results match the filters</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="tx" style={{ flex: 1 }} placeholder="Comment for the selection…" value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNote()} />
          <button className="btn" onClick={addNote}>Add Comment</button>
          <button className="btn" onClick={() => setStatus('Resolved')}>Resolve Selected</button>
          <button className="btn gold" onClick={() => setStatus('Approved')}>Approve Selected</button>
        </div>
      </DesktopWin>
    </>
  );
}
