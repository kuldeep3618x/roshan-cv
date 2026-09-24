import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Guided tour: spotlights real controls inside the demo and explains them one step at a time.
// Each step: find() returns the element to highlight; steps whose element is missing are skipped.
const one = (sel, i = 0) => () => document.querySelectorAll(sel)[i] || null;

export const TOURS = [
  // 01 Clash tolerance
  [
    { find: one('.win'), title: 'This is the add-in window', text: 'It is what opens inside Navisworks Manage. Everything in it really works, so nothing here can break.' },
    { find: one('.tx', 0), title: 'Filter the clash tests', text: 'Type part of a test name (for example “MEP”) to narrow the list on a big federated model.', tryIt: 'Type “ARC” in the box.' },
    { find: one('tbody tr', 0), title: 'Tick the tests to change', text: 'Click any row to tick or untick it. Highlighted rows are the ones that will be updated.', tryIt: 'Click a row.' },
    { find: one('.tx', 1), title: 'Pick one tolerance', text: 'The value in millimetres that every ticked test will get.', tryIt: 'Change 10 to 25.' },
    { find: one('.btn.gold'), title: 'Apply in one undoable step', text: 'All ticked tests update together. In Navisworks one Ctrl+Z reverts the whole batch.', tryIt: 'Press Apply Tolerance.' },
  ],
  // 02 Clash analyser
  [
    { find: one('.tile.click', 0), title: 'Status tiles', text: 'Each tile is a total for one clash status: new, active, reviewed, approved or resolved.', tryIt: 'Click a tile.' },
    { find: one('.tile.click', 1), title: 'Tiles filter the table', text: 'Clicking a tile highlights that status column in the table, so a coordination meeting can go straight to what is new.' },
    { find: one('.sv'), title: 'Severity at a glance', text: 'Open clashes grouped by severity, so the critical ones are never buried.' },
    { find: one('table'), title: 'One row per clash test', text: 'Counts for every status, per test. This replaces exporting to a spreadsheet before each meeting.' },
    { find: one('.stk', 0), title: 'The mix bar', text: 'The coloured bar shows how each test splits across statuses, which is faster to read than numbers.' },
  ],
  // 03 Workset assigner
  [
    { find: one('.tx', 0), title: 'Choose a standard', text: 'A workset standard is a saved set of rules. Pick which one to apply.' },
    { find: one('.ws', 0), title: 'Rules for each workset', text: 'Each card says which elements go to which workset, for example “Category = Walls, Type contains Ext”.', tryIt: 'Click a rule card.' },
    { find: one('.seg'), title: 'Choose the scope', text: 'Preview and apply to a selection, the active view or the entire model.', tryIt: 'Switch to “Selection”.' },
    { find: one('table'), title: 'Preview before anything moves', text: 'Every element shows its current workset and where it will go. “No rule matched” flags elements your rules do not cover yet.' },
    { find: one('.btn.gold'), title: 'Apply to the model', text: 'Moves everything in one step. Reset puts the preview back.', tryIt: 'Press Apply to model.' },
  ],
  // 04 ACC to Fabric
  [
    { find: one('.tile', 0), title: 'Three simple steps', text: 'Connect to Autodesk Construction Cloud, choose the models, then choose where the data lands.' },
    { find: one('.sel-box'), title: 'Browse your hub', text: 'Pick a project and folder, then tick the Revit models you want to extract.', tryIt: 'Untick a model.' },
    { find: one('.btn.gold'), title: 'Extract', text: 'Starts the run for the ticked models. The tool waits for ACC to translate each file, retries when needed and isolates errors per file.', tryIt: 'Press Extract selected.' },
    { find: one('.pr', 0), title: 'Live progress', text: 'One bar per model showing elements extracted. A failed model never stops the others.' },
  ],
  // 05 Model health check
  [
    { find: one('.tile', 0), title: 'Batch summary', text: 'How many models ran, and how many passed, need attention or failed.' },
    { find: one('.btn.gold'), title: 'Run again', text: 'Runs the whole QA ruleset again in the cloud. No downloads and no desktop Revit needed.', tryIt: 'Press Run again.' },
    { find: one('tbody tr', 0), title: 'Results per model', text: 'Click a row to open its individual checks (warnings, file size, worksets, links, CAD imports).', tryIt: 'Click a row.' },
    { find: one('.card'), title: 'Read the result colours', text: 'Green passed, amber needs attention, red failed. Each check explains why.' },
  ],
  // 06 MIDP / TIDP
  [
    { find: one('.tile', 0), title: 'Plan versus reality', text: 'The plan says what should be delivered. The tool compares it with what is actually in ACC.' },
    { find: one('.tile.h'), title: 'What is missing', text: 'The highlighted tile counts deliverables that are due but not found in the folder.' },
    { find: one('.chipbtn', 0), title: 'Filter the list', text: 'Show everything, only what was found, or only what is missing.', tryIt: 'Click “Missing”.' },
    { find: one('.tx'), title: 'Search a document', text: 'Type a document number or title to jump straight to it.', tryIt: 'Search “Sections”.' },
    { find: one('table'), title: 'Row by row', text: 'Each deliverable shows its formats and whether it was found, so chasing people becomes a checklist.' },
  ],
];

export default function Tour({ steps, onClose }) {
  const [list] = useState(() => steps.map((s) => ({ ...s, el: s.find() })).filter((s) => s.el));
  const [i, setI] = useState(0);
  const [box, setBox] = useState(null);
  const tip = useRef(null);
  const step = list[i];

  const measure = useCallback(() => {
    if (!step) return;
    const r = step.el.getBoundingClientRect();
    setBox({ x: r.left, y: r.top, w: r.width, h: r.height });
  }, [step]);

  useLayoutEffect(() => {
    if (!step) return undefined;
    step.el.scrollIntoView({ block: 'center', behavior: 'instant' });
    measure();
    const t = setTimeout(measure, 350);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [step, measure]);

  const next = useCallback(() => (i < list.length - 1 ? setI(i + 1) : onClose()), [i, list.length, onClose]);
  const back = useCallback(() => setI((v) => Math.max(0, v - 1)), []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [next, back, onClose]);

  if (!step || !box) return null;

  const pad = 6;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tw = Math.min(330, vw - 24);
  let left = Math.min(Math.max(12, box.x + box.w / 2 - tw / 2), vw - tw - 12);
  const below = box.y + box.h + 14 + 190 < vh;
  const top = below ? box.y + box.h + 14 : Math.max(12, box.y - 14 - 190);
  if (box.w > vw * 0.7 && box.h > vh * 0.5) left = Math.max(12, vw / 2 - tw / 2);

  return (
    <div className="tour" role="dialog" aria-label="Guided tour">
      <div className="tour__click" onClick={onClose} />
      <div className="tour__spot" style={{ left: box.x - pad, top: box.y - pad, width: box.w + pad * 2, height: box.h + pad * 2 }} />
      <div ref={tip} className="tour__tip" style={{ left, top, width: tw }}>
        <div className="tour__step">Step {i + 1} of {list.length}</div>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        {step.tryIt && <p className="tour__try">&#9654; {step.tryIt}</p>}
        <div className="tour__dots">{list.map((_, k) => <i key={k} className={k === i ? 'on' : k < i ? 'done' : ''} />)}</div>
        <div className="tour__btns">
          <button className="btn" onClick={onClose}>Skip</button>
          <span style={{ flex: 1 }} />
          <button className="btn" onClick={back} disabled={i === 0}>Back</button>
          <button className="btn gold" onClick={next}>{i === list.length - 1 ? 'Done' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}
