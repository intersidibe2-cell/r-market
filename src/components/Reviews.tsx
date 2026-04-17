import { useState, useRef } from 'react'
import { useReview, Review } from '../context/ReviewContext'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { Star, ThumbsUp, Flag, Check, User, Camera, X, Image } from 'lucide-react'

interface ReviewsProps {
  productId: number
}

export default function Reviews({ productId }: ReviewsProps) {
  const { getProductReviews, getProductStats, addReview, markHelpful, reportReview } = useReview()
  const { user, isAuthenticated } = useAuth()
  const { success, error, warning } = useNotification()

  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (photos.length >= 3) return
      
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result as string
        setPhotos(prev => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const reviews = getProductReviews(productId)
  const stats = getProductStats(productId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      warning('Connexion requise', 'Veuillez vous connecter pour laisser un avis')
      return
    }

    if (!title.trim() || !comment.trim()) {
      error('Champs requis', 'Veuillez remplir tous les champs')
      return
    }

    addReview({
      productId,
      userId: user!.id,
      userName: user!.name,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verified: true
    })

    success('Avis publié !', 'Merci pour votre avis')
    setShowForm(false)
    setRating(5)
    setTitle('')
    setComment('')
  }

  const handleHelpful = (reviewId: string) => {
    markHelpful(reviewId)
    success('Merci !', 'Votre vote a été enregistré')
  }

  const handleReport = (reviewId: string) => {
    reportReview(reviewId)
    success('Signalement envoyé', 'Nous examinerons cet avis')
  }

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star 
              className={`w-5 h-5 ${
                star <= (interactive ? (hoveredRating || rating) : count)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const renderDistribution = () => {
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = stats.distribution[rating] || 0
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
          return (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-3">{rating}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-5xl font-bold text-gray-900">{stats.average}</p>
          <div className="flex justify-center mt-2">
            {renderStars(Math.round(stats.average))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{stats.total} avis</p>
        </div>
        <div className="md:col-span-2 bg-gray-50 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-4">Distribution des notes</h4>
          {renderDistribution()}
        </div>
      </div>

      {/* Add Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
        >
          Écrire un avis
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h4 className="font-bold text-lg text-gray-900">Votre avis</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            {renderStars(rating, true)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Résumez votre expérience"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec ce produit..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Photos Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ajouter des photos (optionnel)</label>
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500 transition-colors"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">{photos.length}/3</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Publier l'avis
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-bold text-lg text-gray-900">
          Avis des clients ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun avis pour ce produit. Soyez le premier à donner votre avis !
          </p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{review.userName}</p>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3" />
                          Achat vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-600">{review.comment}</p>

              {/* Review Photos */}
              {(review as any).photos && (review as any).photos.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {(review as any).photos.map((photo: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setPhotoPreview(photo)}
                      className="w-16 h-16 rounded-lg overflow-hidden"
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Utile ({review.helpful})
                </button>
                <button
                  onClick={() => handleReport(review.id)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  Signaler
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Photo Preview Modal */}
      {photoPreview && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPhotoPreview(null)}
        >
          <button 
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
            onClick={() => setPhotoPreview(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img 
            src={photoPreview} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
