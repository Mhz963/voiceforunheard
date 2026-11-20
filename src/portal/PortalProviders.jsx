import { ParentAuthProvider } from '../context/ParentAuthContext.jsx'
import { AdminAuthProvider } from '../context/AdminAuthContext.jsx'
import { SuperAdminAuthProvider } from '../context/SuperAdminAuthContext.jsx'

// Only loaded when VITE_PORTAL_ENABLED=true. Keeps portal code (and its
// localStorage demo data) out of the public site bundle.
export default function PortalProviders({ children }) {
  return (
    <ParentAuthProvider>
      <AdminAuthProvider>
        <SuperAdminAuthProvider>{children}</SuperAdminAuthProvider>
      </AdminAuthProvider>
    </ParentAuthProvider>
  )
}
