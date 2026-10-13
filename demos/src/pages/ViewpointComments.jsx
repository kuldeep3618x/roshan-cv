import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

const INIT = [
  ['Design review 01', 'Level 03 corridor', ['Services clash above ceiling', 'Raise duct 150 mm']],
  ['Design review 01', 'Plant room entry', ['Door swing hits pipework']],
  ['Design review 01', 'Podium atrium', []],
  ['Coordination 04', 'Riser R2 section', ['Sleeve missing on slab', 'Confirm with structure']],
  ['Coordination 04', 'Roof plant', ['Access clearance below 600 mm']],
  ['Coordination 04', 'Facade corner', []],
].map(([folder, name, comments], id) => ({ id, folder, name, comments }));

export default function ViewpointComments() {
  const [rows, setRows] = useState(INIT);
  const [sel, setSel] = useState([1]);
  const [txt, setTxt] = useState('');
  const [toast, show] = useToast();
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const total = rows.reduce((a, r) => a + r.comments.length, 0);

  const add = () => {
    if (!sel.length || !txt.trim()) return show('Select a viewpoint and type a comment');
    setRows((rs) => rs.map((r) => (sel.includes(r.id) ? { ...r, comments: [...r.comments, txt.trim()] } : r)));
    setTxt('');
    show('Comment added');
  };
  const del = () => {
    const withC = sel.filter((id) => rows[id].comments.length);
    if (!withC.length) return show('Selected viewpoints have no comments to delete');
    setRows((rs) => rs.map((r) => (withC.includes(r.id) ? { ...r, comments: r.comments.slice(0, -1) } : r)));
    show('Latest comment deleted from the selection');
  };
  const exp = (what) => {
    if (!sel.length) return show('Select one or more viewpoints first');
    const n = sel.reduce((a, id) => a + Math.max(1, rows[id].comments.length), 0);
    show(what === 'csv' ? `${n} comment rows exported (empty viewpoints keep a row)` : what === 'xml' ? `${sel.length} viewpoint definitions exported to XML` : `Report with ${sel.length} screenshots built · opening in browser`);
  };

  return (
    <>
      <Info
        n="13" eyebrow="Navisworks add-in tool"
        title={<>Viewpoint <em>Comments</em></>}
        desc="Review and manage the comments on every saved viewpoint in one grid, then export them as CSV, Excel, XML or an HTML report."
        bullets={['Folder, name, comment count and last comment', 'Add, edit and delete comments in place', 'Exports act on the viewpoints you select']}
        chips={['C#', '.NET 4.8', 'WPF', 'HTML report']}
        hint="select viewpoints, add a comment, then try an export"
      />
      <DesktopWin title="Viewpoint Comments" sub="Navisworks Tools" toast={toast}>
        <div className="card" style={{ flex: 1 }}>
          <h4>Saved viewpoints · {rows.length} viewpoints · {total} comments</h4>
          <table>
            <thead><tr><th style={{ width: 24 }} /><th>Folder</th><th>Viewpoint</th><th>Comments</th><th>Last comment</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={'r' + (sel.includes(r.id) ? ' sel' : '')} style={{ '--i': i }} onClick={() => toggle(r.id)}>
                  <td><span className={'cb' + (sel.includes(r.id) ? '' : ' o')} /></td>
                  <td>{r.folder}</td><td>{r.name}</td><td>{r.comments.length}</td>
                  <td style={{ color: r.comments.length ? 'var(--text)' : 'var(--muted)' }}>{r.comments[r.comments.length - 1] || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="tx" style={{ flex: 1 }} placeholder="Comment for the selected viewpoints…" value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          <button className="btn" onClick={add}>Add Comment</button>
          <button className="btn" onClick={del}>Delete Selected</button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => exp('csv')}>Export Selected CSV…</button>
          <button className="btn" onClick={() => exp('csv')}>Export Selected Excel…</button>
          <button className="btn" onClick={() => exp('xml')}>Export Viewpoints…</button>
          <button className="btn gold" onClick={() => exp('html')}>Export Viewpoints Report…</button>
        </div>
      </DesktopWin>
    </>
  );
}
