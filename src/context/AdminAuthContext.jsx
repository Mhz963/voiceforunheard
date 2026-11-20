import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearAdminSession,
  getAdminSession,
} from '../services/parentStorage'
import { seedDemoData } from '../services/seedDemoData'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedDemoData()
    const session = getAdminSession()
    if (session) setAdmin(session)
    setLoading(false)
  }, [])

  // Staff sign-in cannot be verified safely in the browser. It stays disabled
  // until server-side authentication (e.g. Supabase Auth) is connected.
  function login() {
    throw new Error('Educator sign-in is not available yet. It will open once secure server sign-in is set up.')
  }

  function logout() {
    clearAdminSession()
    setAdmin(null)
  }

  const value = useMemo(
    () => ({ admin, loading, login, logout, isAuthenticated: !!admin }),
    [admin, loading],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
