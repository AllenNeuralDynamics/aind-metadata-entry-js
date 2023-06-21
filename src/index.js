import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import './index.css';

console.log('app version: ', process.env.REACT_APP_VERSION)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

reportWebVitals();

