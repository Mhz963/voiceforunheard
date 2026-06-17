import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { portalConfig } from '../data/parentPortal'
import {
  clearAdminSession,
  getAdminSession,
  setAdminSession,
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

  function login(email, password) {
    const normalized = email.trim().toLowerCase()
    const { admin } = portalConfig.roles

    if (normalized !== admin.email || password !== admin.password) {
      throw new Error('Invalid admin credentials.')
    }

    const account = { email: admin.email, name: 'Educator Admin' }
    setAdminSession(account)
    setAdmin(account)
    return account
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
