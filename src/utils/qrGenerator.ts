import { QRCodeData, OrderQRData, ProductQRData, ScanLog } from './types'

export function generateOrderHash(orderId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const data = `${orderId}-${timestamp}-${random}`
  
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  return Math.abs(hash).toString(16).padStart(8, '0')
}

export function createOrderQRData(
  orderId: string,
  customerName: string,
  total: number,
  items: number,
  address: string
): OrderQRData {
  const hash = generateOrderHash(orderId)
  const timestamp = new Date().toISOString()
  
  return {
    orderId,
    hash,
    timestamp,
    customerName,
    total,
    items,
    address,
    status: 'pending_scan'
  }
}

export function createProductQRData(
  productId: number,
  sku: string,
  name: string,
  barcode?: string
): ProductQRData {
  return {
    productId,
    sku,
    name,
    barcode: barcode || generateBarcode(sku),
    timestamp: new Date().toISOString()
  }
}

export function generateBarcode(sku: string): string {
  const base = sku.replace(/[^a-zA-Z0-9]/g, '')
  const numeric = base.split('').map(c => c.charCodeAt(0)).join('')
  const timestamp = Date.now().toString().slice(-6)
  return `${numeric}${timestamp}`.slice(0, 12).padStart(12, '0')
}

export function encodeQRData(data: OrderQRData | ProductQRData): string {
  return JSON.stringify({
    ...data,
    app: 'R-MARKET',
    version: '1.0'
  })
}

export function decodeQRData(qrString: string): OrderQRData | ProductQRData | null {
  try {
    const data = JSON.parse(qrString)
    if (data.app === 'R-MARKET') {
      return data
    }
    if (qrString.startsWith('CMD-')) {
      return {
        orderId: qrString,
        hash: '',
        timestamp: new Date().toISOString(),
        customerName: '',
        total: 0,
        items: 0,
        address: '',
        status: 'pending_scan'
      } as OrderQRData
    }
    return null
  } catch {
    return null
  }
}

export function validateQRData(data: any): data is OrderQRData | ProductQRData {
  if (!data) return false
  if ('orderId' in data) {
    return !!(data.orderId && data.hash)
  }
  if ('productId' in data) {
    return !!(data.productId && data.sku)
  }
  return false
}

const SCAN_LOGS_KEY = 'rmarket_scan_logs'

export function getScanLogs(): ScanLog[] {
  const saved = localStorage.getItem(SCAN_LOGS_KEY)
  return saved ? JSON.parse(saved) : []
}

export function addScanLog(log: Omit<ScanLog, 'id' | 'scannedAt'>): void {
  const logs = getScanLogs()
  const newLog: ScanLog = {
    ...log,
    id: Date.now().toString(),
    scannedAt: new Date().toISOString()
  }
  logs.unshift(newLog)
  localStorage.setItem(SCAN_LOGS_KEY, JSON.stringify(logs.slice(0, 1000)))
}

export function clearScanLogs(): void {
  localStorage.removeItem(SCAN_LOGS_KEY)
}

export type QRScanStatus = 
  | 'pending_scan'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'confirmed'
  | 'problem_reported'

export function getStatusLabel(status: QRScanStatus): string {
  const labels: Record<QRScanStatus, string> = {
    pending_scan: 'En attente de scan',
    picked_up: 'Colis récupéré',
    in_transit: 'En transit',
    delivered: 'Livré',
    confirmed: 'Confirmé',
    problem_reported: 'Problème signalé'
  }
  return labels[status] || status
}

export function getStatusColor(status: QRScanStatus): string {
  const colors: Record<QRScanStatus, string> = {
    pending_scan: 'bg-yellow-100 text-yellow-700',
    picked_up: 'bg-blue-100 text-blue-700',
    in_transit: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    problem_reported: 'bg-red-100 text-red-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}
