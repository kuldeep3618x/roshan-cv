import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import WorkScene from './WorkScene.jsx';

const points = [
  'Low, warm lighting and a tidy desk keep screens comfortable during long modelling and coordination sessions.',
  'Everything within reach (large display, notes, reference) means fewer interruptions and less context switching.',
  'A calm, personal space makes deep-focus work, like building automation tools, easier to sustain.',
];

export default function Workspace() {
  return (
    <section className="section" id="workspace">
      <div className="container workspace">
        <div>
          <SectionHead kicker="How I work" title="Day and night, on the tools and the models" />
          <Reveal>
            <p className="lead">
              My days move between writing code, coordinating federated models, reviewing dashboards and talking to project teams. Good BIM and automation work needs long stretches of concentration, so I protect a calm, well-organised space to do it in.
            </p>
            <ul className="workspace__list">
              {points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="workspace__scene" delay={100}>
          <WorkScene />
        </Reveal>
      </div>
    </section>
  );
}
