import { summary, focus } from '../data/cv.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Bar from './Bar.jsx';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <div>
          <SectionHead kicker="Profile" title="BIM management meets software development" />
          <Reveal>
            {summary.map((p) => (
              <p key={p} className="lead">
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        <Reveal className="card about__focus" delay={100}>
          <h3>Career focus</h3>
          {focus.map((f) => (
            <Bar key={f.name} label={f.name} pct={f.pct} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
