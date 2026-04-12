import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'admin' | 'manager' | 'seller' | 'delivery' | 'customer'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Administrateur',
    email: 'admin@r-market.ml',
    phone: '+223 70 00 00 01',
    password: 'admin123',
    role: 'admin',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Gestionnaire',
    email: 'manager@r-market.ml',
    phone: '+223 70 00 00 02',
    password: 'manager123',
    role: 'manager',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Vendeur',
    email: 'seller@r-market.ml',
    phone: '+223 70 00 00 03',
    password: 'seller123',
    role: 'seller',
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'Livreur',
    email: 'delivery@r-market.ml',
    phone: '+223 70 00 00 04',
    password: 'delivery123',
    role: 'delivery',
    createdAt: '2024-02-15'
  }
]

// Permissions par rôle
const rolePermissions: Record<UserRole, string[]> = {
  admin: ['all'],
  manager: ['products', 'orders', 'customers', 'reports', 'inventory', 'returns', 'finances', 'suppliers'],
  seller: ['orders', 'customers', 'products:view'],
  delivery: ['orders:view', 'orders:deliver'],
  customer: ['orders:view', 'reviews']
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier la session sauvegardée
    const savedUser = localStorage.getItem('rmarket_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('rmarket_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500))

    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('rmarket_user', JSON.stringify(userWithoutPassword))
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rmarket_user')
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    const permissions = rolePermissions[user.role]
    if (permissions.includes('all')) return true
    if (permissions.includes(permission)) return true
    
    // Vérifier les permissions avec wildcards
    const [resource, action] = permission.split(':')
    if (action && permissions.includes(resource)) return true
    
    return false
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
