import { Routes, Route, Navigate } from 'react-router-dom'
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
import RussianOrders from './pages/admin/RussianOrders'
import RussianProducts from './pages/admin/RussianProducts'
import OrdersMali from './pages/admin/OrdersMali'
import ProductsMali from './pages/admin/ProductsMali'
import Inventory from './pages/admin/Inventory'
import Delivery from './pages/admin/Delivery'
import Returns from './pages/admin/Returns'
import Reports from './pages/admin/Reports'
import Finances from './pages/admin/Finances'
import Suppliers from './pages/admin/Suppliers'
import CustomersMali from './pages/admin/CustomersMali'
import Analytics from './pages/admin/Analytics'
import SettingsPage from './pages/admin/SettingsPage'
import ContentManager from './pages/admin/ContentManager'
import PhotoManagement from './pages/admin/PhotoManagement'
import QRCodeGenerator from './pages/admin/QRCodeGenerator'
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
                          
                          {/* Admin Panel unifié */}
                          <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />
                          <Route path="/admin-panel" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="orders" element={<OrdersMali />} />
                            <Route path="products" element={<ProductsMali />} />
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="delivery" element={<Delivery />} />
                            <Route path="returns" element={<Returns />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="finances" element={<Finances />} />
                            <Route path="suppliers" element={<Suppliers />} />
                            <Route path="customers" element={<CustomersMali />} />
                            <Route path="content" element={<ContentManager />} />
                            <Route path="photos" element={<PhotoManagement />} />
                            <Route path="qrcodes" element={<QRCodeGenerator />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="russian-orders" element={<RussianOrders />} />
                            <Route path="russian-products" element={<RussianProducts />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="settings" element={<SettingsPage />} />
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
