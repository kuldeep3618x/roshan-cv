import React from 'react';
import { createRoot } from 'react-dom/client';
import './theme.css';
import App from './App.jsx';

// ?embed hides the toolkit chrome so a single demo window can sit inside another page.
const embed = new URLSearchParams(window.location.search).has('embed');
if (embed) document.documentElement.classList.add('embed');
// ?shot hides the toolkit chrome and buttons so a page can be captured as a graphic.
if (new URLSearchParams(window.location.search).has('shot')) document.documentElement.classList.add('shot');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App embed={embed} />
  </React.StrictMode>
);
