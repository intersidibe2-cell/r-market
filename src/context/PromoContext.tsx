import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type PromoType = 'percentage' | 'fixed' | 'free_shipping'
export type PromoStatus = 'active' | 'expired' | 'disabled'

export interface PromoCode {
  id: string
  code: string
  type: PromoType
  value: number
  minPurchase: number
  maxDiscount: number
  usageLimit: number
  usageCount: number
  startDate: string
  endDate: string
  status: PromoStatus
  description: string
  createdAt: string
}

export interface AppliedPromo {
  code: string
  type: PromoType
  value: number
  discount: number
  description: string
}

interface PromoContextType {
  promos: PromoCode[]
  appliedPromo: AppliedPromo | null
  validatePromo: (code: string, cartTotal: number) => { valid: boolean; error?: string; promo?: AppliedPromo }
  applyPromo: (promo: AppliedPromo) => void
  removePromo: () => void
  addPromo: (promo: Omit<PromoCode, 'id' | 'usageCount' | 'createdAt'>) => void
  updatePromo: (id: string, updates: Partial<PromoCode>) => void
  deletePromo: (id: string) => void
  calculateDiscount: (promo: AppliedPromo, subtotal: number) => number
}

const PromoContext = createContext<PromoContextType | undefined>(undefined)

const STORAGE_KEY = 'rmarket_promos'

const defaultPromos: PromoCode[] = [
  {
    id: '1',
    code: 'BIENVENUE10',
    type: 'percentage',
    value: 10,
    minPurchase: 5000,
    maxDiscount: 10000,
    usageLimit: 100,
    usageCount: 23,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    status: 'active',
    description: '10% de réduction pour les nouveaux clients',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    code: 'FIDELITE20',
    type: 'percentage',
    value: 20,
    minPurchase: 20000,
    maxDiscount: 30000,
    usageLimit: 50,
    usageCount: 12,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    status: 'active',
    description: '20% de réduction pour les clients fidèles',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    code: 'LIVRAISON',
    type: 'free_shipping',
    value: 0,
    minPurchase: 10000,
    maxDiscount: 5000,
    usageLimit: 200,
    usageCount: 89,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    status: 'active',
    description: 'Livraison gratuite pour les commandes > 10,000 FCFA',
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    code: 'RAMADAN5000',
    type: 'fixed',
    value: 5000,
    minPurchase: 30000,
    maxDiscount: 5000,
    usageLimit: 100,
    usageCount: 0,
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    status: 'active',
    description: '5000 FCFA de réduction pour Ramadan',
    createdAt: '2024-02-15'
  }
]

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promos, setPromos] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultPromos
  })

  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)

  const savePromos = (newPromos: PromoCode[]) => {
    setPromos(newPromos)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPromos))
  }

  const validatePromo = useCallback((code: string, cartTotal: number): { valid: boolean; error?: string; promo?: AppliedPromo } => {
    const promo = promos.find(p => p.code.toUpperCase() === code.toUpperCase())
    
    if (!promo) {
      return { valid: false, error: 'Code promo invalide' }
    }

    if (promo.status !== 'active') {
      return { valid: false, error: 'Ce code promo n\'est plus actif' }
    }

    const now = new Date()
    const startDate = new Date(promo.startDate)
    const endDate = new Date(promo.endDate)
    endDate.setHours(23, 59, 59)

    if (now < startDate) {
      return { valid: false, error: 'Ce code promo n\'est pas encore valide' }
    }

    if (now > endDate) {
      return { valid: false, error: 'Ce code promo a expiré' }
    }

    if (promo.usageCount >= promo.usageLimit) {
      return { valid: false, error: 'Ce code promo a atteint sa limite d\'utilisation' }
    }

    if (cartTotal < promo.minPurchase) {
      return { valid: false, error: `Montant minimum requis: ${promo.minPurchase.toLocaleString()} FCFA` }
    }

    let discount = 0
    if (promo.type === 'percentage') {
      discount = Math.round(cartTotal * (promo.value / 100))
      discount = Math.min(discount, promo.maxDiscount)
    } else if (promo.type === 'fixed') {
      discount = promo.value
    }

    const appliedPromo: AppliedPromo = {
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discount,
      description: promo.description
    }

    return { valid: true, promo: appliedPromo }
  }, [promos])

  const applyPromo = useCallback((promo: AppliedPromo) => {
    setAppliedPromo(promo)
    
    // Incrémenter le compteur d'utilisation
    const updatedPromos = promos.map(p => 
      p.code === promo.code ? { ...p, usageCount: p.usageCount + 1 } : p
    )
    savePromos(updatedPromos)
  }, [promos])

  const removePromo = useCallback(() => {
    setAppliedPromo(null)
  }, [])

  const addPromo = useCallback((promo: Omit<PromoCode, 'id' | 'usageCount' | 'createdAt'>) => {
    const newPromo: PromoCode = {
      ...promo,
      id: Date.now().toString(),
      usageCount: 0,
      createdAt: new Date().toISOString()
    }
    savePromos([...promos, newPromo])
  }, [promos])

  const updatePromo = useCallback((id: string, updates: Partial<PromoCode>) => {
    const updatedPromos = promos.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
    savePromos(updatedPromos)
  }, [promos])

  const deletePromo = useCallback((id: string) => {
    savePromos(promos.filter(p => p.id !== id))
  }, [promos])

  const calculateDiscount = useCallback((promo: AppliedPromo, subtotal: number): number => {
    if (promo.type === 'percentage') {
      const discount = Math.round(subtotal * (promo.value / 100))
      return Math.min(discount, promo.discount)
    } else if (promo.type === 'fixed') {
      return Math.min(promo.value, subtotal)
    }
    return 0
  }, [])

  return (
    <PromoContext.Provider value={{
      promos,
      appliedPromo,
      validatePromo,
      applyPromo,
      removePromo,
      addPromo,
      updatePromo,
      deletePromo,
      calculateDiscount
    }}>
      {children}
    </PromoContext.Provider>
  )
}

export function usePromo() {
  const context = useContext(PromoContext)
  if (!context) {
    throw new Error('usePromo must be used within a PromoProvider')
  }
  return context
}
