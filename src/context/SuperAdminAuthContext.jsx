import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearSuperAdminSession, getSuperAdminSession } from '../services/parentStorage'
import { seedDemoData } from '../services/seedDemoData'

const SuperAdminAuthContext = createContext(null)

export function SuperAdminAuthProvider({ children }) {
  const [superadmin, setSuperadmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedDemoData()
    const session = getSuperAdminSession()
    if (session) setSuperadmin(session)
    setLoading(false)
  }, [])

  // Admin sign-in cannot be verified safely in the browser. It stays disabled
  // until server-side authentication (e.g. Supabase Auth) is connected.
  function login() {
    throw new Error('Admin sign-in is not available yet. It will open once secure server sign-in is set up.')
  }

  function logout() {
    clearSuperAdminSession()
    setSuperadmin(null)
  }

  const value = useMemo(
    () => ({ superadmin, loading, login, logout, isAuthenticated: !!superadmin }),
    [superadmin, loading],
  )

  return <SuperAdminAuthContext.Provider value={value}>{children}</SuperAdminAuthContext.Provider>
}

export function useSuperAdminAuth() {
  const ctx = useContext(SuperAdminAuthContext)
  if (!ctx) throw new Error('useSuperAdminAuth must be used within SuperAdminAuthProvider')
  return ctx
}
