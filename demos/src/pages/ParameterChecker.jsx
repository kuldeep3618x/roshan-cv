import { useEffect, useRef, useState } from 'react';
import { CountUp, DesktopWin, Info, fmt, useToast } from '../ui.jsx';

const FILES0 = [
  { n: 'ARC_Tower_A.nwc', total: 4820, on: true },
  { n: 'STR_Tower_A.nwc', total: 2960, on: true },
  { n: 'MEP_Tower_A.nwc', total: 7410, on: true },
  { n: 'FAC_Tower_A.nwc', total: 1380, on: false },
];
const ELEMS = [
  ['ARC_Tower_A.nwc', 'Walls', 'Basic Wall', 'Ext 300', { code: '001-AR', zone: null }],
  ['ARC_Tower_A.nwc', 'Doors', 'Single-Flush', '900 x 2100', { code: null, zone: 'Z2' }],
  ['ARC_Tower_A.nwc', 'Floors', 'Floor', 'Conc. 250', { code: null, zone: null }],
  ['STR_Tower_A.nwc', 'Structural Columns', 'Concrete Column', 'C400', { code: '002-ST', zone: null }],
  ['MEP_Tower_A.nwc', 'Ducts', 'Rectangular Duct', 'Supply 600', { code: null, zone: 'Z4' }],
  ['MEP_Tower_A.nwc', 'Pipes', 'Pipe Types', 'CHW 100', { code: null, zone: null }],
  ['MEP_Tower_A.nwc', 'Cable Tray', 'Ladder', 'Tray 300', { code: '004-EL', zone: 'Z4' }],
].map(([file, cat, fam, type, v], id) => ({ id, file, cat, fam, type, v: { Clash_Test_Code: v.code, Clash_Zone: v.zone } }));

export default function ParameterChecker() {
  const [params, setParams] = useState(['Clash_Test_Code', 'Clash_Zone']);
  const [np, setNp] = useState('');
  const [files, setFiles] = useState(FILES0);
  const [deep, setDeep] = useState(true);
  const [phase, setPhase] = useState('idle');
  const [pct, setPct] = useState(0);
  const [toast, show] = useToast();
  const timer = useRef();
  useEffect(() => () => clearInterval(timer.current), []);

  const run = () => {
    if (phase === 'run') return;
    if (!params.length || !files.some((f) => f.on)) return show('Add a parameter and choose at least one file');
    setPhase('run'); setPct(0);
    let p = 0;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      p += 7;
      setPct(Math.min(p, 100));
      if (p >= 100) { clearInterval(timer.current); setPhase('done'); show('Check complete · gaps listed below'); }
    }, 110);
  };

  const scope = files.filter((f) => f.on);
  const rows = ELEMS.filter((e) => scope.some((f) => f.n === e.file) && params.some((p) => !e.v[p]));
  const gapsByFile = scope.map((f) => ({ n: f.n, k: rows.filter((r) => r.file === f.n).length })).filter((g) => g.k);
  const scanned = scope.reduce((a, f) => a + f.total, 0);
  const missingTotal = rows.length * 38;
  const label = pct < 40 ? 'Enumerating elements…' : pct < 75 && deep ? 'Indexing required parameters across the document…' : 'Checking parameters…';

  return (
    <>
      <Info
        n="12" eyebrow="Navisworks add-in tool"
        title={<>Parameter <em>Checker</em></>}
        desc="Check required element parameters across every element in the chosen model files, not only the ones involved in a clash."
        bullets={['Dashboard of files and elements scanned, and gaps by file', 'Optional document-wide search as a last resort', 'Double-click isolates the element, CSV and Excel export']}
        chips={['C#', '.NET 4.8', 'WPF', 'Navisworks API']}
        hint="untick a file, add a parameter name, then Run Parameter Check"
      />
      <DesktopWin title="Parameter Checker" sub="Navisworks Tools" toast={toast}>
        <div className="row2" style={{ flex: 'none' }}>
          <div className="card" style={{ flex: 1 }}>
            <h4>Required parameters</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {params.map((p) => <span key={p} className="tag" style={{ cursor: 'pointer' }} onClick={() => setParams((a) => a.filter((x) => x !== p))}>{p} ✕</span>)}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="tx" style={{ flex: 1 }} placeholder="Add parameter name…" value={np} onChange={(e) => setNp(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && np.trim()) { setParams((a) => [...a, np.trim()]); setNp(''); } }} />
              <button className="btn" onClick={() => { if (np.trim()) { setParams((a) => [...a, np.trim()]); setNp(''); } }}>Add</button>
            </div>
            <label className="fr" style={{ marginTop: 6 }}><span className={'cb' + (deep ? '' : ' o')} onClick={() => setDeep(!deep)} />Also search the whole document for parameters not found on the element</label>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <h4>Files in scope</h4>
            {files.map((f, i) => (
              <div key={f.n} className="fr" onClick={() => setFiles((fs) => fs.map((x, k) => (k === i ? { ...x, on: !x.on } : x)))}>
                <span className={'cb' + (f.on ? '' : ' o')} />{f.n}<span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>{fmt(f.total)} elements</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn gold pulse" onClick={run}>Run Parameter Check</button>
          {phase === 'run' && <><div className="bar" style={{ flex: 1 }}><i style={{ width: pct + '%', background: 'var(--gold)' }} /></div><span style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</span></>}
          {phase !== 'run' && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{phase === 'done' ? `${rows.length} sample element rows with gaps` : 'Ready'}</span>}
        </div>
        {phase === 'done' && (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="tile" style={{ '--c': '#38bdf8' }}><small>Files scanned</small><b style={{ fontSize: 22 }}><CountUp to={scope.length} /></b></div>
              <div className="tile" style={{ '--c': '#6ea8fe' }}><small>Elements scanned</small><b style={{ fontSize: 22 }}><CountUp to={scanned} /></b></div>
              <div className="tile h"><small>Elements missing</small><b style={{ fontSize: 22 }}><CountUp to={missingTotal} /></b></div>
              <div className="tile" style={{ '--c': '#fb7185' }}><small>Files with gaps</small><b style={{ fontSize: 22 }}><CountUp to={gapsByFile.length} /></b></div>
            </div>
            <div className="card" style={{ flex: 1 }}>
              <h4>Elements missing a required parameter · double-click to isolate</h4>
              <table>
                <thead><tr><th>File</th><th>Category</th><th>Family</th>{params.map((p) => <th key={p}>{p}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.id} className="r" style={{ '--i': i }} onDoubleClick={() => show(`Isolated ${r.cat} · ${r.fam} in the 3D view`)}>
                      <td className="mono">{r.file}</td><td>{r.cat}</td><td>{r.fam}</td>
                      {params.map((p) => <td key={p} className={r.v[p] ? '' : 'hl'}>{r.v[p] || 'Parameter not found'}</td>)}
                    </tr>
                  ))}
                  {!rows.length && <tr><td colSpan={3 + params.length} style={{ color: 'var(--muted)' }}>No gaps found in the files in scope</td></tr>}
                </tbody>
              </table>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn" onClick={() => show('Element grid exported to CSV')}>Export CSV…</button>
                <button className="btn" onClick={() => show('By-file dashboard exported to Excel')}>Export Excel…</button>
              </div>
            </div>
          </>
        )}
      </DesktopWin>
    </>
  );
}
