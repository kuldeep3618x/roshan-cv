// Add-in suites and platform apps added in the October 2026 refresh.
// Facts come from the project READMEs and CHANGELOGs (see the fact sheet). Status words are deliberate:
// "Built" = released with a version number; "In development" = working but not released.
// No client names, tenant details or credentials.

export const suites = [
  /* -------------------------------------------------------------- Navisworks suite */
  {
    slug: 'navisworks-tools-suite',
    n: '07',
    name: 'Navisworks Tools Suite',
    kind: 'Navisworks add-in suite',
    status: 'Built',
    version: 'v2.1.5',
    released: '3 Oct 2026',
    stack: ['C#', '.NET Framework 4.8', 'WPF', 'Navisworks API', 'WiX installer'],
    tagline: 'Six clash and viewpoint tools on one ribbon tab, shipped as a versioned installer with a user guide.',
    problem:
      'Clash coordination in Navisworks leans on repetitive, manual steps: editing tolerances test by test, approving results one at a time, chasing parameters by hand and exporting data that is too large to open.',
    outcome: [
      'Clash Tolerance, Clash Approval, Clash Analyser, Parameter Checker, Viewpoint Comments and Hide By Category, all non-modal windows beside the 3D view.',
      'Load Asset Info reads category, family, type, workset, element ID, source file and custom parameters for both items of every clash.',
      'Clash Analyser exports one row per open clash (CSV zip or Excel) for filtering and pivoting by zone, file or asset.',
      'Per-user MSI that upgrades in place, an uninstall entry and an illustrated PDF guide behind a Help button.',
    ],
    diagram: {
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'user', label: 'BIM coordinator', sub: 'Ribbon tab', col: 0, row: 0, kind: 'actor', desc: 'Works from a single custom ribbon tab in Navisworks Manage 2025.' },
        { id: 'ribbon', label: 'Ribbon commands', sub: 'Plugin entry points', col: 1, row: 0, kind: 'app', desc: 'One command per tool plus Help. Each opens its own non-modal window so the 3D view stays interactive.' },
        { id: 'tools', label: 'Six tool windows', sub: 'WPF, non-modal', col: 2, row: 0, kind: 'app', desc: 'Clash Tolerance, Clash Approval, Clash Analyser, Parameter Checker, Viewpoint Comments, Hide By Category.' },
        { id: 'api', label: 'Navisworks API', sub: 'Clash, model, search', col: 3, row: 0, kind: 'service', desc: 'Clash Detective data, model tree, properties, saved viewpoints and native searches.' },
        { id: 'msi', label: 'MSI installer', sub: 'WiX, per user', col: 1, row: 1, kind: 'data', desc: 'Installs without admin rights to the user’s plug-ins folder, upgrades in place and adds a Start-menu uninstall.' },
        { id: 'common', label: 'Shared services', sub: 'Isolation, asset info, writers', col: 2, row: 1, kind: 'app', desc: 'Common code used by several tools: tree-walking isolate, element and asset resolution, and the compressed Excel writer.' },
        { id: 'out', label: 'Reports & exports', sub: 'CSV zip, Excel, HTML', col: 3, row: 1, kind: 'data', desc: 'Detailed clash export, clash test summary, parameter gaps and viewpoint reports.' },
      ],
      edges: [
        { from: 'user', to: 'ribbon' },
        { from: 'ribbon', to: 'tools', label: 'opens' },
        { from: 'tools', to: 'api', both: true },
        { from: 'msi', to: 'ribbon', label: 'installs' },
        { from: 'tools', to: 'common' },
        { from: 'common', to: 'out' },
      ],
    },
    steps: [
      { title: 'Install', text: 'The MSI installs per user with no admin rights, upgrades an earlier version in place and registers an uninstall entry.', nodes: ['msi', 'ribbon'], edges: [3] },
      { title: 'Open a tool', text: 'Each ribbon button opens a non-modal window, so you can keep orbiting, selecting and isolating in the model while it stays open.', nodes: ['user', 'ribbon', 'tools'], edges: [0, 1] },
      { title: 'Read the model and clash data', text: 'Tools read Clash Detective tests and results, the model tree and element properties through the Navisworks API.', nodes: ['tools', 'api'], edges: [2] },
      { title: 'Resolve to the real element', text: 'Clash items often point at a generic geometry node. Shared code climbs to the real Revit element so category, type, workset and parameters are correct for both items.', nodes: ['tools', 'common'], edges: [4] },
      { title: 'Isolate and highlight fast', text: 'Double-clicking a result isolates the clashing items using a tree walk and a temporary transparency override instead of a whole-model hide.', nodes: ['common', 'api'], edges: [4, 2] },
      { title: 'Export', text: 'Detailed clash export covers open clashes only, as a zipped CSV or a compressed Excel file, ready to pivot by zone, source file or asset.', nodes: ['common', 'out'], edges: [4, 5] },
    ],
    decisions: [
      { t: 'Isolate with a transparency override, not a hide', d: 'Hiding items through the model API could freeze Navisworks for 30+ minutes on a real federated model. Switching to a temporary transparency override made isolate take roughly 350 to 460 ms.' },
      { t: 'Exports scoped to what people act on', d: 'A document where most work was already approved produced an unworkable export. The detailed export now covers new and active clashes only, and CSV is delivered as a zip.' },
      { t: 'Compressed Excel files', d: 'The Excel writer created each workbook part uncompressed. Setting maximum compression turned a 50,000-row, 22-column export into about 4.5 MB.' },
      { t: 'Navisworks 2025 only, on purpose', d: 'A 2027 build was wired up but never verified against real binaries, so support was removed rather than claimed. The suite states only what it has been run on.' },
    ],
    video: null,
  },

  /* -------------------------------------------------------------- Revit suite */
  {
    slug: 'revit-tools-suite',
    n: '08',
    name: 'Revit Tools Suite',
    kind: 'Revit add-in suite',
    status: 'Built',
    version: 'v1.4.1',
    released: '5 Oct 2026',
    stack: ['C#', 'Revit API', '.NET Framework 4.8 / .NET 8', 'WPF', 'WiX installer'],
    tagline: 'Six model-management tools on a custom ribbon tab, driven by Excel rules and previewed before anything changes.',
    problem:
      'Parameters, worksets, links and warnings are cleaned up by hand, differently on every model. The work is repetitive, easy to get wrong and rarely documented.',
    outcome: [
      'Clash Parameters, Shared Parameters, Warning Remover, Workset Assigner, Link Loader and Model Health Check.',
      'Rules live in Excel or JSON, so the standard is data you can review and reuse, not hard-coded values.',
      'Preview first, then one undoable apply, with Model Health Check kept strictly read-only.',
      'One installer for Revit 2024 and 2025, a changelog and a user guide inside the add-in.',
    ],
    diagram: {
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'user', label: 'BIM manager', sub: 'Ribbon tab', col: 0, row: 0, kind: 'actor', desc: 'Runs the tools from a custom tab with panels for parameters, warnings, worksets, links and model health.' },
        { id: 'tools', label: 'Six tool windows', sub: 'WPF, non-modal', col: 1, row: 0, kind: 'app', desc: 'Each tool is a non-modal window with the same look and tick-box behaviour, including Shift+click ranges.' },
        { id: 'rules', label: 'Rules & settings', sub: 'Excel sheets, JSON config', col: 2, row: 0, kind: 'data', desc: 'Parameter rule sheets, workset rules (rules.json) and the Model Health Check settings.' },
        { id: 'api', label: 'Revit API', sub: 'Document, elements, links', col: 3, row: 0, kind: 'service', desc: 'Elements, parameters, worksets, links and warnings are read and changed through one transaction per apply.' },
        { id: 'msi', label: 'MSI installer', sub: 'One package, year choice', col: 1, row: 1, kind: 'data', desc: 'A single installer with a Custom Setup page to choose the Revit year or years.' },
        { id: 'prev', label: 'Preview grid', sub: 'Current vs proposed', col: 2, row: 1, kind: 'app', desc: 'Shows what would change before anything is written, with rows you can untick.' },
        { id: 'rep', label: 'Excel reports', sub: 'QA / health results', col: 3, row: 1, kind: 'data', desc: 'Model Health Check and Warning Remover export their results to Excel.' },
      ],
      edges: [
        { from: 'user', to: 'tools' },
        { from: 'rules', to: 'tools', label: 'rules' },
        { from: 'tools', to: 'api', route: 'vh' },
        { from: 'msi', to: 'tools', label: 'installs' },
        { from: 'rules', to: 'prev' },
        { from: 'prev', to: 'rep' },
      ],
    },
    steps: [
      { title: 'Install for your Revit year', text: 'One MSI covers Revit 2024 and 2025. Tick the years you use; it installs per user and upgrades earlier versions.', nodes: ['msi', 'tools'], edges: [3] },
      { title: 'Load the rules', text: 'Shared parameters, worksets and health-check tests are driven by an Excel sheet or JSON file, so the standard can be reviewed and reused across models.', nodes: ['rules', 'tools'], edges: [1] },
      { title: 'Preview before anything changes', text: 'Tools list what would change, with current and proposed values, and let you untick rows.', nodes: ['rules', 'prev'], edges: [4] },
      { title: 'Apply as one undo step', text: 'Changes are written in a single transaction, so one undo reverts the batch.', nodes: ['tools', 'api'], edges: [2] },
      { title: 'Report', text: 'Health check and warning results export to Excel for the model record.', nodes: ['prev', 'rep'], edges: [5] },
    ],
    decisions: [
      { t: 'The workbook is the authority', d: 'Rule sheets, mapping workbooks and rules.json hold the standard. Nothing is hard-coded, so changing a rule never means shipping a new build.' },
      { t: 'Preview, then one undo step', d: 'Every tool that edits the model shows a preview first and applies in one transaction. Model Health Check never edits at all.' },
      { t: 'One installer, several Revit years', d: 'Revit 2024 builds on .NET Framework 4.8 and 2025 on .NET 8. Model Health Check is compiled only for .NET 8 and later, so the 2024 build ships five tools and the 2025 build six.' },
      { t: 'A real release process', d: 'One version file, a changelog written as work happens, a release script and a signed installer with a certificate trust script for each machine.' },
    ],
    video: null,
  },

  /* -------------------------------------------------------------- BIM-Q Central */
  {
    slug: 'bim-q-central',
    n: '09',
    name: 'BIM-Q Central',
    kind: 'APS web app',
    status: 'In development',
    stack: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'APS Data Management'],
    tagline: 'See whether each trade is sharing its required models on time, and how its issues are progressing.',
    problem:
      'Model uploads, issues and submission status live in separate places and reach meetings as spreadsheets that are already out of date. Nobody can see at a glance whose model is late.',
    outcome: [
      'Overview, Issue tracking, Model sharing and Setup pages built on the same stack and design system as the other tools on this site.',
      'Compares the models each trade is required to share with what is actually in its mapped ACC folders, with compliance against a target.',
      'Issue metrics from the ACC issue-summary export: open, overdue, closure rate, ageing, by trade, category and assignee.',
      'Excel and PDF reports that follow the current filter, with sample-data demo mode.',
    ],
    diagram: {
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'bim', label: 'BIM Manager', sub: 'Sets up and reviews', col: 0, row: 0, kind: 'actor', desc: 'The only role that can edit setup. Coordinators and leads can view, sync and export; stakeholders are read-only.' },
        { id: 'spa', label: 'React client', sub: 'Overview, issues, sharing, setup', col: 1, row: 0, kind: 'app', desc: 'Four pages. Overview lists what needs attention, with links to the detail.' },
        { id: 'api', label: 'API server', sub: 'Express + TypeScript', col: 2, row: 0, kind: 'app', desc: 'Signs the user in, reads ACC, judges each required model and builds the reports.' },
        { id: 'aps', label: 'ACC via APS', sub: 'Data Management', col: 3, row: 0, kind: 'service', desc: 'Folders and file versions, including who uploaded which version and when.' },
        { id: 'rep', label: 'Excel & PDF', sub: 'Reports and logs', col: 0, row: 1, kind: 'data', desc: 'Status report, compliance report, version history and submission log. Each honours the current filter.' },
        { id: 'cfg', label: 'Setups & templates', sub: 'Folders, naming, required list', col: 1, row: 1, kind: 'data', desc: 'Trade-to-folder mapping, naming rule, required model list, sharing frequency and thresholds. Start new projects from a template.' },
        { id: 'iss', label: 'Issue summary', sub: 'Excel import from ACC', col: 2, row: 1, kind: 'data', desc: 'Imported file. The app shows its data-as-of date so stale numbers are obvious.' },
      ],
      edges: [
        { from: 'bim', to: 'spa' },
        { from: 'spa', to: 'api', both: true, label: 'REST' },
        { from: 'api', to: 'aps', both: true },
        { from: 'spa', to: 'cfg', both: true, label: 'setup' },
        { from: 'iss', to: 'api', label: 'import' },
        { from: 'rep', to: 'bim', label: 'download' },
      ],
    },
    steps: [
      { title: 'Set up the project', text: 'Pick the ACC hub and project, map folders to each trade, name each lead, set the naming rule and the required model list, and choose the sharing frequency.', nodes: ['bim', 'spa', 'cfg'], edges: [0, 3] },
      { title: 'Read ACC folder by folder', text: 'The server walks each trade’s mapped folders through Data Management and records the latest version and the full version history.', nodes: ['spa', 'api', 'aps'], edges: [1, 2] },
      { title: 'Judge each required model', text: 'Compliant, Overdue, Outdated or Missing, from the latest upload against the period, grace days and outdated limit. Also flagged: files not on the list, naming-rule breaks and a model under another trade’s folder.', nodes: ['api', 'cfg'], edges: [] },
      { title: 'Import issues', text: 'The ACC issue-summary export is imported and measured by trade, category, assignee and age. There is no live Issues API connection yet, and the page says so.', nodes: ['iss', 'api'], edges: [4] },
      { title: 'Share the numbers', text: 'Download Excel and PDF reports that follow the current trade and status filter, or print the page layout.', nodes: ['rep', 'bim'], edges: [5] },
    ],
    decisions: [
      { t: 'Judge against a required list', d: 'Listing what is in a folder says little. Comparing it with the models each trade must share shows what is missing, late or outdated.' },
      { t: 'Say where the data came from', d: 'Issues are imported from an export, so the app shows a data-as-of date instead of implying a live feed.' },
      { t: 'Roles from day one', d: 'BIM Managers configure, coordinators and leads sync and export, stakeholders only view. The first sign-in becomes BIM Manager unless set otherwise.' },
      { t: 'A demo mode with sample data', d: 'With no credentials the app loads a sample project of eight trades and 31 required models, so the product can be shown and tested without touching real project data.' },
    ],
    video: 'videos/bim-q-central-walkthrough.mp4',
    videoCaption: 'Walkthrough with sample data.',
  },

  /* -------------------------------------------------------------- AddinHub */
  {
    slug: 'addinhub',
    n: '10',
    name: 'AddinHub',
    kind: 'Add-in control board and PC agent',
    status: 'In development',
    stack: ['Node.js', 'SQLite', 'PowerShell agent', 'C# hooks for Revit and Navisworks', 'Windows DPAPI'],
    tagline: 'Deploy, roll back and monitor the Revit and Navisworks add-ins by user or office, with a kill switch.',
    problem:
      'Add-ins are emailed as zips and installed by hand, so people end up on different versions and nobody can pull a bad release or see what is actually used.',
    outcome: [
      'Upload add-in versions, roll back, and assign to everyone, an office or a single user.',
      'A per-user agent keeps each PC in step, with no admin rights and checked downloads.',
      'Usage KPIs, a map and breakdowns by add-in, office, user and command, with CSV export.',
      'A write-only encrypted vault, a device list with revoke, and an audit trail.',
      'Part of BIM-Q Central: the board is mounted into that web app.',
    ],
    diagram: {
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'admin', label: 'BIM Manager', sub: 'Admin', col: 0, row: 0, kind: 'actor', desc: 'Registers add-ins, uploads versions, assigns them and can switch one off.' },
        { id: 'board', label: 'Control board', sub: 'Express middleware + SQLite', col: 1, row: 0, kind: 'app', desc: 'Mounts into the BIM-Q Central web app, which signs users in with Autodesk. Keeps add-ins, assignments, usage, devices and the audit log.' },
        { id: 'agent', label: 'PC agent', sub: 'PowerShell, per user', col: 2, row: 0, kind: 'app', desc: 'Pairs once, then syncs at sign-in and every 15 minutes. Installs, updates or removes add-ins for the Revit and Navisworks years it finds.' },
        { id: 'addins', label: 'Revit and Navisworks add-ins', sub: 'Revit / Navisworks', col: 3, row: 0, kind: 'app', desc: 'Each add-in runs a short check at the start of a command that refuses it when it has been disabled, and records one use.' },
        { id: 'vault', label: 'Vault', sub: 'Encrypted, write-only', col: 1, row: 1, kind: 'data', desc: 'Holds shared service credentials. Values can be written but not read back from the board.' },
        { id: 'pol', label: 'Policy & heartbeat', sub: 'Kill switch, status', col: 2, row: 1, kind: 'data', desc: 'The agent reports its version and what is installed or pending, and saves the policy file that add-ins read.' },
      ],
      edges: [
        { from: 'admin', to: 'board' },
        { from: 'board', to: 'agent', both: true, label: 'manifest' },
        { from: 'agent', to: 'addins', label: 'installs' },
        { from: 'board', to: 'vault', both: true },
        { from: 'agent', to: 'pol', label: 'heartbeat' },
        { from: 'addins', to: 'board', label: 'usage' },
      ],
    },
    steps: [
      { title: 'Register and upload', text: 'An admin registers an add-in, uploads a version per Revit or Navisworks year and assigns it to everyone, an office or a user.', nodes: ['admin', 'board'], edges: [0] },
      { title: 'Pair a PC once', text: 'The agent shows a code and opens a pairing page. The user approves, and the refresh token is stored encrypted for that Windows user only.', nodes: ['agent', 'board'], edges: [1] },
      { title: 'Sync', text: 'At sign-in and every 15 minutes the agent asks for its manifest, downloads what is new and checks the SHA-256 before installing. A new version waits while Revit or Navisworks is open.', nodes: ['board', 'agent', 'addins'], edges: [1, 2] },
      { title: 'Report', text: 'The agent sends a heartbeat of installed and pending versions. Add-ins send usage events, which feed the board’s KPIs.', nodes: ['agent', 'pol', 'addins', 'board'], edges: [4, 5] },
      { title: 'Roll back or switch off', text: 'Unassigning, rolling back or switching an add-in off removes it at the next sync, never while the host application is open.', nodes: ['admin', 'board', 'agent'], edges: [0, 1] },
    ],
    decisions: [
      { t: 'Per user, no admin rights', d: 'Files go to the user’s own Autodesk add-in folders, which fits locked-down machines and keeps one person’s installs from affecting another’s.' },
      { t: 'Verify before install', d: 'Every download is checked against the hash in the manifest and refused if damaged.' },
      { t: 'Never swap under a running host', d: 'A new version is shown as pending and installed on a later sync instead of replacing files while Revit or Navisworks is using them.' },
      { t: 'Honest about limits', d: 'The agent removes an add-in at the next sync, but a kill switch inside a running session depends on the add-in reading the policy. The Navisworks bundle format also has not yet been proven on a real machine, and the README says so.' },
    ],
    video: 'videos/bim-q-central-walkthrough.mp4',
    videoCaption: 'Walkthrough with sample data; it includes the add-in control board.',
  },
];
