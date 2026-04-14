import { useState, useRef } from 'react'
import { Upload, X, Image, Video, Loader2, Check } from 'lucide-react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  type?: 'image' | 'video' | 'both'
  maxSizeMB?: number
}

// Cloudinary config - Remplace avec tes propres identifiants
const CLOUDINARY_CLOUD_NAME = 'demo' // Remplace par ton cloud name
const CLOUDINARY_UPLOAD_PRESET = 'ml_default' // Remplace par ton upload preset

export default function ImageUpload({ 
  onUpload, 
  currentImage, 
  type = 'image',
  maxSizeMB = 10 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation du type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (type === 'image' && !isImage) {
      setError('Veuillez sélectionner une image')
      return
    }
    if (type === 'video' && !isVideo) {
      setError('Veuillez sélectionner une vidéo')
      return
    }
    if (type === 'both' && !isImage && !isVideo) {
      setError('Veuillez sélectionner une image ou vidéo')
      return
    }

    // Validation de la taille
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`Fichier trop volumineux (max ${maxSizeMB}MB)`)
      return
    }

    setError(null)
    setUploading(true)

    // Preview local
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      // Upload vers Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload')
      }

      const data = await response.json()
      const url = data.secure_url

      setPreview(url)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onUpload(url)

    } catch (err) {
      console.error('Upload error:', err)
      setError('Erreur lors de l\'upload. Vérifiez votre connexion.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isVideo = preview?.includes('.mp4') || preview?.includes('video')

  return (
    <div className="space-y-3">
      {/* Zone d'upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          error
            ? 'border-red-300 bg-red-50'
            : success
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*'}
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            <p className="text-sm text-gray-600">Upload en cours...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            {isVideo ? (
              <video src={preview} className="w-full h-48 object-cover rounded-lg" controls />
            ) : (
              <img src={preview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg" />
            )}
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            {success && (
              <div className="absolute top-2 left-2 p-1.5 bg-green-500 text-white rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {type === 'video' ? (
                <Video className="w-6 h-6 text-gray-400" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Cliquez pour uploader {type === 'video' ? 'une vidéo' : type === 'image' ? 'une image' : 'un fichier'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {type === 'both' ? 'Images et vidéos' : type === 'video' ? 'MP4, WebM' : 'JPG, PNG, WebP'} • Max {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Messages d'erreur */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Info Cloudinary */}
      <p className="text-xs text-gray-400">
        💡 Pour utiliser l'upload, configure tes identifiants Cloudinary dans le code
      </p>
    </div>
  )
}
