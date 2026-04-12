import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface CompareProduct {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
  stock: number
  description?: string
}

interface CompareContextType {
  items: CompareProduct[]
  addToCompare: (product: CompareProduct) => boolean
  removeFromCompare: (id: number) => void
  clearCompare: () => void
  isInCompare: (id: number) => boolean
  canAddMore: () => boolean
  itemCount: number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)
const MAX_COMPARE = 4

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareProduct[]>(() => {
    const saved = localStorage.getItem('rmarket_compare')
    return saved ? JSON.parse(saved) : []
  })

  const saveItems = (newItems: CompareProduct[]) => {
    setItems(newItems)
    localStorage.setItem('rmarket_compare', JSON.stringify(newItems))
  }

  const addToCompare = useCallback((product: CompareProduct): boolean => {
    if (items.length >= MAX_COMPARE) return false
    if (items.some(item => item.id === product.id)) return false
    
    saveItems([...items, product])
    return true
  }, [items])

  const removeFromCompare = useCallback((id: number) => {
    saveItems(items.filter(item => item.id !== id))
  }, [items])

  const clearCompare = useCallback(() => {
    saveItems([])
  }, [])

  const isInCompare = useCallback((id: number): boolean => {
    return items.some(item => item.id === id)
  }, [items])

  const canAddMore = useCallback((): boolean => {
    return items.length < MAX_COMPARE
  }, [items.length])

  return (
    <CompareContext.Provider value={{
      items,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      canAddMore,
      itemCount: items.length
    }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
