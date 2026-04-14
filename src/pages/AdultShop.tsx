import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdultAccess } from '../context/AdultAccessContext'
import AgeGate from '../components/AgeGate'

export default function AdultShop() {
  const { hasAccess, verifyAge } = useAdultAccess()
  const [showGate, setShowGate] = useState(true)
  const [accessGranted, setAccessGranted] = useState(false)

  // Vérifier si l'utilisateur a déjà accédé dans cette session
  useEffect(() => {
    const sessionAccess = sessionStorage.getItem('adult_access_granted')
    if (sessionAccess === 'true') {
      setAccessGranted(true)
      setShowGate(false)
    }
  }, [])

  const handleVerified = () => {
    verifyAge('') // Accès sans PIN pour les clients
    sessionStorage.setItem('adult_access_granted', 'true')
    setAccessGranted(true)
    setShowGate(false)
  }

  const handleCancel = () => {
    window.history.back()
  }

  // Afficher le popup si pas encore vérifié
  if (showGate && !accessGranted) {
    return <AgeGate onVerified={handleVerified} onCancel={handleCancel} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">Articles Intimes</h1>
        <p className="text-gray-600">Bienvenue dans notre section de produits intimes</p>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center">
        <p className="text-purple-700">Section en cours de développement</p>
        <p className="text-gray-600 mt-2">Les produits seront bientôt disponibles</p>
      </div>
    </div>
  )
}
