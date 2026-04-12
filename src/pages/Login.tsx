import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const { success, error } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = (location.state as any)?.from?.pathname || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)
      
      if (result) {
        success('Bienvenue !', 'Connexion réussie')
        navigate(from, { replace: true })
      } else {
        error('Erreur', 'Email ou mot de passe incorrect')
      }
    } catch (err) {
      error('Erreur', 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 via-green-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4">
            <span className="text-white font-bold text-3xl">R</span>
          </div>
          <h1 className="text-3xl font-bold text-white">R-Market</h1>
          <p className="text-green-200 mt-2">Connectez-vous à votre compte</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center mb-4">Comptes de démonstration</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setEmail('admin@r-market.ml'); setPassword('admin123') }}
                className="p-3 bg-gray-50 rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Admin</span>
                <p className="text-xs text-gray-500">admin@r-market.ml</p>
              </button>
              <button
                onClick={() => { setEmail('manager@r-market.ml'); setPassword('manager123') }}
                className="p-3 bg-gray-50 rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Manager</span>
                <p className="text-xs text-gray-500">manager@r-market.ml</p>
              </button>
              <button
                onClick={() => { setEmail('seller@r-market.ml'); setPassword('seller123') }}
                className="p-3 bg-gray-50 rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Vendeur</span>
                <p className="text-xs text-gray-500">seller@r-market.ml</p>
              </button>
              <button
                onClick={() => { setEmail('delivery@r-market.ml'); setPassword('delivery123') }}
                className="p-3 bg-gray-50 rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Livreur</span>
                <p className="text-xs text-gray-500">delivery@r-market.ml</p>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-green-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
