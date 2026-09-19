import { profile, stats } from '../data/cv.js';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <p className="eyebrow">{profile.location}</p>
        <h1 className="hero__title">
          {profile.name}
          <span className="hero__role">{profile.title}</span>
        </h1>
        <p className="hero__tagline">{profile.tagline}</p>
        <div className="hero__cta">
          <a className="btn btn--primary" href={profile.cvFile} download>
            Download CV
          </a>
          <a className="btn btn--ghost" href="#contact">
            Get in touch
          </a>
          <a className="btn btn--ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </div>
      </div>

      <div className="container">
        <ul className="stats">
          {stats.map((s) => (
            <li key={s.label} className="stats__item">
              <span className="stats__value">{s.value}</span>
              <span className="stats__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
