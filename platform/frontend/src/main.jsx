import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ProjectProvider } from './context/ProjectContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
