import { Navigate } from 'react-router-dom'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'

export default function ProtectedSuperAdminRoute({ children }) {
  const { superadmin, loading } = useSuperAdminAuth()

  if (loading) {
    return (
      <div className="portal-loading">
        <p>Loading super admin portal...</p>
      </div>
    )
  }

  if (!superadmin) {
    return <Navigate to="/signin" replace />
  }

  return children
}
