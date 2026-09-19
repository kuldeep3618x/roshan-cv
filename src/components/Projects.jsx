import { projects } from '../data/cv.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

const ICONS = {
  mountain: <path d="M3 19l6-10 4 6 3-4 5 8z" />,
  depot: <path d="M3 19V9l9-5 9 5v10zM8 19v-6h8v6" />,
  tower: <path d="M8 21V4h8v17M4 21h16M11 8h2M11 12h2M11 16h2" />,
  stadium: <path d="M3 10c0-3 4-5 9-5s9 2 9 5-4 5-9 5-9-2-9-5zM3 10v6c0 3 4 5 9 5s9-2 9-5v-6" />,
  plane: <path d="M2 14l8-2-2-8h2l5 8 6-1v2l-6 1-5 8h-2l2-8-8-2z" />,
  home: <path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6" />,
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export default function Projects() {
  return (
    <section className="section section--alt" id="projects">
      <div className="container">
        <SectionHead kicker="Notable projects" title="Large-scale delivery" />
        <div className="grid grid--3">
          {projects.map((p, i) => (
            <Reveal key={p.name} className="card project" delay={i * 60}>
              <span className="project__icon">
                <Icon name={p.icon} />
              </span>
              <h3>{p.name}</h3>
              <p className="muted">
                {p.meta} — {p.place}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
