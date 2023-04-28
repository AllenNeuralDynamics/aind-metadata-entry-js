import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import './index.css';

require("dotenv").config();
console.log(process.env.REACT_APP_S3__URL)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

reportWebVitals();

