// Utility functions for managing supplier WhatsApp numbers
// WhatsApp numbers are stored in localStorage with key 'rmarket_supplier_whatsapp'

const STORAGE_KEY = 'rmarket_supplier_whatsapp'

export interface SupplierWhatsappMap {
  [supplierId: string]: string
}

// Get all supplier WhatsApp numbers from localStorage
export function getSupplierWhatsapps(): SupplierWhatsappMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Get WhatsApp number for a specific supplier
export function getSupplierWhatsapp(supplierId: number | string): string {
  const whatsapps = getSupplierWhatsapps()
  return whatsapps[String(supplierId)] || ''
}

// Save WhatsApp number for a specific supplier
export function saveSupplierWhatsapp(supplierId: number | string, whatsapp: string): void {
  const whatsapps = getSupplierWhatsapps()
  whatsapps[String(supplierId)] = whatsapp
  localStorage.setItem(STORAGE_KEY, JSON.stringify(whatsapps))
}

// Delete WhatsApp number for a specific supplier
export function deleteSupplierWhatsapp(supplierId: number | string): void {
  const whatsapps = getSupplierWhatsapps()
  delete whatsapps[String(supplierId)]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(whatsapps))
}

// Generate WhatsApp message for an order
export function generateSupplierWhatsappMessage(
  supplierName: string,
  orderItems: Array<{ name: string; quantity: number; image?: string }>,
  orderId: string
): string {
  const itemsList = orderItems
    .map(item => `- ${item.name} x${item.quantity}`)
    .join('\n')

  const firstItemImage = orderItems[0]?.image
  const photoLine = firstItemImage ? `\n\nPhoto du produit : ${firstItemImage}` : ''

  return `Bonjour ${supplierName},

Commande à préparer (${orderId}) :
${itemsList}${photoLine}

Merci de préparer pour récupération.
Cordialement,
R-Market`
}

// Generate WhatsApp URL with pre-filled message
export function generateWhatsappUrl(phone: string, message: string): string {
  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  // Remove + for wa.me format
  const phoneForUrl = cleanPhone.replace(/^\+/, '')
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${phoneForUrl}?text=${encodedMessage}`
}

// Validate phone number format (Mali format)
export function isValidMaliPhone(phone: string): boolean {
  // Mali phone numbers: +223 XX XX XX XXX or 223XXXXXXXX or 0XXXXXXXX
  const cleanPhone = phone.replace(/\s/g, '')
  const patterns = [
    /^\+223\d{8}$/,  // +223XXXXXXXX
    /^223\d{8}$/,   // 223XXXXXXXX
    /^0\d{8}$/,     // 0XXXXXXXX
    /^\d{8}$/,      // XXXXXXXX (local format)
  ]

  return patterns.some(pattern => pattern.test(cleanPhone))
}

// Format phone number for display
export function formatPhoneForDisplay(phone: string): string {
  const cleanPhone = phone.replace(/\s/g, '')

  if (cleanPhone.startsWith('+223')) {
    const digits = cleanPhone.slice(4)
    return `+223 ${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`
  }

  if (cleanPhone.startsWith('223')) {
    const digits = cleanPhone.slice(3)
    return `+223 ${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`
  }

  if (cleanPhone.length === 8) {
    return `+223 ${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6)}`
  }

  return phone
}
