import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { TopUpPage } from './pages/TopUpPage';
import { HistoryPage } from './pages/History';
import { CartPage } from './pages/CartPage';
import { ScrollToTop } from './components/ScrollToTop';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Profile } from './pages/Profile';
import { SupportPage } from './pages/SupportPage';
import { Toaster } from 'sonner';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const AppContent: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <ScrollToTop />
      <Toaster position="top-center" richColors theme="dark" />
      <Navbar />
      <main className="flex-grow bg-[#020617]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/topup/:id" element={<TopUpPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<SupportPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {location.pathname !== '/support' && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
