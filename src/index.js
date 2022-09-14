import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
// import FormContainer from './components/Routes';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
