import { useState, useRef } from 'react'
import { QrCode, Printer, Download, Search, Package, Check } from 'lucide-react'

interface ProductQR {
  id: number
  name: string
  price: number
  category: string
  sku: string
}

const products: ProductQR[] = [
  { id: 1, name: 'Robe bazin riche brodée', price: 25000, category: 'Mode', sku: 'RMA-001' },
  { id: 2, name: 'Collier perles Bambara', price: 15000, category: 'Mode', sku: 'RMA-002' },
  { id: 3, name: 'Masque Dogon sculpté', price: 25000, category: 'Souvenirs', sku: 'RMA-003' },
  { id: 4, name: 'Tissu Bogolan', price: 12000, category: 'Mode', sku: 'RMA-004' },
  { id: 5, name: 'Statuette bronze', price: 45000, category: 'Souvenirs', sku: 'RMA-005' },
  { id: 6, name: 'Boubou homme brodé', price: 35000, category: 'Mode', sku: 'RMA-006' },
  { id: 7, name: 'Chapeau traditionnel', price: 8000, category: 'Mode', sku: 'RMA-007' },
  { id: 8, name: 'Tambour Tam-tam', price: 28000, category: 'Souvenirs', sku: 'RMA-008' },
  { id: 9, name: 'Vin rouge sec', price: 12000, category: 'Alcool', sku: 'RMA-009' },
  { id: 10, name: 'Vodka Absolut', price: 18000, category: 'Alcool', sku: 'RMA-010' },
]

export default function QRCodeGenerator() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [printSize, setPrintSize] = useState<'small' | 'medium' | 'large'>('medium')
  const printRef = useRef<HTMLDivElement>(null)

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(i => i !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const selectAll = () => {
    setSelectedProducts(filteredProducts.map(p => p.id))
  }

  const deselectAll = () => {
    setSelectedProducts([])
  }

  const handlePrint = () => {
    window.print()
  }

  const getQRUrl = (sku: string) => {
    const data = JSON.stringify({ sku, url: `https://r-market.shop/product/${sku}` })
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}&bgcolor=ffffff&color=1a1a2e&margin=2`
  }

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            Générateur de QR Codes
          </h1>
          <p className="text-gray-500 text-sm">Générez et imprimez des QR codes pour vos produits</p>
        </div>
        <div className="flex gap-3">
          <select
            value={printSize}
            onChange={e => setPrintSize(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-xl"
          >
            <option value="small">Petit (20x20mm)</option>
            <option value="medium">Moyen (40x40mm)</option>
            <option value="large">Grand (60x60mm)</option>
          </select>
          <button
            onClick={handlePrint}
            disabled={selectedProducts.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-medium disabled:opacity-50"
          >
            <Printer className="w-5 h-5" />
            Imprimer ({selectedProducts.length})
          </button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 no-print">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={selectAll} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200">
            Tout sélectionner
          </button>
          <button onClick={deselectAll} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
            Tout désélectionner
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={() => selectedProducts.length === filteredProducts.length ? deselectAll() : selectAll()}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Aperçu QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className={`hover:bg-gray-50 ${selectedProducts.includes(product.id) ? 'bg-green-50' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-green-600">{product.price.toLocaleString()} F</td>
                  <td className="px-6 py-4">
                    <img src={getQRUrl(product.sku)} alt="QR Code" className="w-12 h-12" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Area (Hidden until print) */}
      <div ref={printRef} className="print:block hidden print-area">
        <div className="print-grid">
          {selectedProducts.map(id => {
            const product = products.find(p => p.id === id)
            if (!product) return null
            return (
              <div key={product.id} className="qr-label">
                <img src={getQRUrl(product.sku)} alt="QR Code" className={sizeClasses[printSize]} />
                <div className="mt-2 text-center">
                  <p className="font-bold text-xs">{product.sku}</p>
                  <p className="text-xs text-gray-600 truncate max-w-[120px]">{product.name}</p>
                  <p className="text-xs font-bold text-green-600">{product.price.toLocaleString()} F</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Print Preview */}
      {selectedProducts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 no-print">
          <h3 className="font-bold text-lg mb-4">Aperçu avant impression ({selectedProducts.length} QR codes)</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {selectedProducts.map(id => {
              const product = products.find(p => p.id === id)
              if (!product) return null
              return (
                <div key={product.id} className="text-center">
                  <img src={getQRUrl(product.sku)} alt="QR Code" className="w-20 h-20 mx-auto" />
                  <p className="text-xs font-mono mt-1">{product.sku}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { display: block !important; }
          .print-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            padding: 20px;
          }
          .qr-label {
            text-align: center;
            page-break-inside: avoid;
          }
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  )
}
