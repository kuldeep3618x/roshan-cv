import { skillGroups } from '../data/cv.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

export default function Skills() {
  return (
    <section className="section section--alt" id="skills">
      <div className="container">
        <SectionHead kicker="Skills" title="Platforms, code and information management" />
        <div className="grid grid--3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} className="card" delay={i * 80}>
              <h3>{g.title}</h3>
              <ul className="chips">
                {g.items.map((it) => (
                  <li key={it} className="chip">
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
