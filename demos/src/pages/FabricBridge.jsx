import { useEffect, useRef, useState } from 'react';
import { BrowserWin, Info, fmt, useToast } from '../ui.jsx';

const INIT = [
  { id: 0, name: 'ARC_Tower_A.rvt', el: 48210, sel: true, p: 100, st: null },
  { id: 1, name: 'STR_Tower_A.rvt', el: 31876, sel: true, p: 100, st: null },
  { id: 2, name: 'MEP_Tower_A.rvt', el: 62004, sel: true, p: 64, st: null },
  { id: 3, name: 'ARC_Podium.rvt', el: 27350, sel: false, p: 0, st: null },
];

function StatusPill({ f }) {
  if (!f.sel) return <span className="p in">Not selected</span>;
  if (f.st === 'wait') return <span className="p at"><span className="spin" />Waiting for translation</span>;
  if (f.p >= 100) return <span className="p ok">Done</span>;
  if (f.p > 0) return <span className="p in">Extracting {Math.round(f.p)}%</span>;
  return <span className="p in">Queued</span>;
}

export default function FabricBridge() {
  const [files, setFiles] = useState(INIT);
  const [running, setRunning] = useState(false);
  const [toast, show] = useToast();
  const timers = useRef([]);
  const clearTimers = () => { timers.current.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers.current = []; };
  useEffect(() => clearTimers, []);

  const patch = (id, obj) => setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, ...obj } : f)));
  const toggle = (id) => !running && setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, sel: !f.sel } : f)));

  const run = () => {
    const queue = files.filter((f) => f.sel);
    if (!queue.length) { show('Select at least one model'); return; }
    if (running) return;
    clearTimers();
    setRunning(true);
    setFiles((fs) => fs.map((f) => ({ ...f, p: 0, st: null })));
    let i = 0;
    const next = () => {
      if (i >= queue.length) {
        setRunning(false);
        show(`${queue.length} models landed in OneLake · tables refreshed`);
        return;
      }
      const id = queue[i++].id;
      patch(id, { st: 'wait' });
      timers.current.push(setTimeout(() => {
        patch(id, { st: null });
        let p = 0;
        const iv = setInterval(() => {
          p = Math.min(100, p + 8 + Math.random() * 10);
          patch(id, { p });
          if (p >= 100) { clearInterval(iv); next(); }
        }, 110);
        timers.current.push(iv);
      }, 650));
    };
    next();
  };

  const nSel = files.filter((f) => f.sel).length;
  return (
    <>
      <Info
        n="04" eyebrow="APS web app"
        title={<>ACC to Microsoft <em>Fabric</em> bridge</>}
        desc="Pull element and property data out of ACC Revit models and land it in a Fabric Lakehouse, ready for Power BI, without manual exports."
        bullets={['Browse hub, project and folder; pick many models at once', 'Waits for ACC translation, retries and isolates errors per file', 'Delta tables (dim_element, fact_element_property) for Direct Lake']}
        chips={['Node.js', 'APS Model Derivative', 'OneLake / Delta', 'Power BI']}
        hint="untick a model, then hit Extract selected"
      />
      <BrowserWin url="localhost:8080" toast={toast}>
        <div className="top">
          <div><h2>ACC → Fabric bridge</h2><div className="sub">Extract Revit model properties from Autodesk Construction Cloud into Microsoft Fabric</div></div>
          <span className="tag">APS connected · Fabric connected</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="tile" style={{ '--c': '#8fa876' }}><small>1 · Connect</small><div style={{ marginTop: 7 }}><span className="p ok">APS</span> <span className="p ok">Fabric</span></div></div>
          <div className="tile" style={{ '--c': '#c99a4e' }}><small>2 · Models selected</small><b style={{ fontSize: 24 }}>{nSel}</b></div>
          <div className="tile" style={{ '--c': '#7c93ad' }}><small>3 · Destination</small><div style={{ marginTop: 7 }}><span className="p in">OneDrive → OneLake</span></div></div>
        </div>
        <div className="card">
          <h4>Choose ACC models</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <div className="sel-box">Sample Hub</div><div className="sel-box">Riverside Tower</div><div className="sel-box">Project Files / Architecture</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {files.map((f) => <div key={f.id} className="fr" onClick={() => toggle(f.id)}><span className={'cb' + (f.sel ? '' : ' o')} />{f.name}</div>)}
          </div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <h4 style={{ margin: 0 }}>Extraction</h4>
            <button className={'btn gold' + (running ? '' : ' pulse')} onClick={run} disabled={running} style={running ? { opacity: .6, cursor: 'default' } : undefined}>{running ? 'Extracting…' : 'Extract selected'}</button>
          </div>
          {files.map((f) => (
            <div className="pr" key={f.id}>
              <span className="nm">{f.name}</span>
              <div className="bar"><i style={{ width: (f.sel ? f.p : 0) + '%', background: f.p >= 100 ? '#8fa876' : '#7c93ad', transition: 'width .3s' }} /></div>
              <span className="el">{f.sel && f.p > 0 ? fmt(Math.round(f.el * Math.min(1, f.p / 100))) : '—'}</span>
              <span className="pl"><StatusPill f={f} /></span>
            </div>
          ))}
          <div style={{ marginTop: 'auto', fontFamily: 'var(--mf)', fontSize: 10.5, color: 'var(--muted)' }}>→ dim_element · fact_element_property · Power BI (Direct Lake)</div>
        </div>
      </BrowserWin>
    </>
  );
}
