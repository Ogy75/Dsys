import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Show focus ring only on keyboard navigation, never on mouse/pointer click
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') document.body.setAttribute('data-keyboard-nav', '')
})
document.addEventListener('pointerdown', () => {
  document.body.removeAttribute('data-keyboard-nav')
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
