import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from './components/App';
import DropdownList from './components/DropdownList';
import reportWebVitals from './reportWebVitals';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DropdownList />
  </React.StrictMode>
);

reportWebVitals();

