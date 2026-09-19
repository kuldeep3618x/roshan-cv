import { credentials } from '../data/cv.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

export default function Credentials() {
  const { education, certifications, languages, honors } = credentials;
  return (
    <section className="section section--alt" id="credentials">
      <div className="container">
        <SectionHead kicker="Education & credentials" title="Background" />
        <div className="grid grid--4">
          <Reveal className="card">
            <h3>Education</h3>
            {education.map((e) => (
              <p key={e.title}>
                <strong>{e.title}</strong>
                <br />
                <span className="muted">
                  {e.org} ({e.year})
                </span>
              </p>
            ))}
          </Reveal>
          <Reveal className="card" delay={60}>
            <h3>Certifications</h3>
            <ul className="plain">
              {certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="card" delay={120}>
            <h3>Languages</h3>
            <ul className="plain">
              {languages.map((l) => (
                <li key={l.name}>
                  <strong>{l.name}</strong> <span className="muted">— {l.level}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="card" delay={180}>
            <h3>Honors</h3>
            <ul className="plain">
              {honors.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
