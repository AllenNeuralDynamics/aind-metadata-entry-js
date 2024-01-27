import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const appVersion = require('../package.json').version;
console.log('app version: ', appVersion)
console.log('s3 url: ', process.env.REACT_APP_S3_URL)
console.log('schemas to filter: ', process.env.REACT_APP_FILTER_SCHEMAS)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

reportWebVitals();
