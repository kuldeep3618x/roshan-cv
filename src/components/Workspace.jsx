import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

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
          <SectionHead kicker="Workspace" title="A comfortable setup helps me do focused work" />
          <Reveal>
            <p className="lead">
              Good BIM and automation work needs long stretches of concentration. A comfortable, well-organised environment
              is one of the simplest ways I protect that focus and keep quality consistent.
            </p>
            <ul className="workspace__list">
              {points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="workspace__video" delay={100}>
          <video
            controls
            playsInline
            preload="metadata"
            poster={`${import.meta.env.BASE_URL}media/workspace-poster.jpg`}
            aria-label="Video of my workspace"
          >
            <source src={`${import.meta.env.BASE_URL}media/workspace.mp4`} type="video/mp4" />
            Your browser does not support embedded video.
          </video>
        </Reveal>
      </div>
    </section>
  );
}
