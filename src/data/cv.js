// All CV content lives here so the site can be updated without touching components.

export const profile = {
  name: 'J K Roshan Kerketta',
  short: 'Roshan Kerketta',
  title: 'BIM Manager',
  tagline: 'Information Management  ·  Digital Delivery & Automation',
  location: 'Dubai, UAE',
  email: 'kuldeep3618x@gmail.com',
  linkedin: 'https://www.linkedin.com/in/j-k-roshan-kerketta-a2a4a669',
  linkedinLabel: 'linkedin.com/in/j-k-roshan-kerketta',
  cvFile: 'Roshan_Kerketta_CV.pdf',
};

export const stats = [
  { value: '11+', label: 'Years of experience' },
  { value: '6+', label: 'Custom add-ins & automations' },
  { value: '3', label: 'Giga-scale projects' },
  { value: '5+', label: 'Platforms: Revit · ACC · APS · Power BI' },
];

export const summary = [
  'BIM Manager and Lead Architect with 11+ years in BIM management, information management and design automation, delivering large-scale, complex, multidisciplinary projects — airports, stadiums, high-rise towers and giga-projects.',
  'I define project information strategy, develop BIM Execution Plans (BEP), and set up and manage Common Data Environment (CDE) structures, workflows and protocols in Autodesk Construction Cloud (ACC) in line with ISO 19650, keeping information structured, governed and consistent across all disciplines.',
  'I am also a hands-on developer: I build the tools teams use in C#, JavaScript/TypeScript, Python and Dynamo — add-ins for Revit, Navisworks and Civil 3D, Design Automation apps, and Autodesk Platform Services (APS) web apps with React and Node.js that connect ACC to Power BI and Microsoft Fabric. I use AI-assisted development to ship internal tools faster, turning repetitive BIM and data tasks into reliable, self-service applications.',
];

export const focus = [
  { name: 'BIM Management & Coordination', pct: 95 },
  { name: 'Revit / Navisworks Add-in Development', pct: 90 },
  { name: 'Autodesk Platform Services (APS)', pct: 85 },
  { name: 'Power Platform & Dashboards', pct: 85 },
  { name: 'AI-Assisted Development', pct: 80 },
];

export const projects = [
  { name: 'NEOM Trojena Vault', meta: 'Concept → Detailed Design', place: 'Saudi Arabia', icon: 'mountain' },
  { name: 'Mirage Depot', meta: 'Design & BIM Coordination', place: 'NEOM', icon: 'depot' },
  { name: 'High-Rise Towers', meta: 'Design & BIM Delivery', place: 'Dubai / Bengaluru', icon: 'tower' },
  { name: 'Bin Rashid Stadium', meta: 'BIM Coordination', place: 'Dubai', icon: 'stadium' },
  { name: 'Al Maktoum Airport', meta: 'Model Coordination', place: 'Dubai', icon: 'plane' },
  { name: 'YAS-IB Housing', meta: 'Dynamo Automation', place: 'Abu Dhabi', icon: 'home' },
];

export const portfolio = [
  {
    name: 'ClashCommentSync',
    stack: 'C# · ClosedXML',
    text: 'Exports and imports Clash Detective comments through Excel for offline review, with bulk sync back into the model.',
  },
  {
    name: 'pyRevit Workset Manager',
    stack: 'Python · WPF · Revit 2025',
    text: 'Extension for bulk workset assignment with category/family grouping and Excel rule import.',
  },
  {
    name: 'ACC → Power BI Pipeline',
    stack: 'Power Query · APS GraphQL',
    text: 'Power Query Online dataflow pulling Revit model data from ACC through the APS Data Exchange GraphQL API into live dashboards.',
  },
  {
    name: 'ACC File-Log Automation',
    stack: 'Power Automate · Power Apps · APS OAuth',
    text: 'Solution using 2-legged APS OAuth to log ACC folder activity into SharePoint through a canvas app.',
  },
];

export const skillGroups = [
  { title: 'Autodesk platform', items: ['Revit', 'Navisworks Manage', 'AutoCAD', 'Civil 3D', 'Dynamo', 'Autodesk Construction Cloud (ACC)', 'Autodesk Platform Services (APS / Forge)'] },
  { title: 'Development & automation', items: ['C# / .NET', 'Revit, Navisworks & Civil 3D API', 'Python', 'pyRevit', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Power BI', 'Power Automate', 'Power Apps', 'Git', 'Azure'] },
  { title: 'Information management', items: ['ISO 19650', 'BIM Execution Plans (BEP)', 'CDE setup & governance', 'Clash coordination', 'MEP coordination', 'Authority submittals'] },
];

export const toolUsage = [
  { name: 'Revit', pct: 96 },
  { name: 'Navisworks Manage', pct: 92 },
  { name: 'Python (pyRevit, scripting)', pct: 88 },
  { name: 'C# / .NET (Revit & Navisworks API)', pct: 87 },
  { name: 'APS', pct: 85 },
  { name: 'Power BI / Automate / Apps', pct: 85 },
  { name: 'Dynamo', pct: 78 },
];

export const experience = [
  {
    role: 'BIM Manager',
    org: 'OBMI (OBM International)',
    dates: 'Apr 2026 – Present',
    place: 'Dubai, UAE',
    current: true,
    bullets: [
      'Lead BIM and information management strategy, standards and execution planning across live projects, ensuring model quality, consistent information delivery and effective clash resolution.',
      'Set up and manage Common Data Environment (CDE) structures, workflows and protocols in Autodesk Construction Cloud (ACC), working to ISO 19650 and keeping information governed across all disciplines.',
      'Drive automation as a hands-on developer: C# add-ins for Revit and Navisworks (incl. a Clash Tolerance Updater), APS Design Automation apps, and APS web apps (Node.js, React, TypeScript) integrated with ACC.',
      'Built an ACC to Microsoft Fabric data pipeline (APS Model Derivative, OneLake/Delta tables) feeding Power BI model and data quality reporting.',
      'Apply AI tools and scripting to turn repetitive BIM workflows into reusable applications, bridging design teams, project leadership and consultants.',
    ],
  },
  {
    role: 'Senior BIM Architect',
    org: 'LACASA Architects and Engineering Consultants',
    dates: 'Sep 2025 – Apr 2026',
    place: 'Dubai, UAE',
    bullets: [
      'Led architecture design and design development on high-rise projects, from design options to coordinated, submission-ready packages.',
      'Led the design team and coordinated MEP with architecture in the BIM model, resolving interface issues early.',
      'Set up BIM models and projects to client requirements; kept the team synchronized on complex, multidisciplinary models.',
      'Prepared and managed Dubai Municipality submittals.',
    ],
  },
  {
    role: 'Lead Architect',
    org: 'Khatib & Alami',
    dates: 'Mar 2025 – Aug 2025',
    place: 'Bengaluru, India',
    bullets: [
      'ADEK Schools, Abu Dhabi (ALDAR): 1680-capacity Boys and Girls Schools and 2040-capacity Boys School; delivered the Schematic Design package for the 1680 and 2040 Boys Schools.',
      'Led design development, design options and MEP coordination; set up models and projects to client requirements and kept the team synchronized.',
      'Prepared Tasareeh/authority submissions, the LDN package and Abu Dhabi Civil Defense submissions; carried out value engineering against client requirements (CRS).',
      'Managed workforce and resource planning, action tracking and quality audits.',
    ],
  },
  {
    role: 'Senior Architect | BIM Specialist',
    org: 'LACASA Architects and Engineering Consultants',
    dates: 'Oct 2024 – Feb 2025',
    place: 'Dubai, UAE',
    bullets: [
      'Led architecture design and design development on high-rise projects, from design options to coordinated, submission-ready packages.',
      'Led the design team through design development and MEP coordination; set up BIM models and projects to client requirements.',
      'Used Dynamo and Python to automate repetitive BIM tasks; prepared and managed Dubai Municipality submittals.',
    ],
  },
  {
    role: 'Architect and BIM Coordinator',
    org: 'Jacobs',
    dates: 'Jan 2023 – Oct 2024',
    place: 'Dubai, UAE',
    bullets: [
      'Delivered concept and schematic design, detailed design, and design and BIM coordination across disciplines on NEOM Trojena (Vault and Mirage Depot) and The Rig.',
      'Supported constructability and logistics schematics, discarded material management schematics, temporary surrounding road works and excavation works.',
      'Supported TBM launching strategy, gantry, crawler and tower crane deployment strategy, project 4D simulation and The Rig POD modularity design.',
    ],
  },
  {
    role: 'Project Engineer | Software Developer III',
    org: 'AECOM',
    dates: 'Nov 2020 – Dec 2022',
    place: 'Bengaluru, India',
    bullets: [
      'Software Developer in the AEC sector: conceived, designed, documented and tested BIM automation products and trained staff to use them.',
      'Automated workflows and delivered advanced data management and verification of BIM data using custom-built applications.',
      'Developed and deployed desktop applications in Python (tkinter) with Figma and Adobe XD for UI/UX; built a Selenium web-scraping application to extract bulk data from websites.',
      'Worked on the Forge Platform (now APS) and Power BI for data analysis. Stack: Python, JavaScript, Node.js, React, HTML, CSS, Bootstrap, VB.NET, Git, Azure.',
    ],
  },
  {
    role: 'Architect and BIM Coordinator',
    org: 'Dar Al-Handasah (Shair and Partners)',
    dates: 'Dec 2017 – Oct 2020',
    place: 'Pune, India',
    bullets: [
      'Architecture design, design coordination and workflow management on large-scale projects incl. Sheikh Mohammed Bin Rashid Stadium, Ibn Battuta Mall Expansion and Ibn Battuta Hotel.',
      'Used Dynamo and Python to automate processes and improve efficiency across project workflows (R&D in automation, Dec 2017 to Nov 2020).',
      'Created BIM models of Dubai International Airport as-built facilities to support long-term reliability assessment and asset management.',
    ],
  },
  {
    role: 'BIM Architect',
    org: 'AtkinsRéalis',
    dates: 'Aug 2017 – Dec 2017',
    place: 'Bangalore, India',
    bullets: [
      'BIM Architect on the YAS-IB housing project at Yas Island, Abu Dhabi.',
      'Applied Dynamo scripting to improve efficiency and automate BIM workflows.',
    ],
  },
  {
    role: 'Architect and BIM Coordinator',
    org: 'Dar Al-Handasah (Shair and Partners)',
    dates: 'Aug 2015 – Jul 2017',
    place: 'Pune, India',
    bullets: [
      'Architectural design and structural/MEP coordination; prepared construction drawings (concept to tender), details, schedules and presentations, plus fire and life safety (NFPA, DCD, ARFFS) and acoustic reports.',
      'BIM/model coordinator (Revit) on Sheikh Mohammed Bin Rashid Stadium and Al Maktoum International Airport: central models, large-scale Revit models and families.',
      'Clash detection of Revit models in Navisworks with MEP coordination.',
    ],
  },
  {
    role: 'Architectural Intern',
    org: 'RHAA Landscape Architecture + Planning',
    dates: 'Feb 2014 – Jul 2014',
    place: 'New Delhi, India',
    bullets: ['Prepared concept and design development plans, construction documents, BOQs and 3D visualisations.'],
  },
];

export const credentials = {
  education: [{ title: 'Bachelor of Architecture (B.Arch)', org: 'School of Planning & Architecture, New Delhi', year: '2015' }],
  certifications: [
    'Programming Foundations: Algorithms',
    'AI Tools Workshop',
    'Learning Python',
    'Using Python with Excel',
    'Python Essential Training',
  ],
  languages: [
    { name: 'English', level: 'Full professional' },
    { name: 'Hindi', level: 'Native / bilingual' },
  ],
  honors: ['NASA Industrial Design Trophy, 2011'],
};
