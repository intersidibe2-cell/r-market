import { useState } from 'react'
import { MapPin, Calendar, Camera, Package, Clock, Navigation, Phone, Check, AlertCircle, ChevronRight, Users } from 'lucide-react'
import { suppliers, supplierCategories, cities } from '../../data/suppliers'

interface PhotoTask {
  id: number
  productName: string
  supplierId: number
  supplierName: string
  location: string
  city: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'planned' | 'done'
  plannedDate?: string
  category: string
  estimatedTime: number // minutes
}

const photoTasks: PhotoTask[] = [
  { id: 1, productName: 'Robe bazin riche brodée', supplierId: 1, supplierName: 'Marché Médina', location: 'Marché Médina, Allée 5', city: 'Bamako', priority: 'high', status: 'todo', category: 'Mode', estimatedTime: 15 },
  { id: 2, productName: 'Tissu Bogolan', supplierId: 1, supplierName: 'Marché Médina', location: 'Marché Médina, Allée 5', city: 'Bamako', priority: 'medium', status: 'todo', category: 'Mode', estimatedTime: 10 },
  { id: 3, productName: 'Masque Dogon sculpté', supplierId: 3, supplierName: 'Artisan Bandiagara', location: 'Bandiagara, Zone artisanale', city: 'Bandiagara', priority: 'high', status: 'planned', plannedDate: '15/04/2026', category: 'Souvenirs', estimatedTime: 20 },
  { id: 4, productName: 'Tambour Tam-tam', supplierId: 3, supplierName: 'Artisan Bandiagara', location: 'Bandiagara, Zone artisanale', city: 'Bandiagara', priority: 'medium', status: 'planned', plannedDate: '15/04/2026', category: 'Souvenirs', estimatedTime: 15 },
  { id: 5, productName: 'Pack biscuits importés', supplierId: 4, supplierName: 'Fournisseur Alimentation', location: 'Zone industrielle, Entrepôt 7', city: 'Bamako', priority: 'low', status: 'todo', category: 'Alimentation', estimatedTime: 10 },
  { id: 6, productName: 'Collier perles Bambara', supplierId: 5, supplierName: 'Marché de Ségou', location: 'Marché central, Secteur B', city: 'Ségou', priority: 'high', status: 'todo', category: 'Mode', estimatedTime: 15 },
  { id: 7, productName: 'Statuette bronze', supplierId: 3, supplierName: 'Artisan Bandiagara', location: 'Bandiagara, Zone artisanale', city: 'Bandiagara', priority: 'medium', status: 'todo', category: 'Souvenirs', estimatedTime: 20 },
  { id: 8, productName: 'Boubou homme brodé', supplierId: 1, supplierName: 'Marché Médina', location: 'Marché Médina, Allée 5', city: 'Bamako', priority: 'high', status: 'todo', category: 'Mode', estimatedTime: 15 },
]

export default function PhotoPlanning() {
  const [tasks, setTasks] = useState<PhotoTask[]>(photoTasks)
  const [view, setView] = useState<'planning' | 'map' | 'list'>('planning')
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredTasks = tasks.filter(t => {
    const matchesCity = cityFilter === 'all' || t.city === cityFilter
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesCity && matchesStatus
  })

  // Group tasks by supplier/location
  const tasksBySupplier = filteredTasks.reduce((acc, task) => {
    const key = task.supplierId
    if (!acc[key]) {
      acc[key] = {
        supplier: suppliers.find(s => s.id === task.supplierId)!,
        tasks: []
      }
    }
    acc[key].tasks.push(task)
    return acc
  }, {} as Record<number, { supplier: typeof suppliers[0], tasks: PhotoTask[] }>)

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    planned: tasks.filter(t => t.status === 'planned').length,
    done: tasks.filter(t => t.status === 'done').length,
    totalTime: tasks.filter(t => t.status !== 'done').reduce((sum, t) => sum + t.estimatedTime, 0),
    locations: new Set(tasks.filter(t => t.status !== 'done').map(t => t.supplierId)).size,
  }

  const markAsPlanned = (taskId: number, date: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'planned', plannedDate: date } : t))
  }

  const markAsDone = (taskId: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'done' } : t))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Planning Photos
          </h1>
          <p className="text-gray-500 text-sm">Organisez vos sorties photos chez les fournisseurs</p>
        </div>
        <div className="flex gap-2">
          {['planning', 'map', 'list'].map(v => (
            <button
              key={v}
              onClick={() => setView(v as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === v
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {v === 'planning' ? '📅 Planning' : v === 'map' ? '📍 Carte' : '📋 Liste'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">À photographier</p>
          <p className="text-2xl font-bold text-red-600">{stats.todo}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Planifiées</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.planned}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Faites</p>
          <p className="text-2xl font-bold text-green-600">{stats.done}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Temps estimé</p>
          <p className="text-2xl font-bold text-blue-600">{Math.floor(stats.totalTime / 60)}h{stats.totalTime % 60}m</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Lieux à visiter</p>
          <p className="text-2xl font-bold text-purple-600">{stats.locations}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl"
        >
          <option value="all">Toutes les villes</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl"
        >
          <option value="all">Tous les statuts</option>
          <option value="todo">À photographier</option>
          <option value="planned">Planifiées</option>
          <option value="done">Faites</option>
        </select>
      </div>

      {/* Planning View - Grouped by Supplier */}
      {view === 'planning' && (
        <div className="space-y-6">
          {Object.values(tasksBySupplier).map(({ supplier, tasks: supplierTasks }) => (
            <div key={supplier.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Supplier Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6" />
                    <div>
                      <h3 className="font-bold">{supplier.name}</h3>
                      <p className="text-sm text-green-100">{supplier.location}, {supplier.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{supplierTasks.length} produits</p>
                    <p className="text-sm text-green-100">{supplierTasks.reduce((s, t) => s + t.estimatedTime, 0)} min</p>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-4 space-y-3">
                {supplierTasks.map(task => (
                  <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                    task.status === 'done' ? 'bg-green-50 border-green-200' :
                    task.status === 'planned' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{task.productName}</p>
                        <p className="text-sm text-gray-500">{task.category} • {task.estimatedTime} min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status === 'todo' && (
                        <button
                          onClick={() => markAsPlanned(task.id, new Date().toLocaleDateString())}
                          className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200"
                        >
                          Planifier
                        </button>
                      )}
                      {task.status === 'planned' && (
                        <button
                          onClick={() => markAsDone(task.id)}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {task.status === 'done' && (
                        <span className="text-green-600 font-medium text-sm">✓ Fait</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Supplier Info */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {supplier.phone}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {supplier.contact}</span>
                </div>
                {supplier.notes && (
                  <p className="text-sm text-blue-600 mt-2 bg-blue-50 p-2 rounded-lg">💡 {supplier.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Fournisseur</th>
                <th className="px-6 py-4">Lieu</th>
                <th className="px-6 py-4">Priorité</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{task.productName}</p>
                    <p className="text-sm text-gray-500">{task.category}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{task.supplierName}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{task.city}</p>
                    <p className="text-xs text-gray-500">{task.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      task.status === 'done' ? 'bg-green-100 text-green-700' :
                      task.status === 'planned' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {task.status === 'done' ? 'Fait' : task.status === 'planned' ? 'Planifié' : 'À faire'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.status === 'todo' && (
                      <button onClick={() => markAsPlanned(task.id, new Date().toLocaleDateString())}
                        className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-200">
                        Planifier
                      </button>
                    )}
                    {task.status === 'planned' && (
                      <button onClick={() => markAsDone(task.id)}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200">
                        Terminé
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Map View (Simplified) */}
      {view === 'map' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg mb-4">📍 Carte des fournisseurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.filter(s => s.productsNeedingPhotos > 0).map(supplier => (
              <div key={supplier.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{supplier.name}</h4>
                      <p className="text-sm text-gray-500">{supplier.city}</p>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {supplier.productsNeedingPhotos} photos
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{supplier.location}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{supplier.category}</span>
                  <a href={`tel:${supplier.phone}`} className="text-green-600 font-medium">
                    {supplier.phone}
                  </a>
                </div>
                {supplier.notes && (
                  <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">💡 {supplier.notes}</p>
                )}
                <button className="w-full mt-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Ouvrir dans Maps
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
