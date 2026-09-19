import { useEffect, useId, useMemo, useState } from 'react';

const W = 1100;
const PAD_X = 30;
const PAD_Y_FLAT = 34;
const PAD_Y_ARC = 84; // headroom for arcs that hop over boxes, plus their label
const ROW_H = 150;
const BOX_H = 84;

const KIND_LABEL = {
  actor: 'User / UI',
  app: 'Our code',
  service: 'External service',
  data: 'Data / files',
};

function layout(diagram) {
  const { cols, rows, nodes, edges } = diagram;
  const colW = (W - PAD_X * 2) / cols;
  const boxW = Math.min(colW - 68, 190);
  const byNode = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const hasArc = edges.some((e) => byNode[e.from].row === byNode[e.to].row && Math.abs(byNode[e.from].col - byNode[e.to].col) > 1);
  const PAD_Y = hasArc ? PAD_Y_ARC : PAD_Y_FLAT;
  const H = PAD_Y + (rows - 1) * ROW_H + BOX_H + 30;
  const pos = {};
  nodes.forEach((n) => {
    const cx = PAD_X + colW * n.col + colW / 2;
    const top = PAD_Y + ROW_H * n.row;
    const cy = top + BOX_H / 2;
    pos[n.id] = { cx, cy, l: cx - boxW / 2, r: cx + boxW / 2, t: top, b: top + BOX_H };
  });
  return { pos, boxW, H };
}

// Edge routing:
//  - same row, adjacent      -> straight line
//  - same row, not adjacent  -> arc over the boxes in between (never through them)
//  - same column             -> straight vertical line
//  - different row and column-> "hv" (default): leave A sideways, turn into B's top/bottom
//                               "vh": leave A's top/bottom, turn into B's side
function edgeGeometry(a, b, nodeA, nodeB, route) {
  if (nodeA.row === nodeB.row) {
    if (Math.abs(nodeB.col - nodeA.col) > 1) {
      const peak = a.t - 58;
      return {
        d: `M${a.cx} ${a.t} C${a.cx} ${peak} ${b.cx} ${peak} ${b.cx} ${b.t}`,
        lx: (a.cx + b.cx) / 2,
        ly: a.t - 50,
        anchor: 'middle',
      };
    }
    const right = nodeB.col > nodeA.col;
    const x1 = right ? a.r : a.l;
    const x2 = right ? b.l : b.r;
    return { d: `M${x1} ${a.cy} L${x2} ${b.cy}`, lx: (x1 + x2) / 2, ly: a.cy - 9, anchor: 'middle' };
  }
  if (nodeA.col === nodeB.col) {
    const down = nodeB.row > nodeA.row;
    const y1 = down ? a.b : a.t;
    const y2 = down ? b.t : b.b;
    return { d: `M${a.cx} ${y1} L${b.cx} ${y2}`, lx: a.cx + 10, ly: (y1 + y2) / 2 + 4, anchor: 'start' };
  }
  const down = nodeB.row > nodeA.row;
  const right = nodeB.col > nodeA.col;
  if (route === 'vh') {
    const y1 = down ? a.b : a.t;
    const x2 = right ? b.l : b.r;
    return { d: `M${a.cx} ${y1} V${b.cy} H${x2}`, lx: a.cx + 10, ly: (y1 + b.cy) / 2, anchor: 'start' };
  }
  const x1 = right ? a.r : a.l;
  const y2 = down ? b.t : b.b;
  return { d: `M${x1} ${a.cy} H${b.cx} V${y2}`, lx: (x1 + b.cx) / 2, ly: a.cy - 9, anchor: 'middle' };
}

export default function Architecture({ diagram, steps }) {
  const uid = useId().replace(/:/g, '');
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [playing, setPlaying] = useState(false);

  const { pos, boxW, H } = useMemo(() => layout(diagram), [diagram]);
  const byId = useMemo(() => Object.fromEntries(diagram.nodes.map((n) => [n.id, n])), [diagram]);
  const active = steps[step];
  const activeNodes = new Set(active.nodes);
  const activeEdges = new Set(active.edges);
  const pickedNode = picked ? byId[picked] : null;

  useEffect(() => {
    setStep(0);
    setPicked(null);
    setPlaying(false);
  }, [diagram]);

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), 4500);
    return () => clearInterval(t);
  }, [playing, steps.length]);

  const go = (i) => {
    setPlaying(false);
    setStep((i + steps.length) % steps.length);
  };

  return (
    <div className="arch">
      <div className="arch__legend" aria-hidden="true">
        {Object.entries(KIND_LABEL).map(([k, label]) => (
          <span key={k} className={`arch__key arch__key--${k}`}>
            {label}
          </span>
        ))}
        <span className="arch__hint">Click a box for details</span>
      </div>

      <div className="arch__canvas">
        <svg className="arch__svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Architecture diagram">
          <defs>
            <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
            </marker>
          </defs>

          {diagram.edges.map((e, i) => {
            const geo = edgeGeometry(pos[e.from], pos[e.to], byId[e.from], byId[e.to], e.route);
            const on = activeEdges.has(i);
            return (
              <g key={`${e.from}-${e.to}-${i}`} className={`arch__edge ${on ? 'is-on' : ''}`}>
                <path
                  d={geo.d}
                  fill="none"
                  markerEnd={`url(#${uid}-arrow)`}
                  markerStart={e.both ? `url(#${uid}-arrow)` : undefined}
                />
                {e.label && (
                  <text x={geo.lx} y={geo.ly} textAnchor={geo.anchor} className="arch__elabel">
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {diagram.nodes.map((n) => {
            const p = pos[n.id];
            const on = activeNodes.has(n.id);
            const sel = picked === n.id;
            return (
              <g
                key={n.id}
                className={`arch__node arch__node--${n.kind} ${on ? 'is-on' : 'is-dim'} ${sel ? 'is-picked' : ''}`}
                transform={`translate(${p.l} ${p.t})`}
                role="button"
                tabIndex={0}
                aria-pressed={sel}
                aria-label={`${n.label}. ${n.sub}`}
                onClick={() => setPicked(sel ? null : n.id)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    setPicked(sel ? null : n.id);
                  }
                }}
              >
                <rect width={boxW} height={BOX_H} rx="12" />
                <foreignObject width={boxW} height={BOX_H}>
                  <div className="arch__text" xmlns="http://www.w3.org/1999/xhtml">
                    <strong>{n.label}</strong>
                    <span>{n.sub}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        <ul className="arch__list">
          {diagram.nodes.map((n) => (
            <li key={n.id} className={`arch__li arch__li--${n.kind} ${activeNodes.has(n.id) ? 'is-on' : ''}`}>
              <button type="button" onClick={() => setPicked(picked === n.id ? null : n.id)} aria-pressed={picked === n.id}>
                <strong>{n.label}</strong>
                <span>{n.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {pickedNode && (
        <div className={`arch__pick arch__pick--${pickedNode.kind}`} role="status">
          <strong>{pickedNode.label}</strong>
          <span className="arch__pickkind">{KIND_LABEL[pickedNode.kind]}</span>
          <p>{pickedNode.desc}</p>
        </div>
      )}

      <div className="arch__steps">
        <div className="arch__stephead">
          <span className="arch__count">
            Step {step + 1} of {steps.length}
          </span>
          <div className="arch__ctl">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(step - 1)} aria-label="Previous step">
              ←
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setPlaying((p) => !p)}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(step + 1)} aria-label="Next step">
              →
            </button>
          </div>
        </div>

        <ol className="arch__dots">
          {steps.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className={i === step ? 'is-on' : i < step ? 'is-done' : ''}
                onClick={() => go(i)}
                aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={i === step ? 'step' : undefined}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>

        <div className="arch__step" key={step} aria-live="polite">
          <h3>{active.title}</h3>
          <p>{active.text}</p>
        </div>
      </div>
    </div>
  );
}
