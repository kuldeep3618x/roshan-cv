// Content for the tool pages (#/tools/<slug>).
// Diagram layout: nodes sit on a grid (col,row). kind: actor | app | service | data.
// Steps highlight nodes (by id) and edges (by index into `edges`).
// Everything here is generic: no client names, tenant details or credentials.

export const tools = [
  /* ------------------------------------------------------------------ 01 */
  {
    slug: 'clash-tolerance',
    n: '01',
    name: 'Clash Tolerance',
    kind: 'Navisworks add-in',
    status: 'Built',
    image: 'showcase/1-navisworks-clash-tolerance.jpg',
    demo: 1,
    demoHint: 'Tick some tests, change the tolerance and hit Apply.',
    stack: ['C#', '.NET Framework 4.8', 'Navisworks API', 'WPF'],
    tagline: 'Set the tolerance on every Clash Detective test from one window, in one undoable step.',
    problem:
      'Changing a clash tolerance normally means opening each test in Clash Detective, going to its Rules tab and editing it by hand. On a federated model with dozens of tests that is slow, easy to get wrong and hard to reverse.',
    outcome: [
      'Filter tests by name, multi-select, set the tolerance once and apply it to all selected.',
      'Every change commits as one undoable transaction, so a single Ctrl+Z reverts the whole batch.',
      'Runs as a non-modal window: you keep orbiting and selecting in the 3D view while it stays open.',
    ],
    diagram: {
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'user', label: 'BIM coordinator', sub: 'Ribbon click', col: 0, row: 0, kind: 'actor', desc: 'Starts the tool from a ribbon button in Navisworks Manage.' },
        { id: 'cmd', label: 'Ribbon command', sub: 'Plugin entry point', col: 1, row: 0, kind: 'app', desc: 'A Navisworks plugin command registered through a ribbon XAML layout. It opens the tool window and returns immediately.' },
        { id: 'win', label: 'Tool window', sub: 'Non-modal', col: 1, row: 1, kind: 'app', desc: 'Grid of clash tests with name, type, current tolerance and results. Non-modal so the 3D view stays interactive.' },
        { id: 'repo', label: 'Clash test repository', sub: 'Read / edit service', col: 2, row: 0, kind: 'app', desc: 'A small service that walks Clash Detective data (recursing into folders) and applies tolerance edits.' },
        { id: 'api', label: 'Navisworks Clash API', sub: 'ClashTest, DocumentClashTests', col: 3, row: 0, kind: 'service', desc: 'Autodesk.Navisworks.Clash: saved clash tests are copy-on-write objects.' },
        { id: 'doc', label: 'Active document', sub: 'Transaction + undo stack', col: 3, row: 1, kind: 'data', desc: 'All edits happen inside one document transaction, which is why a single undo reverts everything.' },
      ],
      edges: [
        { from: 'user', to: 'cmd' },
        { from: 'cmd', to: 'win', label: 'opens' },
        { from: 'win', to: 'repo', both: true, label: 'apply' },
        { from: 'repo', to: 'api', both: true },
        { from: 'api', to: 'doc', label: 'transaction' },
      ],
    },
    steps: [
      { title: 'Open the tool', text: 'The ribbon command opens the tool window without blocking Navisworks, so orbiting and selecting still work.', nodes: ['user', 'cmd', 'win'], edges: [0, 1] },
      { title: 'Read every clash test', text: 'The repository walks the Clash Detective data and recurses into test folders, prefixing each name with its folder path, so nothing is silently skipped.', nodes: ['win', 'repo', 'api'], edges: [2, 3] },
      { title: 'Filter, select, set a value', text: 'You filter by name, tick the tests you want and type one tolerance value. Nothing is written yet.', nodes: ['win'], edges: [] },
      { title: 'Apply as one transaction', text: 'For each selected test the add-in makes a copy, sets the tolerance on the copy and commits it back with TestsEditTestFromCopy, all inside a single document transaction.', nodes: ['win', 'repo', 'api', 'doc'], edges: [2, 3, 4] },
      { title: 'One undo reverts the batch', text: 'Because the whole batch is one transaction, Ctrl+Z in Navisworks reverts every changed test at once.', nodes: ['doc'], edges: [] },
    ],
    decisions: [
      { t: 'Targets .NET Framework 4.8, not modern .NET', d: 'Navisworks Manage 2025 hosts add-ins in-process on .NET Framework 4.8. A build for a newer runtime simply never appears in the Plugins list.' },
      { t: 'Copy, edit, commit instead of setting the property', d: 'Saved items in Clash Detective are copy-on-write. Setting Tolerance on the live object bypasses Undo, so the tool uses CreateCopy, edits the copy and commits it in a transaction. The signatures were confirmed against the installed assemblies by reflection instead of assumed from older docs.' },
      { t: 'Recurses into test folders', d: 'An early version only read the top level, so tests inside folders never appeared and were never updated. The repository now walks folders and shows the folder path in each name.' },
      { t: 'Edit failures are surfaced', d: 'A grid cell that failed to commit used to revert silently, which looked like a read-only field. Errors now show a message so a bad value is never mistaken for a no-op.' },
    ],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    slug: 'clash-analyser',
    n: '02',
    name: 'Clash Analyser',
    kind: 'Navisworks add-in',
    status: 'Built',
    image: 'showcase/2-navisworks-clash-analyser.jpg',
    demo: 2,
    demoHint: 'Click a status tile to slice the per-test table.',
    stack: ['C#', '.NET Framework 4.8', 'Navisworks API', 'WPF', 'Excel matrix checks'],
    tagline: 'A live clash dashboard inside Navisworks, so coordination meetings start from the numbers.',
    problem:
      'Clash status usually lives in exported spreadsheets that are already out of date by the time the meeting starts. Totals do not reconcile, and nobody can quickly slice by test or severity.',
    outcome: [
      'Status tiles (New, Active, Reviewed, Approved, Resolved) plus a Total tile that reconciles them.',
      'Open-clash severity breakdown from Critical to Low, a per-test status table and trend history.',
      'Tiles are slicers: click one and the per-test table filters to it.',
      'Optional clash-matrix workbook (.xlsx) of required category-pair rules to validate the Categories & Matrix setup.',
    ],
    diagram: {
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'user', label: 'BIM coordinator', sub: 'Opens dashboard', col: 0, row: 0, kind: 'actor', desc: 'Opens the analyser from the add-in ribbon tab before or during a coordination meeting.' },
        { id: 'win', label: 'Dashboard window', sub: 'Non-modal WPF', col: 1, row: 0, kind: 'app', desc: 'Tiles, severity bars, per-test table and trend chart. Stays open while you work in the model.' },
        { id: 'read', label: 'Clash reader', sub: 'Aggregation', col: 2, row: 0, kind: 'app', desc: 'Reads every clash test and result, then aggregates by status, severity and test.' },
        { id: 'api', label: 'Navisworks Clash API', sub: 'Results in the model', col: 3, row: 0, kind: 'service', desc: 'The data lives where the model lives, so there is no export step.' },
        { id: 'slice', label: 'Slicers', sub: 'Tile filters', col: 1, row: 1, kind: 'app', desc: 'Status and severity tiles act as filters over the per-test table.' },
        { id: 'matrix', label: 'Clash matrix', sub: '.xlsx of category pairs', col: 3, row: 1, kind: 'data', desc: 'A user-attached workbook listing which category pairs must be tested. Used to validate the setup.' },
      ],
      edges: [
        { from: 'user', to: 'win' },
        { from: 'win', to: 'read', both: true, label: 'refresh' },
        { from: 'read', to: 'api', both: true },
        { from: 'win', to: 'slice', both: true },
        { from: 'matrix', to: 'read', label: 'validate' },
      ],
    },
    steps: [
      { title: 'Open the dashboard', text: 'A non-modal window opens from the ribbon, so it can sit beside the 3D view.', nodes: ['user', 'win'], edges: [0] },
      { title: 'Read the clash data', text: 'The reader collects every clash test and result straight from the open model.', nodes: ['win', 'read', 'api'], edges: [1, 2] },
      { title: 'Build the tiles', text: 'Results are counted by status, and the Total tile reconciles with the sum of the status tiles so the numbers always add up.', nodes: ['read', 'win'], edges: [1] },
      { title: 'Break down open clashes', text: 'Only open clashes are counted in the Critical / High / Medium / Low breakdown, so resolved work does not inflate severity.', nodes: ['read', 'win'], edges: [1] },
      { title: 'Slice with the tiles', text: 'Clicking a status or severity tile filters the per-test table to that slice.', nodes: ['win', 'slice'], edges: [3] },
      { title: 'Validate against a clash matrix', text: 'Attach a matrix workbook of required category-pair rules and the Categories & Matrix setup is validated against it.', nodes: ['matrix', 'read'], edges: [4] },
    ],
    decisions: [
      { t: 'Numbers must reconcile', d: 'The Total tile reconciles with the five status tiles. A dashboard that does not add up loses the room in the first minute, so the reconciliation is part of the design.' },
      { t: 'Severity counts open clashes only', d: 'Resolved and approved clashes are excluded from the severity bars, which keeps them a to-do list instead of a history.' },
      { t: 'Data stays in the model', d: 'Reading results from the open Navisworks document removes the export-to-Excel step and the stale-copy problem that comes with it.' },
      { t: 'Non-modal, single theme', d: 'Every tool window is non-modal. A light and dark toggle was tried and removed because live repainting was unreliable inside the host and dark mode hurt readability of dense tables.' },
    ],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    slug: 'workset-assigner',
    n: '03',
    name: 'Workset Assigner',
    kind: 'Revit add-in',
    status: 'Built',
    image: 'showcase/3-revit-workset-assigner.jpg',
    demo: 3,
    demoHint: 'Click a workset, switch the scope and hit Apply.',
    stack: ['C#', 'Revit API', '.NET Framework 4.7 / 4.8 and .NET 8', 'WPF', 'JSON rule sets'],
    tagline: 'Define your workset standard once as rules, preview what will move, then apply it.',
    problem:
      'Worksets drift. Elements end up in Workset1 or in the wrong discipline workset, and cleaning that up by hand is tedious and inconsistent between team members.',
    outcome: [
      'Sets of governed worksets, each owning its own rules by category, family, type, level or parameter.',
      'Preview exactly which elements move, with current vs proposed workset and the rule that matched.',
      'Apply to a selection, the active view or the whole model, as one undoable transaction.',
      'One codebase supports Revit 2020 to 2026.',
    ],
    diagram: {
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'user', label: 'BIM manager', sub: 'Owns the standard', col: 0, row: 0, kind: 'actor', desc: 'Defines and maintains the workset standard as reusable sets.' },
        { id: 'win', label: 'Assigner window', sub: 'Sets, worksets, rules', col: 1, row: 0, kind: 'app', desc: 'Three panes: Sets, the Worksets of that set, and the Rules of the selected workset. Non-modal.' },
        { id: 'json', label: 'Rule sets', sub: 'JSON files per user', col: 1, row: 1, kind: 'data', desc: 'Sets are saved as JSON so they can be reused and shared across projects.' },
        { id: 'engine', label: 'Rule engine', sub: 'Evaluate + preview', col: 2, row: 0, kind: 'app', desc: 'Evaluates rules in workset precedence order and builds a preview of proposed changes.' },
        { id: 'model', label: 'Revit document', sub: 'Elements and worksets', col: 3, row: 0, kind: 'service', desc: 'Elements are read through the Revit API and reassigned inside one transaction.' },
        { id: 'preview', label: 'Preview grid', sub: 'Include / exclude rows', col: 2, row: 1, kind: 'app', desc: 'Current vs proposed workset per element. Untick rows to exclude them, then apply.' },
      ],
      edges: [
        { from: 'user', to: 'win' },
        { from: 'win', to: 'json', both: true, label: 'files' },
        { from: 'win', to: 'engine', label: 'run' },
        { from: 'engine', to: 'model', both: true },
        { from: 'engine', to: 'preview' },
      ],
    },
    steps: [
      { title: 'Define a set', text: 'Create a named set, for example an architecture standard, and add the worksets it governs in precedence order. A star marks the fallback workset.', nodes: ['user', 'win', 'json'], edges: [0, 1] },
      { title: 'Add rules to each workset', text: 'A rule is a group of AND conditions (category, family, type, level, name, current workset or a named parameter). Any matching rule on a workset routes the element there.', nodes: ['win'], edges: [] },
      { title: 'Pick a scope and run', text: 'Choose Selection, Active view or Entire model. The engine evaluates rules in order against the elements in that scope.', nodes: ['win', 'engine', 'model'], edges: [2, 3] },
      { title: 'Review the preview', text: 'The grid lists every affected element with its current and proposed workset and the rule that matched. Untick anything you do not want changed.', nodes: ['engine', 'preview'], edges: [4] },
      { title: 'Apply as one transaction', text: 'Apply writes the changes in a single transaction, so one undo reverts the batch. Optionally a violations list flags elements sitting in a governed workset that no longer match its rules.', nodes: ['preview', 'engine', 'model'], edges: [3, 4] },
    ],
    decisions: [
      { t: 'Rules as data, sets as files', d: 'Standards are stored as JSON sets, not hard-coded, so a firm standard can be versioned, shared and reused on the next project.' },
      { t: 'Preview before commit', d: 'Nothing moves until you have seen the current vs proposed workset per element, which makes it safe to run against a whole model.' },
      { t: 'One project, seven Revit versions', d: 'Build configurations R2020 to R2026 pull the matching Revit API reference assemblies from NuGet, so any version builds without Revit installed. Older releases target .NET Framework, newer ones .NET 8.' },
      { t: 'Honest about API limits', d: 'Revit cannot rename an existing workset through the API. Renaming inside a set only renames its entry in the set, and the UI says so, instead of pretending the project workset changed.' },
    ],
  },

  /* ------------------------------------------------------------------ 04 */
  {
    slug: 'acc-fabric-bridge',
    n: '04',
    name: 'ACC to Microsoft Fabric bridge',
    kind: 'APS web app',
    status: 'In progress',
    image: 'showcase/4-aps-acc-fabric-bridge.jpg',
    demo: 4,
    demoHint: 'Untick a model, then hit Extract selected.',
    stack: ['Node.js', 'APS Data Management', 'APS Model Derivative', 'Microsoft Graph', 'OneLake / Delta', 'Power BI'],
    tagline: 'Land Revit element and property data from Autodesk Construction Cloud in a Fabric Lakehouse, ready for Power BI.',
    problem:
      'Model data in ACC is locked behind the viewer. Getting it into Power BI usually means manual exports, desktop refreshes or extra orchestration tools.',
    outcome: [
      'Browse hub, project and folder, pick many models at once and save the pick as a named setup.',
      'Pulls element and property data from ACC models without manual exports.',
      'Lands one file per model in Fabric, overwritten in place, so it always shows current state.',
      'Signs in as the user (OAuth with PKCE): no client secret and no service principal for the Fabric side.',
    ],
    diagram: {
      cols: 5,
      rows: 2,
      nodes: [
        { id: 'ui', label: 'Browser UI', sub: 'Login, browse, run', col: 0, row: 0, kind: 'actor', desc: 'A small local web app: sign in to both services, browse, pick models and start the extraction.' },
        { id: 'srv', label: 'Node.js server', sub: 'Express + clients', col: 1, row: 0, kind: 'app', desc: 'Holds the token cache and saved setups and orchestrates every API call.' },
        { id: 'aps', label: 'APS', sub: 'Data Management + Model Derivative', col: 2, row: 0, kind: 'service', desc: 'Data Management lists hubs, projects and files. Model Derivative returns element properties.' },
        { id: 'graph', label: 'Microsoft Graph', sub: 'OneDrive app folder', col: 3, row: 0, kind: 'service', desc: 'Each model result is written as a JSON file to a single app-specific OneDrive folder.' },
        { id: 'lake', label: 'OneLake shortcut', sub: 'Fabric Lakehouse', col: 4, row: 0, kind: 'data', desc: 'A shortcut created once in the Fabric portal exposes that folder inside the Lakehouse.' },
        { id: 'nb', label: 'Notebook', sub: 'JSON to Delta', col: 4, row: 1, kind: 'app', desc: 'Converts the landed JSON into Delta tables (an element dimension and an element-property fact).' },
        { id: 'pbi', label: 'Power BI', sub: 'Direct Lake', col: 3, row: 1, kind: 'service', desc: 'A semantic model reads the Delta tables directly.' },
        { id: 'setup', label: 'Setups + tokens', sub: 'Local JSON', col: 1, row: 1, kind: 'data', desc: 'Named selections and cached tokens, shared by the web app and the CLI scripts.' },
      ],
      edges: [
        { from: 'ui', to: 'srv', both: true },
        { from: 'srv', to: 'aps', both: true, label: 'REST' },
        { from: 'srv', to: 'graph', label: 'JSON' },
        { from: 'graph', to: 'lake', label: 'shortcut' },
        { from: 'lake', to: 'nb' },
        { from: 'nb', to: 'pbi' },
        { from: 'srv', to: 'setup', both: true },
      ],
    },
    steps: [
      { title: 'Sign in as yourself', text: 'APS uses a 3-legged OAuth flow (with the rotating refresh token handled correctly). The Fabric side uses authorization code with PKCE, so no client secret is stored anywhere.', nodes: ['ui', 'srv', 'aps'], edges: [0, 1] },
      { title: 'Browse and pick models', text: 'Data Management lists hub, project and folder. Tick any number of models and save the choice as a named, reusable setup.', nodes: ['ui', 'srv', 'aps', 'setup'], edges: [0, 1, 6] },
      { title: 'Extract properties', text: 'Model Derivative is called per model to get element properties. The run waits for ACC translation, retries, and isolates errors per file so one bad model does not stop the batch.', nodes: ['srv', 'aps'], edges: [1] },
      { title: 'Write one file per model', text: 'Each result is written through Microsoft Graph to an app-specific OneDrive folder, named after the ACC file and overwritten in place on every run.', nodes: ['srv', 'graph'], edges: [2] },
      { title: 'Expose it in Fabric', text: 'A OneLake shortcut, created once by hand, makes that folder visible in the Lakehouse.', nodes: ['graph', 'lake'], edges: [3] },
      { title: 'Convert to Delta and report', text: 'A notebook converts the JSON to Delta tables, and Power BI reads them through Direct Lake.', nodes: ['lake', 'nb', 'pbi'], edges: [4, 5] },
    ],
    decisions: [
      { t: 'OneDrive as the landing zone', d: 'Writing straight to OneLake needs a storage-audience token that many tenants do not provision. Microsoft Graph with the narrow app-folder permission works without that, and a OneLake shortcut bridges the last hop.' },
      { t: 'Narrowest permission that works', d: 'Only access to a single app-specific OneDrive folder is requested, not the whole drive.' },
      { t: 'Delta tables come from a notebook', d: 'There is no mature Delta Lake writer for Node.js, so the server lands JSON and a Fabric notebook does the conversion where Delta is native.' },
      { t: 'Current state, not snapshots', d: 'Output files are named after the model and overwritten, so the Lakehouse holds the latest state per file instead of an ever-growing pile of timestamped copies.' },
    ],
  },

  /* ------------------------------------------------------------------ 05 */
  {
    slug: 'model-health-check',
    n: '05',
    name: 'Cloud Model Health Check',
    kind: 'APS web app',
    status: 'In progress',
    image: 'showcase/5-aps-model-health-check.jpg',
    demo: 5,
    demoHint: 'Filter by tile, click a row for check detail, then Run again.',
    stack: ['React', 'TypeScript', 'Node.js', 'Design Automation for Revit', 'C# Revit plug-in', 'Excel export'],
    tagline: 'Run a QA ruleset across a batch of ACC Revit models in the cloud, with no downloads and no desktop Revit.',
    problem:
      'Model health is normally checked by opening each model in desktop Revit, which is slow, manual and only happens close to a milestone.',
    outcome: [
      'Runs a QA ruleset against many ACC models in parallel, each checked independently in the cloud.',
      'Warnings, file size, worksets, links, CAD imports and naming checks, with per-model Pass / Attention / Fail.',
      'Editable rulesets, saved setups and an Excel report export.',
    ],
    diagram: {
      cols: 5,
      rows: 2,
      nodes: [
        { id: 'spa', label: 'React SPA', sub: 'Ruleset, models, results', col: 0, row: 0, kind: 'actor', desc: 'The workspace: pick a ruleset, pick models, start a run and review results.' },
        { id: 'api', label: 'API server', sub: 'Express + TypeScript', col: 1, row: 0, kind: 'app', desc: 'Signs the user in, orchestrates runs with bounded concurrency and builds reports. CPU-heavy work runs on worker threads.' },
        { id: 'dm', label: 'Data Management', sub: 'Hubs, projects, files', col: 2, row: 0, kind: 'service', desc: 'Browsing and resolving the version of each Revit file.' },
        { id: 'oss', label: 'Transient storage', sub: 'params.json / results.json', col: 3, row: 0, kind: 'data', desc: 'A short-lived bucket holds each model and its ruleset for the duration of one work item.' },
        { id: 'da', label: 'Design Automation', sub: 'One work item per model', col: 4, row: 0, kind: 'service', desc: 'Autodesk’s cloud Revit engine runs the plug-in headlessly against the real document.' },
        { id: 'plug', label: 'Revit plug-in', sub: 'Shared check catalog', col: 4, row: 1, kind: 'app', desc: 'A generic filter engine plus prebuilt checks, evaluating the ruleset inside the open Revit document.' },
        { id: 'rules', label: 'Ruleset', sub: 'XML converted to JSON', col: 0, row: 1, kind: 'data', desc: 'A ruleset file is converted to JSON and checks can be switched on or off.' },
        { id: 'xls', label: 'Excel report', sub: 'Per model, per check', col: 2, row: 1, kind: 'data', desc: 'Pass, fail and counts per check, exported as a formatted workbook.' },
      ],
      edges: [
        { from: 'spa', to: 'api', both: true },
        { from: 'api', to: 'dm', both: true },
        { from: 'api', to: 'oss', label: 'stage' },
        { from: 'oss', to: 'da', label: 'work item' },
        { from: 'da', to: 'plug' },
        { from: 'rules', to: 'spa', label: 'checks' },
        { from: 'api', to: 'xls', route: 'vh' },
      ],
    },
    steps: [
      { title: 'Choose the ruleset', text: 'A ruleset file is converted to JSON. You tick or untick individual checks before a run.', nodes: ['spa', 'api', 'rules'], edges: [0, 5] },
      { title: 'Pick models', text: 'Data Management lists hubs, projects and folders. Tick any number of Revit files across the project.', nodes: ['spa', 'api', 'dm'], edges: [0, 1] },
      { title: 'Stage the inputs', text: 'For each model, the file and a params.json are staged in a short-lived storage bucket. No write permission on the ACC folder is needed.', nodes: ['api', 'oss'], edges: [2] },
      { title: 'One cloud work item per model', text: 'A Design Automation work item runs per model, with bounded concurrency. If one fails, the rest of the batch carries on.', nodes: ['oss', 'da'], edges: [3] },
      { title: 'Check the real document', text: 'The plug-in opens the model in Autodesk’s cloud Revit engine and evaluates the ruleset there, then writes results.json.', nodes: ['da', 'plug'], edges: [4] },
      { title: 'Review and export', text: 'Results come back per model and per check. Export the whole run as an Excel report.', nodes: ['api', 'spa', 'xls'], edges: [0, 6] },
    ],
    decisions: [
      { t: 'Revit itself is the source of truth', d: 'Many checks (pinned, mirrored, in-place families) cannot be answered reliably from a translated property database, so checks run against the real document in Design Automation.' },
      { t: 'One check catalog, two entry points', d: 'The same check library is used by a cloud app bundle and by a desktop test add-in, so a new check can be tried locally in Revit before it ever goes to the cloud.' },
      { t: 'JSON contract between web and cloud', d: 'The web app and the plug-in only exchange params.json and results.json, which keeps the two sides independent and easy to test.' },
      { t: 'Cost-aware concurrency', d: 'Concurrency only changes wall-clock time, not total billed minutes, so it is a setting. Heavy XML parsing and workbook building run on worker threads to keep the API responsive.' },
    ],
  },

  /* ------------------------------------------------------------------ 06 */
  {
    slug: 'midp-tidp-check',
    n: '06',
    name: 'MIDP / TIDP delivery check',
    kind: 'APS web app',
    status: 'Built',
    image: 'showcase/6-aps-midp-tidp-check.jpg',
    demo: 6,
    demoHint: 'Filter Found or Missing, or search a document number.',
    stack: ['React', 'TypeScript', 'Node.js', 'ACC Data Management', 'Excel (exceljs)'],
    tagline: 'Compare the information delivery plan against what is actually in ACC, so teams see what is delivered and what is missing.',
    problem:
      'Answering “has everything on the MIDP been delivered?” usually takes days of manual cross-checking between a schedule and folder contents.',
    outcome: [
      'Reads the TIDP/MIDP schedule from ACC or an upload.',
      'Matches file names exactly, then starts-with, then contains (“deep search”).',
      'Filters to files in the Shared area, shows found vs missing with a delivery rate and exports a QA/QC report.',
    ],
    diagram: {
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'spa', label: 'React SPA', sub: 'Pick, filter, review', col: 0, row: 0, kind: 'actor', desc: 'Receives ready-to-render JSON. It has no Excel-parsing dependency at all.' },
        { id: 'api', label: 'API server', sub: 'Express + TypeScript', col: 1, row: 0, kind: 'app', desc: 'Handles APS sign-in (PKCE), reads and parses workbooks and runs the comparison.' },
        { id: 'sched', label: 'TIDP / MIDP workbook', sub: 'From ACC or upload', col: 2, row: 0, kind: 'data', desc: 'The schedule of expected documents. Parsed on the server for speed.' },
        { id: 'log', label: 'Files log', sub: 'Live scan, ACC file or upload', col: 2, row: 1, kind: 'data', desc: 'What actually exists: a live recursive folder scan, an exported log picked from ACC, or an uploaded workbook.' },
        { id: 'match', label: 'Match engine', sub: 'Deep search', col: 1, row: 1, kind: 'app', desc: 'Exact base name first, then starts-with, then contains, recording which strategy matched each document.' },
        { id: 'aps', label: 'APS', sub: 'Data Management', col: 3, row: 0, kind: 'service', desc: 'Browsing hubs, projects and folders, and downloading files.' },
        { id: 'report', label: 'QA/QC report', sub: 'Excel + error log', col: 0, row: 1, kind: 'data', desc: 'Per-row, per-format results, downloadable or saved back into an ACC folder.' },
      ],
      edges: [
        { from: 'spa', to: 'api', both: true },
        { from: 'api', to: 'aps', both: true },
        { from: 'sched', to: 'api' },
        { from: 'log', to: 'match' },
        { from: 'api', to: 'match' },
        { from: 'match', to: 'report' },
      ],
    },
    steps: [
      { title: 'Sign in and pick a project', text: 'Sign in with Autodesk (authorization code with PKCE) and choose the hub and project.', nodes: ['spa', 'api', 'aps'], edges: [0, 1] },
      { title: 'Load the schedule', text: 'Pick the TIDP/MIDP workbook from ACC or upload it. The server parses it and returns clean JSON to the browser.', nodes: ['sched', 'api', 'spa'], edges: [2, 0] },
      { title: 'Choose columns and formats', text: 'Filter to the filled-in rows, choose the column holding each document’s base filename and the formats it should exist in (for example pdf, dwg, ifc).', nodes: ['spa', 'api'], edges: [0] },
      { title: 'Provide the files log', text: 'Scan folders live, pick an exported log from ACC, or upload one. Optionally keep only files whose path contains the Shared area.', nodes: ['log', 'aps', 'match'], edges: [3, 1] },
      { title: 'Deep-search match', text: 'Each expected document is matched exact first, then starts-with, then contains, so naming drift does not create a false “missing”.', nodes: ['api', 'match', 'log'], edges: [4, 3] },
      { title: 'Review and export', text: 'See found and missing per row and per format with a delivery rate, then export the QA/QC report or save it back to ACC.', nodes: ['match', 'report', 'spa'], edges: [5] },
    ],
    decisions: [
      { t: 'Deep search instead of one match mode', d: 'Committing to a single match mode up front causes false missing results when files carry suffixes, version tags or different casing. The combined strategy also reports which rule found each match.' },
      { t: 'Two sources for both inputs', d: 'The schedule and the files log can each come from ACC or from a local upload, so the tool works with live data or with exports.' },
      { t: 'Scope to the Shared area', d: 'An optional path filter limits the comparison to documents that have reached the project’s Shared area under ISO 19650, not everything in work-in-progress.' },
      { t: 'Parsing stays on the server', d: 'Workbooks are parsed in Node and sent to the browser as JSON, which keeps the client small and fast on large schedules.' },
    ],
  },
];

export const toolBySlug = Object.fromEntries(tools.map((t) => [t.slug, t]));
