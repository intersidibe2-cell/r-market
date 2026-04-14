import { useState, useEffect } from 'react'
import { Package, Search, Plus, Edit, Trash2, X, QrCode, Printer, Camera, MapPin, Calendar, Phone } from 'lucide-react'
import { products, categories } from '../../data/products'
import { suppliers } from '../../data/suppliers'
import ImageUpload from '../../components/ImageUpload'
import { getSupplierWhatsapp, saveSupplierWhatsapp, formatPhoneForDisplay } from '../../utils/supplierWhatsapp'

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  stock: number
  sold: number
  sku: string
  supplierId?: number
  photos: string[]
  qrCode?: string
}

export default function ProductsMali() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  const [productList, setProductList] = useState<Product[]>(
    products.map(p => ({
      ...p,
      sku: `MAL-${String(p.id).padStart(4, '0')}`,
      photos: [p.image],
      qrCode: `https://r-market.shop/product/${p.id}`
    }))
  )

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    description: '',
    category: 'mode',
    supplierId: '',
    photos: [] as string[]
  })

  // Supplier WhatsApp state
  const [supplierWhatsapp, setSupplierWhatsapp] = useState('')

  // Load WhatsApp when supplier changes
  useEffect(() => {
    if (newProduct.supplierId) {
      const whatsapp = getSupplierWhatsapp(newProduct.supplierId)
      setSupplierWhatsapp(whatsapp)
    } else {
      setSupplierWhatsapp('')
    }
  }, [newProduct.supplierId])

  // Handle WhatsApp change
  const handleWhatsappChange = (value: string) => {
    setSupplierWhatsapp(value)
    if (newProduct.supplierId) {
      saveSupplierWhatsapp(newProduct.supplierId, value)
    }
  }

  // Generate SKU
  const generateSKU = (categoryId: string, supplierId: number) => {
    const categoryCode = categoryId.substring(0, 3).toUpperCase()
    const supplierCode = String(supplierId).padStart(2, '0')
    const productCode = String(productList.length + 1).padStart(4, '0')
    return `MAL-${categoryCode}-${supplierCode}-${productCode}`
  }

  // Generate QR Code URL
  const generateQRCode = (sku: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/${sku}`
  }

  // Filter products
  const filteredProducts = productList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Stats
  const stats = {
    total: productList.length,
    inStock: productList.filter(p => p.stock > 0).length,
    lowStock: productList.filter(p => p.stock > 0 && p.stock < 20).length,
    outOfStock: productList.filter(p => p.stock === 0).length,
    withPhotos: productList.filter(p => p.photos.length > 0).length,
    withQR: productList.filter(p => p.qrCode).length,
  }

  // Add product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    
    const supplierId = parseInt(newProduct.supplierId) || 1
    const sku = generateSKU(newProduct.category, supplierId)
    
    const product: Product = {
      id: Math.max(...productList.map(p => p.id), 0) + 1,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price) * 1.3,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: newProduct.category,
      description: newProduct.description,
      rating: 4.5,
      reviews: 0,
      stock: parseInt(newProduct.stock) || 100,
      sold: 0,
      sku,
      supplierId,
      photos: newProduct.photos.length > 0 ? newProduct.photos : [newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'],
      qrCode: generateQRCode(sku)
    }
    
    setProductList([...productList, product])
    setNewProduct({
      name: '', price: '', originalPrice: '', stock: '', image: '', 
      description: '', category: 'mode', supplierId: '', photos: []
    })
    setShowAddModal(false)
  }

  // Delete product
  const handleDeleteProduct = (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      setProductList(productList.filter(p => p.id !== id))
    }
  }

  // Print QR Code
  const printQRCode = (product: Product) => {
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
              .sku { font-size: 12px; color: #666; }
              .price { font-size: 16px; color: #16a34a; font-weight: bold; margin: 10px 0; }
              img { width: 150px; height: 150px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${product.qrCode}" alt="QR Code" />
              <div class="product-name">${product.name}</div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Produits Mali
          </h1>
          <p className="text-gray-500 text-sm">{productList.length} produits dans le catalogue</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">En stock</p>
          <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
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
          <p className="text-sm text-gray-500">Avec photos</p>
          <p className="text-2xl font-bold text-blue-600">{stats.withPhotos}</p>
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
            placeholder="Rechercher par nom ou SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
        >
          <option value="all">Toutes catégories</option>
          {categories.filter(c => c.id !== 'all').map(c => (
            <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(product => {
          const supplier = suppliers.find(s => s.id === product.supplierId)
          return (
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
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => printQRCode(product)}
                    className="p-1.5 bg-white/90 text-purple-600 rounded-full hover:bg-purple-50"
                    title="Imprimer QR"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1.5 bg-white/90 text-red-600 rounded-full hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-900 truncate flex-1">{product.name}</h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{product.sku}</span>
                </div>
                
                {supplier && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {supplier.name}, {supplier.city}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-green-600">{product.price.toLocaleString()} F</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()} F</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className={`font-medium ${product.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                    Stock: {product.stock}
                  </span>
                  <span className="text-gray-500">{product.sold} vendus</span>
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
          )
        })}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Ajouter un produit 🇲🇱</h3>
                <p className="text-sm text-gray-500">Le SKU et QR code seront générés automatiquement</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  placeholder="Ex: Robe bazin riche brodée"
                />
              </div>

              {/* Supplier Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Fournisseur
                </label>
                <select
                  value={newProduct.supplierId}
                  onChange={e => setNewProduct({...newProduct, supplierId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.city} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Supplier WhatsApp */}
              {newProduct.supplierId && (
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    placeholder="+223 XX XX XX XXX"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pour contacter le fournisseur lors des commandes
                  </p>
                </div>
              )}

              {/* Price and Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ancien prix</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                >
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none"
                  placeholder="Description détaillée du produit..."
                />
              </div>

              {/* Photo Upload */}
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
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-green-500" />
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
              </div>

              {/* Auto-generated info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Généré automatiquement :</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" /> SKU: MAL-XXX-XX-XXXX
                  </span>
                  <span className="flex items-center gap-1">
                    <QrCode className="w-4 h-4" /> QR Code
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50 rounded-b-3xl">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Ajouter le produit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
