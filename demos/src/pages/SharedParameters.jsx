import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

// kind: add | extend | bound | missing
const RULES0 = [
  { p: 'Fire Rating Note', b: 'Instance', g: 'Identity Data', c: 'Doors; Windows; Walls', kind: 'add' },
  { p: 'Asset Code', b: 'Type', g: 'Data', c: 'Doors; Windows; Furniture; Casework', kind: 'add' },
  { p: 'Install Phase', b: 'Instance', g: 'Data', c: 'Walls; Floors', kind: 'extend' },
  { p: 'Door Hardware Set', b: 'Type', g: 'Data', c: 'Doors', kind: 'bound' },
  { p: 'Legacy Tag', b: 'Instance', g: 'Data', c: 'Walls', kind: 'missing' },
].map((r, id) => ({ ...r, id, on: r.kind === 'add' || r.kind === 'extend' }));

const PREVIEW = { add: 'Will add', extend: 'Will add 1 category to the existing parameter', bound: 'Already bound to these categories', missing: 'Not in shared parameter file' };
const DONE = { add: 'Added', extend: 'Extended', bound: 'No change', missing: 'Skipped' };
const CLS = { add: 'ok', extend: 'at', bound: 'in', missing: 'fl' };

export default function SharedParameters() {
  const [rules, setRules] = useState(RULES0);
  const [phase, setPhase] = useState('idle');
  const [toast, show] = useToast();

  const toggle = (id) => setRules((rs) => rs.map((r) => (r.id === id && (r.kind === 'add' || r.kind === 'extend') ? { ...r, on: !r.on } : r)));
  const preview = () => { setPhase('preview'); show('Preview only · nothing has been changed'); };
  const apply = () => {
    const n = rules.filter((r) => r.on).length;
    if (phase !== 'preview') return show('Run Preview first');
    if (!n) return show('Tick at least one rule');
    setPhase('applied');
    show(`${n} parameters applied in one transaction · Ctrl+Z to undo`);
  };

  return (
    <>
      <Info
        n="16" eyebrow="Revit add-in tool"
        title={<>Shared <em>Parameters</em></>}
        desc="Add shared parameters to a model from a shared parameter file, following rules kept in an Excel sheet, with a preview first."
        bullets={['Rules: parameter, binding, group and categories', 'Preview shows a result for every rule', 'One undoable apply, existing parameters only extended']}
        chips={['C#', 'Revit API', 'WPF', 'Excel rules']}
        hint="click Preview, untick a row, then Apply Checked"
      />
      <DesktopWin title="Shared Parameters" sub="Revit Tools" pin={false} toast={toast}>
        <div className="card">
          <h4>Files</h4>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, width: 120 }}>Shared parameter file</span>
            <div className="sel-box mono">project-shared-parameters.txt</div><button className="btn">Browse…</button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, width: 120 }}>Excel rules</span>
            <div className="sel-box mono">parameter-rules.xlsx</div><button className="btn" onClick={() => show('Template written from the shared parameter file')}>Export Template…</button>
          </div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4>Rules · {rules.filter((r) => r.on).length} checked</h4>
          <table>
            <thead><tr><th style={{ width: 24 }} /><th>Parameter</th><th>Binding</th><th>Group</th><th>Categories</th><th>Result</th></tr></thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={r.id} className={'r' + (r.on ? ' sel' : '')} style={{ '--i': i }} onClick={() => toggle(r.id)}>
                  <td><span className={'cb' + (r.on ? '' : ' o')} /></td>
                  <td>{r.p}</td><td>{r.b}</td><td>{r.g}</td><td>{r.c}</td>
                  <td>{phase === 'idle' ? <span style={{ color: 'var(--muted)' }}>—</span> : <span className={'p ' + CLS[r.kind]}>{phase === 'applied' ? (r.on || r.kind === 'bound' || r.kind === 'missing' ? DONE[r.kind] : 'Not applied') : PREVIEW[r.kind]}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => setRules((rs) => rs.map((r) => ({ ...r, on: r.kind === 'add' || r.kind === 'extend' })))}>Check All</button>
          <button className="btn" onClick={() => setRules((rs) => rs.map((r) => ({ ...r, on: false })))}>Uncheck All</button>
          <button className="btn" onClick={preview}>Preview</button>
          <button className="btn gold pulse" onClick={apply}>Apply Checked</button>
        </div>
      </DesktopWin>
    </>
  );
}
