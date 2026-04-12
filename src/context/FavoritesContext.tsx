import { createContext, useContext, useState, ReactNode } from 'react'

interface FavoriteProduct {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  sold: number
}

interface FavoritesContextType {
  favorites: FavoriteProduct[]
  addToFavorites: (product: FavoriteProduct) => void
  removeFromFavorites: (id: number) => void
  isFavorite: (id: number) => boolean
  toggleFavorite: (product: FavoriteProduct) => void
  totalFavorites: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(() => {
    const saved = localStorage.getItem('rm_favorites')
    return saved ? JSON.parse(saved) : []
  })

  const saveFavorites = (items: FavoriteProduct[]) => {
    setFavorites(items)
    localStorage.setItem('rm_favorites', JSON.stringify(items))
  }

  const addToFavorites = (product: FavoriteProduct) => {
    if (!favorites.find(f => f.id === product.id)) {
      saveFavorites([...favorites, product])
    }
  }

  const removeFromFavorites = (id: number) => {
    saveFavorites(favorites.filter(f => f.id !== id))
  }

  const isFavorite = (id: number) => {
    return favorites.some(f => f.id === id)
  }

  const toggleFavorite = (product: FavoriteProduct) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const totalFavorites = favorites.length

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite, totalFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
