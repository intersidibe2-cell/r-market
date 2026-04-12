import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Package, ShoppingCart, Heart, Settings, LogOut, MapPin, Phone, Mail, ChevronRight, Edit2 } from 'lucide-react'

export default function AccountPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [isRegister, setIsRegister] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticated(true)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRegister ? 'Créer un compte' : 'Mon Compte'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isRegister ? 'Rejoignez R-Market Mali' : 'Connectez-vous à votre compte'}
            </p>
          </div>

          {isRegister ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
                <input type="text" required value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="Moussa Diallo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" required value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                <input type="tel" required value={registerForm.phone} onChange={e => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="+223 XX XX XX XX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                <input type="password" required value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all">
                Créer mon compte
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" required value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                <input type="password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all">
                Se connecter
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-green-600 text-sm font-medium hover:text-green-700"
            >
              {isRegister ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
            </button>
          </div>

          <Link to="/" className="block text-center text-gray-400 text-sm mt-4 hover:text-gray-600">
            ← Retour au site
          </Link>
        </div>
      </div>
    )
  }

  const orders = [
    { id: 'CMD-001', date: '02/04/2026', total: 65000, status: 'Livré', items: 2 },
    { id: 'CMD-002', date: '28/03/2026', total: 35000, status: 'En cours', items: 1 },
    { id: 'CMD-003', date: '15/03/2026', total: 125000, status: 'Livré', items: 3 },
  ]

  const tabs = [
    { id: 'orders', label: 'Mes commandes', icon: ShoppingCart },
    { id: 'wishlist', label: 'Mes favoris', icon: Heart },
    { id: 'addresses', label: 'Mes adresses', icon: MapPin },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Moussa Diallo</h1>
              <p className="text-green-100 text-sm">moussa@email.com • +223 70 12 34 56</p>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="ml-auto flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-6 shadow-sm overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Mes commandes</h2>
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span className="text-sm text-gray-500 ml-3">{order.date}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Livré' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{order.items} article{order.items > 1 ? 's' : ''}</span>
                  <span className="font-bold text-gray-900">{order.total.toLocaleString()} FCFA</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun favori</h3>
            <p className="text-gray-500 text-sm mb-4">Ajoutez des produits à vos favoris</p>
            <Link to="/shop" className="text-green-600 font-medium text-sm hover:text-green-700">
              Découvrir nos produits →
            </Link>
          </div>
        )}

        {/* Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Mes adresses</h2>
              <button className="flex items-center gap-1.5 text-green-600 text-sm font-medium hover:text-green-700">
                <Edit2 className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-green-500">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Moussa Diallo</p>
                  <p className="text-sm text-gray-500 mt-1">Quartier du Fleuve, Rue 305</p>
                  <p className="text-sm text-gray-500">Bamako, Mali</p>
                  <p className="text-sm text-gray-500 mt-1">+223 70 12 34 56</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium">Principale</span>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
            {[
              { label: 'Modifier mon profil', icon: User },
              { label: 'Changer le mot de passe', icon: Settings },
              { label: 'Notifications', icon: Mail },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
