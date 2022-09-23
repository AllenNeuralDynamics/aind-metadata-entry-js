import React from 'react';
import ReactDOM from 'react-dom/client'; 
import DropdownList from './components/DropdownList';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <DropdownList />
);

reportWebVitals();

