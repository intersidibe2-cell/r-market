import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'

export interface AuditLog {
  id: string
  action: string
  category: 'auth' | 'product' | 'order' | 'customer' | 'inventory' | 'finance' | 'settings' | 'system'
  description: string
  details?: Record<string, any>
  userId: string
  userName: string
  userRole: string
  timestamp: string
  ipAddress?: string
}

interface AuditContextType {
  logs: AuditLog[]
  addLog: (action: string, category: AuditLog['category'], description: string, details?: Record<string, any>) => void
  getLogsByCategory: (category: AuditLog['category']) => AuditLog[]
  getLogsByUser: (userId: string) => AuditLog[]
  getLogsByDateRange: (startDate: string, endDate: string) => AuditLog[]
  clearLogs: () => void
  exportLogs: () => string
}

const AuditContext = createContext<AuditContextType | undefined>(undefined)

const STORAGE_KEY = 'rmarket_audit_logs'
const MAX_LOGS = 1000

export function AuditProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const saveLogs = (newLogs: AuditLog[]) => {
    // Limiter le nombre de logs
    const trimmed = newLogs.slice(-MAX_LOGS)
    setLogs(trimmed)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  }

  const addLog = useCallback((
    action: string, 
    category: AuditLog['category'], 
    description: string, 
    details?: Record<string, any>
  ) => {
    const newLog: AuditLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      action,
      category,
      description,
      details,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonyme',
      userRole: user?.role || 'guest',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1' // Mock IP
    }

    setLogs(prev => {
      const updated = [...prev, newLog]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(-MAX_LOGS)))
      return updated.slice(-MAX_LOGS)
    })
  }, [user])

  const getLogsByCategory = useCallback((category: AuditLog['category']) => {
    return logs.filter(log => log.category === category)
  }, [logs])

  const getLogsByUser = useCallback((userId: string) => {
    return logs.filter(log => log.userId === userId)
  }, [logs])

  const getLogsByDateRange = useCallback((startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    return logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime()
      return logTime >= start && logTime <= end
    })
  }, [logs])

  const clearLogs = useCallback(() => {
    setLogs([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const exportLogs = useCallback(() => {
    const csv = [
      ['Date', 'Action', 'Catégorie', 'Description', 'Utilisateur', 'Rôle'].join(','),
      ...logs.map(log => [
        new Date(log.timestamp).toLocaleString('fr-FR'),
        log.action,
        log.category,
        `"${log.description}"`,
        log.userName,
        log.userRole
      ].join(','))
    ].join('\n')
    
    return csv
  }, [logs])

  return (
    <AuditContext.Provider value={{
      logs,
      addLog,
      getLogsByCategory,
      getLogsByUser,
      getLogsByDateRange,
      clearLogs,
      exportLogs
    }}>
      {children}
    </AuditContext.Provider>
  )
}

export function useAudit() {
  const context = useContext(AuditContext)
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider')
  }
  return context
}
