import { Fragment, useEffect, useRef, useState } from 'react';
import { BrowserWin, CountUp, Info, fmt, useToast } from '../ui.jsx';

const MODELS = [
  { n: 'ARC_Tower_A', w: 112, z: '412 MB', ws: 'OK', l: 'OK', r: 'Pass', c: [1, 1, 1, 1, 1, 1] },
  { n: 'STR_Tower_A', w: 64, z: '298 MB', ws: 'OK', l: 'OK', r: 'Pass', c: [1, 1, 1, 1, 1, 1] },
  { n: 'MEP_Tower_A', w: 1940, z: '780 MB', ws: 'OK', l: '2 unloaded', r: 'Attention', c: [0.5, 1, 1, 0.5, 1, 1] },
  { n: 'ARC_Podium', w: 388, z: '530 MB', ws: '3 unused', l: 'OK', r: 'Attention', c: [1, 1, 0.5, 1, 1, 1] },
  { n: 'FAC_Tower_A', w: 2406, z: '1.1 GB', ws: 'OK', l: 'CAD import', r: 'Fail', c: [0, 0.5, 1, 1, 0, 1] },
  { n: 'LND_Site', w: 41, z: '120 MB', ws: 'OK', l: 'OK', r: 'Pass', c: [1, 1, 1, 1, 1, 1] },
];
const CHECKS = ['Open warnings', 'File size', 'Workset health', 'Revit links', 'CAD imports', 'Naming'];
const CLS = { Pass: 'ok', Attention: 'at', Fail: 'fl' };
const count = (r) => MODELS.filter((m) => m.r === r).length;

export default function HealthCheck() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState('FAC_Tower_A');
  const [running, setRunning] = useState(false);
  const [toast, show] = useToast();
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const runAgain = () => {
    if (running) return;
    setRunning(true);
    timer.current = setTimeout(() => { setRunning(false); show('Batch complete · report ready to export to Excel'); }, 1800);
  };
  const tiles = [['all', 'Models', MODELS.length, '#38bdf8'], ['Pass', 'Passed', count('Pass'), '#34d399'], ['Attention', 'Need attention', count('Attention')], ['Fail', 'Failed', count('Fail'), '#fb7185']];
  const rows = MODELS.filter((m) => filter === 'all' || m.r === filter);

  return (
    <>
      <Info
        n="05" eyebrow="APS web app"
        title={<>Cloud model <em>health</em> checks</>}
        desc="Run a QA ruleset against a batch of ACC Revit models in the cloud, with no downloads and no desktop Revit, then export a clear report."
        bullets={['Design Automation for Revit runs each check headlessly', 'Concurrent batch runs with per-model results', 'Editable rulesets, saved setups and Excel export']}
        chips={['React', 'Node.js', 'Design Automation', 'C# Revit plugin']}
        hint="filter by tile, click a row for check detail, Run again"
      />
      <BrowserWin url="localhost:5173 / runs / batch-12" toast={toast}>
        <div className="top">
          <div><h2>Model Health Check</h2><div className="sub">Batch run 12 · ruleset: Standard QA</div></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag">{running ? 'running…' : `${MODELS.length} models · completed`}</span>
            <button className="btn gold pulse" onClick={runAgain}>Run again</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {tiles.map(([k, label, v, c]) => (
            <div key={k} className={'tile click' + (k === 'Attention' ? ' h' : '') + (filter === k ? ' on' : '')} style={c ? { '--c': c } : undefined} onClick={() => setFilter(k)}>
              <small>{label}</small><b style={c && k !== 'all' ? { color: c } : undefined}><CountUp to={v} /></b>
            </div>
          ))}
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4>Results by model · click a row for check detail</h4>
          <table>
            <thead><tr><th>Model</th><th>Warnings</th><th>File size</th><th>Worksets</th><th>Links</th><th>Result</th></tr></thead>
            <tbody>
              {rows.map((m, i) => (
                <Fragment key={m.n}>
                  <tr className="r" style={{ '--i': i }} onClick={() => setOpen(open === m.n ? null : m.n)}>
                    <td className="mono">{m.n}</td><td>{fmt(m.w)}</td><td>{m.z}</td><td>{m.ws}</td><td>{m.l}</td>
                    <td>{running ? <span className="p in"><span className="spin" />Running</span> : <span className={'p ' + CLS[m.r]}>{m.r}</span>}</td>
                  </tr>
                  {open === m.n && !running && (
                    <tr className="det"><td colSpan={6}>
                      {CHECKS.map((c, k) => {
                        const s = m.c[k];
                        return <span key={c} className={'chk ' + (s === 1 ? 'ok' : s === 0.5 ? 'at' : 'fl')}>{s === 1 ? '✓' : s === 0.5 ? '!' : '✕'} {c}</span>;
                      })}
                    </td></tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </BrowserWin>
    </>
  );
}
