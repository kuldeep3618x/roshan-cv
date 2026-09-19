import { useEffect } from 'react';
import { tools, toolBySlug } from '../data/tools.js';
import { toolHref } from '../router.js';
import Architecture from '../components/Architecture.jsx';
import DemoFrame from '../components/DemoFrame.jsx';
import Reveal from '../components/Reveal.jsx';

export default function ToolPage({ slug }) {
  const tool = toolBySlug[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = tool ? `${tool.name} — Roshan Kerketta` : 'Roshan Kerketta — BIM Manager';
    return () => {
      document.title = 'Roshan Kerketta — BIM Manager';
    };
  }, [slug, tool]);

  if (!tool) {
    return (
      <section className="section">
        <div className="container">
          <h1>Tool not found</h1>
          <p className="muted">That page does not exist.</p>
          <a className="btn btn--primary" href="#tools">
            Back to all tools
          </a>
        </div>
      </section>
    );
  }

  const i = tools.findIndex((t) => t.slug === slug);
  const prev = tools[(i - 1 + tools.length) % tools.length];
  const next = tools[(i + 1) % tools.length];

  return (
    <article className="tool">
      <header className="tool__hero">
        <div className="container">
          <a className="tool__back" href="#tools">
            ← All tools
          </a>
          <p className="eyebrow">
            {tool.n} · {tool.kind}
          </p>
          <h1 className="tool__title">{tool.name}</h1>
          <p className="tool__tagline">{tool.tagline}</p>
          <div className="tool__meta">
            <span className={`badge badge--${tool.status === 'Built' ? 'built' : 'wip'}`}>{tool.status}</span>
            <ul className="chips chips--light">
              {tool.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container tool__intro">
          <Reveal>
            <h2 className="h-sm">The problem</h2>
            <p className="lead">{tool.problem}</p>
            <h2 className="h-sm">What it does</h2>
            <ul className="ticks">
              {tool.outcome.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <a className="tool__shot" href={tool.image} target="_blank" rel="noreferrer" title="Open full size">
              <img src={tool.image} alt={`${tool.name} — illustration with sample data`} width="1600" height="900" loading="lazy" />
              <span>Illustration with sample data</span>
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" id="demo">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Try it</p>
            <h2>Interactive demo</h2>
          </div>
          <DemoFrame index={Number(tool.n)} title={tool.name} hint={tool.demoHint} />
        </div>
      </section>

      <section className="section" id="architecture">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Architecture &amp; how it works</p>
            <h2>From click to result</h2>
            <p className="muted">Step through a run, or click any box to see what it does.</p>
          </div>
          <Architecture diagram={tool.diagram} steps={tool.steps} />
        </div>
      </section>

      <section className="section section--alt" id="decisions">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Design decisions</p>
            <h2>Why it is built this way</h2>
          </div>
          <div className="grid grid--2">
            {tool.decisions.map((d, k) => (
              <Reveal key={d.t} className="card decision" delay={(k % 2) * 80}>
                <h3>{d.t}</h3>
                <p className="muted">{d.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <nav className="section tool__nav" aria-label="More tools">
        <div className="container tool__navrow">
          <a className="card tool__navcard" href={toolHref(prev.slug)}>
            <span className="muted">← Previous</span>
            <strong>{prev.name}</strong>
          </a>
          <a className="card tool__navcard tool__navcard--next" href={toolHref(next.slug)}>
            <span className="muted">Next →</span>
            <strong>{next.name}</strong>
          </a>
        </div>
      </nav>
    </article>
  );
}
