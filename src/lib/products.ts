import { supabase } from '../lib/supabase'

export interface Product {
  id: number
  name: string
  price: number
  original_price: number
  image: string
  category: string
  description: string
  badge?: string
  rating: number
  reviews: number
  stock: number
  sold: number
  is_adult?: boolean
  supplier_id?: number
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

// Mettre à jour un produit
export const updateProduct = async (id: number, updates: Partial<Product>) => {
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
export const deleteProduct = async (id: number) => {
  const { error } = await supabase
    .from('produits')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Obtenir produits par catégorie
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error:', error)
    return []
  }
  
  return data || []
}