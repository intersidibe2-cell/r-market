import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdultAccessContextType {
  hasAccess: boolean
  isVerified: boolean
  verifyAge: (pin?: string) => boolean
  logout: () => void
  setCustomPin: (newPin: string) => void
  defaultPin: string
}

const AdultAccessContext = createContext<AdultAccessContextType | undefined>(undefined)

const STORAGE_KEY = 'rmarket_adult_access'
const PIN_STORAGE_KEY = 'rmarket_adult_pin'
const DEFAULT_PIN = '1234' // PIN par défaut
const ACCESS_DURATION = 24 * 60 * 60 * 1000 // 24 heures

export function AdultAccessProvider({ children }: { children: ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [defaultPin, setDefaultPin] = useState(DEFAULT_PIN)

  useEffect(() => {
    // Vérifier l'accès sauvegardé
    const savedAccess = localStorage.getItem(STORAGE_KEY)
    if (savedAccess) {
      const { timestamp } = JSON.parse(savedAccess)
      const now = Date.now()
      
      // Vérifier si l'accès a expiré (24h)
      if (now - timestamp < ACCESS_DURATION) {
        setHasAccess(true)
        setIsVerified(true)
      } else {
        // Accès expiré
        localStorage.removeItem(STORAGE_KEY)
        setHasAccess(false)
        setIsVerified(false)
      }
    }

    // Charger le PIN personnalisé
    const savedPin = localStorage.getItem(PIN_STORAGE_KEY)
    if (savedPin) {
      setDefaultPin(savedPin)
    }
  }, [])

  const verifyAge = (pin?: string): boolean => {
    // Si pas de PIN fourni (client), accès direct
    if (!pin || pin === '') {
      setHasAccess(true)
      setIsVerified(true)
      
      // Sauvegarder avec timestamp
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timestamp: Date.now()
      }))
      
      return true
    }
    
    // Si PIN fourni, vérifier (pour admin)
    const pinToCheck = pin || defaultPin
    if (pinToCheck === defaultPin || pinToCheck === DEFAULT_PIN) {
      setHasAccess(true)
      setIsVerified(true)
      
      // Sauvegarder avec timestamp
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timestamp: Date.now()
      }))
      
      return true
    }
    
    return false
  }

  const logout = () => {
    setHasAccess(false)
    setIsVerified(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const setCustomPin = (newPin: string) => {
    setDefaultPin(newPin)
    localStorage.setItem(PIN_STORAGE_KEY, newPin)
  }

  return (
    <AdultAccessContext.Provider value={{
      hasAccess,
      isVerified,
      verifyAge,
      logout,
      setCustomPin,
      defaultPin
    }}>
      {children}
    </AdultAccessContext.Provider>
  )
}

export function useAdultAccess() {
  const context = useContext(AdultAccessContext)
  if (!context) {
    throw new Error('useAdultAccess must be used within an AdultAccessProvider')
  }
  return context
}
