import { portfolio, toolUsage } from '../data/cv.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Bar from './Bar.jsx';

export default function Portfolio() {
  return (
    <section className="section" id="tools">
      <div className="container">
        <SectionHead kicker="Automation & application portfolio" title="Tools I have built" />
        <div className="grid grid--2">
          {portfolio.map((a, i) => (
            <Reveal key={a.name} className="card app" delay={(i % 2) * 80}>
              <h3>{a.name}</h3>
              <p className="app__stack">{a.stack}</p>
              <p className="muted">{a.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="card usage">
          <h3>Tools &amp; platforms usage</h3>
          <div className="usage__grid">
            {toolUsage.map((t) => (
              <Bar key={t.name} label={t.name} pct={t.pct} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
