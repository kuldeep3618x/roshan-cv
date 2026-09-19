import React from 'react';
import { createRoot } from 'react-dom/client';
import './theme.css';
import App from './App.jsx';

// ?embed hides the toolkit chrome so a single demo window can sit inside another page.
const embed = new URLSearchParams(window.location.search).has('embed');
if (embed) document.documentElement.classList.add('embed');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App embed={embed} />
  </React.StrictMode>
);
