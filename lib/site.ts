// ─────────────────────────────────────────────────────────────
// Edit everything about the site from this one file.
// Change the strings below and the whole page updates.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: 'Jonathan Obele',
  handle: 'jonathanobele',
  role: 'Data Science Student · AI Minor',
  gradYear: '2027',
  location: 'San Francisco, CA',
  tagline: 'Data science, machine learning, statistics, philosophy.',
  status: 'Open to summer 2026 internships',
  email: 'jonathan.obele@example.com',
  socials: {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    x: 'https://x.com/',
  },
} as const

// The About section heading + paragraphs. Add or remove paragraphs freely.
export const about = {
  paragraphs: [
    "I'm Jonathan Obele, a data science student with an AI minor graduating in 2027. I originally studied engineering before transitioning into data science, while maintaining my interest in science. I am fascinated by predictive modeling, machine learning, and statistics, and I aspire to work broadly in the fields of data science and AI.",
    'Aside from this, I consider myself an aspiring polymath. I desire to acquire significant knowledge across a wide range of fields and apply that knowledge across domains to improve my reasoning and understanding. I have a profound interest in philosophy, especially the philosophy of mind, philosophy of language, logic, and metaphysics.',
    'I am also interested in the sciences, although I am currently far less competent in them and hope to develop a deeper understanding of fields such as evolutionary biology, physics, physiology, and medicine. I currently research miracles and the paranormal, mostly focusing on vindicatory miracles within the Catholic tradition.',
  ],
} as const

// The three focus cards. Each `key` maps to an icon in about-section.tsx.
export const focusAreas = [
  {
    key: 'stats',
    title: 'Statistics',
    body: 'Grounding every conclusion in sound inference — experiment design, uncertainty, and honest evidence.',
  },
  {
    key: 'ml',
    title: 'Machine Learning',
    body: 'Building and evaluating supervised and deep learning models, from feature engineering to deployment.',
  },
  {
    key: 'phil',
    title: 'Philosophy',
    body: 'Thinking about epistemology, ethics, and meaning — and how they shape the way data becomes decisions.',
  },
] as const

export const toolkit = [
  'Python',
  'PyTorch',
  'scikit-learn',
  'Pandas',
  'NumPy',
  'SQL',
  'R',
  'TensorFlow',
  'Jupyter',
  'Git',
  'Docker',
  'Tableau',
] as const
