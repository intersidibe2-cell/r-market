import { useState, useEffect, useRef } from 'react'
import { Package, Search, Plus, Edit, Trash2, X, QrCode, Printer, Camera, MapPin, Phone, Upload, Loader2, Check, Eye, Image } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { generateSKU, generateQRCodeUrl } from '../../lib/products'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  image?: string
  photos?: string[]
  category: string
  description?: string
  badge?: string
  rating: number
  reviews: number
  stock: number
  sold: number
  is_adult?: boolean
  is_active?: boolean
  supplier_id?: string
  sku?: string
  qr_code?: string
  created_at?: string
}

interface Supplier {
  id: string
  name: string
  phone: string
  whatsapp?: string
  city?: string
  category?: string
}

const categories = [
  { id: 'all', name: 'Tous', emoji: '' },
  { id: 'mode', name: 'Mode & Vetements', emoji: '' },
  { id: 'electronique', name: 'Electronique', emoji: '' },
  { id: 'sante', name: 'Sante & Beaute', emoji: '' },
  { id: 'maison', name: 'Maison & Decoration', emoji: '' },
  { id: 'alimentation', name: 'Alimentation', emoji: '' },
  { id: 'adulte', name: 'Articles adultes', emoji: '' },
]

export default function ProductsMali() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '', price: '', original_price: '', stock: '', description: '',
    category: 'mode', supplier_id: '', badge: '', is_adult: false, photos: [] as string[]
  })

  useEffect(() => {
    loadProducts()
    loadSuppliers()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('produits')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const loadSuppliers = async () => {
    const { data } = await supabase.from('fournisseurs').select('*').order('name')
    if (data) setSuppliers(data)
  }

  // Upload photo vers Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || form.photos.length >= 5) return

    setUploading(true)
    const newPhotos = [...form.photos]

    for (let i = 0; i < files.length && newPhotos.length < 5; i++) {
      const file = files[i]
      if (file.size > 10 * 1024 * 1024) continue // Max 10MB

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error } = await supabase.storage
        .from('product-photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (!error) {
        const { data: urlData } = supabase.storage.from('product-photos').getPublicUrl(filePath)
        newPhotos.push(urlData.publicUrl)
      }
    }

    setForm({ ...form, photos: newPhotos })
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Supprimer une photo
  const removePhoto = (index: number) => {
    const newPhotos = form.photos.filter((_, i) => i !== index)
    setForm({ ...form, photos: newPhotos })
  }

  // Ouvrir modal ajout
  const openAddModal = () => {
    setEditing(null)
    setForm({
      name: '', price: '', original_price: '', stock: '', description: '',
      category: 'mode', supplier_id: '', badge: '', is_adult: false, photos: []
    })
    setShowModal(true)
  }

  // Ouvrir modal edition
  const openEditModal = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      price: String(product.price),
      original_price: String(product.original_price || ''),
      stock: String(product.stock),
      description: product.description || '',
      category: product.category || 'mode',
      supplier_id: product.supplier_id || '',
      badge: product.badge || '',
      is_adult: product.is_adult || false,
      photos: product.photos || (product.image ? [product.image] : [])
    })
    setShowModal(true)
  }

  // Sauvegarder produit (ajout ou edition)
  const handleSave = async () => {
    if (!form.name || !form.price) return
    setSaving(true)

    const productCount = products.length
    const sku = editing?.sku || generateSKU(form.category, productCount + 1)
    const qr_code = generateQRCodeUrl(sku)

    const productData = {
      name: form.name,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      stock: parseInt(form.stock) || 0,
      description: form.description || null,
      category: form.category,
      supplier_id: form.supplier_id || null,
      badge: form.badge || null,
      is_adult: form.is_adult,
      is_active: true,
      image: form.photos[0] || null,
      photos: form.photos,
      sku,
      qr_code,
      updated_at: new Date().toISOString()
    }

    if (editing) {
      await supabase.from('produits').update(productData).eq('id', editing.id)
    } else {
      await supabase.from('produits').insert(productData)
    }

    await loadProducts()
    setShowModal(false)
    setSaving(false)
  }

  // Supprimer produit
  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('produits').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  // Imprimer QR Code
  const printQRCode = (product: Product) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html><head><title>QR - ${product.name}</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 20px; }
        .qr { border: 2px solid #000; padding: 15px; display: inline-block; }
        .name { font-size: 14px; font-weight: bold; margin: 8px 0; }
        .sku { font-size: 11px; color: #666; }
        .price { font-size: 14px; color: #16a34a; font-weight: bold; margin: 8px 0; }
        img { width: 150px; height: 150px; }
      </style></head>
      <body><div class="qr">
        <img src="${product.qr_code || generateQRCodeUrl(product.sku || 'RM-0000')}" />
        <div class="name">${product.name}</div>
        <div class="sku">${product.sku || ''}</div>
        <div class="price">${product.price?.toLocaleString()} FCFA</div>
      </div></body></html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // Filtrer
  const filtered = products
    .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
    .filter(p => {
      if (!search) return true
      const s = search.toLowerCase()
      return p.name.toLowerCase().includes(s) || (p.sku || '').toLowerCase().includes(s)
    })

  // Stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.is_active !== false).length,
    withPhotos: products.filter(p => (p.photos?.length || 0) > 0 || p.image).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    withSupplier: products.filter(p => p.supplier_id).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            Produits Mali
          </h1>
          <p className="text-gray-500 text-sm">{products.length} produits dans le catalogue</p>
        </div>
        <button onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" /> Nouveau produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Avec photos</p>
          <p className="text-2xl font-bold text-blue-600">{stats.withPhotos}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Stock faible</p>
          <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Rupture</p>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Avec fournisseur</p>
          <p className="text-2xl font-bold text-purple-600">{stats.withSupplier}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Rechercher par nom ou SKU..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500">
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Grille produits */}
      {loading ? (
        <div className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun produit trouve</p>
          <button onClick={openAddModal} className="mt-3 text-green-600 font-medium">
            Ajouter un produit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => {
            const supplier = suppliers.find(s => s.id === product.supplier_id)
            const photoCount = product.photos?.length || (product.image ? 1 : 0)
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                <div className="relative">
                  {product.image || (product.photos && product.photos[0]) ? (
                    <img src={product.image || product.photos![0]} alt={product.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {photoCount > 1 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Camera className="w-3 h-3" /> {photoCount}
                      </span>
                    )}
                    {product.badge && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{product.badge}</span>
                    )}
                  </div>
                  
                  {/* Actions hover */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(product)} className="p-1.5 bg-white/90 text-blue-600 rounded-full hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => printQRCode(product)} className="p-1.5 bg-white/90 text-purple-600 rounded-full hover:bg-purple-50">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-white/90 text-red-600 rounded-full hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 truncate flex-1">{product.name}</h4>
                    {product.sku && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{product.sku}</span>}
                  </div>
                  
                  {supplier && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {supplier.name}{supplier.city ? `, ${supplier.city}` : ''}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-green-600">{product.price?.toLocaleString()} F</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-gray-400 line-through">{product.original_price.toLocaleString()} F</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      Stock: {product.stock}
                    </span>
                    <span className="text-gray-500">{product.sold || 0} vendus</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <QrCode className="w-3 h-3" /> {product.qr_code ? 'QR genere' : 'Pas de QR'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.is_active !== false ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Ajout/Edition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h3>
                <p className="text-sm text-gray-500">SKU et QR code generes automatiquement</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                  placeholder="Ex: Robe bazin riche brodee" />
              </div>

              {/* Fournisseur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" /> Fournisseur
                </label>
                <select value={form.supplier_id} onChange={e => setForm({...form, supplier_id: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500">
                  <option value="">Selectionner un fournisseur</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}{s.city ? ` - ${s.city}` : ''}{s.category ? ` (${s.category})` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Prix et Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ancien prix</label>
                  <input type="number" value={form.original_price} onChange={e => setForm({...form, original_price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="0" />
                </div>
              </div>

              {/* Categorie + Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500">
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge (optionnel)</label>
                  <input type="text" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    placeholder="Ex: Nouveau, Promo, Best-seller" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none"
                  placeholder="Description detaillee du produit..." />
              </div>

              {/* Article adulte */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_adult} onChange={e => setForm({...form, is_adult: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="text-sm text-gray-700">Article adulte (18+)</span>
              </label>

              {/* Upload Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-4 h-4 inline mr-1" />
                  Photos du produit (max 5)
                </label>
                
                {/* Zone d'upload */}
                <div
                  onClick={() => form.photos.length < 5 && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    form.photos.length >= 5 ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                  
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                      <p className="text-sm text-gray-600">Upload en cours...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">
                        {form.photos.length >= 5 ? 'Maximum 5 photos atteint' : 'Cliquez pour ajouter des photos'}
                      </p>
                      <p className="text-xs text-gray-500">{form.photos.length}/5 photos | JPG, PNG, WebP | Max 10MB</p>
                    </div>
                  )}
                </div>
                
                {/* Miniatures photos */}
                {form.photos.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {form.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={photo} alt={`Photo ${index + 1}`} className={`w-20 h-20 object-cover rounded-lg ${index === 0 ? 'border-2 border-green-500' : 'border border-gray-200'}`} />
                        {index === 0 && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            Principale
                          </span>
                        )}
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info auto-generee */}
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm font-medium text-green-700 mb-2">Genere automatiquement :</p>
                <div className="flex items-center gap-4 text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" /> SKU: {editing?.sku || 'RM-XXX-XXXX'}
                  </span>
                  <span className="flex items-center gap-1">
                    <QrCode className="w-4 h-4" /> QR Code auto
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50 rounded-b-3xl">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-100">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.price}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50">
                {saving ? 'Sauvegarde...' : editing ? 'Modifier' : 'Ajouter le produit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
