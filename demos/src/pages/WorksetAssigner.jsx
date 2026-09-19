import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

const WORKSETS = [
  ['ARC_Walls', 'Category = Walls · Type contains “Ext”'],
  ['ARC_Floors', 'Category = Floors'],
  ['ARC_Doors', 'Category = Doors · Level ≠ Roof'],
  ['ARC_Furniture', 'Parameter “Discipline” = Interior'],
];
const ELEMENTS = [
  ['Basic Wall: Ext 300', 'Walls', 'Workset1', 'ARC_Walls'],
  ['Floor: Conc. 250', 'Floors', 'Workset1', 'ARC_Floors'],
  ['Single-Flush 900', 'Doors', 'ARC_Walls', 'ARC_Doors'],
  ['Desk 1600', 'Furniture', 'Workset1', 'ARC_Furniture'],
  ['Wall: Int 100', 'Walls', 'Workset1', null],
  ['Curtain Panel', 'Curtain Panels', 'Workset1', null],
].map(([name, cat, cur, assign]) => ({ name, cat, cur, assign }));
const SCOPES = [
  ['Selection', '12 elements matched · 0 unmatched'],
  ['Active view', '418 elements matched · 3 unmatched'],
  ['Entire model', '2,318 elements matched · 14 unmatched'],
];

export default function WorksetAssigner() {
  const [rows, setRows] = useState(ELEMENTS);
  const [focus, setFocus] = useState(null);
  const [scope, setScope] = useState(2);
  const [applied, setApplied] = useState(false);
  const [toast, show] = useToast();

  const apply = () => {
    setRows((rs) => rs.map((r) => (r.assign ? { ...r, cur: r.assign } : r)));
    setApplied(true);
    show('Assigned 2,304 elements to their worksets · Ctrl+Z to undo');
  };
  const reset = () => { setRows(ELEMENTS); setApplied(false); setFocus(null); show('Preview reset'); };

  return (
    <>
      <Info
        n="03" eyebrow="Revit add-in"
        title={<>Rule-based <em>workset</em> assigner</>}
        desc="Define your workset standard once as reusable rules, preview what will move, then apply it to a selection, the active view or the whole model."
        bullets={['Sets of governed worksets, each with its own rules', 'Rules by category, family, type, level or parameter', 'One codebase for Revit 2020 to 2026']}
        chips={['C#', 'Revit API', '.NET FW / .NET 8', 'WPF']}
        hint="click a workset, switch scope, hit Apply"
      />
      <DesktopWin title="Workset Assigner" sub="Revit Tools" pin={false} toast={toast}>
        <div className="row2">
          <div className="card" style={{ width: 226 }}>
            <h4>Set &amp; worksets</h4>
            <div className="tx" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}><span>Architecture standard</span><span>&#9662;</span></div>
            {WORKSETS.map(([n, rule]) => (
              <div key={n} className={'ws' + (focus === n ? ' on' : '')} onClick={() => setFocus(focus === n ? null : n)}>
                <b>{n}</b><small>{rule}</small>
              </div>
            ))}
          </div>
          <div className="card" style={{ flex: 1 }}>
            <h4>Preview</h4>
            <div className="seg">
              {SCOPES.map(([label], i) => <span key={label} className={scope === i ? 'on' : ''} onClick={() => { setScope(i); setApplied(false); setRows(ELEMENTS); }}>{label}</span>)}
            </div>
            <table>
              <thead><tr><th>Element</th><th>Category</th><th>Current</th><th>Assign to</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.name} className={'r' + (focus && r.assign && r.assign !== focus ? ' dim' : '')} style={{ '--i': i }}>
                    <td>{r.name}</td><td>{r.cat}</td><td>{r.cur}</td>
                    <td>{r.assign ? <span className={'p ' + (applied ? 'ok' : 'in')}>{r.assign}</span> : <span className="p at">No rule matched</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--muted)', paddingTop: 8 }}>
              {applied ? '2,304 elements assigned · 14 skipped (no rule)' : SCOPES[scope][1]}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={reset}>Reset</button>
          <button className="btn gold pulse" style={{ padding: '9px 22px', fontSize: 12.5 }} onClick={apply}>Apply to model</button>
        </div>
      </DesktopWin>
    </>
  );
}
