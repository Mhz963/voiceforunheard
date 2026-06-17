import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { portalConfig } from '../data/parentPortal'
import { clearSuperAdminSession, getSuperAdminSession, setSuperAdminSession } from '../services/parentStorage'
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

  function login(email, password) {
    const creds = portalConfig.roles.superadmin
    if (email.trim().toLowerCase() !== creds.email || password !== creds.password) {
      throw new Error('Invalid super admin credentials.')
    }
    const account = { email: creds.email, name: 'Super Administrator', role: 'superadmin' }
    setSuperAdminSession(account)
    setSuperadmin(account)
    return account
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
