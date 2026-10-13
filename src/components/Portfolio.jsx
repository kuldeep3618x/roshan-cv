import { portfolio, toolUsage, openSource } from '../data/cv.js';
import { tools } from '../data/tools.js';
import { toolHref } from '../router.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Bar from './Bar.jsx';

export default function Portfolio() {
  return (
    <section className="section" id="tools">
      <div className="container">
        <SectionHead kicker="Automation & application portfolio" title="Tools I have built and am building" />
        <p className="muted tools__intro">
          Each tool has its own page with an architecture diagram and a step-by-step walkthrough, plus a video or interactive demo where one exists. All screens use sample data.
        </p>

        <div className="grid grid--2">
          {tools.map((t, i) => (
            <Reveal key={t.slug} className="card feat" delay={(i % 2) * 80}>
              <a className="feat__link" href={toolHref(t.slug)}>
                <div className={`feat__img ${t.image ? '' : 'feat__img--plain'}`}>
                  {t.image ? (
                    <img src={t.image} alt="" width="1600" height="900" loading="lazy" />
                  ) : (
                    <div className="feat__plain" aria-hidden="true">
                      <span>{t.version || t.n}</span>
                      <strong>{t.name}</strong>
                    </div>
                  )}
                  <span className={`badge badge--${['Built', 'Deployed'].includes(t.status) ? 'built' : 'wip'}`}>{t.status}</span>
                </div>
                <div className="feat__body">
                  <p className="feat__kind">
                    {t.n} · {t.kind}
                    {t.version ? ` · ${t.version}` : ''}
                  </p>
                  <h3>{t.name}</h3>
                  <p className="muted">{t.tagline}</p>
                  <ul className="chips">
                    {t.stack.slice(0, 4).map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <span className="feat__cta">{t.demo ? 'View demo & architecture →' : 'View architecture & walkthrough →'}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <h3 className="tools__more">Open source on GitHub</h3>
        <div className="grid grid--3">
          {openSource.map((r, i) => (
            <Reveal key={r.name} className="card repo" delay={i * 60}>
              <h3>{r.name}</h3>
              <p className="app__stack">{r.stack}</p>
              <p className="muted">{r.text}</p>
              <a className="feat__cta" href={r.url} target="_blank" rel="noreferrer">
                View on GitHub ↗
              </a>
            </Reveal>
          ))}
        </div>

        <h3 className="tools__more">More automations</h3>
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
