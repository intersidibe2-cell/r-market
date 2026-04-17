import { useState, useEffect } from 'react'
import { ShoppingCart, Check } from 'lucide-react'

interface CartAnimationProps {
  show: boolean
  productImage: string
  onComplete: () => void
}

export default function CartAnimation({ show, productImage, onComplete }: CartAnimationProps) {
  const [stage, setStage] = useState<'idle' | 'flying' | 'arrived' | 'done'>('idle')

  useEffect(() => {
    if (show) {
      setStage('flying')
      
      // Flying animation
      const flyingTimer = setTimeout(() => {
        setStage('arrived')
      }, 600)
      
      // Arrived animation
      const arrivedTimer = setTimeout(() => {
        setStage('done')
      }, 1000)
      
      // Reset
      const resetTimer = setTimeout(() => {
        setStage('idle')
        onComplete()
      }, 1500)
      
      return () => {
        clearTimeout(flyingTimer)
        clearTimeout(arrivedTimer)
        clearTimeout(resetTimer)
      }
    }
  }, [show, onComplete])

  if (stage === 'idle') return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {/* Flying product */}
      <div 
        className={`absolute transition-all duration-500 ease-out ${
          stage === 'flying' 
            ? 'opacity-100 scale-100' 
            : stage === 'arrived' 
              ? 'opacity-0 scale-50' 
              : 'hidden'
        }`}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: stage === 'flying' ? 'flyToCart 0.6s ease-out forwards' : undefined
        }}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-500 shadow-2xl bg-white">
          <img src={productImage} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Cart icon with bounce */}
      <div 
        className={`fixed top-4 right-4 transition-all duration-300 ${
          stage === 'arrived' ? 'scale-125' : 'scale-100'
        }`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          stage === 'arrived' ? 'bg-green-500' : 'bg-gray-800'
        } shadow-lg transition-colors duration-300`}>
          {stage === 'arrived' ? (
            <Check className="w-6 h-6 text-white" />
          ) : (
            <ShoppingCart className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      {/* Success text */}
      {stage === 'arrived' && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          Ajouté au panier!
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes flyToCart {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(30%, -70%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(60%, -80%) scale(0.3);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
