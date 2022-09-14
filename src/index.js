import React from 'react';
import ReactDOM from 'react-dom/client';
import FormContainer from './components/Routes';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FormContainer />
  </React.StrictMode>
);

reportWebVitals();
