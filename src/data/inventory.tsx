export interface InventoryItem {
  id: number
  productId: number
  productName: string
  lotNumber: string
  supplier: string
  quantityReceived: number
  quantityInStock: number
  quantityDefective: number
  quantitySold: number
  purchasePrice: number
  sellingPrice: number
  weight: number
  weightUnit: 'kg' | 'g' | 'l' | 'ml'
  expiryDate: string
  receivedDate: string
  location: string
  condition: 'new' | 'good' | 'defective' | 'damaged' | 'expired'
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired'
  notes: string
}

export interface Supplier {
  id: number
  name: string
  contact: string
  phone: string
  email: string
  address: string
  city: string
  country: string
  category: string
  totalOrders: number
  totalSpent: number
  rating: number
  paymentTerms: 'cash' | 'virement' | 'mobile_money' | 'credit'
  status: 'active' | 'inactive' | 'suspended'
  notes: string
}

export interface Return {
  id: string
  orderId: string
  productId: number
  productName: string
  customer: string
  customerPhone: string
  reason: string
  type: 'defective' | 'damaged' | 'expired' | 'wrong_item' | 'customer_regret'
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'replaced'
  refundAmount: number
  refundMethod: 'cash' | 'mobile_money' | 'credit' | 'exchange'
  date: string
  resolvedDate: string
  notes: string
}

export interface StockMovement {
  id: string
  productId: number
  productName: string
  type: 'in' | 'out' | 'adjustment' | 'defective' | 'return' | 'transfer'
  quantity: number
  reason: string
  reference: string
  date: string
  user: string
}

export interface FinancialTransaction {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  method: 'cash' | 'orange_money' | 'moov_money' | 'wave' | 'virement' | 'check'
  reference: string
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  notes: string
}

// Données initiales fournisseurs
export const initialSuppliers: Supplier[] = [
  { id: 1, name: 'SOTELMA Import', contact: 'Amadou Diallo', phone: '+223 20 22 33 44', email: 'amadou@sotelma.ml', address: 'ACI 2000', city: 'Bamako', country: 'Mali', category: 'Électronique', totalOrders: 45, totalSpent: 12500000, rating: 4.8, paymentTerms: 'virement', status: 'active', notes: 'Fiable, délais respectés' },
  { id: 2, name: 'Dubai Wholesale', contact: 'Mohammed Ali', phone: '+971 4 123 4567', email: 'mohammed@dubaiwholesale.ae', address: 'Deira', city: 'Dubai', country: 'Émirats', category: 'Mode', totalOrders: 23, totalSpent: 8500000, rating: 4.5, paymentTerms: 'virement', status: 'active', notes: 'Bonne qualité' },
  { id: 3, name: 'Guangzhou Electronics', contact: 'Li Wei', phone: '+86 20 1234 5678', email: 'liwei@gzelec.cn', address: 'Tianhe District', city: 'Guangzhou', country: 'Chine', category: 'Électronique', totalOrders: 67, totalSpent: 25000000, rating: 4.2, paymentTerms: 'virement', status: 'active', notes: 'Prix compétitifs' },
  { id: 4, name: 'Istanbul Fashion', contact: 'Mehmet Yilmaz', phone: '+90 212 123 4567', email: 'mehmet@istanbulfashion.tr', address: 'Laleli', city: 'Istanbul', country: 'Turquie', category: 'Mode', totalOrders: 34, totalSpent: 12000000, rating: 4.6, paymentTerms: 'virement', status: 'active', notes: 'Mode tendance' },
  { id: 5, name: 'Moscow Spirits', contact: 'Ivan Petrov', phone: '+7 495 123 4567', email: 'ivan@moscowspirits.ru', address: 'Arbat', city: 'Moscou', country: 'Russie', category: 'Alcool', totalOrders: 12, totalSpent: 3500000, rating: 4.9, paymentTerms: 'virement', status: 'active', notes: 'Alcools premium' },
  { id: 6, name: 'Marché Bamako Local', contact: 'Ousmane Traoré', phone: '+223 66 12 34 56', email: '', address: 'Marché Grand Bamako', city: 'Bamako', country: 'Mali', category: 'Artisanat', totalOrders: 120, totalSpent: 5000000, rating: 4.3, paymentTerms: 'cash', status: 'active', notes: 'Artisanat local' },
]

// Données initiales inventaire
export const initialInventory: InventoryItem[] = [
  { id: 1, productId: 1, productName: 'Boubou Homme Bazin', lotNumber: 'LOT-2026-001', supplier: 'Istanbul Fashion', quantityReceived: 50, quantityInStock: 35, quantityDefective: 2, quantitySold: 13, purchasePrice: 15000, sellingPrice: 35000, weight: 0.5, weightUnit: 'kg', expiryDate: '', receivedDate: '2026-03-15', location: 'A1-01', condition: 'new', status: 'in_stock', notes: '' },
  { id: 2, productId: 2, productName: 'iPhone 15 Pro Max', lotNumber: 'LOT-2026-002', supplier: 'Guangzhou Electronics', quantityReceived: 20, quantityInStock: 8, quantityDefective: 0, quantitySold: 12, purchasePrice: 450000, sellingPrice: 580000, weight: 0.2, weightUnit: 'kg', expiryDate: '', receivedDate: '2026-03-20', location: 'B2-05', condition: 'new', status: 'low_stock', notes: '' },
  { id: 3, productId: 3, productName: 'Vodka Absolut 700ml', lotNumber: 'LOT-2026-003', supplier: 'Moscow Spirits', quantityReceived: 100, quantityInStock: 75, quantityDefective: 1, quantitySold: 24, purchasePrice: 8000, sellingPrice: 18000, weight: 0.7, weightUnit: 'kg', expiryDate: '2028-12-31', receivedDate: '2026-03-25', location: 'C1-02', condition: 'new', status: 'in_stock', notes: 'Lot vérifié' },
  { id: 4, productId: 4, productName: 'Masque Dogon', lotNumber: 'LOT-2026-004', supplier: 'Marché Bamako Local', quantityReceived: 30, quantityInStock: 22, quantityDefective: 3, quantitySold: 5, purchasePrice: 8000, sellingPrice: 25000, weight: 1.5, weightUnit: 'kg', expiryDate: '', receivedDate: '2026-03-10', location: 'A3-08', condition: 'new', status: 'in_stock', notes: 'Fait main' },
  { id: 5, productId: 5, productName: 'Samsung Galaxy S24', lotNumber: 'LOT-2026-005', supplier: 'Guangzhou Electronics', quantityReceived: 15, quantityInStock: 0, quantityDefective: 0, quantitySold: 15, purchasePrice: 380000, sellingPrice: 520000, weight: 0.2, weightUnit: 'kg', expiryDate: '', receivedDate: '2026-03-18', location: 'B2-06', condition: 'new', status: 'out_of_stock', notes: 'À réapprovisionner' },
]

// Données initiales retours
export const initialReturns: Return[] = [
  { id: 'RET-001', orderId: 'CMD-001', productId: 1, productName: 'Boubou Homme Bazin', customer: 'Moussa Dembélé', customerPhone: '+223 70 12 34 56', reason: 'Taille incorrecte', type: 'customer_regret', status: 'approved', refundAmount: 35000, refundMethod: 'mobile_money', date: '2026-04-01', resolvedDate: '2026-04-02', notes: 'Échange effectué' },
  { id: 'RET-002', orderId: 'CMD-003', productId: 3, productName: 'Vodka Absolut 700ml', customer: 'Alpha Oumar', customerPhone: '+223 77 34 56 78', reason: 'Bouteille cassée', type: 'damaged', status: 'refunded', refundAmount: 18000, refundMethod: 'mobile_money', date: '2026-04-02', resolvedDate: '2026-04-02', notes: 'Remboursé intégralement' },
  { id: 'RET-003', orderId: 'CMD-005', productId: 4, productName: 'Masque Dogon', customer: 'Mamadou Traoré', customerPhone: '+223 78 45 67 89', reason: 'Peinture écaillée', type: 'defective', status: 'pending', refundAmount: 0, refundMethod: 'cash', date: '2026-04-03', resolvedDate: '', notes: 'En attente d\'examen' },
]

// Données initiales mouvements de stock
export const initialStockMovements: StockMovement[] = [
  { id: 'MOV-001', productId: 1, productName: 'Boubou Homme Bazin', type: 'in', quantity: 50, reason: 'Réception fournisseur', reference: 'LOT-2026-001', date: '2026-03-15', user: 'Admin' },
  { id: 'MOV-002', productId: 1, productName: 'Boubou Homme Bazin', type: 'out', quantity: 13, reason: 'Vente', reference: 'CMD-001,CMD-005', date: '2026-03-20', user: 'Système' },
  { id: 'MOV-003', productId: 1, productName: 'Boubou Homme Bazin', type: 'defective', quantity: 2, reason: 'Défaut de couture', reference: 'QC-001', date: '2026-03-22', user: 'Admin' },
  { id: 'MOV-004', productId: 2, productName: 'iPhone 15 Pro Max', type: 'in', quantity: 20, reason: 'Réception fournisseur', reference: 'LOT-2026-002', date: '2026-03-20', user: 'Admin' },
  { id: 'MOV-005', productId: 2, productName: 'iPhone 15 Pro Max', type: 'out', quantity: 12, reason: 'Vente', reference: 'CMD-002,CMD-004', date: '2026-03-25', user: 'Système' },
]

// Données initiales transactions financières
export const initialTransactions: FinancialTransaction[] = [
  { id: 'TRX-001', type: 'expense', category: 'Achat stock', description: 'Achat 50 Boubou Bazin', amount: 750000, method: 'virement', reference: 'ACH-001', date: '2026-03-15', status: 'completed', notes: 'Paiement Istanbul Fashion' },
  { id: 'TRX-002', type: 'expense', category: 'Achat stock', description: 'Achat 20 iPhone 15 Pro Max', amount: 9000000, method: 'virement', reference: 'ACH-002', date: '2026-03-20', status: 'completed', notes: 'Paiement Guangzhou Electronics' },
  { id: 'TRX-003', type: 'income', category: 'Vente', description: 'Vente CMD-001 Boubou', amount: 70000, method: 'orange_money', reference: 'CMD-001', date: '2026-03-25', status: 'completed', notes: '' },
  { id: 'TRX-004', type: 'income', category: 'Vente', description: 'Vente CMD-002 iPhone', amount: 580000, method: 'wave', reference: 'CMD-002', date: '2026-03-26', status: 'completed', notes: '' },
  { id: 'TRX-005', type: 'expense', category: 'Livraison', description: 'Frais livraison Kayes', amount: 5000, method: 'cash', reference: 'LIV-001', date: '2026-03-27', status: 'completed', notes: '' },
  { id: 'TRX-006', type: 'expense', category: 'Salaires', description: 'Salaire employé magasin', amount: 80000, method: 'wave', reference: 'SAL-001', date: '2026-03-30', status: 'completed', notes: 'Salaire mars' },
  { id: 'TRX-007', type: 'income', category: 'Vente', description: 'Vente CMD-003 Vodka', amount: 36000, method: 'orange_money', reference: 'CMD-003', date: '2026-04-01', status: 'completed', notes: '' },
  { id: 'TRX-008', type: 'expense', category: 'Remboursement', description: 'Remboursement retour', amount: 18000, method: 'orange_money', reference: 'RET-002', date: '2026-04-02', status: 'completed', notes: 'Retour Vodka cassée' },
]
