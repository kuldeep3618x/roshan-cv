import { useState } from 'react';

// Isolated interactive demo (built from demos/ into public/demos/index.html). Loaded only when asked for.
export default function DemoFrame({ index, title, hint }) {
  const [loaded, setLoaded] = useState(false);
  const [go, setGo] = useState(false);
  const src = `demos/index.html?embed#/${index}`;

  return (
    <div className="demo">
      <div className="demo__bar">
        <span className="demo__tag">Interactive demo · sample data</span>
        {hint && <span className="demo__hint">Try it: {hint}</span>}
      </div>
      <div className="demo__stage">
        {!go && (
          <button type="button" className="demo__start" onClick={() => setGo(true)}>
            <span className="demo__play" aria-hidden="true">
              ▶
            </span>
            Launch the {title} demo
          </button>
        )}
        {go && (
          <>
            {!loaded && <div className="demo__loading">Loading demo…</div>}
            <iframe
              className="demo__frame"
              title={`${title} interactive demo`}
              src={src}
              onLoad={() => setLoaded(true)}
              loading="lazy"
            />
          </>
        )}
      </div>
    </div>
  );
}
