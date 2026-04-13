import { useState } from 'react'
import { Users, UserPlus, Shield, Edit, Trash2, Search, Lock, Unlock, Eye, EyeOff, Check, X } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'blocked'
  lastLogin: string
  permissions: string[]
}

const initialUsers: User[] = [
  { id: 1, name: 'Admin Principal', email: 'admin@r-market.shop', role: 'admin', status: 'active', lastLogin: '14/04/2026 10:30', permissions: ['all'] },
  { id: 2, name: 'Moussa Dembélé', email: 'moussa@r-market.shop', role: 'manager', status: 'active', lastLogin: '14/04/2026 09:15', permissions: ['orders', 'products', 'inventory'] },
  { id: 3, name: 'Aminata Koné', email: 'aminata@r-market.shop', role: 'editor', status: 'active', lastLogin: '13/04/2026 16:45', permissions: ['products', 'categories'] },
  { id: 4, name: 'Ibrahim Touré', email: 'ibrahim@r-market.shop', role: 'viewer', status: 'inactive', lastLogin: '10/04/2026 11:20', permissions: ['reports'] },
  { id: 5, name: 'Admin Russe', email: 'russian@r-market.shop', role: 'manager', status: 'active', lastLogin: '14/04/2026 08:00', permissions: ['russian-shop', 'russian-orders'] },
]

const roles = [
  { id: 'admin', label: 'Administrateur', color: 'bg-red-100 text-red-700', description: 'Accès complet à toutes les fonctionnalités' },
  { id: 'manager', label: 'Gestionnaire', color: 'bg-blue-100 text-blue-700', description: 'Gestion des commandes, produits et inventaire' },
  { id: 'editor', label: 'Éditeur', color: 'bg-green-100 text-green-700', description: 'Modification des produits et catégories' },
  { id: 'viewer', label: 'Lecteur', color: 'bg-gray-100 text-gray-700', description: 'Consultation uniquement, pas de modification' },
]

const allPermissions = [
  { id: 'all', label: 'Tout', description: 'Accès total' },
  { id: 'orders', label: 'Commandes', description: 'Gérer les commandes' },
  { id: 'products', label: 'Produits', description: 'Gérer les produits' },
  { id: 'inventory', label: 'Inventaire', description: 'Gérer l\'inventaire' },
  { id: 'delivery', label: 'Livraisons', description: 'Gérer les livraisons' },
  { id: 'returns', label: 'Retours', description: 'Gérer les retours' },
  { id: 'reports', label: 'Rapports', description: 'Voir les rapports' },
  { id: 'finances', label: 'Finances', description: 'Gérer les finances' },
  { id: 'suppliers', label: 'Fournisseurs', description: 'Gérer les fournisseurs' },
  { id: 'customers', label: 'Clients', description: 'Gérer les clients' },
  { id: 'settings', label: 'Paramètres', description: 'Paramètres du site' },
  { id: 'russian-shop', label: 'Boutique Russe', description: 'Gérer la boutique russe' },
  { id: 'russian-orders', label: 'Commandes Russes', description: 'Gérer les commandes russes' },
]

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as User['role'],
    permissions: [] as string[]
  })

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addUser = () => {
    const user: User = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: '-',
      permissions: newUser.permissions
    }
    setUsers([...users, user])
    setNewUser({ name: '', email: '', password: '', role: 'viewer', permissions: [] })
    setShowAddModal(false)
  }

  const deleteUser = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
      }
      return u
    }))
  }

  const togglePermission = (permId: string) => {
    if (newUser.permissions.includes(permId)) {
      setNewUser({ ...newUser, permissions: newUser.permissions.filter(p => p !== permId) })
    } else {
      setNewUser({ ...newUser, permissions: [...newUser.permissions, permId] })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des comptes et accès</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} utilisateurs enregistrés</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Inactifs</p>
          <p className="text-2xl font-bold text-gray-400">{users.filter(u => u.status !== 'active').length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Dernière connexion</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${roles.find(r => r.id === user.role)?.color}`}>
                      {roles.find(r => r.id === user.role)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-sm ${user.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg ${user.status === 'active' ? 'text-gray-400 hover:bg-gray-100' : 'text-green-600 hover:bg-green-50'}`}
                        title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                      >
                        {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => { setSelectedUser(user); setShowEditModal(true) }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles Legend */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Rôles et permissions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map(role => (
            <div key={role.id} className="p-4 bg-gray-50 rounded-xl">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${role.color}`}>
                {role.label}
              </span>
              <p className="text-sm text-gray-600 mt-2">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Nouvel utilisateur</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  placeholder="jean@r-market.shop"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {allPermissions.map(perm => (
                    <label key={perm.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="rounded text-green-600"
                      />
                      <span className="text-sm">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={addUser} className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700">
                Créer l'utilisateur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
