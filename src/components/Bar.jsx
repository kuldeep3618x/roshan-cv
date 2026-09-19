import { useEffect, useRef, useState } from 'react';

// Proficiency bar that animates its fill when first visible.
export default function Bar({ label, pct }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    // Safety net for throttled observers: fill bars that are already on screen.
    const fallback = setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        setOn(true);
        io.disconnect();
      }
    }, 700);

    return () => {
      clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  return (
    <div className="bar" ref={ref}>
      <div className="bar__row">
        <span>{label}</span>
        <span className="bar__pct">{pct}%</span>
      </div>
      <div className="bar__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="bar__fill" style={{ width: on ? `${pct}%` : '0%' }} />
      </div>
    </div>
  );
}
