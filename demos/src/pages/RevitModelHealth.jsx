import { useState } from 'react';
import { CountUp, DesktopWin, Info, useToast } from '../ui.jsx';

const DISCS = ['General', 'Architectural', 'Structural', 'Mechanical', 'Electrical'];
// kind: auto | cfg | att ; r = result when computed
const TESTS = [
  ['General', 'GEN-01', 'Warnings below agreed threshold', 'auto', 'Pass'],
  ['General', 'GEN-05', 'Project length unit is as agreed', 'cfg', 'Pass'],
  ['General', 'GEN-12', 'Model file name follows convention', 'cfg', 'Fail'],
  ['General', 'GEN-20', 'No unused imported CAD files', 'auto', 'Fail'],
  ['Architectural', 'ARC-03', 'Rooms are placed and enclosed', 'auto', 'Needs review'],
  ['Architectural', 'ARC-08', 'Floor finishes in the agreed workset', 'cfg', 'Pass'],
  ['Structural', 'STR-02', 'Columns span valid levels', 'cfg', 'Fail'],
  ['Structural', 'STR-09', 'Compact the model regularly', 'att', 'Needs review'],
  ['Mechanical', 'MEC-04', 'Ducts and pipes have size agreed', 'auto', 'Pass'],
  ['Electrical', 'ELE-06', 'Cable trays in correct workset', 'cfg', 'Pass'],
].map(([disc, id, title, kind, r]) => ({ disc, id, title, kind, r, run: true }));
const CLS = { Pass: 'ok', Fail: 'fl', 'Needs review': 'at', 'Not applicable': 'in' };
const KIND = { auto: 'Automated', cfg: 'Config-compared', att: 'Attestation' };

export default function RevitModelHealth() {
  const [discs, setDiscs] = useState(['General', 'Architectural', 'Structural']);
  const [tests, setTests] = useState(TESTS);
  const [configured, setConfigured] = useState(false);
  const [ran, setRan] = useState(false);
  const [toast, show] = useToast();

  const scope = tests.filter((t) => discs.includes(t.disc) && t.run);
  const result = (t) => (t.kind === 'cfg' && !configured ? 'Not applicable' : t.kind === 'att' ? 'Needs review' : t.r);
  const count = (s) => scope.filter((t) => result(t) === s).length;

  const run = () => {
    if (!scope.length) return show('Tick at least one discipline and test');
    setRan(true);
    show(`${scope.length} tests run · read-only, no transaction opened`);
  };

  return (
    <>
      <Info
        n="19" eyebrow="Revit add-in tool"
        title={<>Model <em>Health Check</em></>}
        desc="Audit the open model against a QA test catalog, discipline by discipline, with editable settings and an Excel report. Read-only."
        bullets={['Automated, config-compared and attestation tests', 'Not applicable until your standard is loaded', 'Opens no transaction and never changes the model']}
        chips={['C#', '.NET 8', 'Revit API', 'Excel report']}
        hint="Run Health Check, then Import Settings and run again"
      />
      <DesktopWin title="Model Health Check" sub="Revit Tools" pin={false} toast={toast}>
        <div className="card">
          <h4>Disciplines</h4>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DISCS.map((d) => <span key={d} className={'chipbtn' + (discs.includes(d) ? ' on' : '')} onClick={() => setDiscs((a) => (a.includes(d) ? a.filter((x) => x !== d) : [...a, d]))}>{d}</span>)}
          </div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4>Tests · {scope.length} will run · settings {configured ? 'loaded' : 'not loaded'}</h4>
          <div style={{ overflow: 'auto', maxHeight: 230 }}>
            <table>
              <thead><tr><th style={{ width: 24 }}>Run</th><th>Id</th><th>Test</th><th>Type</th><th>Result</th></tr></thead>
              <tbody>
                {tests.filter((t) => discs.includes(t.disc)).map((t, i) => (
                  <tr key={t.id} className="r" style={{ '--i': i, opacity: t.run ? 1 : 0.4 }} onClick={() => setTests((ts) => ts.map((x) => (x.id === t.id ? { ...x, run: !x.run } : x)))}>
                    <td><span className={'cb' + (t.run ? '' : ' o')} /></td>
                    <td className="mono">{t.id}</td><td>{t.title}</td><td>{KIND[t.kind]}</td>
                    <td>{ran && t.run ? <span className={'p ' + CLS[result(t)]}>{result(t)}</span> : <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {ran && (
          <div style={{ display: 'flex', gap: 8 }}>
            {['Pass', 'Fail', 'Needs review', 'Not applicable'].map((s) => (
              <div key={s} className="tile" style={{ '--c': { Pass: '#34d399', Fail: '#fb7185', 'Needs review': '#fbbf24', 'Not applicable': '#38bdf8' }[s], padding: '7px 10px' }}>
                <small>{s}</small><b style={{ fontSize: 22 }}><CountUp to={count(s)} /></b>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => { setConfigured(true); show('Project standard imported · config-compared tests now run'); }}>Import Settings…</button>
          <button className="btn" onClick={() => (ran ? show('Excel report written next to the model, with the attestation checklist') : show('Run the health check first'))}>Export Excel</button>
          <button className="btn gold pulse" onClick={run}>Run Health Check</button>
        </div>
      </DesktopWin>
    </>
  );
}
