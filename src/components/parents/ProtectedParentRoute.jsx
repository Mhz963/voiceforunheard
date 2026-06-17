import { Navigate } from 'react-router-dom'
import { useParentAuth } from '../../context/ParentAuthContext'

export default function ProtectedParentRoute({ children }) {
  const { parent, loading } = useParentAuth()

  if (loading) {
    return (
      <div className="portal-loading">
        <p>Loading your portal...</p>
      </div>
    )
  }

  if (!parent) {
    return <Navigate to="/signin" replace />
  }

  return children
}
