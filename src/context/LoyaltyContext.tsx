import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'diamond'

export interface LoyaltyData {
  userId: string
  points: number
  tier: LoyaltyTier
  totalSpent: number
  totalPointsEarned: number
  totalPointsRedeemed: number
  joinedAt: string
  lastActivity: string
}

export interface LoyaltyReward {
  id: string
  name: string
  description: string
  pointsCost: number
  type: 'discount_percent' | 'discount_fixed' | 'free_shipping' | 'gift'
  value: number
  minTier: LoyaltyTier
  available: boolean
}

export interface PointsTransaction {
  id: string
  type: 'earned' | 'redeemed' | 'expired' | 'bonus'
  points: number
  description: string
  orderId?: string
  date: string
}

interface LoyaltyContextType {
  data: LoyaltyData | null
  rewards: LoyaltyReward[]
  transactions: PointsTransaction[]
  addPoints: (points: number, description: string, orderId?: string) => void
  redeemPoints: (points: number, description: string) => boolean
  getTierInfo: (tier: LoyaltyTier) => { name: string; minPoints: number; benefits: string[]; color: string }
  getPointsValue: (points: number) => number
  calculateOrderPoints: (orderTotal: number) => number
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined)

const tierConfig: Record<LoyaltyTier, { name: string; minPoints: number; benefits: string[]; color: string }> = {
  bronze: {
    name: 'Bronze',
    minPoints: 0,
    benefits: ['1 point = 100 FCFA', 'Accès aux promotions'],
    color: 'text-orange-600 bg-orange-100'
  },
  silver: {
    name: 'Argent',
    minPoints: 1000,
    benefits: ['1.2x points', 'Livraison gratuite > 10,000 FCFA', 'Accès prioritaire'],
    color: 'text-gray-600 bg-gray-200'
  },
  gold: {
    name: 'Or',
    minPoints: 5000,
    benefits: ['1.5x points', 'Livraison gratuite', 'Réduction 5%', 'Support prioritaire'],
    color: 'text-yellow-600 bg-yellow-100'
  },
  diamond: {
    name: 'Diamant',
    minPoints: 10000,
    benefits: ['2x points', 'Livraison gratuite', 'Réduction 10%', 'Offres exclusives', 'Concierge dédié'],
    color: 'text-blue-600 bg-blue-100'
  }
}

const defaultRewards: LoyaltyReward[] = [
  {
    id: 'r1',
    name: 'Réduction 5%',
    description: '5% de réduction sur votre prochaine commande',
    pointsCost: 500,
    type: 'discount_percent',
    value: 5,
    minTier: 'bronze',
    available: true
  },
  {
    id: 'r2',
    name: 'Réduction 10%',
    description: '10% de réduction sur votre prochaine commande',
    pointsCost: 1000,
    type: 'discount_percent',
    value: 10,
    minTier: 'silver',
    available: true
  },
  {
    id: 'r3',
    name: 'Livraison gratuite',
    description: 'Livraison gratuite sur votre prochaine commande',
    pointsCost: 300,
    type: 'free_shipping',
    value: 0,
    minTier: 'bronze',
    available: true
  },
  {
    id: 'r4',
    name: 'Bon 1000 FCFA',
    description: 'Bon d\'achat de 1000 FCFA',
    pointsCost: 1500,
    type: 'discount_fixed',
    value: 1000,
    minTier: 'silver',
    available: true
  },
  {
    id: 'r5',
    name: 'Bon 5000 FCFA',
    description: 'Bon d\'achat de 5000 FCFA',
    pointsCost: 7000,
    type: 'discount_fixed',
    value: 5000,
    minTier: 'gold',
    available: true
  }
]

const STORAGE_KEY = 'rmarket_loyalty'
const TRANSACTIONS_KEY = 'rmarket_loyalty_transactions'

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [data, setData] = useState<LoyaltyData | null>(() => {
    if (!user) return null
    const saved = localStorage.getItem(`${STORAGE_KEY}_${user.id}`)
    if (saved) return JSON.parse(saved)
    
    // Créer un nouveau profil
    const newData: LoyaltyData = {
      userId: user.id,
      points: 0,
      tier: 'bronze',
      totalSpent: 0,
      totalPointsEarned: 0,
      totalPointsRedeemed: 0,
      joinedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(newData))
    return newData
  })

  const [transactions, setTransactions] = useState<PointsTransaction[]>(() => {
    if (!user) return []
    const saved = localStorage.getItem(`${TRANSACTIONS_KEY}_${user.id}`)
    return saved ? JSON.parse(saved) : []
  })

  const saveData = (newData: LoyaltyData) => {
    setData(newData)
    localStorage.setItem(`${STORAGE_KEY}_${user?.id || ''}`, JSON.stringify(newData))
    
    // Recalculer le tier
    const newTier = calculateTier(newData.totalPointsEarned - newData.totalPointsRedeemed)
    if (newTier !== newData.tier) {
      newData.tier = newTier
      setData({ ...newData })
      localStorage.setItem(`${STORAGE_KEY}_${user?.id || ''}`, JSON.stringify(newData))
    }
  }

  const saveTransactions = (newTransactions: PointsTransaction[]) => {
    setTransactions(newTransactions)
    localStorage.setItem(`${TRANSACTIONS_KEY}_${user?.id || ''}`, JSON.stringify(newTransactions))
  }

  const calculateTier = (points: number): LoyaltyTier => {
    if (points >= 10000) return 'diamond'
    if (points >= 5000) return 'gold'
    if (points >= 1000) return 'silver'
    return 'bronze'
  }

  const addPoints = useCallback((points: number, description: string, orderId?: string) => {
    if (!data) return

    const multiplier = data.tier === 'silver' ? 1.2 : data.tier === 'gold' ? 1.5 : data.tier === 'diamond' ? 2 : 1
    const finalPoints = Math.round(points * multiplier)

    const newData: LoyaltyData = {
      ...data,
      points: data.points + finalPoints,
      totalPointsEarned: data.totalPointsEarned + finalPoints,
      lastActivity: new Date().toISOString()
    }

    const transaction: PointsTransaction = {
      id: Date.now().toString(),
      type: 'earned',
      points: finalPoints,
      description,
      orderId,
      date: new Date().toISOString()
    }

    saveData(newData)
    saveTransactions([...transactions, transaction])
  }, [data, transactions])

  const redeemPoints = useCallback((points: number, description: string): boolean => {
    if (!data || data.points < points) return false

    const newData: LoyaltyData = {
      ...data,
      points: data.points - points,
      totalPointsRedeemed: data.totalPointsRedeemed + points,
      lastActivity: new Date().toISOString()
    }

    const transaction: PointsTransaction = {
      id: Date.now().toString(),
      type: 'redeemed',
      points: -points,
      description,
      date: new Date().toISOString()
    }

    saveData(newData)
    saveTransactions([...transactions, transaction])
    return true
  }, [data, transactions])

  const getTierInfo = useCallback((tier: LoyaltyTier) => {
    return tierConfig[tier]
  }, [])

  const getPointsValue = useCallback((points: number): number => {
    // 100 points = 1000 FCFA
    return points * 10
  }, [])

  const calculateOrderPoints = useCallback((orderTotal: number): number => {
    // 1 point par 100 FCFA
    return Math.floor(orderTotal / 100)
  }, [])

  return (
    <LoyaltyContext.Provider value={{
      data,
      rewards: defaultRewards,
      transactions,
      addPoints,
      redeemPoints,
      getTierInfo,
      getPointsValue,
      calculateOrderPoints
    }}>
      {children}
    </LoyaltyContext.Provider>
  )
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext)
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider')
  }
  return context
}
