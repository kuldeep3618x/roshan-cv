import { useState } from 'react';
import { BrowserWin, CountUp, GrowBar, Info } from '../ui.jsx';

const DOCS = [
  ['PRJ-ARC-XX-00-DR-A-1001', 'Ground floor plan', ['PDF', 'DWG'], true],
  ['PRJ-ARC-XX-01-DR-A-1002', 'Level 01 plan', ['PDF', 'DWG'], true],
  ['PRJ-ARC-XX-ZZ-DR-A-2001', 'Sections', ['PDF'], false],
  ['PRJ-ARC-XX-ZZ-M3-A-0001', 'Federated model', ['RVT'], true],
  ['PRJ-ARC-XX-ZZ-SH-A-3001', 'Door schedule', ['XLSX'], false],
  ['PRJ-ARC-XX-ZZ-DR-A-2002', 'Elevations', ['PDF'], true],
  ['PRJ-ARC-XX-ZZ-DR-A-2003', 'Roof plan', ['PDF', 'DWG'], false],
].map(([no, title, fmts, found]) => ({ no, title, fmts, found }));

export default function MidpTidp() {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const rows = DOCS.filter((d) => (filter === 'all' || (filter === 'found') === d.found) && (d.no + d.title).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <Info
        n="06" eyebrow="APS web app"
        title={<>MIDP / TIDP <em>delivery</em> check</>}
        desc="Compare the information delivery plan against what is actually in ACC, so teams see what has been delivered and what is still missing."
        bullets={['Reads the TIDP/MIDP schedule from ACC or an upload', 'Matches file names exactly, then starts-with, then contains', 'Filter to shared files and export a QA report']}
        chips={['React', 'Node.js', 'ACC Data Management', 'Excel']}
        hint="filter Found / Missing, search a document number"
      />
      <BrowserWin url="localhost:5173 / check">
        <div className="top">
          <div><h2>Delivery check</h2><div className="sub">Schedule vs ACC folder · Shared / Architecture</div></div>
          <span className="tag">Only shared: on</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="tile" style={{ '--c': '#7c93ad' }}><small>Scheduled</small><b><CountUp to={240} /></b></div>
          <div className="tile" style={{ '--c': '#8fa876' }}><small>Found</small><b style={{ color: '#8fa876' }}><CountUp to={201} /></b></div>
          <div className="tile h"><small>Missing</small><b><CountUp to={39} /></b></div>
          <div className="tile" style={{ '--c': '#6fa39d' }}>
            <small>Delivery rate</small><b><CountUp to={84} />%</b>
            <div style={{ marginTop: 6 }}><GrowBar pct={84} color="linear-gradient(90deg,#8fa876,#6fa39d)" /></div>
          </div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0, flex: 1 }}>Deliverables</h4>
            <input className="tx" style={{ width: 150 }} placeholder="Search document…" value={q} onChange={(e) => setQ(e.target.value)} />
            {[['all', 'All'], ['found', 'Found'], ['missing', 'Missing']].map(([k, l]) => (
              <span key={k} className={'chipbtn' + (filter === k ? ' on' : '')} onClick={() => setFilter(k)}>{l}</span>
            ))}
          </div>
          <table>
            <thead><tr><th>Document number</th><th>Title</th><th>Formats</th><th>Result</th></tr></thead>
            <tbody>
              {rows.map((d, i) => (
                <tr key={d.no} className="r" style={{ '--i': i }}>
                  <td className="mono">{d.no}</td><td>{d.title}</td>
                  <td>{d.fmts.map((f) => <span className="fmt" key={f}>{f}</span>)}</td>
                  <td><span className={'p ' + (d.found ? 'ok' : 'fl')}>{d.found ? 'Found' : 'Missing'}</span></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={4} style={{ color: 'var(--muted)' }}>No deliverables match</td></tr>}
            </tbody>
          </table>
          <div style={{ marginTop: 'auto', paddingTop: 8, fontSize: 11, color: 'var(--muted)' }}>Showing {rows.length} of 240 scheduled deliverables (sample)</div>
        </div>
      </BrowserWin>
    </>
  );
}
