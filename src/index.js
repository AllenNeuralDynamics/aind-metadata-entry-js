import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

const appVersion = require('../package.json').version
console.log('app version: ', appVersion)
console.log('aind-data-transfer-service url: ', process.env.REACT_APP_DATA_TRANSFER_SERVICE_URL)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <div>
        <App appVersion={appVersion} />
        <ToastContainer autoClose={8000} />
    </div>
)

reportWebVitals()
