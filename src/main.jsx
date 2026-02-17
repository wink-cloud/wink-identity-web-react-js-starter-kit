import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WinkAuthProvider from './components/WinkAuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <WinkAuthProvider>
    <App />
  </WinkAuthProvider>,
)
