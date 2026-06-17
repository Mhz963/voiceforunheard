import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { admin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="portal-loading">
        <p>Loading admin portal...</p>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/signin" replace />
  }

  return children
}
