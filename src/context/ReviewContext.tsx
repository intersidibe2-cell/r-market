import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Review {
  id: string
  productId: number
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  images?: string[]
  verified: boolean
  helpful: number
  reported: boolean
  createdAt: string
}

export interface ReviewStats {
  average: number
  total: number
  distribution: Record<number, number>
}

interface ReviewContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'helpful' | 'reported' | 'createdAt'>) => void
  getProductReviews: (productId: number) => Review[]
  getProductStats: (productId: number) => ReviewStats
  markHelpful: (reviewId: string) => void
  reportReview: (reviewId: string) => void
  deleteReview: (reviewId: string) => void
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

const STORAGE_KEY = 'rmarket_reviews'

const defaultReviews: Review[] = [
  {
    id: '1',
    productId: 1,
    userId: '1',
    userName: 'Moussa D.',
    rating: 5,
    title: 'Excellent boubou !',
    comment: 'Très beau boubou, la qualité du tissu est exceptionnelle. La livraison a été rapide. Je recommande vivement ce produit.',
    verified: true,
    helpful: 12,
    reported: false,
    createdAt: '2026-03-15T10:30:00Z'
  },
  {
    id: '2',
    productId: 1,
    userId: '2',
    userName: 'Fatima Z.',
    rating: 4,
    title: 'Bon produit',
    comment: 'Belle coupe et bon tissu. Seul bémol, la couleur est légèrement différente de la photo.',
    verified: true,
    helpful: 5,
    reported: false,
    createdAt: '2026-03-20T14:15:00Z'
  },
  {
    id: '3',
    productId: 2,
    userId: '3',
    userName: 'Alpha O.',
    rating: 5,
    title: 'iPhone authentique',
    comment: 'Phone received in perfect condition. Original packaging and all accessories included. Very satisfied with the purchase.',
    verified: true,
    helpful: 8,
    reported: false,
    createdAt: '2026-03-25T09:00:00Z'
  },
  {
    id: '4',
    productId: 3,
    userId: '4',
    userName: 'Mamadou T.',
    rating: 5,
    title: 'Vodka de qualité',
    comment: 'Bonne vodka, livraison soignée. Parfait pour les fêtes.',
    verified: true,
    helpful: 3,
    reported: false,
    createdAt: '2026-04-01T16:45:00Z'
  },
  {
    id: '5',
    productId: 4,
    userId: '5',
    userName: 'Aïssata C.',
    rating: 4,
    title: 'Masque magnifique',
    comment: 'Superbe masque Dogon, parfait pour la décoration. Un peu plus petit que prévu mais très beau travail artisanal.',
    verified: true,
    helpful: 7,
    reported: false,
    createdAt: '2026-04-05T11:20:00Z'
  }
]

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultReviews
  })

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews))
  }

  const addReview = useCallback((review: Omit<Review, 'id' | 'helpful' | 'reported' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      helpful: 0,
      reported: false,
      createdAt: new Date().toISOString()
    }
    saveReviews([newReview, ...reviews])
  }, [reviews])

  const getProductReviews = useCallback((productId: number): Review[] => {
    return reviews
      .filter(r => r.productId === productId && !r.reported)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [reviews])

  const getProductStats = useCallback((productId: number): ReviewStats => {
    const productReviews = reviews.filter(r => r.productId === productId && !r.reported)
    
    if (productReviews.length === 0) {
      return { average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
    }

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let sum = 0

    productReviews.forEach(r => {
      distribution[r.rating as keyof typeof distribution]++
      sum += r.rating
    })

    return {
      average: Math.round((sum / productReviews.length) * 10) / 10,
      total: productReviews.length,
      distribution
    }
  }, [reviews])

  const markHelpful = useCallback((reviewId: string) => {
    const updatedReviews = reviews.map(r =>
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    )
    saveReviews(updatedReviews)
  }, [reviews])

  const reportReview = useCallback((reviewId: string) => {
    const updatedReviews = reviews.map(r =>
      r.id === reviewId ? { ...r, reported: true } : r
    )
    saveReviews(updatedReviews)
  }, [reviews])

  const deleteReview = useCallback((reviewId: string) => {
    saveReviews(reviews.filter(r => r.id !== reviewId))
  }, [reviews])

  return (
    <ReviewContext.Provider value={{
      reviews,
      addReview,
      getProductReviews,
      getProductStats,
      markHelpful,
      reportReview,
      deleteReview
    }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReview() {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider')
  }
  return context
}
