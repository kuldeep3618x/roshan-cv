import { useEffect, useState } from 'react';
import { useRoute } from './router.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Portfolio from './components/Portfolio.jsx';
import Skills from './components/Skills.jsx';
import Experience from './components/Experience.jsx';
import Credentials from './components/Credentials.jsx';
import Contact from './components/Contact.jsx';
import ToolPage from './pages/ToolPage.jsx';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'tools', label: 'Tools' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const route = useRoute();
  const [theme, setTheme] = useState(initialTheme);
  const [active, setActive] = useState('about');
  const onHome = route.name === 'home';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  // Returning from a tool page to "#tools" (or any section): the target only exists after the home page renders.
  useEffect(() => {
    if (!onHome) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    // Instant: this is a page change, and a smooth scroll would race the home page finishing its layout.
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, [onHome]);

  // Highlight the current section in the nav (home page only).
  useEffect(() => {
    if (!onHome) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <>
      <Nav
        sections={SECTIONS}
        active={onHome ? active : 'tools'}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <main>
        {onHome ? (
          <>
            <Hero />
            <About />
            <Projects />
            <Portfolio />
            <Skills />
            <Experience />
            <Credentials />
            <Contact />
          </>
        ) : (
          <>
            <ToolPage slug={route.slug} />
            <Contact />
          </>
        )}
      </main>
    </>
  );
}
