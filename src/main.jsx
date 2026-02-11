import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WinkAuthProvider from './components/WinkAuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WinkAuthProvider>
      <App />
    </WinkAuthProvider>
  </StrictMode>,
)
