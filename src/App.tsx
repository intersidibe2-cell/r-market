import { Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
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

import Home from './pages/Home'
import Login from './pages/Login'
import AccountPage from './pages/AccountPage'
import AdminDashboard from './pages/admin/AdminDashboard'
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
import BehaviorAnalytics from './pages/admin/BehaviorAnalytics'
import HeatmapPage from './pages/admin/HeatmapPage'
import PredictiveAnalytics from './pages/admin/PredictiveAnalytics'
import DeliveryManagement from './pages/admin/DeliveryManagement'
import InternationalShops from './pages/admin/InternationalShops'
import SettingsPage from './pages/admin/SettingsPage'
import ContentManager from './pages/admin/ContentManager'
import PhotoManagement from './pages/admin/PhotoManagement'
import QRCodeGenerator from './pages/admin/QRCodeGenerator'
import PhotoPlanning from './pages/admin/PhotoPlanning'
import ExchangeRates from './pages/admin/ExchangeRates'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Favorites from './pages/Favorites'
import RussianShop from './pages/RussianShop'
import RussianProductDetail from './pages/RussianProductDetail'
import RussianAdmin from './pages/RussianAdmin'
import RussianLanding from './pages/RussianLanding'
import RussianLogin from './pages/RussianLogin'
import BambaraCourse from './pages/BambaraCourse'
import AdultShop from './pages/AdultShop'
import BarcodeScanner from './pages/BarcodeScanner'
import Contact from './pages/Contact'
import DeliveryScan from './pages/DeliveryScan'
import MilitaryQRCode from './pages/MilitaryQRCode'
import OrderTracking from './pages/OrderTracking'
import Compare from './pages/Compare'
import Loyalty from './pages/Loyalty'
import International from './pages/International'
import InternationalLanding from './pages/InternationalLanding'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <CartProvider>
              <CompareProvider>
                <AuditProvider>
                  <LoyaltyProvider>
                    <PromoProvider>
                      <ReviewProvider>
                        <CurrencyProvider>
                          <AdultAccessProvider>
                            <div className="min-h-screen bg-gray-50">
                              <Header />
                              <main>
                                <Routes>
                                  <Route path="/" element={<Home />} />
                                  <Route path="/shop" element={<Shop />} />
                                  <Route path="/product/:id" element={<ProductDetail />} />
                                  <Route path="/cart" element={<Cart />} />
                                  <Route path="/checkout" element={<Checkout />} />
                                  <Route path="/favorites" element={<Favorites />} />
                                  <Route path="/login" element={<Login />} />
                                  <Route path="/russian" element={<RussianLanding />} />
                                  <Route path="/russian/shop" element={<RussianShop />} />
                                  <Route path="/russian/product/:id" element={<RussianProductDetail />} />
                                  <Route path="/account" element={<AccountPage />} />
                                  <Route path="/admin" element={<AdminDashboard />} />
                                  <Route path="/admin/orders-mali" element={<OrdersMali />} />
                                  <Route path="/admin/products-mali" element={<ProductsMali />} />
                                  <Route path="/admin/inventory" element={<Inventory />} />
                                  <Route path="/admin/suppliers" element={<Suppliers />} />
                                  <Route path="/admin/customers" element={<CustomersMali />} />
                                  <Route path="/admin/finances" element={<Finances />} />
                                  <Route path="/admin/reports" element={<Reports />} />
                                  <Route path="/admin/returns" element={<Returns />} />
                                  <Route path="/admin/delivery" element={<Delivery />} />
                                  <Route path="/admin/exchange-rates" element={<ExchangeRates />} />
                                  <Route path="/admin/photo-management" element={<PhotoManagement />} />
                                  <Route path="/admin/qr-code-generator" element={<QRCodeGenerator />} />
                                  <Route path="/admin/photo-planning" element={<PhotoPlanning />} />
                                  <Route path="/admin/content-manager" element={<ContentManager />} />
                                  <Route path="/admin/settings" element={<SettingsPage />} />
                                  <Route path="/admin/international-shops" element={<InternationalShops />} />
                                  <Route path="/admin/delivery-management" element={<DeliveryManagement />} />
                                  <Route path="/admin/predictive-analytics" element={<PredictiveAnalytics />} />
                                  <Route path="/admin/heatmap" element={<HeatmapPage />} />
                                  <Route path="/admin/behavior-analytics" element={<BehaviorAnalytics />} />
                                  <Route path="/admin/analytics" element={<Analytics />} />
                                  <Route path="/admin/user-management" element={<UserManagement />} />
                                  <Route path="/admin/russian-login" element={<RussianLogin />} />
                                  <Route path="/admin/russian-admin" element={<RussianAdmin />} />
                                  <Route path="/admin/russian-products" element={<RussianProducts />} />
                                  <Route path="/admin/russian-orders" element={<RussianOrders />} />
                                  <Route path="/bambara-course" element={<BambaraCourse />} />
                                  <Route path="/adult-shop" element={<AdultShop />} />
                                  <Route path="/contact" element={<Contact />} />
                                  <Route path="/barcode-scanner" element={<BarcodeScanner />} />
                                  <Route path="/delivery-scan" element={<DeliveryScan />} />
                                  <Route path="/military-qr-code" element={<MilitaryQRCode />} />
                                  <Route path="/order-tracking" element={<OrderTracking />} />
                                  <Route path="/compare" element={<Compare />} />
                                  <Route path="/loyalty" element={<Loyalty />} />
                                  <Route path="/international" element={<International />} />
                                  <Route path="/international-landing" element={<InternationalLanding />} />
                                  <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                              </main>
                              <Footer />
                              <ScrollToTop />
                              <ToastContainer />
                              <CompareBar />
                              <WhatsAppButton />
                            </div>
                          </AdultAccessProvider>
                        </CurrencyProvider>
                      </ReviewProvider>
                    </PromoProvider>
                  </LoyaltyProvider>
                </AuditProvider>
              </CompareProvider>
            </CartProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App