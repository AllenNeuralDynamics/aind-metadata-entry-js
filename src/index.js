import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const appVersion = require('../package.json').version;
console.log('app version: ', appVersion)
console.log('s3 url: ', process.env.REACT_APP_S3_URL)
console.log('schemas to filter: ', process.env.REACT_APP_FILTER_SCHEMAS)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <App appVersion={appVersion} />
        <ToastContainer autoClose={8000} />
    </div>
);

reportWebVitals();
