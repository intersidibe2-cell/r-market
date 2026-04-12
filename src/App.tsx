import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Favorites from './pages/Favorites'
import Admin from './pages/Admin'
import RussianShop from './pages/RussianShop'
import RussianAdmin from './pages/RussianAdmin'
import RussianLanding from './pages/RussianLanding'
import BambaraCourse from './pages/BambaraCourse'
import QRCodePage from './pages/QRCodePage'
import AccountPage from './pages/AccountPage'

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/ru" element={<RussianLanding />} />
          <Route path="/russian" element={<RussianShop />} />
          <Route path="/russian-admin" element={<RussianAdmin />} />
          <Route path="/bambara-course" element={<BambaraCourse />} />
          <Route path="/qr-code" element={<QRCodePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/*" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </FavoritesProvider>
    </CartProvider>
  )
}
