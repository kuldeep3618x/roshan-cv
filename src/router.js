import { useEffect, useState } from 'react';

// Tiny hash router. "#/tools/<slug>" is a tool page; anything else (including "#about") is the home page.
function parse(hash) {
  const m = hash.match(/^#\/tools\/([\w-]+)/);
  return m ? { name: 'tool', slug: m[1] } : { name: 'home' };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export const toolHref = (slug) => `#/tools/${slug}`;
