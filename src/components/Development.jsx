import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

const LANES = [
  {
    tag: 'Shipping now',
    tone: 'wip',
    title: 'APS Command Center and add-in board',
    items: [
      'Delivery dashboards on one platform: executive view, model sharing, issues, clash coordination, BIM health, MIDP/TIDP.',
      'Add-in control board: publish versions, roll back, assign to a user, an office or everyone, with a kill switch and usage analytics.',
      'Cloud model health checks and the ACC to Fabric pipeline, both moving from prototype to production use.',
    ],
  },
  {
    tag: 'Built',
    tone: 'built',
    title: 'Tools already in use',
    items: [
      'Navisworks clash tolerance and live clash analyser.',
      'Revit workset assigner with rule-based standards.',
      'MIDP / TIDP delivery check against what is in ACC.',
    ],
  },
  {
    tag: 'Always improving',
    tone: 'next',
    title: 'How I keep building',
    items: [
      'Small, frequent releases: each tool gets fixes and features as real project feedback comes in.',
      'AI-assisted engineering for scaffolding, refactoring and tests, with every change reviewed and owned by me.',
      'Coding day and night, alongside the model coordination and information management the tools are built to support.',
    ],
  },
];

export default function Development() {
  return (
    <section className="section" id="development">
      <div className="container">
        <SectionHead kicker="Ongoing development" title="What I am building right now" />
        <div className="dev">
          {LANES.map((l, i) => (
            <Reveal key={l.tag} className={`card dev__lane dev__lane--${l.tone}`} delay={i * 90}>
              <span className={`badge badge--${l.tone === 'built' ? 'built' : 'wip'}`}>{l.tag}</span>
              <h3>{l.title}</h3>
              <ul className="ticks">
                {l.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
