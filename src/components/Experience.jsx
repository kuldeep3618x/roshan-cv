import { useState } from 'react';
import { experience } from '../data/cv.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

function Role({ item, open, onToggle, id }) {
  return (
    <Reveal as="li" className={`role ${item.current ? 'role--current' : ''} ${open ? 'is-open' : ''}`}>
      <button type="button" className="role__head" onClick={onToggle} aria-expanded={open} aria-controls={id}>
        <span className="role__title">
          <strong>{item.role}</strong>
          <span className="role__org">{item.org}</span>
        </span>
        <span className="role__meta">
          <span className="role__dates">{item.dates}</span>
          <span className="role__place">{item.place}</span>
        </span>
        <span className="role__chev" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <ul className="role__body" id={id}>
          {item.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}

export default function Experience() {
  const [openIdx, setOpenIdx] = useState(new Set([0]));

  const toggle = (i) =>
    setOpenIdx((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const allOpen = openIdx.size === experience.length;

  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-head section-head--row">
          <div>
            <p className="eyebrow">Professional experience</p>
            <h2>Career timeline</h2>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setOpenIdx(allOpen ? new Set() : new Set(experience.map((_, i) => i)))}
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        <ol className="timeline">
          {experience.map((item, i) => (
            <Role key={`${item.org}-${item.dates}`} item={item} id={`role-${i}`} open={openIdx.has(i)} onToggle={() => toggle(i)} />
          ))}
        </ol>
      </div>
    </section>
  );
}
