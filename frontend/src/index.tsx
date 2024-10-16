import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


// Tipizacija za `getElementById` jer može biti null
const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

