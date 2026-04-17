import { supabase } from './supabase'

export interface Product {
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
  updated_at?: string
}

// Charger tous les produits depuis Supabase
export const loadProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error loading products:', error)
    return []
  }
  
  return data || []
}

// Charger produits actifs uniquement (pour le shop client)
export const loadActiveProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error loading active products:', error)
    return []
  }
  
  return data || []
}

// Ajouter un produit
export const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('produits')
    .insert(product)
    .select()
    .single()
  
  if (error) {
    console.error('Error adding product:', error)
    throw error
  }
  
  return data
}

// Mettre a jour un produit
export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('produits')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating product:', error)
    throw error
  }
  
  return data
}

// Supprimer un produit
export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('produits')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Obtenir produits par categorie
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error:', error)
    return []
  }
  
  return data || []
}

// Upload photo vers Supabase Storage
export const uploadProductPhoto = async (file: File, productId?: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${productId || 'new'}-${Date.now()}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage
    .from('product-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw error
  }

  const { data: urlData } = supabase.storage
    .from('product-photos')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

// Supprimer photo du Storage
export const deleteProductPhoto = async (photoUrl: string) => {
  // Extraire le chemin du fichier depuis l'URL
  const parts = photoUrl.split('/product-photos/')
  if (parts.length < 2) return
  const filePath = parts[1]

  const { error } = await supabase.storage
    .from('product-photos')
    .remove([filePath])

  if (error) {
    console.error('Delete photo error:', error)
  }
}

// Generer SKU automatique
export const generateSKU = (category: string, index: number): string => {
  const categoryCode = (category || 'div').substring(0, 3).toUpperCase()
  const num = String(index).padStart(4, '0')
  return `RM-${categoryCode}-${num}`
}

// Generer QR Code URL
export const generateQRCodeUrl = (sku: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://r-market.shop/qr/${sku}&bgcolor=ffffff&color=166534&margin=4`
}
