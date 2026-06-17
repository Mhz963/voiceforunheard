import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { parentPortalConfig } from '../data/parentPortal'
import {
  clearParentSession,
  findParentByEmail,
  getEffectiveAccessCodes,
  getParentFromSession,
  saveParent,
  setParentSession,
} from '../services/parentStorage'
import { seedDemoData } from '../services/seedDemoData'

const ParentAuthContext = createContext(null)

function createId() {
  return `parent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function ParentAuthProvider({ children }) {
  const [parent, setParent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedDemoData()
    setParent(getParentFromSession())
    setLoading(false)
  }, [])

  function login(email, password) {
    const account = findParentByEmail(email)
    if (!account) {
      throw new Error('No account found with this email. Please register first.')
    }
    if (!account.approved) {
      throw new Error('Your account is pending approval. The educator will activate your access soon.')
    }
    if (account.password !== password) {
      throw new Error('Incorrect password. Please try again.')
    }
    setParentSession(account)
    setParent(account)
    return account
  }

  function register({ name, email, password, childName, childAge, relationship, accessCode }) {
    if (findParentByEmail(email)) {
      throw new Error('An account with this email already exists. Please sign in.')
    }

    const codeValid = getEffectiveAccessCodes(parentPortalConfig.accessCodes).includes(
      accessCode?.trim().toUpperCase(),
    )
    const account = {
      id: createId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      childName: childName.trim(),
      childAge: childAge.trim(),
      relationship,
      approved: codeValid,
      createdAt: new Date().toISOString(),
    }

    saveParent(account)

    if (!codeValid) {
      throw new Error(
        'Registration saved. Your educator will review your request and activate your account. Use your access code when provided to sign in after approval.',
      )
    }

    setParentSession(account)
    setParent(account)
    return account
  }

  function logout() {
    clearParentSession()
    setParent(null)
  }

  const value = useMemo(
    () => ({ parent, loading, login, register, logout, isAuthenticated: !!parent }),
    [parent, loading],
  )

  return <ParentAuthContext.Provider value={value}>{children}</ParentAuthContext.Provider>
}

export function useParentAuth() {
  const ctx = useContext(ParentAuthContext)
  if (!ctx) throw new Error('useParentAuth must be used within ParentAuthProvider')
  return ctx
}
