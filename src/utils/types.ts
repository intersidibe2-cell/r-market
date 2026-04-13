export interface OrderQRData {
  orderId: string
  hash: string
  timestamp: string
  customerName: string
  total: number
  items: number
  address: string
  status: QRScanStatus
}

export interface ProductQRData {
  productId: number
  sku: string
  name: string
  barcode: string
  timestamp: string
}

export type QRCodeData = OrderQRData | ProductQRData

export type QRScanStatus = 
  | 'pending_scan'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'confirmed'
  | 'problem_reported'

export interface ScanLog {
  id: string
  qrData: QRCodeData
  scannedBy: string
  scannedAt: string
  location?: string
  status: QRScanStatus
  notes?: string
  device: 'phone' | 'tscd' | 'barcode_scanner'
}

export interface DeliveryOrder {
  id: string
  orderId: string
  qrCode: OrderQRData
  status: QRScanStatus
  assignedTo?: string
  pickedUpAt?: string
  deliveredAt?: string
  confirmedAt?: string
  problemReport?: {
    reason: string
    description: string
    reportedAt: string
  }
}

export interface ProductScanResult {
  productId: number
  sku: string
  name: string
  barcode: string
  found: boolean
  action?: 'stock_update' | 'inventory_check' | 'quick_add'
}
