import { useCallback, useEffect, useState } from 'react';
import ClashTolerance from './pages/ClashTolerance.jsx';
import ClashAnalyser from './pages/ClashAnalyser.jsx';
import WorksetAssigner from './pages/WorksetAssigner.jsx';
import FabricBridge from './pages/FabricBridge.jsx';
import HealthCheck from './pages/HealthCheck.jsx';
import MidpTidp from './pages/MidpTidp.jsx';
import Tour, { TOURS } from './Tour.jsx';

const PAGES = [
  { n: '01', t: 'Clash tolerance', k: 'Navisworks add-in', C: ClashTolerance },
  { n: '02', t: 'Clash analyser', k: 'Navisworks add-in', C: ClashAnalyser },
  { n: '03', t: 'Workset assigner', k: 'Revit add-in', C: WorksetAssigner },
  { n: '04', t: 'ACC to Fabric', k: 'APS web app', C: FabricBridge },
  { n: '05', t: 'Model health', k: 'APS web app', C: HealthCheck },
  { n: '06', t: 'MIDP / TIDP', k: 'APS web app', C: MidpTidp },
];

const fromHash = () => {
  const m = window.location.hash.match(/#\/(\d)/);
  const i = m ? Number(m[1]) - 1 : 0;
  return i >= 0 && i < PAGES.length ? i : 0;
};

export default function App({ embed = false }) {
  const [i, setI] = useState(fromHash);
  const [auto, setAuto] = useState(false);
  const [tour, setTour] = useState(false);
  const [run, setRun] = useState(0);
  const go = useCallback((d) => setI((v) => (v + d + PAGES.length) % PAGES.length), []);

  useEffect(() => {
    window.location.hash = '/' + (i + 1);
  }, [i]);
  useEffect(() => {
    const h = () => setI(fromHash());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  useEffect(() => {
    const h = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [go]);
  useEffect(() => {
    if (!auto || tour) return;
    const t = setInterval(() => go(1), 12000);
    return () => clearInterval(t);
  }, [auto, tour, go]);

  const Page = PAGES[i].C;
  return (
    <>
      <header className="sh-hd">
        <h1>BIM automation <em>toolkit</em></h1>
        <nav className="tabs">
          {PAGES.map((p, k) => (
            <button key={p.n} className={'tab' + (k === i ? ' on' : '')} onClick={() => setI(k)}>
              <b>{p.n}</b>{p.t}
            </button>
          ))}
        </nav>
        <div className="ctl">
          <button className="ib" onClick={() => go(-1)} aria-label="Previous">&larr;</button>
          <button className="ib" onClick={() => go(1)} aria-label="Next">&rarr;</button>
          <button className={'ib' + (auto ? ' on' : '')} onClick={() => setAuto(!auto)}>{auto ? 'Pause' : 'Autoplay'}</button>
        </div>
      </header>
      <main key={i + ':' + run} className="page">
        <Page />
      </main>
      <div className="fab">
        <button className="btn" onClick={() => { setTour(false); setRun((r) => r + 1); }}>&#8635; Reset demo</button>
        <button className="btn gold" onClick={() => { setAuto(false); setTour(true); }}>&#10024; Guided tour</button>
      </div>
      {tour && <Tour key={i + ':' + run} steps={TOURS[i]} onClose={() => setTour(false)} />}
      <div className="foot">{PAGES[i].k} &middot; use the &larr; &rarr; keys to switch &middot; every control inside the window works</div>
    </>
  );
}
