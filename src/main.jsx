import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ParentAuthProvider } from './context/ParentAuthContext.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { SuperAdminAuthProvider } from './context/SuperAdminAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <ParentAuthProvider>
          <AdminAuthProvider>
            <SuperAdminAuthProvider>
              <App />
            </SuperAdminAuthProvider>
          </AdminAuthProvider>
        </ParentAuthProvider>
      </ToastProvider>
    </LanguageProvider>
  </StrictMode>,
)
