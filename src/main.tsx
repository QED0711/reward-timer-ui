import React from 'react'
import ReactDOM from 'react-dom/client'
import Spiccato from 'spiccato';
import App from './App'
import './index.css'

import "./state/main/mainManager";
declare global {
  interface Window {_S: any}
}
window._S = Spiccato

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    
    <App />
)
