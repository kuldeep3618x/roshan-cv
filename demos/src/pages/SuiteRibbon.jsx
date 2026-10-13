import { useState } from 'react';
import { DesktopWin, Info, useToast } from '../ui.jsx';

// Ribbon mock-ups for the two add-in suites. Sample illustration only.

function Ribbon({ n, eyebrow, title, desc, bullets, chips, hint, winTitle, winSub, tabs, panels, help, note }) {
  const [sel, setSel] = useState(panels[0].items[0].name);
  const [toast, show] = useToast();
  const all = panels.flatMap((p) => p.items);
  const cur = all.find((i) => i.name === sel) || all[0];

  const pick = (it) => {
    if (it.soon) { show(`${it.name} is in progress: planned for the next release`); setSel(it.name); return; }
    setSel(it.name);
    show(`${it.name} opens as a non-modal window beside the 3D view`);
  };

  return (
    <>
      <Info n={n} eyebrow={eyebrow} title={title} desc={desc} bullets={bullets} chips={chips} hint={hint} />
      <DesktopWin title={winTitle} sub={winSub} toast={toast}>
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line2)' }}>
          {tabs.map((t) => (
            <span key={t.name} style={{ padding: '7px 14px', fontSize: 12, fontWeight: t.on ? 700 : 500, color: t.on ? '#0b1020' : 'var(--muted)', background: t.on ? 'var(--gradient-btn)' : 'transparent', borderRadius: '6px 6px 0 0' }}>{t.name}</span>
          ))}
        </div>
        <div className="card" style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap', alignItems: 'stretch' }}>
          {panels.map((p) => (
            <div key={p.name} style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--line)', paddingRight: 14 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.items.map((it) => (
                  <button key={it.name} type="button" onClick={() => pick(it)} className="btn"
                    style={{ width: 82, height: 78, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 6, opacity: it.soon ? 0.55 : 1, borderColor: sel === it.name ? 'var(--gold)' : undefined, background: sel === it.name ? 'var(--gold-l)' : undefined }}>
                    <span style={{ width: 28, height: 28, borderRadius: 7, display: 'grid', placeItems: 'center', background: it.c, color: '#0b1020', fontWeight: 800, fontSize: 13 }}>{it.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
                    <span style={{ fontSize: 10.5, lineHeight: 1.15, textAlign: 'center' }}>{it.name}{it.soon ? ' (soon)' : ''}</span>
                  </button>
                ))}
              </div>
              <small style={{ marginTop: 'auto', paddingTop: 6, textAlign: 'center', color: 'var(--muted)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>{p.name}</small>
            </div>
          ))}
          {help && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button type="button" className="btn" onClick={() => show('Opens the illustrated user guide (PDF)')} style={{ width: 70, height: 78, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#38bdf8', color: '#0b1020', fontWeight: 800 }}>?</span>
                <span style={{ fontSize: 10.5 }}>Help</span>
              </button>
              <small style={{ marginTop: 'auto', paddingTop: 6, textAlign: 'center', color: 'var(--muted)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Help</small>
            </div>
          )}
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4>{cur.name}</h4>
          <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>{cur.d}</div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{note}</div>
        </div>
      </DesktopWin>
    </>
  );
}

export function NavisworksRibbon() {
  return (
    <Ribbon
      n="07" eyebrow="Navisworks add-in suite"
      title={<>Navisworks <em>Tools Suite</em></>}
      desc="Six clash and viewpoint tools on one ribbon tab, shipped as a versioned installer with an illustrated user guide."
      bullets={['Six tools, each a non-modal window', 'One per-user installer, upgrades in place', 'Help opens the user guide']}
      chips={['C#', '.NET 4.8', 'WPF', 'Navisworks API']}
      hint="click a tool on the ribbon"
      winTitle="Navisworks Manage 2025" winSub="Custom ribbon tab"
      tabs={[{ name: 'Home' }, { name: 'View' }, { name: 'Review' }, { name: 'Tools', on: true }, { name: 'Output' }]}
      help
      note="v2.1.5 · Navisworks Manage 2025 · windows stay open while you orbit and select."
      panels={[{ name: 'Clash and viewpoint tools', items: [
        { name: 'Clash Tolerance', c: '#fbbf24', d: 'Set the tolerance on every Clash Detective test from one window, in one undoable step.' },
        { name: 'Clash Approval', c: '#34d399', d: 'Review results across every test, filter to what matters and record approvals with comments.' },
        { name: 'Clash Analyser', c: '#6ea8fe', d: 'A live clash dashboard: status tiles that reconcile, severity of open clashes and a per-test table.' },
        { name: 'Parameter Checker', c: '#fb7185', d: 'Check required parameters across every element in the chosen model files.' },
        { name: 'Viewpoint Comments', c: '#a78bfa', d: 'Manage the comments on every saved viewpoint and export them as CSV, Excel, XML or HTML.' },
        { name: 'Hide By Category', c: '#2dd4bf', d: 'Hide or show standard categories across every loaded model in one pass.' },
      ] }]}
    />
  );
}

export function RevitRibbon() {
  return (
    <Ribbon
      n="08" eyebrow="Revit add-in suite"
      title={<>Revit <em>Tools Suite</em></>}
      desc="Six model-management tools on a custom ribbon tab, driven by Excel rules and previewed before anything changes."
      bullets={['Preview first, then one undoable apply', 'Rules live in Excel or JSON', 'One installer for Revit 2024 and 2025']}
      chips={['C#', 'Revit API', 'WPF', 'WiX installer']}
      hint="click a tool on the ribbon"
      winTitle="Autodesk Revit" winSub="Custom ribbon tab"
      tabs={[{ name: 'Architecture' }, { name: 'Structure' }, { name: 'Systems' }, { name: 'Tools', on: true }, { name: 'Manage' }]}
      note="v1.4.1 · Revit 2024 and 2025 · Parameter Updater is planned for the next release."
      panels={[
        { name: 'Parameters', items: [
          { name: 'Clash Parameters', c: '#fbbf24', d: 'Fill the Clash Code and Clash Zone parameters in bulk and round-trip them through Excel.' },
          { name: 'Shared Parameters', c: '#34d399', d: 'Add shared parameters from a file using an Excel rule sheet, with a preview first.' },
        ] },
        { name: 'Warnings', items: [{ name: 'Warning Remover', c: '#fb7185', d: 'Collect warnings and fix the ones that can be fixed safely, on the rows you ticked.' }] },
        { name: 'Worksets', items: [{ name: 'Workset Assigner', c: '#6ea8fe', d: 'Define the workset standard once as rules, preview what moves, then apply.' }] },
        { name: 'Links', items: [{ name: 'Link Loader', c: '#a78bfa', d: 'Load or unload many Revit links in one step, by name, status or selection.' }] },
        { name: 'Model health', items: [{ name: 'Model Health Check', c: '#2dd4bf', d: 'Audit the open model against a QA test catalog. Read-only, with an Excel report.' }] },
        { name: 'Next', items: [{ name: 'Parameter Updater', c: '#64748b', soon: true, d: 'Update parameter values from an Excel mapping workbook, with formulas and a read-back check. In progress.' }] },
      ]}
    />
  );
}
