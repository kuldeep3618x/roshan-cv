import { useCallback, useEffect, useRef, useState } from 'react';

export const fmt = (n) => n.toLocaleString('en-US');

export function CountUp({ to, dur = 900 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const step = (t) => {
      t0 ??= t;
      const p = Math.min(1, (t - t0) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <>{fmt(v)}</>;
}

export function GrowBar({ pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="bar">
      <i style={{ width: w + '%', background: color }} />
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  const timer = useRef();
  const show = useCallback((m) => {
    setMsg(m);
    setOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [<div key="toast" className={'toast' + (on ? ' show' : '')}>{msg}</div>, show];
}

export function Info({ n, eyebrow, title, desc, bullets, chips, hint }) {
  return (
    <div className="info">
      <div className="eyebrow"><b>{n}</b>{eyebrow}</div>
      <h1>{title}</h1>
      <p>{desc}</p>
      <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      <div className="chips">{chips.map((c) => <span key={c}>{c}</span>)}</div>
      <div className="note">Illustration with sample data</div>
      <div className="hint">&#9654; Try it: {hint}</div>
    </div>
  );
}

export function DesktopWin({ title, sub, pin = true, toast, children }) {
  return (
    <div className="win">
      <div className="hd">
        <div><b>{title}</b><small>{sub}</small></div>
        <div className="c">{pin && <span>&#128204;</span>}<span>&mdash;</span><span>&#9633;</span><span>&#10005;</span></div>
      </div>
      <div className="pad">{children}</div>
      {toast}
    </div>
  );
}

export function BrowserWin({ url, toast, children }) {
  return (
    <div className="win">
      <div className="browser">
        <div className="d"><i /><i /><i /></div>
        <div className="u">{url}</div>
      </div>
      <div className="wb">{children}</div>
      {toast}
    </div>
  );
}
