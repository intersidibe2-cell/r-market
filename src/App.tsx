import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'
import { AuditProvider } from './context/AuditContext'
import { CompareProvider } from './context/CompareContext'
import { LoyaltyProvider } from './context/LoyaltyContext'
import { PromoProvider } from './context/PromoContext'
import { ReviewProvider } from './context/ReviewContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { AdultAccessProvider } from './context/AdultAccessContext'

import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ToastContainer from './components/Toast'
import CompareBar from './components/CompareBar'
import WhatsAppButton from './components/WhatsAppButton'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import UserManagement from './pages/admin/UserManagement'
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
import Login from './pages/Login'
import Compare from './pages/Compare'
import OrderTracking from './pages/OrderTracking'
import Loyalty from './pages/Loyalty'
import DeliveryScan from './pages/DeliveryScan'
import BarcodeScanner from './pages/BarcodeScanner'
import AdultShop from './pages/AdultShop'
import MilitaryQRCode from './pages/MilitaryQRCode'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <AdultAccessProvider>
      <NotificationProvider>
        <AuthProvider>
          <AuditProvider>
            <CurrencyProvider>
              <PromoProvider>
                <ReviewProvider>
                  <LoyaltyProvider>
                    <CompareProvider>
                      <CartProvider>
                        <FavoritesProvider>
                          <ToastContainer />
                        
                        <Routes>
                          {/* Routes sans layout */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/admin" element={
                            <ProtectedRoute requiredPermission="all">
                              <Admin />
                            </ProtectedRoute>
                          } />
                          <Route path="/russian-admin" element={<RussianAdmin />} />
                          
                          {/* Admin Panel séparé */}
                          <Route path="/admin-panel" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="orders" element={<AdminDashboard />} />
                            <Route path="products" element={<AdminDashboard />} />
                            <Route path="inventory" element={<AdminDashboard />} />
                            <Route path="delivery" element={<AdminDashboard />} />
                            <Route path="returns" element={<AdminDashboard />} />
                            <Route path="reports" element={<AdminDashboard />} />
                            <Route path="finances" element={<AdminDashboard />} />
                            <Route path="suppliers" element={<AdminDashboard />} />
                            <Route path="customers" element={<AdminDashboard />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="analytics" element={<AdminDashboard />} />
                            <Route path="settings" element={<AdminDashboard />} />
                          </Route>
                          
                          {/* QR Code militaire */}
                          <Route path="/military-qr" element={<MilitaryQRCode />} />
                          
                          {/* Routes avec layout */}
                          <Route path="/ru" element={<RussianLanding />} />
                          <Route path="/russian" element={<RussianShop />} />
                          <Route path="/bambara-course" element={<BambaraCourse />} />
                          <Route path="/qr-code" element={<QRCodePage />} />
                          <Route path="/account" element={<AccountPage />} />
                          <Route path="/compare" element={<Compare />} />
                          <Route path="/order-tracking" element={<OrderTracking />} />
                          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                          <Route path="/loyalty" element={<Loyalty />} />
                          <Route path="/delivery-scan" element={<DeliveryScan />} />
                          <Route path="/barcode-scanner" element={<BarcodeScanner />} />
                          <Route path="/admin/barcode-scanner" element={<BarcodeScanner />} />
                          
                          {/* Routes principales avec Header/Footer */}
                          <Route path="/*" element={
                            <div className="min-h-screen bg-gray-50 flex flex-col">
                              <ScrollToTop />
                              <Header />
                              <main className="flex-1">
                                <Routes>
                                  <Route path="/" element={<Home />} />
                                  <Route path="/shop" element={<Shop />} />
                                  <Route path="/product/:id" element={<ProductDetail />} />
                                  <Route path="/cart" element={<Cart />} />
                                  <Route path="/checkout" element={<Checkout />} />
                                  <Route path="/favorites" element={<Favorites />} />
                                  <Route path="/adult" element={<AdultShop />} />
                                </Routes>
                              </main>
                              <Footer />
                              <CompareBar />
                              <WhatsAppButton />
                            </div>
                          } />
                        </Routes>
                       </FavoritesProvider>
                     </CartProvider>
                   </CompareProvider>
                 </LoyaltyProvider>
               </ReviewProvider>
             </PromoProvider>
           </CurrencyProvider>
         </AuditProvider>
       </AuthProvider>
     </NotificationProvider>
    </AdultAccessProvider>
  )
}
