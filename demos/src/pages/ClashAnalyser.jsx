import { useMemo, useState } from 'react';
import { CountUp, DesktopWin, GrowBar, Info } from '../ui.jsx';

const COLORS = { n: '#ff5c7a', a: '#FFB347', r: '#4cc9f0', p: '#3ddc84', s: '#3ee0c1' };
const LABEL = { n: 'New', a: 'Active', r: 'Reviewed', p: 'Approved', s: 'Resolved' };
const TESTS = [
  ['ARC vs STR', 30, 60, 30, 14, 66], ['ARC vs MEP', 52, 96, 44, 20, 68], ['MEP vs STR', 38, 74, 32, 14, 42],
  ['Ducts vs Pipes', 30, 50, 28, 12, 40], ['Facade vs STR', 20, 40, 24, 12, 52], ['Lift core vs MEP', 14, 26, 16, 8, 34],
  ['Fire stopping', 16, 24, 18, 10, 32], ['Landscape', 12, 16, 12, 6, 16],
].map(([name, n, a, r, p, s]) => ({ name, n, a, r, p, s }));
const SEV = [['Critical', 64, 14, '#ff5c7a'], ['High', 198, 42, '#ff9b3d'], ['Medium', 241, 52, '#FFB347'], ['Low', 95, 20, '#3ddc84']];

export default function ClashAnalyser() {
  const [key, setKey] = useState(null);
  const totals = useMemo(() => {
    const t = { n: 0, a: 0, r: 0, p: 0, s: 0 };
    TESTS.forEach((x) => Object.keys(t).forEach((k) => (t[k] += x[k])));
    return { ...t, tot: t.n + t.a + t.r + t.p + t.s };
  }, []);
  const rows = key && key !== 'tot' ? [...TESTS].sort((x, y) => y[key] - x[key]) : TESTS;
  const tiles = [['tot', 'Total', '#4cc9f0'], ['n', 'New'], ['a', 'Active'], ['r', 'Reviewed'], ['p', 'Approved'], ['s', 'Resolved']];

  return (
    <>
      <Info
        n="02" eyebrow="Navisworks add-in"
        title={<>Clash Analyser <em>dashboard</em></>}
        desc="A live view of every clash test: status and severity at a glance, so coordination meetings start from the numbers instead of a spreadsheet."
        bullets={['Status tiles that reconcile to the total', 'Open-clash severity breakdown, per-test table and trend history', 'Click a tile to filter the table']}
        chips={['C#', 'Navisworks API', 'WPF', 'Excel matrix checks']}
        hint="click a status tile to slice the table"
      />
      <DesktopWin title="Clash Analyser" sub="Navisworks Tools · Dashboard">
        <div style={{ display: 'flex', gap: 8 }}>
          {tiles.map(([k, label, c]) => (
            <div key={k} className={'tile click' + (key === k ? ' on' : '')} style={{ '--c': c || COLORS[k] }} onClick={() => setKey(key === k ? null : k)}>
              <small>{label}</small><b><CountUp to={totals[k]} /></b>
            </div>
          ))}
        </div>
        <div className="row2">
          <div className="card" style={{ width: 230 }}>
            <h4>Open clashes by severity</h4>
            {SEV.map(([l, v, pct, c]) => (
              <div className="sv" key={l}><span>{l}</span><GrowBar pct={pct} color={c} /><em><CountUp to={v} /></em></div>
            ))}
            <h4 style={{ marginTop: 14 }}>Trend · last 8 runs</h4>
            <svg viewBox="0 0 220 70" width="100%" height="70">
              <polyline style={{ strokeDasharray: 400, animation: 'draw 1.6s .3s both' }} fill="none" stroke="#ffc531" strokeWidth="3" points="5,12 35,20 65,26 95,34 125,38 155,48 185,54 215,60" />
              <polyline style={{ strokeDasharray: 400, animation: 'draw 1.6s .5s both' }} fill="none" stroke="#4cc9f0" strokeWidth="3" points="5,60 35,56 65,50 95,44 125,38 155,30 185,22 215,14" />
            </svg>
            <div style={{ fontSize: 10.5, display: 'flex', gap: 14, marginTop: 4 }}><span style={{ color: '#ffc531' }}>&#9632; Open</span><span style={{ color: '#4cc9f0' }}>&#9632; Resolved</span></div>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <h4>{key && key !== 'tot' ? `Per clash test · sorted by ${LABEL[key]}` : 'Per clash test'}</h4>
            <table>
              <thead>
                <tr><th>Test</th>{['n', 'a', 'r', 'p', 's'].map((k) => <th key={k} className={key === k ? 'hl' : ''}>{LABEL[k].slice(0, 3)}.</th>)}<th>Mix</th></tr>
              </thead>
              <tbody>
                {rows.map((t) => {
                  const tot = t.n + t.a + t.r + t.p + t.s;
                  return (
                    <tr key={t.name}>
                      <td>{t.name}</td>
                      {['n', 'a', 'r', 'p', 's'].map((k) => <td key={k} className={key === k ? 'hl' : ''}>{t[k]}</td>)}
                      <td><div className="stk">{['n', 'a', 'r', 'p', 's'].map((k) => <i key={k} style={{ width: (t[k] / tot) * 100 + '%', background: COLORS[k] }} />)}</div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </DesktopWin>
    </>
  );
}
