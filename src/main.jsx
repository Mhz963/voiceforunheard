import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ParentAuthProvider } from './context/ParentAuthContext.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { SuperAdminAuthProvider } from './context/SuperAdminAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParentAuthProvider>
      <AdminAuthProvider>
        <SuperAdminAuthProvider>
          <App />
        </SuperAdminAuthProvider>
      </AdminAuthProvider>
    </ParentAuthProvider>
  </StrictMode>,
)
