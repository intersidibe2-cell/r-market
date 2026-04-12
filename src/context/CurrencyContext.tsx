import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type Currency = 'FCFA' | 'EUR' | 'RUB' | 'USD'

export interface CurrencyInfo {
  code: Currency
  symbol: string
  name: string
  rate: number // Taux par rapport au FCFA
  flag: string
}

interface CurrencyContextType {
  currency: Currency
  currencies: CurrencyInfo[]
  setCurrency: (currency: Currency) => void
  formatPrice: (amountInFCFA: number, showSymbol?: boolean) => string
  convertPrice: (amountInFCFA: number) => number
  getExchangeRate: (from: Currency, to: Currency) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const currencyList: CurrencyInfo[] = [
  { code: 'FCFA', symbol: 'F', name: 'Franc CFA', rate: 1, flag: '🇲🇱' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.00152, flag: '🇪🇺' },
  { code: 'RUB', symbol: '₽', name: 'Rouble russe', rate: 0.14, flag: '🇷🇺' },
  { code: 'USD', symbol: '$', name: 'Dollar US', rate: 0.00163, flag: '🇺🇸' }
]

const STORAGE_KEY = 'rmarket_currency'

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (saved as Currency) || 'FCFA'
  })

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(STORAGE_KEY, newCurrency)
  }, [])

  const convertPrice = useCallback((amountInFCFA: number): number => {
    const info = currencyList.find(c => c.code === currency)
    if (!info) return amountInFCFA
    return Math.round(amountInFCFA * info.rate)
  }, [currency])

  const formatPrice = useCallback((amountInFCFA: number, showSymbol = true): string => {
    const info = currencyList.find(c => c.code === currency)
    if (!info) return `${amountInFCFA.toLocaleString()} F`

    const converted = convertPrice(amountInFCFA)
    
    if (currency === 'FCFA') {
      return showSymbol 
        ? `${converted.toLocaleString()} ${info.symbol}`
        : converted.toLocaleString()
    }

    // Pour les devises avec décimales
    const formatted = (converted / (currency === 'RUB' ? 100 : 1)).toFixed(2)
    return showSymbol 
      ? `${info.symbol}${parseFloat(formatted).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : parseFloat(formatted).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }, [currency, convertPrice])

  const getExchangeRate = useCallback((from: Currency, to: Currency): number => {
    const fromInfo = currencyList.find(c => c.code === from)
    const toInfo = currencyList.find(c => c.code === to)
    if (!fromInfo || !toInfo) return 1
    return fromInfo.rate / toInfo.rate
  }, [])

  return (
    <CurrencyContext.Provider value={{
      currency,
      currencies: currencyList,
      setCurrency,
      formatPrice,
      convertPrice,
      getExchangeRate
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
