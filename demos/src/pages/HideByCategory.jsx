import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

// "present" is whether the category exists in the sample loaded models.
const CATS = [
  ['Walls', true], ['Floors', true], ['Ceilings', true], ['Doors', true], ['Windows', true], ['Furniture', true],
  ['Stairs', true], ['Structural Columns', true], ['Structural Framing', true], ['Ducts', true], ['Pipes', true],
  ['Lighting Fixtures', true], ['Roofs', false],
].map(([name, present]) => ({ name, present }));

export default function HideByCategory() {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(['Furniture', 'Ceilings']);
  const [hidden, setHidden] = useState([]);
  const [res, setRes] = useState({});
  const [toast, show] = useToast();

  const vis = CATS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = (n) => setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));

  const act = (names, hide) => {
    if (!names.length) return show('Select one or more categories first');
    const out = {};
    let changed = 0;
    names.forEach((n) => {
      const c = CATS.find((x) => x.name === n);
      if (!c.present) out[n] = 'Not in any loaded model';
      else { out[n] = hide ? 'Hidden in all models' : 'Shown in all models'; changed += 1; }
    });
    setRes((r) => ({ ...r, ...out }));
    setHidden((h) => {
      const set = new Set(h);
      names.forEach((n) => { if (CATS.find((x) => x.name === n).present) hide ? set.add(n) : set.delete(n); });
      return [...set];
    });
    show(`${changed} categor${changed === 1 ? 'y' : 'ies'} ${hide ? 'hidden' : 'shown'} across all loaded models`);
  };

  return (
    <>
      <Info
        n="14" eyebrow="Navisworks add-in tool"
        title={<>Hide by <em>Category</em></>}
        desc="Hide or show standard Revit categories across every loaded model in one pass, without building a search or selection set."
        bullets={['A fixed menu of standard categories, filterable', 'Resolved on demand with Navisworks’ native search', 'A Last Result column, including categories not in the model']}
        chips={['C#', '.NET 4.8', 'WPF', 'Native search']}
        hint="select categories and Hide Selected, then try Roofs"
      />
      <DesktopWin title="Hide By Category" sub="Navisworks Tools" toast={toast}>
        <div className="card" style={{ flex: 1 }}>
          <h4>Categories · {hidden.length} hidden · {sel.length} selected</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input className="tx" style={{ width: 220 }} placeholder="Filter categories…" value={q} onChange={(e) => setQ(e.target.value)} />
            <span style={{ flex: 1 }} />
            <button className="btn" onClick={() => act(CATS.map((c) => c.name), false)}>Show All</button>
            <button className="btn" onClick={() => act(CATS.map((c) => c.name), true)}>Hide All</button>
          </div>
          <table>
            <thead><tr><th style={{ width: 24 }} /><th>Category</th><th>State</th><th>Last result</th></tr></thead>
            <tbody>
              {vis.map((c, i) => (
                <tr key={c.name} className={'r' + (sel.includes(c.name) ? ' sel' : '')} style={{ '--i': i }} onClick={() => toggle(c.name)}>
                  <td><span className={'cb' + (sel.includes(c.name) ? '' : ' o')} /></td>
                  <td>{c.name}</td>
                  <td>{hidden.includes(c.name) ? <span className="p at">Hidden</span> : <span className="p ok">Visible</span>}</td>
                  <td style={{ color: res[c.name] ? 'var(--text)' : 'var(--muted)' }}>{res[c.name] || '—'}</td>
                </tr>
              ))}
              {!vis.length && <tr><td colSpan={4} style={{ color: 'var(--muted)' }}>No category matches “{q}”</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => act(sel, false)}>Show Selected</button>
          <button className="btn gold pulse" onClick={() => act(sel, true)}>Hide Selected</button>
        </div>
      </DesktopWin>
    </>
  );
}
