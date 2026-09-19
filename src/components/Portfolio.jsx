import { portfolio, toolUsage } from '../data/cv.js';
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
          Each tool has its own page with an interactive demo, an architecture diagram and a step-by-step walkthrough. All screens use sample data.
        </p>

        <div className="grid grid--2">
          {tools.map((t, i) => (
            <Reveal key={t.slug} className="card feat" delay={(i % 2) * 80}>
              <a className="feat__link" href={toolHref(t.slug)}>
                <div className="feat__img">
                  <img src={t.image} alt="" width="1600" height="900" loading="lazy" />
                  <span className={`badge badge--${t.status === 'Built' ? 'built' : 'wip'}`}>{t.status}</span>
                </div>
                <div className="feat__body">
                  <p className="feat__kind">
                    {t.n} · {t.kind}
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
                  <span className="feat__cta">View demo &amp; architecture →</span>
                </div>
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
