import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Package, Eye, X, Save, QrCode, Printer, Camera, MapPin, Phone } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'
import { getSupplierWhatsapp, saveSupplierWhatsapp, formatPhoneForDisplay } from '../../utils/supplierWhatsapp'

interface RussianProduct {
  id: number
  name: string
  nameRu: string
  price: number
  originalPrice: number
  image: string
  category: string
  description: string
  descriptionRu: string
  rating: number
  reviews: number
  stock: number
  sold: number
  sku: string
  photos: string[]
  qrCode?: string
}

const initialProducts: RussianProduct[] = [
  { id: 1, name: 'Vodka Stolichnaya', nameRu: 'Водка Столичная', price: 15000, originalPrice: 18000, image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=500&h=500&fit=crop', category: 'alcohol', description: 'Vodka russe premium 0.5L', descriptionRu: 'Русская водка премиум 0.5л', rating: 4.8, reviews: 156, stock: 50, sold: 234, sku: 'RUS-ALC-001', photos: ['https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=500&h=500&fit=crop'], qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/RUS-ALC-001' },
  { id: 2, name: 'Chocolat Alyonka', nameRu: 'Шоколад Алёнка', price: 5000, originalPrice: 6500, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=500&fit=crop', category: 'food', description: 'Chocolat au lait russe 90g', descriptionRu: 'Русский молочный шоколад 90г', rating: 4.6, reviews: 89, stock: 100, sold: 456, sku: 'RUS-FOO-002', photos: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=500&fit=crop'], qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/RUS-FOO-002' },
  { id: 3, name: 'Matryoshka 5 figures', nameRu: 'Матрёшка 5 фигур', price: 12000, originalPrice: 15000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', category: 'souvenirs', description: 'Poupée russe traditionnelle', descriptionRu: 'Традиционная русская кукла', rating: 4.9, reviews: 234, stock: 30, sold: 189, sku: 'RUS-SOU-003', photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'], qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/RUS-SOU-003' },
  { id: 4, name: 'Red Caviar', nameRu: 'Икра красная', price: 35000, originalPrice: 42000, image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=500&h=500&fit=crop', category: 'food', description: 'Caviar rouge 120g', descriptionRu: 'Красная икра 120г', rating: 4.7, reviews: 67, stock: 20, sold: 78, sku: 'RUS-FOO-004', photos: ['https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=500&h=500&fit=crop'], qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/RUS-FOO-004' },
  { id: 5, name: 'Russian Tea Set', nameRu: 'Чайный набор', price: 25000, originalPrice: 30000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop', category: 'souvenirs', description: 'Set de thé traditionnel', descriptionRu: 'Традиционный чайный набор', rating: 4.5, reviews: 45, stock: 15, sold: 56, sku: 'RUS-SOU-005', photos: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop'], qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/RUS-SOU-005' },
  { id: 6, name: 'Samovar Electric', nameRu: 'Самовар электрический', price: 85000, originalPrice: 95000, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop', category: 'souvenirs', description: 'Samovar électrique moderne', descriptionRu: 'Современный электрический самовар', rating: 4.8, reviews: 23, stock: 8, sold: 34, sku: 'RUS-SOU-006', photos: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop'], qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/RUS-SOU-006' },
]

const categories = [
  { id: 'all', name: 'Tous', emoji: '📦' },
  { id: 'souvenirs', name: 'Сувениры', emoji: '🎁' },
  { id: 'alcohol', name: 'Алкоголь', emoji: '🍷' },
  { id: 'food', name: 'Еда & Специи', emoji: '🍫' },
]

export default function RussianProducts() {
  const [products, setProducts] = useState<RussianProduct[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<RussianProduct | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '', nameRu: '', price: '', originalPrice: '', stock: '', image: '', description: '', descriptionRu: '', category: 'souvenirs', photos: [] as string[]
  })

  // Supplier WhatsApp state (for Russian products, we use a generic supplier ID)
  const [supplierWhatsapp, setSupplierWhatsapp] = useState('')
  const RUSSIAN_SUPPLIER_ID = 'russian' // Generic ID for Russian products supplier

  // Load WhatsApp on mount
  useEffect(() => {
    const whatsapp = getSupplierWhatsapp(RUSSIAN_SUPPLIER_ID)
    setSupplierWhatsapp(whatsapp)
  }, [])

  // Handle WhatsApp change
  const handleWhatsappChange = (value: string) => {
    setSupplierWhatsapp(value)
    saveSupplierWhatsapp(RUSSIAN_SUPPLIER_ID, value)
  }

  // Generate SKU for Russian products
  const generateSKU = (categoryId: string) => {
    const categoryCode = categoryId.substring(0, 3).toUpperCase()
    const productCode = String(products.length + 1).padStart(3, '0')
    return `RUS-${categoryCode}-${productCode}`
  }

  // Generate QR Code URL
  const generateQRCode = (sku: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/${sku}`
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.nameRu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const addProduct = () => {
    if (!newProduct.name || !newProduct.nameRu || !newProduct.price) return
    
    const sku = generateSKU(newProduct.category)
    
    const product: RussianProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: newProduct.name,
      nameRu: newProduct.nameRu,
      price: parseFloat(newProduct.price),
      originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price) * 1.2,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: newProduct.category,
      description: newProduct.description,
      descriptionRu: newProduct.descriptionRu,
      rating: 4.5,
      reviews: 0,
      stock: parseInt(newProduct.stock) || 100,
      sold: 0,
      sku,
      photos: newProduct.photos.length > 0 ? newProduct.photos : [newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'],
      qrCode: generateQRCode(sku)
    }
    
    setProducts([...products, product])
    setNewProduct({ name: '', nameRu: '', price: '', originalPrice: '', stock: '', image: '', description: '', descriptionRu: '', category: 'souvenirs', photos: [] })
    setShowAddModal(false)
  }

  const deleteProduct = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  // Print QR Code
  const printQRCode = (product: RussianProduct) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${product.name}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr-container { border: 2px solid #000; padding: 20px; display: inline-block; }
              .product-name { font-size: 14px; font-weight: bold; margin: 10px 0; }
              .product-name-ru { font-size: 12px; color: #666; margin-bottom: 5px; }
              .sku { font-size: 12px; color: #666; }
              .price { font-size: 16px; color: #2563eb; font-weight: bold; margin: 10px 0; }
              img { width: 150px; height: 150px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${product.qrCode}" alt="QR Code" />
              <div class="product-name">${product.name}</div>
              <div class="product-name-ru">${product.nameRu}</div>
              <div class="sku">${product.sku}</div>
              <div class="price">${product.price.toLocaleString()} FCFA</div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const stats = {
    total: products.length,
    totalStock: products.reduce((s, p) => s + p.stock, 0),
    totalSold: products.reduce((s, p) => s + p.sold, 0),
    lowStock: products.filter(p => p.stock < 20).length,
    withQR: products.filter(p => p.qrCode).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🇷🇺</span>
            Produits Boutique Russe
          </h1>
          <p className="text-gray-500 text-sm mt-1">Produits Mali • {products.length} produits</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-red-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Produits</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">En stock</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Vendus</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalSold}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Stock faible</p>
          <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Avec QR</p>
          <p className="text-2xl font-bold text-purple-600">{stats.withQR}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, nom russe ou SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                categoryFilter === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-2 left-2 flex gap-1">
                {product.photos.length > 1 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Camera className="w-3 h-3" /> {product.photos.length}
                  </span>
                )}
              </div>
              <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold">
                {categories.find(c => c.id === product.category)?.emoji} {categories.find(c => c.id === product.category)?.name}
              </span>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-8">
                <button
                  onClick={() => printQRCode(product)}
                  className="p-1.5 bg-white/90 text-purple-600 rounded-full hover:bg-purple-50"
                  title="Imprimer QR"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-1.5 bg-white/90 text-red-600 rounded-full hover:bg-red-50"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{product.nameRu}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{product.sku}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="font-bold text-green-600">{product.price.toLocaleString()} F</p>
                  <p className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()} F</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Stock: {product.stock}</p>
                  <p className="text-xs text-gray-500">Vendus: {product.sold}</p>
                </div>
              </div>
              
              {product.qrCode && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <QrCode className="w-3 h-3" /> QR généré
                  </span>
                  <button
                    onClick={() => printQRCode(product)}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Imprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Nouveau produit russe</h2>
                <p className="text-sm text-gray-500">SKU et QR code générés automatiquement</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom (FR) *</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Vodka Stolichnaya" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom (RU) *</label>
                  <input type="text" value={newProduct.nameRu} onChange={e => setNewProduct({...newProduct, nameRu: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Водка Столичная" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (CFA) *</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="15000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (FR)</label>
                <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none" placeholder="Description en français..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (RU)</label>
                <textarea value={newProduct.descriptionRu} onChange={e => setNewProduct({...newProduct, descriptionRu: e.target.value})} rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none" placeholder="Описание на русском..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-4 h-4 inline mr-1" />
                  Photo du produit (max 5)
                </label>
                <ImageUpload
                  onUpload={(url) => {
                    if (newProduct.photos.length < 5) {
                      setNewProduct({...newProduct, photos: [...newProduct.photos, url], image: url})
                    }
                  }}
                  currentImage={newProduct.image}
                  type="both"
                  maxSizeMB={10}
                />
                
                {/* Photo thumbnails */}
                {newProduct.photos.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {newProduct.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-blue-500" />
                        <button
                          onClick={() => {
                            const newPhotos = newProduct.photos.filter((_, i) => i !== index)
                            setNewProduct({...newProduct, photos: newPhotos, image: newPhotos[0] || ''})
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">Ou collez une URL :</p>
                <input type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-2" placeholder="https://..." />
              </div>

              {/* Supplier WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  WhatsApp du fournisseur
                  {supplierWhatsapp && (
                    <span className="ml-2 text-xs text-green-600 font-normal">
                      (Enregistré: {formatPhoneForDisplay(supplierWhatsapp)})
                    </span>
                  )}
                </label>
                <input
                  type="tel"
                  value={supplierWhatsapp}
                  onChange={e => handleWhatsappChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="+223 XX XX XX XXX"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pour contacter le fournisseur lors des commandes russes
                </p>
              </div>
              
              {/* Auto-generated info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Généré automatiquement :</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" /> SKU: RUS-XXX-XXX
                  </span>
                  <span className="flex items-center gap-1">
                    <QrCode className="w-4 h-4" /> QR Code
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={addProduct} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-red-700">
                Ajouter 🇷🇺
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
