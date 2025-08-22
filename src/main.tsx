import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToolStoreProvider } from './providers/tool-store-provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToolStoreProvider>
      <App />
    </ToolStoreProvider>
  </React.StrictMode>,
)
