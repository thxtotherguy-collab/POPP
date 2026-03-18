import "@/App.css";
import "@/index.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import PumpFinderPage from "./pages/PumpFinderPage";
import TankSizingPage from "./pages/TankSizingPage";
import ConsultationPage from "./pages/ConsultationPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import { X, Construction } from "lucide-react";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

// Under Construction Notice Popup
function UnderConstructionNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the notice in this session
    const dismissed = sessionStorage.getItem('constructionNoticeDismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('constructionNoticeDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notice"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[hsl(45,93%,47%)]/10 rounded-full flex items-center justify-center">
            <Construction className="h-8 w-8 text-[hsl(45,93%,47%)]" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-manrope font-bold text-center text-[hsl(222,47%,11%)] mb-2">
          Website Under Construction
        </h2>
        <p className="text-center text-[hsl(215,16%,47%)] mb-6">
          We're currently updating our website to serve you better. Some features may be limited during this time. Thank you for your patience!
        </p>

        {/* Button */}
        <button
          onClick={handleDismiss}
          className="w-full py-3 px-4 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white font-semibold rounded-sm transition-colors"
        >
          Continue to Website
        </button>

        {/* Footer note */}
        <p className="text-center text-xs text-[hsl(215,16%,47%)] mt-4">
          For urgent enquiries, please contact us directly.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <UnderConstructionNotice />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-[calc(2rem+64px)]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/pump-finder" element={<PumpFinderPage />} />
                <Route path="/tank-sizing" element={<TankSizingPage />} />
                <Route path="/consultation" element={<ConsultationPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
