import { useState } from 'react';
import { CountUp, DesktopWin, Info, fmt, useToast } from '../ui.jsx';

const CATS0 = [
  { name: 'Walls', total: 1840, code: 620, zone: 410 },
  { name: 'Doors', total: 960, code: 310, zone: 220 },
  { name: 'Floors', total: 420, code: 140, zone: 90 },
  { name: 'Ducts', total: 2380, code: 1120, zone: 960 },
  { name: 'Pipes', total: 1710, code: 880, zone: 700 },
  { name: 'Cable Tray', total: 540, code: 260, zone: 210 },
];
const MATRIX = {
  AR: [['Walls', '001-AR'], ['Doors', '002-AR'], ['Floors', '003-AR']],
  ME: [['Ducts', '010-ME'], ['Pipes', '011-ME']],
  EL: [['Cable Tray', '020-EL']],
};

export default function ClashParameters() {
  const [cats, setCats] = useState(CATS0);
  const [tab, setTab] = useState('Dashboard');
  const [scope, setScope] = useState('Whole model');
  const [ticks, setTicks] = useState(['Doors']);
  const [param, setParam] = useState('Clash Code');
  const [val, setVal] = useState('002-AR');
  const [trade, setTrade] = useState('ME');
  const [toast, show] = useToast();

  const k = scope === 'Whole model' ? 1 : 0.38;
  const tot = cats.reduce((a, c) => a + c.total, 0);
  const mc = cats.reduce((a, c) => a + c.code, 0);
  const mz = cats.reduce((a, c) => a + c.zone, 0);
  const pctDone = Math.round(100 * (1 - (mc + mz) / (2 * tot)));

  const assign = () => {
    if (!ticks.length || !val.trim()) return show('Tick at least one category and enter a value');
    const key = param === 'Clash Code' ? 'code' : 'zone';
    let n = 0;
    setCats((cs) => cs.map((c) => { if (ticks.includes(c.name)) { n += c[key]; return { ...c, [key]: 0 }; } return c; }));
    show(`${fmt(Math.round(n * k))} elements set to ${val} · one undo step`);
  };
  const mapCodes = () => {
    const names = MATRIX[trade].map(([n]) => n);
    let n = 0;
    setCats((cs) => cs.map((c) => { if (names.includes(c.name)) { n += c.code; return { ...c, code: 0 }; } return c; }));
    show(`Codes mapped for ${names.length} categories · ${fmt(Math.round(n * k))} elements filled`);
  };

  return (
    <>
      <Info
        n="15" eyebrow="Revit add-in tool"
        title={<>Clash <em>Parameters</em></>}
        desc="See how complete the Clash Code and Clash Zone parameters are, fill them in bulk, map codes from a clash matrix and round-trip values through Excel."
        bullets={['Dashboard of what is missing, by category', 'Assign values or auto-map codes by trade', 'Writes only the two chosen parameters, one undo step']}
        chips={['C#', 'Revit API', 'WPF', 'Excel / CSV']}
        hint="Assign Values tab: tick a category, Apply, then watch the dashboard"
      />
      <DesktopWin title="Clash Parameters" sub="Revit Tools" pin={false} toast={toast}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Scope</span>
          <div className="seg" style={{ margin: 0 }}>
            {['Whole model', 'Active view'].map((s) => <span key={s} className={scope === s ? 'on' : ''} onClick={() => setScope(s)}>{s}</span>)}
          </div>
          <span style={{ flex: 1 }} />
          <span className="tag">Clash Code · Clash Zone</span>
        </div>
        <div className="seg" style={{ margin: 0 }}>
          {['Dashboard', 'Assign Values', 'Auto-Map Clash Code'].map((t) => <span key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</span>)}
        </div>
        {tab === 'Dashboard' && (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="tile" style={{ '--c': '#38bdf8' }}><small>Elements in scope</small><b style={{ fontSize: 22 }}><CountUp to={Math.round(tot * k)} /></b></div>
              <div className="tile" style={{ '--c': '#fbbf24' }}><small>Missing code</small><b style={{ fontSize: 22 }}><CountUp to={Math.round(mc * k)} /></b></div>
              <div className="tile" style={{ '--c': '#fb7185' }}><small>Missing zone</small><b style={{ fontSize: 22 }}><CountUp to={Math.round(mz * k)} /></b></div>
              <div className="tile h"><small>% complete</small><b style={{ fontSize: 22 }}>{pctDone}%</b></div>
            </div>
            <div className="card" style={{ flex: 1 }}>
              <h4>Missing values by category</h4>
              <table>
                <thead><tr><th>Category</th><th>Elements</th><th>Missing code</th><th>Missing zone</th></tr></thead>
                <tbody>{cats.map((c, i) => (
                  <tr key={c.name} className="r" style={{ '--i': i }}><td>{c.name}</td><td>{fmt(Math.round(c.total * k))}</td>
                    <td className={c.code ? '' : 'hl'}>{c.code ? fmt(Math.round(c.code * k)) : '✓ complete'}</td>
                    <td className={c.zone ? '' : 'hl'}>{c.zone ? fmt(Math.round(c.zone * k)) : '✓ complete'}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}
        {tab === 'Assign Values' && (
          <div className="row2">
            <div className="card" style={{ flex: 1 }}>
              <h4>Target elements · by category</h4>
              {cats.map((c) => (
                <div key={c.name} className="fr" onClick={() => setTicks((t) => (t.includes(c.name) ? t.filter((x) => x !== c.name) : [...t, c.name]))}>
                  <span className={'cb' + (ticks.includes(c.name) ? '' : ' o')} />{c.name}<span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>{fmt(Math.round(c.total * k))}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ flex: 1 }}>
              <h4>Value to assign</h4>
              <div className="seg">{['Clash Code', 'Clash Zone'].map((p) => <span key={p} className={param === p ? 'on' : ''} onClick={() => setParam(p)}>{p}</span>)}</div>
              <input className="tx" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && assign()} />
              <div style={{ flex: 1 }} />
              <button className="btn gold pulse" onClick={assign}>Apply to Scoped Elements</button>
            </div>
          </div>
        )}
        {tab === 'Auto-Map Clash Code' && (
          <div className="card" style={{ flex: 1 }}>
            <h4>Reference clash matrix · choose a trade</h4>
            <div className="seg">{Object.keys(MATRIX).map((t) => <span key={t} className={trade === t ? 'on' : ''} onClick={() => setTrade(t)}>{t}</span>)}</div>
            <table>
              <thead><tr><th>Category</th><th>Match</th><th>Suggested code</th></tr></thead>
              <tbody>{MATRIX[trade].map(([n, c]) => <tr key={n}><td>{n}</td><td><span className="p ok">Matched</span></td><td className="mono">{c}</td></tr>)}</tbody>
            </table>
            <div style={{ flex: 1 }} />
            <button className="btn gold" style={{ alignSelf: 'flex-start', marginTop: 10 }} onClick={mapCodes}>Apply Mapping to Scoped Elements</button>
          </div>
        )}
      </DesktopWin>
    </>
  );
}
