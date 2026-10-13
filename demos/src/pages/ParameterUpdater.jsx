import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

// Mapping rows as they would sit in the Excel workbook.
const MAP = [
  { cat: 'Doors', fam: 'Single-Flush', type: '900 x 2100', scope: 'Type', param: 'Fire Rating', value: '60 min' },
  { cat: 'Doors', fam: 'Single-Flush', type: '900 x 2100', scope: 'Instance', param: 'Asset Code', value: '=AST-{Level}-{Type}-{Seq:000}' },
  { cat: 'Windows', fam: 'Fixed', type: '1200 x 1500', scope: 'Instance', param: 'Asset Code', value: '=WIN-{Level}-{Seq:00}' },
  { cat: 'Furniture', fam: 'Desk', type: '1600', scope: 'Type', param: 'Finish', value: 'Oak' },
];
const ELEMS = [
  { id: 4101, cat: 'Doors', fam: 'Single-Flush', type: '900 x 2100', level: 'L01' },
  { id: 4102, cat: 'Doors', fam: 'Single-Flush', type: '900 x 2100', level: 'L01' },
  { id: 4188, cat: 'Doors', fam: 'Single-Flush', type: '900 x 2100', level: 'L02' },
  { id: 5210, cat: 'Windows', fam: 'Fixed', type: '1200 x 1500', level: 'L01' },
  { id: 5211, cat: 'Windows', fam: 'Fixed', type: '1200 x 1500', level: 'L02' },
  { id: 6302, cat: 'Furniture', fam: 'Desk', type: '1600', level: 'L02' },
];

function evaluate(value, el, seq) {
  if (!value.startsWith('=')) return value;
  const body = value.slice(1);
  return body
    .replace(/\{Seq:(0+)\}/g, (_, z) => String(seq).padStart(z.length, '0'))
    .replace(/\{Level\}/g, el.level).replace(/\{Type\}/g, el.type.replace(/\s/g, '')).replace(/\{Category\}/g, el.cat)
    .replace(/\{Family\}/g, el.fam).replace(/\{Id\}/g, String(el.id));
}

export default function ParameterUpdater() {
  const [phase, setPhase] = useState('idle');
  const [rows, setRows] = useState(MAP);
  const [toast, show] = useToast();

  const plan = [];
  rows.forEach((m) => {
    let seq = 0;
    ELEMS.filter((e) => e.cat === m.cat && e.fam === m.fam && e.type === m.type).forEach((e) => {
      seq += 1;
      plan.push({ key: `${m.param}-${e.id}`, id: e.id, cat: e.cat, level: e.level, param: m.param, scope: m.scope, value: evaluate(m.value, e, seq) });
    });
  });
  const unmatched = rows.filter((m) => !ELEMS.some((e) => e.cat === m.cat && e.fam === m.fam && e.type === m.type));

  return (
    <>
      <Info
        n="20" eyebrow="Revit add-in tool · in progress"
        title={<>Parameter <em>Updater</em></>}
        desc="Update Type and Instance parameter values from an Excel mapping workbook, with formulas for asset codes, a preview and a read-back check."
        bullets={['The workbook is the only authority', 'Formulas such as =AST-{Level}-{Type}-{Seq:000}', 'Validate, apply as one undo step, read every value back']}
        chips={['C#', 'Revit API', 'WPF', 'Excel mapping']}
        hint="Validate & Preview, edit a formula, Apply, then check the read-back"
      />
      <DesktopWin title="Parameter Updater" sub="Revit Tools · in progress" pin={false} toast={toast}>
        <div className="card">
          <h4>Mapping workbook · asset-mapping.xlsx</h4>
          <table>
            <thead><tr><th>Category</th><th>Family</th><th>Type</th><th>Scope</th><th>Parameter</th><th>Value or formula</th></tr></thead>
            <tbody>
              {rows.map((m, i) => (
                <tr key={i}>
                  <td>{m.cat}</td><td>{m.fam}</td><td>{m.type}</td><td>{m.scope}</td><td>{m.param}</td>
                  <td><input className="tx mono" style={{ width: '100%', padding: '3px 6px' }} value={m.value} onChange={(e) => { setPhase('idle'); setRows((rs) => rs.map((r, k) => (k === i ? { ...r, value: e.target.value } : r))); }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {phase !== 'idle' && (
          <div className="card" style={{ flex: 1 }}>
            <h4>{phase === 'preview' ? `Preview · ${plan.length} values will be written` : `Applied · ${plan.length} values read back and verified`}</h4>
            <div style={{ overflow: 'auto', maxHeight: 170 }}>
              <table>
                <thead><tr><th>Element</th><th>Category</th><th>Level</th><th>Parameter</th><th>New value</th><th>{phase === 'applied' ? 'Read-back' : 'Check'}</th></tr></thead>
                <tbody>
                  {plan.map((p, i) => (
                    <tr key={p.key} className="r" style={{ '--i': i }}>
                      <td className="mono">{p.id}</td><td>{p.cat}</td><td>{p.level}</td><td>{p.param}</td><td className="mono">{p.value}</td>
                      <td><span className="p ok">{phase === 'applied' ? '✓ matches' : 'valid'}</span></td>
                    </tr>
                  ))}
                  {unmatched.map((m, i) => <tr key={'u' + i}><td colSpan={5}>No elements match {m.cat} / {m.fam} / {m.type}</td><td><span className="p fl">no match</span></td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => (phase === 'applied' ? show('QA/QC report exported to Excel') : show('Apply the changes first'))}>Export QA/QC Report</button>
          <button className="btn" onClick={() => { setPhase('preview'); show('Validated · nothing has been changed'); }}>Validate &amp; Preview</button>
          <button className="btn gold pulse" onClick={() => (phase === 'idle' ? show('Validate & Preview first') : (setPhase('applied'), show(`${plan.length} values applied as one undo step and verified`)))}>Apply</button>
        </div>
      </DesktopWin>
    </>
  );
}
